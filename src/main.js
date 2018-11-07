import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/icon/iconfont.css";

import "@/styles/index.scss"; // global css

import App from "./App.vue";
import router from "./router";
import store from "./store";

import i18n from "./lang"; // Internationalization
import "./icons"; // icon
import "./errorLog"; // error log
import "./mock"; // simulation data

import * as filters from "./filters"; // global filters

import "./registerServiceWorker";

import Authen from "./Authen.js";
import VJstree from "vue-jstree";
import Viser from "viser-vue";

function loadScript(url, callback) {
  // adding the script tag to the head as suggested before
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;

  // then bind the event to the callback function
  // there are several events for cross browser compatibility
  script.onload = callback;

  // fire the loading
  head.appendChild(script);
}

function bootstrap(env) {
  console.log(env);
  Vue.use(Authen, {
    url: env.VUE_APP_AUTH_SERVER_URL,
    realm: env.VUE_APP_REALM,
    clientId: env.VUE_APP_RESOURCE,
    credentials: {
      secret: env.VUE_APP_CREDENTIALS_SECRET
    }
  });
  Vue.use(Viser);
  Vue.use(VJstree);

  Vue.use(Element, {
    size: Cookies.get("size") || "medium", // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
  });

  // register global utility filters.
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
  });

  Vue.config.productionTip = false;
  const vm = new Vue({
    // el: "#app",
    router,
    store,
    i18n,
    render: h => h(App)
  });
  vm.$keycloak.onAuthSuccess = () => {
    //初始化 将token放入store
    store.commit(
      "SET_TOKEN",
      vm.$keycloak.tokenParsed.typ + " " + vm.$keycloak.token
    );

    vm.$mount("#app");
  };
}

if (process.env.NODE_ENV === "production") {
  loadScript("/env.js", () => {
    bootstrap(ENV || process.env);
  });
} else {
  bootstrap(process.env);
}
