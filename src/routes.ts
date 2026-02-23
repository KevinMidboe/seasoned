import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw, RouteLocationNormalized } from "vue-router";

/* eslint-disable-next-line import-x/no-cycle */
import store from "./store";

declare global {
  interface Window {
    preventPushState: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    component: () => import("./pages/HomePage.vue")
  },
  {
    name: "activity",
    path: "/activity",
    meta: { requiresAuth: true, requiresPlexAccount: true },
    component: () => import("./pages/ActivityPage.vue")
  },
  {
    name: "profile",
    path: "/profile",
    meta: { requiresAuth: true },
    component: () => import("./pages/ProfilePage.vue")
  },
  {
    name: "requests-list",
    path: "/list/requests",
    component: () => import("./pages/RequestPage.vue")
  },
  {
    name: "list",
    path: "/list/:name",
    component: () => import("./pages/ListPage.vue")
  },
  {
    name: "search",
    path: "/search",
    component: () => import("./pages/SearchPage.vue")
  },
  {
    name: "register",
    path: "/register",
    component: () => import("./pages/RegisterPage.vue")
  },
  {
    name: "settings",
    path: "/settings",
    meta: { requiresAuth: true },
    component: () => import("./pages/SettingsPage.vue")
  },
  {
    name: "signin",
    path: "/signin",
    alias: "/login",
    component: () => import("./pages/SigninPage.vue")
  },
  {
    name: "torrents",
    path: "/torrents",
    meta: { requiresAuth: true },
    component: () => import("./pages/TorrentsPage.vue")
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
    component: () => import("./pages/404Page.vue")
  }
  // {
  //   path: "*",
  //   redirect: "/"
  // },
  // {
  //   path: "/request",
  //   redirect: "/"
  // }
];

const router = createRouter({
  history: createWebHistory("/"),
  // base: "/",
  routes,
  linkActiveClass: "is-active"
});

const loggedIn = () => store.getters["user/loggedIn"];
const hasPlexAccount = () => store.getters["user/plexUserId"] !== null;
const hamburgerIsOpen = () => store.getters["hamburger/isOpen"];

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
    store.dispatch("documentTitle/updateTitle", to.name);
    store.dispatch("popup/resetStateFromUrlQuery", to.query);

    // Every route change we close hamburger if open
    if (hamburgerIsOpen()) store.dispatch("hamburger/close");

    // If pages has meta 'requiresAuth' and user not logged in
    // send user to signin page.
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!loggedIn()) {
        next({ path: "/signin" });
      }
    }

    if (to.matched.some(record => record.meta.requiresPlexAccount)) {
      if (!hasPlexAccount()) {
        next({
          path: "/settings",
          query: { missingPlexAccount: true }
        });
      }
    }

    next();
  }
);

export default router;
