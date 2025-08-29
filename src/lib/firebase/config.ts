
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "shyftpro",
  "appId": "1:920692335727:web:c4129bac05c4b7425d999a",
  "storageBucket": "shyftpro.appspot.com",
  "apiKey": "AIzaSyChGKTuUDpXDut7t9QMxO3dg3p3d3js3xM",
  "authDomain": "shyftpro.firebaseapp.com",
  "messagingSenderId": "920692335727"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
