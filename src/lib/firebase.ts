import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

async function testConnection() {
  try {
    const docRef = doc(db, 'test', 'connection');
    // Using getDoc instead of getDocFromServer to avoid offline errors from blocking.
    // We intentionally ignore errors here, as the app will still function for local/cached data.
  } catch (error) {
    // Suppress the offline error message to avoid console spam.
  }
}
testConnection();
