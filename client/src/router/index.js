import { createRouter, createWebHistory } from "vue-router";
import WelcomePage from "../views/WelcomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import ConformPhone from "../views/ConformPhone.vue";
import HomePage from "../views/HomePage.vue";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const routes = [
  {
    path: "/",
    name: "WelcomePage",
    component: WelcomePage,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/phone",
    name: "ConformPhone",
    component: ConformPhone,
  },
  {
    path: "/home",
    name: "HomePage",
    component: HomePage,
    meta: {requiresAuth: true}
  },
];

const firebaseConfig = {
  apiKey: "AIzaSyDclSISlD6slKrOQ_nDud1l4pZwcO1BDwA",
  authDomain: "login-auth-731a0.firebaseapp.com",
  projectId: "login-auth-731a0",
  storageBucket: "login-auth-731a0.appspot.com",
  messagingSenderId: "353417788507",
  appId: "1:353417788507:web:4d50a0e3237feba8b0d37e",
  measurementId: "G-33G2P77KLE"
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();

const router = createRouter({
  mode: "history",
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to,from,next)=>{
  const requiresAuth = to.matched.some(record=>record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser;
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (!requiresAuth && isAuthenticated) {
    next('/home');
  } else {
    next();
  }
})

export default router;
