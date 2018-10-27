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
    pageSize:20,
    queryParams:{}
  },
  mutations: {
    setMainTableData (state,obj) {
      state.mainTableData = obj.data;
    },
    setAccessSourceType(state,obj){
      var list = [];
      for(var value of obj.data){
        list.push({
          id:value.id,
          name:value.name
        });
      }
      state.accessSourceType = list;
    },
    setAccessDataSource(state,obj){
      var list = [];
      for(var value of obj.data){
        list.push({
          id:value.static_CODE,
          name:value.static_NAME
        });
      }
      state.accessDataSource = list;
    },
    setExchangePlatform(state,obj){
      var list = [];
      for(var value of obj.data){
        list.push({
          id:value.static_CODE,
          name:value.static_NAME
        });
      }
      state.exchangePlatform = list;
    },
    setQueryParams(state,obj){
      state.queryParams[obj.name] = obj.data;
    }
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
