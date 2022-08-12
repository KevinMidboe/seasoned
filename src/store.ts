import { createStore } from "vuex";

import darkmodeModule from "./modules/darkmodeModule";
import documentTitle from "./modules/documentTitle";
import torrentModule from "./modules/torrentModule";
import user from "./modules/user";
import hamburger from "./modules/hamburger";

/* eslint-disable-next-line import/no-cycle */
import popup from "./modules/popup";

const store = createStore({
  modules: {
    darkmodeModule,
    documentTitle,
    torrentModule,
    user,
    popup,
    hamburger
  }
});

export default store;
