import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
import gAuthPlugin from 'vue3-google-oauth2';

const gauthOption = {
  clientId: `${process.env.VUE_APP_GOOGLE_CLIENT_ID}`,
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: true,
};

const app = createApp(App);
app.use(store);
app.use(router);
app.use(gAuthPlugin, gauthOption);

app.mount('#app');
