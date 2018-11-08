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

//展宏加入
import axios from "axios";

Vue.prototype.$ajax = axios;
Vue.prototype.$ajax.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers["Authorization"] = store.getters.token;
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

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

  window.vm = new Vue({
    // el: "#app",
    router,
    store,
    i18n,
    render: h => h(App),
    data: {
      eventHub: new Vue()
    },
    mounted() {
      var _self = this;
      this.$ajax
        .get("http://10.19.160.176:8088/demo/caccess/sysdialect", {
          params: {
            type: 0
          }
        })
        .then(function(res) {
          if (res.data.success) {
            _self.$store.commit("setFilterItmeList", {
              name: "dataSourceName",
              data: res.data.data
            });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      this.$ajax
        .get("./getAccessDataSource")
        .then(function(res) {
          var list = [];
          for (var value of res.data.staticDatas.SJLY) {
            list.push({
              id: value.static_CODE,
              name: value.static_NAME
            });
          }
          _self.$store.commit("setFilterItmeList", {
            name: "network",
            data: list
          });
        })
        .catch(function(err) {
          console.log(err);
        });
      this.$ajax
        .get("./getExchangePlatform")
        .then(function(res) {
          var list = [];
          for (var value of res.data.staticDatas.SSJZ) {
            list.push({
              id: value.static_CODE,
              name: value.static_NAME
            });
          }
          _self.$store.commit("setFilterItmeList", {
            name: "platform",
            data: list
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  });

  window.vm.$keycloak.onAuthSuccess = () => {
    store.commit(
      "SET_TOKEN",
      window.vm.$keycloak.tokenParsed.typ + " " + window.vm.$keycloak.token
    );

    window.vm.$mount("#app");
  };
}

if (process.env.NODE_ENV === "production") {
  loadScript("/env.js", () => {
    bootstrap(ENV || process.env);
  });
} else {
  bootstrap(process.env);
}
