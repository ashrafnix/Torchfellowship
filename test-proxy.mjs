import { getFirestore, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const app = null;

const db = new Proxy({}, {
  get: (target, prop) => {
    if (!app) return () => null;
    return {};
  }
});

const auth = new Proxy({}, {
  get: (target, prop) => {
    if (!app) return () => null;
    return {};
  }
});

try {
  console.log("Testing collection()");
  collection(db, 'users');
  console.log("collection() succeeded!");
} catch (e) {
  console.error("collection() failed:", e.message);
}

try {
  console.log("Testing onAuthStateChanged()");
  onAuthStateChanged(auth, () => {});
  console.log("onAuthStateChanged() succeeded!");
} catch (e) {
  console.error("onAuthStateChanged() failed:", e.message);
}
