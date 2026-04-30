import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

const hasValidCredentials = 
  privateKey && !privateKey.includes('PASTE_YOUR') && 
  clientEmail && !clientEmail.includes('PASTE_YOUR');

if (getApps().length === 0) {
  if (hasValidCredentials) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: clientEmail,
        // Next.js stores multi-line strings with literal \n — convert them back
        privateKey: privateKey?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    console.warn('Firebase Admin SDK disabled: Missing or invalid credentials in .env.local');
  }
}

let _db: Firestore | null = null;
let _auth: Auth | null = null;

// Use proxies so we only throw errors when the database is actually queried,
// allowing the API route's try/catch block to return a proper JSON error response.
export const adminDb = new Proxy({} as Firestore, {
  get: (target, prop) => {
    if (!hasValidCredentials) throw new Error('Firebase Admin not initialized: Missing credentials in .env.local');
    if (!_db) _db = getFirestore();
    return (_db as any)[prop];
  }
});

export const adminAuth = new Proxy({} as Auth, {
  get: (target, prop) => {
    if (!hasValidCredentials) throw new Error('Firebase Admin not initialized: Missing credentials in .env.local');
    if (!_auth) _auth = getAuth();
    return (_auth as any)[prop];
  }
});
