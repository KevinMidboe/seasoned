import { createApp } from "vue";
import router from "../../routes";
import ToastComponent from "./ToastComponent.vue";

const optionsDefaults = {
  data: {
    type: "info",
    show: true,
    timeout: 3000
  }
};

function toast(options) {
  // merge the default options with the passed options.
  const toastComponent = createApp(ToastComponent, {
    ...optionsDefaults.data,
    ...options
  });

  toastComponent.use(router);

  toastComponent.mount(
    document.body.appendChild(document.createElement("div"))
  );
}

export default {
  install(app) {
    console.log("installing toast plugin!"); // eslint-disable-line no-console

    function info(options) {
      toast({ type: "info", ...options });
    }

    function success(options) {
      toast({ type: "success", ...options });
    }

    function warning(options) {
      toast({ type: "warning", ...options });
    }

    function error(options) {
      toast({ type: "error", ...options });
    }

    function simple(options) {
      toast({ type: "simple", ...options });
    }

    const notifications = { info, success, warning, error, simple };

    /* eslint-disable-next-line no-param-reassign */
    app.config.globalProperties.$notifications = notifications;

    app.provide("notifications", notifications);
  }
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $notifications: (info: object) => void;
  }
}
