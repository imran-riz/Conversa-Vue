import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
import { initialiseFirebaseApp } from "./services/firebase.js";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// initialise Firebase dependencies
initialiseFirebaseApp();

const vuetify = createVuetify({
   components,
   directives,
   icons: {
      iconfont: "mdiSvg",
      values: {
         ...aliases,
         ...mdi,
      },
   },
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount("#app");
