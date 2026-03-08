import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  UserCredential,
  User
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { supabase } from "./supabase";

// User profile interface
export interface UserProfile {
  id?: string;
  firebase_uid: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "PHARMACIST";
  mode: "RETAIL" | "HOSPITAL";
  organization_id?: string;
  organization_name?: string;
  phone?: string;
  avatar_url?: string;
}

/**
 * Sign up with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns User credential with user info
 */
export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns User credential with user info
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with Google OAuth
 * @returns User credential with user info and metadata
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
    return userCredential;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};

/**
 * Send password reset email
 * @param email - User's email address
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Save user profile to Supabase PostgreSQL
 * Replaces Firestore with proper relational database
 * @param profile - User profile data
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        firebase_uid: profile.firebase_uid,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        mode: profile.mode,
        organization_id: profile.organization_id || null,
        organization_name: profile.organization_name || null,
        phone: profile.phone || null,
        avatar_url: profile.avatar_url || null,
      }, {
        onConflict: 'firebase_uid'
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log("✅ User profile saved successfully to Supabase");
  } catch (error: any) {
    console.error("❌ Error saving user profile to Supabase:", error);
    throw new Error("Failed to save user profile: " + error.message);
  }
};

/**
 * Get user profile from Supabase PostgreSQL
 * @param firebaseUid - Firebase Auth UID
 * @returns User profile data or null if not found
 */
export const getUserProfile = async (firebaseUid: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user doesn't exist
        return null;
      }
      throw error;
    }
    
    return data as UserProfile;
  } catch (error: any) {
    console.error("Error getting user profile from Supabase:", error);
    return null;
  }
};

/**
 * Helper function to convert Firebase error codes to user-friendly messages
 * @param errorCode - Firebase error code
 * @returns User-friendly error message
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed. Please try again.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups and try again.";
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. Please try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";
    default:
      return "An error occurred during authentication. Please try again.";
  }
};
