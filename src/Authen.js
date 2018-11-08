import Keycloak from "keycloak-js";
import store from "@/store";
let installed = false;
let Authen = {
  install(Vue, options) {
    if (installed) return
    installed = true;

    const keycloak = Keycloak(options)

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
    keycloak
      .init({
        onLoad: "login-required",
      })
      .success(isAuthenticated => {
        if (isAuthenticated) {
          watch.token = keycloak.token;
          watch.tokenType = keycloak.tokenParsed.typ;

          store.commit(
            "SET_TOKEN",
            keycloak.tokenParsed.typ + " " + keycloak.token
          );
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
