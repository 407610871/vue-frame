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
import axios from 'axios'

Vue.prototype.$ajax = axios;

import Authen from "./Authen.js";
import VJstree from 'vue-jstree'
import Viser from 'viser-vue'

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
  render: h => h(App),
  data:{
    eventHub:new Vue()
  },
  mounted(){
    var _self = this;
    this.$ajax.get('http://10.19.160.176:8088/demo/caccess/sysdialect').then(function(res){
      if(res.data.success){
        _self.$store.commit('setFilterItmeList', {
          name:'dataSourceName',
          data:res.data.data
        });
      }
    })
    .catch(function(err){
      console.log(err)
    });
    this.$ajax.get('./getAccessDataSource').then(function(res){
      var list = [];
      for(var value of res.data.staticDatas.SJLY){
        list.push({
          id:value.static_CODE,
          name:value.static_NAME
        });
      }
      _self.$store.commit('setFilterItmeList', {
        name:'network',
        data:list
      });
    })
    .catch(function(err){
      console.log(err)
    });
    this.$ajax.get('./getExchangePlatform').then(function(res){
      var list = [];
      for(var value of res.data.staticDatas.SSJZ){
        list.push({
          id:value.static_CODE,
          name:value.static_NAME
        });
      }
      _self.$store.commit('setFilterItmeList', {
        name:'platform',
        data:list
      });
    })
    .catch(function(err){
      console.log(err)
    });
  }
});
vm.$keycloak.onAuthSuccess = () => {
  vm.$mount("#app");
}

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount("#app");
