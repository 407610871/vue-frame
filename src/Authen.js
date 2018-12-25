import Keycloak from "keycloak-js";
import store from "@/store";
import { isInArray } from "@/api/validate";
let installed = false;
let Authen = {
  userInfo: {
    info: ""
  },
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
          //获取用户信息
          this.userInfo = keycloak.tokenParsed;
          let adminArr = keycloak.tokenParsed.resource_access["register-server"].roles;
          let isAdmin = isInArray("ROLE_REGISTERSERVER_ADMIN", adminArr);
          let roleName = isAdmin ? "管理员" : "普通用户";
          let userName = Authen.userInfo.name;
          let userId = Authen.userInfo.sub;
          let obj = {
            userName: userName,
            roleName: roleName,
            userId : userId
          };
          store.commit("setUserInfo", obj);
          watch.token = keycloak.token;
          watch.tokenType = keycloak.tokenParsed.typ;
          store.commit("SET_TOKEN", keycloak.tokenParsed.typ + ' ' + keycloak.token);
          store.commit(
            "SET_TOKEN",
            keycloak.tokenParsed.typ + " " + keycloak.token
          );
          setInterval(() => {
            keycloak.updateToken(300).then(refreshed => {
              if (refreshed) {
                watch.token = keycloak.token;
                watch.tokenType = keycloak.tokenParsed.typ;
                store.commit("SET_TOKEN", keycloak.tokenParsed.typ + ' ' + keycloak.token);
              }
            });
          }, 290000);
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
