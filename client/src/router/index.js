import { createRouter, createWebHistory } from "vue-router";
import WelcomePage from "../views/WelcomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import SignUpPage from "../views/SignUpPage.vue";
import ConformPhone from "../views/ConformPhone.vue";
import HomePage from "../views/HomePage.vue";
import RecordVideo from "../views/RecordVideo.vue";

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
    path: "/register",
    name: "SignUpPage",
    component: SignUpPage,
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
  },
  {
    path: "/camera",
    name: "RecordVideo",
    component: RecordVideo,
  },
  // {
  //   path: '/home',
  //   name: 'HomePage',
  //   component: HomePage,
  //   meta: { requiresAuth: true },
  // },
];

const router = createRouter({
  mode: "history",
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
