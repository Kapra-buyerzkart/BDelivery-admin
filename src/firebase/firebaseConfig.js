import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Choose the config based on environment
const firebaseConfig =
  process.env.NODE_ENV === 'development'
    ? require('./firebaseConfig.dev').default
    : require('./firebaseConfig.prod').default;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
