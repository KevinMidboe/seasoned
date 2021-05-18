import Vue from 'vue'
import VueRouter from 'vue-router';
import store from '@/store'

Vue.use(VueRouter)


let routes = [
  {
    name: 'home',
    path: '/',
    component: (resolve) => require(['./components/Home.vue'], resolve)
  },
  {
    name: 'activity',
    path: '/activity',
    meta: { requiresAuth: true },
    component: (resolve) => require(['./components/ActivityPage.vue'], resolve)
  },
  {
    name: 'profile',
    path: '/profile',
    meta: { requiresAuth: true },
    component: (resolve) => require(['./components/Profile.vue'], resolve)
  },
  {
    name: 'list',
    path: '/list/:name',
    component: (resolve) => require(['./components/ListPage.vue'], resolve)
  },
  {
    name: 'request',
    path: '/request/all',
    components: {
      'request-router-view': require('./components/ListPage.vue')
    }
  },
  {
    name: 'search',
    path: '/search',
    component: (resolve) => require(['./components/Search.vue'], resolve)
  },
  {
    name: 'register',
    path: '/register',
    component: (resolve) => require(['./components/Register.vue'], resolve)
  },
  {
    name: 'settings',
    path: '/settings',
    meta: { requiresAuth: true },
    component: (resolve) => require(['./components/Settings.vue'], resolve)
  },
  {
    name: 'signin',
    path: '/signin',
    alias: '/login',
    component: (resolve) => require(['./components/Signin.vue'], resolve)
  },
  // {
  //   name: 'user-requests',
  //   path: '/profile/requests',
  //   components: {
  //     'user-requests-router-view': require('./components/MoviesList.vue')
  //   }
  // },
  {
    name: '404',
    path: '/404',
    component: (resolve) => require(['./components/404.vue'], resolve)
  },
  {
    name: 'logout',
    path: '/logout',
    component: {
      template: '<div></div>',
      created() {
        localStorage.clear();
        this.$router.push({ name: 'home' });
      }
    }
  },
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/request',
    redirect: '/'
  }
];

const router =  new VueRouter({
  mode: 'history',
  base: '/',
  routes,
  linkActiveClass: 'is-active'
});

router.beforeEach((to, from, next) => {
  store.dispatch('documentTitle/updateTitle', to.name)

  // Toggle mobile nav
  if(document.querySelector('.nav__hamburger--active')){
    document.querySelector('.nav__hamburger').classList.remove('nav__hamburger--active');
    document.querySelector('.nav__list').classList.remove('nav__list--active');
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') == null) {
      next({ path: '/signin' });
    }
  }

  next();
});

export default router;
