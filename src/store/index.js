import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import errorLog from "./modules/errorLog";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    mainTableData:[],
    dialogRouter:{
      'adminAdd':'adminAdd'
    }
  },
  mutations: {
    setMainTableData (state,obj) {
      state.mainTableData = obj.data;
    }
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
