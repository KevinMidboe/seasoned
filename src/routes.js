import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

let routes = [
  {
    name: "home",
    path: "/",
    component: resolve => require(["./components/Home.vue"], resolve)
  },
  {
    name: "activity",
    path: "/activity",
    meta: { requiresAuth: true },
    component: resolve => require(["./components/ActivityPage.vue"], resolve)
  },
  {
    name: "profile",
    path: "/profile",
    meta: { requiresAuth: true },
    component: resolve => require(["./components/Profile.vue"], resolve)
  },
  {
    name: "list",
    path: "/list/requests",
    component: resolve => require(["./components/RequestPage.vue"], resolve)
  },
  {
    name: "list",
    path: "/list/:name",
    component: resolve => require(["./components/ListPage.vue"], resolve)
  },
  {
    name: "search",
    path: "/search",
    component: resolve => require(["./components/SearchPage.vue"], resolve)
  },
  {
    name: "register",
    path: "/register",
    component: resolve => require(["./components/Register.vue"], resolve)
  },
  {
    name: "settings",
    path: "/settings",
    meta: { requiresAuth: true },
    component: resolve => require(["./components/Settings.vue"], resolve)
  },
  {
    name: "signin",
    path: "/signin",
    alias: "/login",
    component: resolve => require(["./components/Signin.vue"], resolve)
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
    component: resolve => require(["./components/404.vue"], resolve)
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

router.beforeEach((to, from, next) => {
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
