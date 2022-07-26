import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import store from "./store";

declare global {
  interface Window {
    preventPushState: boolean;
  }
}

Vue.use(VueRouter);

let routes = [
  {
    name: "home",
    path: "/",
    component: resolve => resolve("./pages/Home.vue")
  },
  {
    name: "activity",
    path: "/activity",
    meta: { requiresAuth: true },
    component: resolve => resolve("./pages/ActivityPage.vue")
  },
  {
    name: "profile",
    path: "/profile",
    meta: { requiresAuth: true },
    component: resolve => resolve("./pages/ProfilePage.vue")
  },
  {
    name: "list",
    path: "/list/requests",
    component: resolve => resolve("./pages/RequestPage.vue")
  },
  {
    name: "list",
    path: "/list/:name",
    component: resolve => resolve("./pages/ListPage.vue")
  },
  {
    name: "search",
    path: "/search",
    component: resolve => resolve("./pages/SearchPage.vue")
  },
  {
    name: "register",
    path: "/register",
    component: resolve => resolve("./pages/RegisterPage.vue")
  },
  {
    name: "settings",
    path: "/settings",
    meta: { requiresAuth: true },
    component: resolve => resolve("./pages/SettingsPage.vue")
  },
  {
    name: "signin",
    path: "/signin",
    alias: "/login",
    component: resolve => resolve("./pages/SigninPage.vue")
  },
  // {
  //   name: 'user-requests',
  //   path: '/profile/requests',
  //   components: {
  //     'user-requests-router-view': require('./components/MoviesList.vue')
  //   }
  // },
  {
    name: "404",
    path: "/404",
    component: resolve => resolve("./pages/404.vue")
  },
  {
    path: "*",
    redirect: "/"
  },
  {
    path: "/request",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes,
  linkActiveClass: "is-active"
});

const loggedIn = () => store.getters["user/loggedIn"];
const popupIsOpen = () => store.getters["popup/isOpen"];
const hamburgerIsOpen = () => store.getters["hamburger/isOpen"];

window.preventPushState = false;
window.onpopstate = () => (window.preventPushState = true);

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
  store.dispatch("documentTitle/updateTitle", to.name);
  const { movie, show, person } = to.query;

  if (movie) store.dispatch("popup/open", { id: movie, type: "movie" });
  else if (show) store.dispatch("popup/open", { id: show, type: "show" });
  else if (person) store.dispatch("popup/open", { id: person, type: "person" });
  else store.dispatch("popup/close");

  if (hamburgerIsOpen()) store.dispatch("hamburger/close");

  // Toggle mobile nav
  if (document.querySelector(".nav__hamburger--active")) {
    document
      .querySelector(".nav__hamburger")
      .classList.remove("nav__hamburger--active");
    document.querySelector(".nav__list").classList.remove("nav__list--active");
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next({ path: "/signin" });
    }
  }

  next();
});

export default router;
