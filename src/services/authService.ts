import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { JwtPayload } from 'jsonwebtoken';
import { FirebaseError } from 'firebase/app';
import jwt_decode from 'jwt-decode';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const authService = {
  async login(email: string, password: string) {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const token = await userCredential.user?.getIdToken();
      const expirationTime = Date.now() + 1200000; // 20 mins from now
      localStorage.setItem('firebase_token', token || '');
      localStorage.setItem('firebase_token_expiration', expirationTime.toString());
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
      localStorage.removeItem('firebase_token_expiration');
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
    const expirationTime = localStorage.getItem('firebase_token_expiration');
    if (token && expirationTime) {
      const decodedToken = jwt_decode(token) as JwtPayload;
      if (decodedToken && decodedToken.exp && Date.now() < parseInt(expirationTime)) {
        return true;
      }
    }
    return false;
  },

  checkTokenExpiration() {
    const token = localStorage.getItem('firebase_token');
    const expirationTime = localStorage.getItem('firebase_token_expiration');
    
    if (token && expirationTime) {
      const decodedToken = jwt_decode(token) as JwtPayload;
      if (decodedToken && decodedToken.exp && Date.now() > parseInt(expirationTime)) {
        this.logout();
      }
    }
  }
};

export default authService;
