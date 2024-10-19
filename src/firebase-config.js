// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCek0u3Yv27wjP7faGWXM8L118jJm54gaI",
  authDomain: "ped-application-4d196.firebaseapp.com",
  projectId: "ped-application-4d196",
  storageBucket: "ped-application-4d196.appspot.com",
  messagingSenderId: "66767077582",
  appId: "1:66767077582:web:93704f82608f35fbe6109f",
  measurementId: "G-GTPV7S3DWT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Export firestore database
export const db = getFirestore(app);
// export const auth = g(app);
export const project_functions = getFunctions(app)
export const project_storage = getStorage(app)
