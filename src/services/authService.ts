import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { JwtPayload } from 'jsonwebtoken';
import { FirebaseError } from 'firebase/app';
import jwt_decode from 'jwt-decode'
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
  },

  isLoggedIn() {
    const token = localStorage.getItem('firebase_token');
    if (token) {
      const decodedToken = jwt_decode(token) as JwtPayload;
      if (decodedToken && decodedToken.exp && Date.now() < decodedToken.exp * 1000) {
        return true;
      }
    }
    return false;
  },

  checkTokenExpiration() {
    const token = localStorage.getItem('firebase_token');
    if (token) {
      const decodedToken = jwt_decode(token) as JwtPayload;
      if (decodedToken && decodedToken.exp && Date.now() > decodedToken.exp * 1000) {
        this.logout();
      }
    }
  }
};

export default authService;