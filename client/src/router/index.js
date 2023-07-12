import { createRouter, createWebHistory } from "vue-router";
import WelcomePage from "../views/WelcomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import SignUpPage from "../views/SignUpPage.vue";
import ConformPhone from "../views/ConformPhone.vue";
import HomePage from "../views/HomePage.vue";
import CreateVideoPage from "../views/CreateVideoPage.vue";
import Profile from "../views/Profile.vue";
import FriendProfile from "../views/FriendProfile.vue";
import Friends from "../views/Friends.vue";
import EditProfile from "../views/EditProfile.vue";
import SearchResultPage from "../views/SearchResultPage.vue";
import ViewVideo from "../views/ViewVideo.vue";

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
    path: "/:id/home",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/search-result/:title",
    name: "SearchResultPage",
    component: SearchResultPage,
  },
  {
    path: "/camera",
    name: "CreateVideoPage",
    component: CreateVideoPage,
  },
  {
    path: "/profile/:id",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/friend/profile/:id",
    name: "FriendProfile",
    component: FriendProfile,
  },
  {
    path: "/edit/:id",
    name: "EditProfile",
    component: EditProfile,
  },
  {
    path: "/friends",
    name: "Friends",
    component: Friends,
  },
  {
    path: "/view-video/:id/:userId",
    name: "ViewVideo",
    component: ViewVideo,
  },
];

const router = createRouter({
  mode: "history",
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
