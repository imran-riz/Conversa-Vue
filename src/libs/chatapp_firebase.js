// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


let app = null;

const initialiseFirebaseApp = () => {
    // the app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAPluxjfXIErNp0E61s04loQPHToWtdLhg",
        authDomain: "vue-chat-app-365a2.firebaseapp.com",
        projectId: "vue-chat-app-365a2",
        storageBucket: "vue-chat-app-365a2.appspot.com",
        messagingSenderId: "513558762397",
        appId: "1:513558762397:web:77011cf532e573b1451574"
    };

    return initializeApp(firebaseConfig);
}

const getApp = () => {
    return app === null ? initialiseFirebaseApp() : app;
}

const getFirestoreDatabase = () => {
    return getFirestore(getApp());
}


const addNewUser = async (id, firstName, lastName, birthdate) => {
    try {
        const userDetails = {
            first_name: firstName,
            last_name: lastName,
            birthdate: birthdate,
        };

        await setDoc(doc(getFirestoreDatabase(), "users", id), userDetails);

        console.log(`chatapp_firebase.js addNewUser() -> New user added to db.`);
    }
    catch (error) {
        console.error(`chatapp_firebase.js addNewUser() -> Failed to add new user to db. Error: ${error.code}`);
    }
}

/**
 * Returns the current authenticated user
 */
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                resolve(user);
                removeListener();
            },
            reject
        );
    });
}


/**
 * Used to sign the user out of the Firebase app
 */
const signOutUser = async () => {
    try {
        const promise = await signOut(getAuth());

        if (promise) return true;
    }
    catch (error) {
        console.error(`chatapp_firebase.js signOutUser() -> Failed to sign the user out. Error: ${error.code}`);
    }

    return false;
}


export { initialiseFirebaseApp, getApp, getFirestoreDatabase, addNewUser, getCurrentUser, signOutUser };