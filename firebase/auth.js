import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

export const signUpWithEmail = async (
  displayName,
  address,
  username,
  phone,
  email,
  password,
  userType
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName,
      email,
      userType,
      ...(userType === "buyer" && { address, username, phone }),
      createdAt: new Date().toISOString(),
    })

    return user
  } catch (error) {
    throw error
  }
}

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    throw error
  }
}

export const getUserType = async (user) => {
  if (!user) return null

  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data().userType || "buyer"
  }

  return "buyer"
}

export const isUserAdmin = async (user) => {
  const userType = await getUserType(user)
  return userType === "admin"
}
