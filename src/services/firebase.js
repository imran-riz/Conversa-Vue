// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";


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

   app = initializeApp(firebaseConfig);

   return app;
}

const getApp = () => {
   return app === null ? initialiseFirebaseApp() : app;
}



export {
   initialiseFirebaseApp,
   getApp
};