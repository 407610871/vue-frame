import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import errorLog from "./modules/errorLog";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userInfo: {
      userName: "",
      roleName: "",
      userId: ""
    },
    userThemes: "DEFAULT"
  },
  mutations: {
    setUserInfo(state, obj) {
      state.userInfo.userName = obj.userName;
      state.userInfo.roleName = obj.roleName;
      state.userInfo.userId = obj.userId;
    },
    //主题颜色
    setThemes(state, obj) {
      state.userThemes = "";
      state.userThemes = obj;
    }
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
