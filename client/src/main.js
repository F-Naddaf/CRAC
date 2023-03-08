// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import store from "./store";
// import "./assets/tailwind.css";

// import GAuth from 'vue-google-oauth2'
// const gauthOption = {
//   clientId: process.env.MIX_GOOGLE_CLIENT_ID,
//   scope: 'profile email',
//   prompt: 'consent'
// }

// createApp(App).use(store).use(router).mount("#app").use(GAuth, gauthOption);

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import gAuthPlugin from 'vue3-google-oauth2'

const gauthOption = {
  // clientId: process.env.MIX_GOOGLE_CLIENT_ID,
  clientId: '830401754547-pk8426v0d7gp0ss0pd3vs2ou40vqnfmh.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: true
}

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");
app.use(gAuthPlugin, gauthOption);


// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import store from "./store";
// import "./assets/tailwind.css";
// import GAuth from 'vue-google-oauth2'


// const gauthOption = {
//   clientId: '830401754547-pk8426v0d7gp0ss0pd3vs2ou40vqnfmh.apps.googleusercontent.com',
//   scope: 'profile email',
//   prompt: 'consent',
//   fetch_basic_profile: true
// }
// const gauthInstance = GAuth(gauthOption)

// const app = createApp(App)
// app.use(store)
// app.use(router)
// app.use(gauthInstance)
// app.mount("#app")
