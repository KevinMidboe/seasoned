import { createApp } from "vue";
import router from "./routes";
import store from "./store";
import Toast from "./plugins/Toast";
import { useTheme } from "./composables/useTheme";

import App from "./App.vue";

// Initialize theme before mounting
const { initTheme } = useTheme();
initTheme();

store.dispatch("user/initUserFromCookie");

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Toast);

app.mount("#app");
