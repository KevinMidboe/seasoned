import Vue from "vue";
import Vuex from "vuex";

import darkmodeModule from "./modules/darkmodeModule";
import documentTitle from "./modules/documentTitle";
import torrentModule from "./modules/torrentModule";
import user from "./modules/user";
import popup from "./modules/popup";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    darkmodeModule,
    documentTitle,
    torrentModule,
    user,
    popup
  }
});

export default store;
