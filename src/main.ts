import { createApp } from "vue";
import router from "./routes";
import store from "./store";

import Toast from "./plugins/Toast";
const App = require("./App.vue").default;

store.dispatch("darkmodeModule/findAndSetDarkmodeSupported");
store.dispatch("user/initUserFromCookie");

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Toast);
app.mount("#entry");
