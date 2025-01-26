import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from "firebase/auth"; // Import updateProfile here
import { auth, googleProvider } from "./firebase";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { auth, db } from "./firebase"; // Replace with your Firebase setup

export const signUpWithEmail = async (displayName, address, username, phone, email, password) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);

    // Update user's displayName after signup
    await updateProfile(userCredential.user, {
      displayName: displayName // Set the displayName here
    });

    console.log("User display name updated:", userCredential.user.displayName);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider); // signInWithPopup now correctly imported
    console.log("Google Sign-In successful:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error with Google Sign-In:", error.message);
    throw error;
  }
};
