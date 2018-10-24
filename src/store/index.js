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
    },
    accessSourceType:[],
    accessDataSource:[],
    exchangePlatform:[],
    breadcrumb:[]
  },
  mutations: {
    setMainTableData (state,obj) {
      state.mainTableData = obj.data;
    },
    setAccessSourceType(state,obj){
      state.accessSourceType = obj.data;
    },
    setAccessDataSource(state,obj){
      state.accessDataSource = obj.data;
    },
    setExchangePlatform(state,obj){
      state.exchangePlatform = obj.data;
    },
    setBreadcrumb(state,obj){
      state.breadcrumb = obj.data;
    }
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
