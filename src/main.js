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
import VJstree from 'vue-jstree'
import Viser from 'viser-vue'

console.log(process.env)
Vue.use(Authen,{
  url: process.env.VUE_APP_AUTH_SERVER_URL,
  realm: process.env.VUE_APP_REALM,
  clientId: process.env.VUE_APP_RESOURCE,
  credentials: {
    secret: process.env.VUE_APP_CREDENTIALS_SECRET
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

window.vm = new Vue({
  // el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
});
vm.$keycloak.onAuthSuccess = () => {
  vm.$mount("#app");
}

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount("#app");
