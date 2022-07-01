import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyDWsCR0qGNQ9ozXiZn5wHsX6xqc2sMm4YA",
    authDomain: "vacation-rental-aj.firebaseapp.com",
    projectId: "vacation-rental-aj",
    storageBucket: "vacation-rental-aj.appspot.com",
    messagingSenderId: "580479807071",
    appId: "1:580479807071:web:7853a8ce3cbb97852e75ea"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;