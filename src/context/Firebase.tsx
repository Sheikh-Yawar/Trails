import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
  createdAt: Timestamp;
  name: string;
  email: string;
  profileImage: string;
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
    profileImageBase64: string
  ) => Promise<void>;
  updateUserDetails: (value: updateUserFields) => Promise<void>;
  uploadBase64Image: (base64Image: string, path: string) => Promise<string>;
}

let userGradient = "";
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
const firebaseAnalytics = getAnalytics(firebaseApp);

const FirebaseContext = createContext<FirebaseContextType | null>(null);

const firebaseGoogleProvider = new GoogleAuthProvider();

export const userFirebase = () => useContext(FirebaseContext);

const signupwithGoogle = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, firebaseGoogleProvider);
    const user = result.user;

    if (!user) throw new Error("User not found");

    // Reference to Firestore user document
    const userDocRef = doc(firebaseFirestore, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);
    console.log("User Doc", userDocRef, userSnapshot, userSnapshot.exists());

    if (!userSnapshot.exists()) {
      // Convert profile image URL to Base64
      // const profileImageBase64 = await convertImageToBase64(
      //   user.photoURL || ""
      // );

      // Store user data in Firestore
      await setDoc(userDocRef, {
        name: user.displayName || "",
        email: user.email || "",
        profileImage: user.photoURL || "",
        createdAt: new Date(),
      });

      console.log("User signed up and data stored in Firestore");
    } else {
      console.log("User already exists in Firestore, skipping storage.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Google sign-in error:", error.message);
    } else {
      console.error("Unknown error occurred", error);
    }
  }
};

export const signUpWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  profileImageBase64: string
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

    // Store user data in Firestore
    await setDoc(doc(firebaseFirestore, "users", user.uid), {
      name,
      email,
      profileImage: profileImageBase64,
      createdAt: new Date(),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Email/Password sign-in error:", error.message);
    } else {
      console.error("Unknown error occurred", error);
    }
  }
};

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

  const updateUserDetails = async (value: updateUserFields) => {
    console.log("Value is", value);
    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    const userRef = doc(firebaseFirestore, "users", user.uid);

    try {
      await updateDoc(userRef, value);

      console.log("User details updated successfully.");

      const updatedUserSnap = await getDoc(userRef);
      if (updatedUserSnap.exists()) {
        const updatedUserData = updatedUserSnap.data();

        console.log("Updated user data", updatedUserData);

        setUser((prevUser) => {
          if (prevUser) {
            const updatedUserDetails: trailsUser = {
              uid: prevUser.uid,
              createdAt: prevUser.createdAt,
              name: updatedUserData.name!,
              email: prevUser.email,
              profileImage: updatedUserData.profileImage,
              emailVerified: prevUser.emailVerified,
            };

            return {
              ...updatedUserDetails,
            };
          } else {
            return prevUser;
          }
        });
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      throw new Error(error as string);
    }
  };

  useEffect(() => {
    const authState = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        try {
          setIsAuthLoaded(false);
          const userDocRef = doc(firebaseFirestore, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const userFromFirestore: trailsUser = {
              uid: user.uid,
              createdAt: userData.createdAt,
              name: userData.name,
              email: userData.email,
              profileImage: userData.profileImage,
              emailVerified: user.emailVerified,
            };
            setUser(userFromFirestore);
            userGradient = getGradientColor(user.uid);
            setIsAuthLoaded(true);
          } else {
            console.log("User not found in Firestore.");
            setIsAuthLoaded(true);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthLoaded(true);
        }
      } else {
        setUser(null);
      }
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
