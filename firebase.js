// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDj9fVl1qhuQX1hNF0vq8-qDNpgxr2XUpQ",
    authDomain: "pantry-3fc01.firebaseapp.com",
    projectId: "pantry-3fc01",
    storageBucket: "pantry-3fc01.appspot.com",
    messagingSenderId: "624738257895",
    appId: "1:624738257895:web:75f4dd854888c6e3520b42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore};