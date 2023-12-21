import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    databaseURL: process.env.DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);