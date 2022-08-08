import Vue from "vue";
import VueRouter from "vue-router";
import router from "./routes";
import store from "./store";

import Toast from "./plugins/Toast";
import App from "./App.vue";

Vue.use(VueRouter);
Vue.use(Toast);

store.dispatch("darkmodeModule/findAndSetDarkmodeSupported");
store.dispatch("user/initUserFromCookie");

new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App />"
});
