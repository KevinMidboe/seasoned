import Vue from 'vue'
import VueRouter from 'vue-router';

Vue.use(VueRouter)


let routes = [
  {
    name: 'home',
    path: '/',
    component: (resolve) => require(['./components/Home.vue'], resolve)
  },
  {
    name: 'profile',
    path: '/profile',
    component: (resolve) => require(['./components/Profile.vue'], resolve)
  },
  {
    name: 'list',
    path: '/list/:name',
    component: (resolve) => require(['./components/MoviesList.vue'], resolve)
  },
  {
    name: 'request',
    path: '/request/all',
    components: {
      'request-router-view': require('./components/MoviesList.vue')
    }
  },
  {
    name: 'search',
    path: '/search',
    component: (resolve) => require(['./components/MoviesList.vue'], resolve)
  },
  {
    name: 'register',
    path: '/register',
    component: (resolve) => require(['./components/Register.vue'], resolve)
  },
  {
    name: 'settings',
    path: '/settings',
    component: (resolve) => require(['./components/Settings.vue'], resolve)
  },
  {
    name: 'signin',
    path: '/signin',
    component: (resolve) => require(['./components/Signin.vue'], resolve)
  },
  {
    name: 'settings',
    path: '/profile/settings',
    components: {
      'search-router-view': require('./components/Settings.vue')
    }
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
    path: '*',
    redirect: '/'
  },
  {
    path: '/request',
    redirect: '/'
  }
];

const router =  new VueRouter({
  mode: 'hash',
  base: '/',
  routes,
  linkActiveClass: 'is-active'
});

router.beforeEach((to, from, next) => {
  // Toggle mobile nav
  if(document.querySelector('.nav__hamburger--active')){
    document.querySelector('.nav__hamburger').classList.remove('nav__hamburger--active');
    document.querySelector('.nav__list').classList.remove('nav__list--active');
  }
  next();
});

export default router;
