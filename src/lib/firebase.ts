import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

export const FIREBASE_CONFIGURED =
  typeof apiKey === 'string' && apiKey.length > 10;

let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof getFirestore>;

if (FIREBASE_CONFIGURED) {
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        apiKey,
        authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId:             import.meta.env.VITE_FIREBASE_APP_ID,
      });
  auth = getAuth(app);
  db   = getFirestore(app);
} else {
  // Placeholder — never called when FIREBASE_CONFIGURED is false
  const app = initializeApp({ apiKey: 'demo-key-placeholder', projectId: 'demo', appId: '1:0:web:0' }, 'demo');
  auth = getAuth(app);
  db   = getFirestore(app);
}

export { auth, db };
