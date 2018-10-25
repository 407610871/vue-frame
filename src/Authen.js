import Keycloak from "keycloak-js";
<<<<<<< HEAD

let installed = false;
let Authen = {
  install(Vue, options) {
    if (installed) return
    installed = true;

    const keycloak = Keycloak({
      url: "http://10.37.146.48:8080/auth",
      realm: "bocom_nanjing",
      clientId: "js-console",
      credentials: {
        secret: "3608819f-5174-4420-b669-5c6036e1ccb5"
      },
    })

    // const watch = new Vue({
    //   data() {
    //     return {
    //       user: null,
    //       token: null,
    //     }
    //   }
    // })
    const watch = {
      token: "",
      tokenType: ""
    }
=======
import Vue from "vue";

const keycloak = Keycloak({
  url: "http://10.37.146.48:8080/auth",
  realm: "bocom_nanjing",
  clientId: "js-console",
  credentials: {
    secret: "3608819f-5174-4420-b669-5c6036e1ccb5"
  },
})




Vue.use({
  install(Vue, options) {
    const watch = new Vue({
      data() {
        return {
          user: null,
          token: null,
        }
      }
    })
>>>>>>> 完成登陆认证
    keycloak
      .init({
        onLoad: "login-required",
      })
      .success(isAuthenticated => {
        if (isAuthenticated) {
<<<<<<< HEAD
          watch.token = keycloak.token;
          watch.tokenType = keycloak.tokenParsed.typ;

          setTimeout(() => {
            keycloak.updateToken(5).then(refreshed => {
              if (refreshed) {
                watch.token = keycloak.token;
                watch.tokenType = keycloak.tokenParsed.typ;
              }
            })
          }, 5000);
        }
      });

    Object.defineProperty(Vue.prototype, '$keycloak', {
      get() {
        return keycloak;
      }
    });

    Object.defineProperty(Vue.prototype, '$ktoken', {
      get() {
        return watch;
      }
    });
  }
};

export default Authen;
=======
          setTimeout(() => {
            keycloak.updateToken(5).then(refreshed => {
              if (refreshed) {
                watch.token = keycloak.token
              }
            })
          }, 5000)

        }
      });



    Object.defineProperty(Vue.prototype, '$keycloak', {
      get() {
        return keycloak
      }
    })


  }
})

export default keycloak;

// Vue.prototype.keycloak
//   .init({
//     onLoad: "login-required",
//   })
//   .success(isAuthenticated => {
//     if (isAuthenticated) {
//       console.log("SUccess");
//     }
//   });
>>>>>>> 完成登陆认证
