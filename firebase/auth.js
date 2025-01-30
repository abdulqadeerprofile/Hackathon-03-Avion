import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth } from "./firebase";

export const signUpWithEmail = async (displayName, address, username, phone, email, password, userType) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user's profile with additional information
    await updateProfile(userCredential.user, {
      displayName: displayName,
      // Store user type and other details in photoURL as JSON
      photoURL: JSON.stringify({
        userType,
        address,
        username,
        phone
      })
    });

    console.log("User signed up:", userCredential.user);
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

export const getUserType = (user) => {
  try {
    if (user?.photoURL) {
      const profileData = JSON.parse(user.photoURL);
      return profileData.userType;
    }
    return null;
  } catch (error) {
    console.error("Error getting user type:", error);
    return null;
  }
};