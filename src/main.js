import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
import createVuetify from "./vuetify.js"
import { initialiseFirebaseApp } from "./services/firebase.js";


// initialise Firebase dependencies
initialiseFirebaseApp();

const app = createApp(App);
app.use(router);
app.use(createVuetify);
app.mount("#app");
