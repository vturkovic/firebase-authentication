import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { FirebaseError } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const authService = {
  async login(email: string, password: string) {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const token = await userCredential.user?.getIdToken();
      localStorage.setItem('firebase_token', token || '');
      return token;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error);
      }
      return null;
    }
  },

  async logout() {
    try {
      await firebase.auth().signOut();
      localStorage.removeItem('firebase_token');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        throw new Error(error.message);
      } else {
        throw new Error('Unknown error occurred during logout');
      }
    }
  }
};

export default authService;