import Keycloak from "keycloak-js";



function install(Vue, options) {
  console.log(this)
  const keycloak = Keycloak({
    url: window.ENV.VUE_APP_AUTH_SERVER_URL,
    realm: "bocom_nanjing",
    clientId: "js-console",
    credentials: {
      secret: "3608819f-5174-4420-b669-5c6036e1ccb5"
    },
  })

  keycloak
    .init({
      onLoad: "login-required",
    })
    .success(isAuthenticated => {
      if (isAuthenticated) {
        // watch.vmtoken = keycloak.token
        setTimeout(() => {
          keycloak.updateToken(2).then(refreshed => {
            if (refreshed) {
              watch.vmtoken = keycloak.token
            }
          })
        }, 5000)
      }
    });



  Object.defineProperty(Vue.prototype, '$keycloak', {
    get() {
      return keycloak
    }
  });

  // Object.defineProperty(Vue.prototype, '$kcToken', {
  //   get() {
  //     return t
  //   }
  // })



}


function VueKeycloak(options) {
  if (options === void 0) options = {};
  this.token = "";

}
VueKeycloak.prototype.install = install;

export default VueKeycloak
// export default keycloak;

// Vue.prototype.keycloak
//   .init({
//     onLoad: "login-required",
//   })
//   .success(isAuthenticated => {
//     if (isAuthenticated) {
//       console.log("SUccess");
//     }
//   });