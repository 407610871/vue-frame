import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import errorLog from "./modules/errorLog";
import getters from "./getters";

Vue.use(Vuex);

const queryParamsDefault = {
  dashboard:{
    network:[],
    dataSourceName:[],
    platform:[],
    name:'',
    pageNum:1
  },
  accessObjManage:{
    accessObjType:[],
    dataArea:[],
    keyword:'',
    pageNum:1
  },
  accessObjInfo:{
    pageNum1:1,
    pageNum2:1,
    keyword:'',
    tabPosition:'metadataManage'
  },
  recyclingBins:{
    accessSourceType:[],
    accessDataSource:[],
    exchangePlatform:[],
    keyword:'',
    pageNum:1
  }
}

const store = new Vuex.Store({
  state: {
    deptId:'',
    network:[],
    dataSourceName:[],
    platform:[],
    pageSize:20,
    queryParams:JSON.parse(JSON.stringify(queryParamsDefault))
  },
  mutations: {
    selDept(state,id){
      state.deptId = id;
    },
    setNetwork(state,obj){
      var list = [];
      for(var value of obj.data){
        list.push({
          id:value.id,
          name:value.name
        });
      }
      state.network = list;
    },
    setDataSourceName(state,obj){
      var list = [];
      for(var value of obj.data){
        list.push({
          id:value.static_CODE,
          name:value.static_NAME
        });
      }
      state.dataSourceName = list;
    },
    setPlatform(state,obj){
      var list = [];
      for(var value of obj.data){
        list.push({
          id:value.static_CODE,
          name:value.static_NAME
        });
      }
      state.platform = list;
    },
    setQueryParams(state,obj){
      state.queryParams[obj.name] = obj.data;
    },
    resetQueryParam(state,obj){
      var newObj = JSON.parse(JSON.stringify(queryParamsDefault));
      for(var value of obj.data){  //这里obj.data是一个数组，表示不需要重置的
        if(state.queryParams[value]){
          newObj[value] = JSON.parse(JSON.stringify(state.queryParams[value]));
        }
      }
      state.queryParams = newObj;
    }
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
