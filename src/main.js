import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { initialiseFirebaseApp } from "./libs/chatapp_firebase.js";

// initialise Firebase dependencies
initialiseFirebaseApp();


const app = createApp(App);

app.mount('#app');
