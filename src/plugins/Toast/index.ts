import { createApp } from "vue";
import router from "../../routes";
import ToastComponent from "./ToastComponent.vue";

const optionsDefaults = {
  data: {
    type: "info",
    show: true,
    timeout: 3000,

    onCreate(created = null) {},
    onEdit(editted = null) {},
    onRemove(removed = null) {}
  }
};

function toast(options) {
  // merge the default options with the passed options.
  const toastComponent = createApp(ToastComponent, {
    ...optionsDefaults.data,
    ...options
  });

  toastComponent.use(router);

  console.log("toastComponent:", toastComponent);
  toastComponent.mount(
    document.body.appendChild(document.createElement("div"))
  );
}

export default {
  install(app, options) {
    console.log("installing toast plugin!");
    console.log("plugin options", options);

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
    app.config.globalProperties.$notifications = notifications;

    app.provide("notifications", notifications);
  }
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $notifications: (info: object) => void;
  }
}
