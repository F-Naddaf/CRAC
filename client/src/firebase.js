import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: `${process.env.VUE_APP_FIREBASE_API_KEY}`,
  authDomain: "crac-video-upload.firebaseapp.com",
  projectId: "crac-video-upload",
  storageBucket: "crac-video-upload.appspot.com",
  messagingSenderId: `${process.env.VUE_APP_FIREBASE_SENDER_ID}`,
  appId: `${process.env.VUE_APP_FIREBASE_APP_ID}`,
  measurementId: `${process.env.VUE_APP_FIREBASE_MEASUREMENT_ID}`,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const storage = getStorage(app);

export { storage, auth };
