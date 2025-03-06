import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { Analytics, getAnalytics } from "firebase/analytics";
import { createContext, useContext, useEffect, useState } from "react";
import { getGradientColor } from "../components/getGradientColor";
import { updateUserFields } from "../utils/CustomTypes";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

type trailsUser = {
  uid: string;
  name: string;
  email: string;
  profileImage: string | null;
  emailVerified: boolean;
};

interface FirebaseContextType {
  isAuthLoaded: boolean;
  userGradient: string;
  user: trailsUser | null;
  firebaseAnalytics: Analytics;
  firebaseAuth: Auth;
  signupwithGoogle: () => Promise<void>;
  signUpWithEmailAndPassword: (
    name: string,
    email: string,
    password: string,
    profileImageBase64: string | null
  ) => Promise<void>;
  updateUserDetails: (value: updateUserFields) => Promise<void>;
  uploadBase64Image: (base64Image: string, path: string) => Promise<string>;
}

let userGradient = "#f3f4f6";
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
const firebaseAnalytics = getAnalytics(firebaseApp);

const FirebaseContext = createContext<FirebaseContextType | null>(null);

const firebaseGoogleProvider = new GoogleAuthProvider();

export const userFirebase = () => useContext(FirebaseContext);

export const uploadBase64Image = async (
  base64Image: string,
  path: string
): Promise<string> => {
  try {
    if (!base64Image) throw new Error("Invalid image data");

    const storageRef = ref(firebaseStorage, path);

    // Upload the base64 image as a data URL
    await uploadString(storageRef, base64Image, "data_url");

    // Get the download URL of the uploaded image
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(
      "We were unable to upload the image at this time. Please try again later."
    );
  }
};

export const FirebaseProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<trailsUser | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const signupwithGoogle = async () => {
    try {
      await signInWithPopup(firebaseAuth, firebaseGoogleProvider);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Google sign-in error:", error.message);
      } else {
        console.error("Unknown error occurred", error);
      }
    }
  };

  const signUpWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string,
    profileImageBase64: string | null
  ) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      let profileImageURL = null;

      if (profileImageBase64) {
        profileImageURL = (await uploadBase64Image(
          profileImageBase64,
          `${name}_${user.uid}`
        )) as string;
      }

      await updateProfile(user, {
        displayName: name,
        photoURL: profileImageURL,
      });

      const updatedUser: trailsUser = {
        uid: user.uid,
        name,
        email,
        profileImage: profileImageURL,
        emailVerified: user.emailVerified,
      };
      setUser(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Email/Password sign-in error:", error.message);
        throw new Error(error.message);
      } else {
        console.error("Unknown error occurred", error);
        throw new Error("Something went wrong. Please try again later.");
      }
    }
  };

  const updateUserDetails = async (value: updateUserFields) => {
    try {
      console.log("Incoming profile changes", value);
      const user = firebaseAuth.currentUser;

      if (!user) {
        throw new Error("No authenticated user found.");
      }

      await updateProfile(user, value);

      console.log("User profile updated successfully.", user);

      const updatedUser: trailsUser = {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email!,
        profileImage: user.photoURL,
        emailVerified: user.emailVerified,
      };
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Failed to update user profile.");
    }
  };

  useEffect(() => {
    const authState = onAuthStateChanged(firebaseAuth, async (user) => {
      console.log("Auth State changed", user);
      setIsAuthLoaded(false);
      if (user) {
        try {
          const userFromFirestore: trailsUser = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email!,
            profileImage: user.photoURL,
            emailVerified: user.emailVerified,
          };
          setUser(userFromFirestore);
          userGradient = getGradientColor(user.uid);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setIsAuthLoaded(true);
    });

    return () => authState();
  }, [firebaseAuth]);

  return (
    <FirebaseContext.Provider
      value={{
        isAuthLoaded,
        userGradient,
        user,
        firebaseAuth,
        firebaseAnalytics,
        signupwithGoogle,
        signUpWithEmailAndPassword,
        uploadBase64Image,
        updateUserDetails,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
