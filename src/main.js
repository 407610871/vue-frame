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
import Keycloak from "keycloak-js"
import VueKeycloak from "./utils/vue-keycloak"


Vue.prototype.keycloak = Keycloak({
  "url": "http://10.37.146.48:8080/auth",
  "realm": "bocom_nanjing",
  "clientId": "js-console",
  "credentials": {
    "secret": "3608819f-5174-4420-b669-5c6036e1ccb5"
  },
})
Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

// Vue.use(VueKeycloak)
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

// Vue.prototype.keycloak = new kc({
//   "url": "http://10.37.146.48:8080/auth",
//   "realm": "bocom_nanjing",
//   "clientId": "js-console",
//   "credentials": {
//     "secret": "3608819f-5174-4420-b669-5c6036e1ccb5"
//   },

// })
// Vue.prototype.keycloak.init({onLoad: 'login-required'}).success( res =>{
//   console.log(res);

// })

Vue.prototype.keycloak
  .init({
    onLoad: "login-required",
  })
  .success(isAuthenticated => {
    if (isAuthenticated) {
      console.log("SUccess");
    }
  });

Vue.prototype.keycloak.onAuthSuccess = function() {
  new Vue({
    el: "#app",
    router,
    store,
    i18n,
    render: h => h(App)
  });
}

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount("#app");
