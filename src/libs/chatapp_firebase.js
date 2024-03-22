// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


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

    initializeApp(firebaseConfig);
}


export { initialiseFirebaseApp };