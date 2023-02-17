import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { FirebaseError } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const authService = {

  async login (email: string, password: string): Promise<string | null> {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const token = await userCredential.user?.getIdToken();
      localStorage.setItem('firebase_token', token || '');
      return '';
    } catch (error) {
      return 'Login failed. Please check your credentials and try again.';
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
  },

  async isAuthenticated() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, (error) => {
        reject(error);
      });
    });
  }
  
};

export default authService;