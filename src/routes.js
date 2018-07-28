import VueRouter from 'vue-router';

let routes = [
  {
    name: 'home',
    path: '/',
    components: {
      'list-router-view': require('./components/Home.vue')
    }
  },
  {
    name: 'home-category',
    path: '/list/:category',
    components: {
      'list-router-view': require('./components/MoviesList.vue')
    }
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
    path: '/search/:query',
    components: {
      'search-router-view': require('./components/MoviesList.vue')
    }
  },
  {
    name: 'user-requests',
    path: '/profile/requests',
    components: {
      'user-requests-router-view': require('./components/MoviesList.vue')
    }
  },
  {
    name: 'movie',
    path: '/movie/:id',
    components: {
      'page-router-view': require('./components/MoviePage.vue')
    },
    beforeEnter: (to, from, next) => {
      if(history.state && history.state.popup && from.name){
        eventHub.$emit('openMoviePopup', to.params.id, 'movie', false);
        return;
      }
      next();
    }
  },
  {
    name: 'show',
    path: '/show/:id',
    components: {
      'page-router-view': require('./components/MoviePage.vue')
    },
    beforeEnter: (to, from, next) => {
      if(history.state && history.state.popup && from.name){
        eventHub.$emit('openMoviePopup', to.params.id, 'show', false);
        return;
      }
      next();
    }
  },
  {
    name: 'register',
    path: '/register',
    components: {
      'search-router-view': require('./components/Register.vue')
    }
  },
  {
    name: 'signin',
    path: '/signin',
    components: {
      'search-router-view': require('./components/Signin.vue')
    }
  },
  {
    name: 'profile',
    path: '/profile',
    components: {
      'search-router-view': require('./components/Profile.vue')
    }
  },
  {
    name: 'settings',
    path: '/profile/settings',
    components: {
      'search-router-view': require('./components/Settings.vue')
    }
  },
  {
    name: '404',
    path: '/404',
    components: {
      'page-router-view': require('./components/404.vue')
    }
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router =  new VueRouter({
  // mode: 'history',
  base: '/request/',
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
