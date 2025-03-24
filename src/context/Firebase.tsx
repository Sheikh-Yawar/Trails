import { FirebaseError, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
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
import { TripDataType, updateUserFields } from "../utils/CustomTypes";

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
  savedTrips: TripDataType[];
  firebaseAnalytics: Analytics;
  firebaseAuth: Auth;
  signupwithGoogle: () => Promise<void>;
  signUpWithEmailAndPassword: (
    name: string,
    email: string,
    password: string,
    profileImageBase64: string | null
  ) => Promise<void>;
  signinWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<void>;
  updateUserDetails: (value: updateUserFields) => Promise<void>;
  uploadBase64Image: (base64Image: string, path: string) => Promise<string>;
  saveDataToFireStore: (
    collectionName: string,
    data: any,
    tripId: string,
    userId: string,
    action: "favourites" | "community"
  ) => Promise<string>;
  removeDataFromFireStore: (
    collectionName: string,
    tripId: string,
    action: "favourites" | "community"
  ) => Promise<string>;
  getUserFavouriteTrips: (userId: string) => Promise<void>;
}

let userGradient = "#f3f4f6";
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);
const firebaseAnalytics = getAnalytics(firebaseApp);

const FirebaseContext = createContext<FirebaseContextType | null>(null);

const firebaseGoogleProvider = new GoogleAuthProvider();

export const useFirebase = () => useContext(FirebaseContext);

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
  const [savedTrips, setSavedTrips] = useState<TripDataType[]>([]);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const saveDataToFireStore = async (
    collectionName: string,
    data: any,
    tripId: string,
    userId: string,
    action: "favourites" | "community"
  ): Promise<string> => {
    try {
      await setDoc(doc(firebaseFirestore, "trips", tripId), {
        userId,
        tripId,
        ...data,
      });
      if (action === "favourites") {
        await getUserFavouriteTrips(userId);
      }

      return action === "favourites"
        ? "Added to Favourites!"
        : "Trip has been shared with the community!";
    } catch (error) {
      console.error("Error saving Dats:", error);
      throw new Error("Something went wrong. Please try again later.");
    }
  };

  const removeDataFromFireStore = async (
    collectionName: string,
    tripId: string,
    action: "favourites" | "community"
  ): Promise<string> => {
    try {
      const tripDocRef = doc(firebaseFirestore, "trips", tripId);
      const tripDocSnap = await getDoc(tripDocRef);

      if (tripDocSnap.exists()) {
        const tripData = tripDocSnap.data() as TripDataType;

        if (tripData.isTripSaved && tripData.isCommunityTrip) {
          const updateData: Partial<TripDataType> = {};
          if (action === "favourites") {
            updateData.isTripSaved = false;
          } else if (action === "community") {
            updateData.isCommunityTrip = false;
          }

          await updateDoc(tripDocRef, updateData);

          // Update local state if it's a favourite trip
          if (action === "favourites") {
            console.log("Updating state", tripId);
            setSavedTrips((prevTrips: TripDataType[]) =>
              prevTrips.filter((trip) => trip.tripId !== tripId)
            );
          }
          return action === "favourites"
            ? "Removed from Favourites!"
            : "Removed from Community!";
        } else {
          // Only one is true, delete the document
          await deleteDoc(tripDocRef);
          setSavedTrips((prevTrips: TripDataType[]) =>
            prevTrips.filter((trip) => trip.tripId !== tripId)
          );
          return `Removed from ${
            action === "favourites" ? "Favourites" : "Community"
          }!`;
        }
      } else {
        throw new Error("Trip not found.");
      }
    } catch (error) {
      console.log(`Error removing trip`, error);
      throw new Error("Something went wrong. Please try again later.");
    }
  };

  const getUserFavouriteTrips = async (userId: string): Promise<void> => {
    const tripsRef = collection(firebaseFirestore, "trips");
    const q = query(
      tripsRef,
      where("userId", "==", userId),
      where("isTripSaved", "==", true)
    );

    const querySnapshot = await getDocs(q);
    const trips = querySnapshot.docs.map((doc) => {
      return doc.data() as TripDataType;
    });

    setSavedTrips(trips);
  };

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
  ): Promise<void> => {
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

      // Update user profile
      await updateProfile(user, {
        displayName: name,
        photoURL: profileImageURL,
      });

      // Set user in state
      const updatedUser: trailsUser = {
        uid: user.uid,
        name,
        email,
        profileImage: profileImageURL,
        emailVerified: user.emailVerified,
      };
      setUser(updatedUser);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase sign-up error code:", error.code);

        const errorMessages: Record<string, string> = {
          "auth/email-already-in-use":
            "This email is already registered. Try logging in instead.",
          "auth/invalid-email":
            "Invalid email format. Please enter a valid email address.",
          "auth/weak-password":
            "Password is too weak. Please use at least 6 characters.",
          "auth/network-request-failed":
            "Network error. Please check your connection and try again.",
          "auth/internal-error":
            "An unexpected error occurred. Please try again later.",
          "auth/operation-not-allowed":
            "Sign-up is currently disabled. Please contact support.",
        };

        throw new Error(
          errorMessages[error.code] || "Something went wrong. Please try again."
        );
      } else {
        console.error("Unknown error occurred", error);
        throw new Error("Something went wrong. Please try again later.");
      }
    }
  };

  const signinWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;
      if (!user.emailVerified) {
        // Resend verification email
        await sendEmailVerification(user);
        await signOut(firebaseAuth);
        throw new FirebaseError("auth/email-not-verified", "Custom Message");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase sign-in error-code:", error.code);
        // Define user-friendly error messages based on Firebase error codes
        const errorMessages: Record<string, string> = {
          "auth/invalid-email":
            "The email address is not valid. Please enter a valid email.",
          "auth/user-disabled":
            "This account has been disabled. Please contact support.",
          "auth/user-not-found":
            "No account found with this email. Please sign up first.",
          "auth/wrong-password":
            "Incorrect password. Please try again or reset your password.",
          "auth/too-many-requests":
            "Too many failed attempts. Please try again later or reset your password.",
          "auth/network-request-failed":
            "Network error. Please check your internet connection and try again.",
          "auth/internal-error":
            "An unexpected error occurred. Please try again later.",
          "auth/invalid-credential": "Invalid Credentials. Please try again.",
          "auth/email-not-verified":
            "Your email address is not verified. A verification email has been sent to your inbox. Please check your email and verify your account before logging in.",
        };

        throw new Error(
          errorMessages[error.code] ||
            "Something went wrong. Please try again later."
        );
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
          await getUserFavouriteTrips(user.uid);
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
        savedTrips,
        firebaseAuth,
        firebaseAnalytics,
        signupwithGoogle,
        signUpWithEmailAndPassword,
        signinWithEmailAndPassword,
        uploadBase64Image,
        updateUserDetails,
        saveDataToFireStore,
        removeDataFromFireStore,
        getUserFavouriteTrips,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
