// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getConfig } from "@testing-library/react";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCrl3XcrA83AYQMoq7o_078UL6qu8IwZCU",
  authDomain: "assignment-smit67.firebaseapp.com",
  projectId: "assignment-smit67",
  storageBucket: "assignment-smit67.appspot.com",
  messagingSenderId: "910032542667",
  appId: "1:910032542667:web:67700df4fe888f2fb7344e",
  measurementId: "G-MDP4RXTXMM"
};



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const config = getConfig(app);

export{analytics,auth,config,firestore}





