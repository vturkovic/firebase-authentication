import firebase from 'firebase/compat/app';

export type LoginError = string | firebase.FirebaseError;

export type LoginFormType = {
    onLogin: (email: string, password: string) => void;
    loginError: LoginError | null;
};