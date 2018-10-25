import Keycloak from "keycloak-js";

const VueKeycloak = {}
VueKeycloak.install = function (Vue, options) {
  const keycloak = Keycloak({
    "url": "http://10.37.146.48:8080/auth",
    "realm": "bocom_nanjing",
    "clientId": "js-console",
    "credentials": {
      "secret": "3608819f-5174-4420-b669-5c6036e1ccb5"
    },

  });

  const watch = new Vue({
    data () {
      return {
        ready: false,
        authenticated: false,
        user: null,
        token: null,
        resourceAccess: null
      }
    }
  });
  // Keycloak({
  //   "url": "http://10.37.146.48:8080/auth",
  //   "realm": "bocom_nanjing",
  //   "clientId": "js-console",
  //   "credentials": {
  //     "secret": "3608819f-5174-4420-b669-5c6036e1ccb5"
  //   },
  // })
  keycloak.init({onLoad: "login-required"}).success((isAutenticated) => {
    if (isAutenticated){
      watch.authenticated = true;
    }


  })



  Vue.prototype.$keycloak = keycloak;
}
export default VueKeycloak;
