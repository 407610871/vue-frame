import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import errorLog from "./modules/errorLog";
import getters from "./getters";

Vue.use(Vuex);

const queryParamsDefault = {
  dashboard:{
    dataSourceName:[],
    network:'',
    platform:[],
    condition:'',
		deptId:[],
    pageNum:1
  },
  accessObjManage:{
    objectType:[],
    dataRange:[],
    condition:'',
    pageNum:1
  },
  accessObjInfo:{
		ACCESS_SYS_DIALECT_ID:'',
		accessSysId:'',
    pageNum1:1,
    pageNum2:1,
    keyword:'',
    tabPosition:'metadataManage'
  },
  recyclingBins:{
    dataSourceName:[],
    network:'',
    platform:[],
    condition:'',
    pageNum:1
  }
}

const store = new Vuex.Store({
  state: {
    deptId:[],
		changingRoute:false,
		routeFlag:'',
    fliterItemList:{
      network:{
        ready:false,
        data:[]
      },
      dataSourceName:{
        ready:false,
        data:[]
      },
      platform:{
        ready:false,
        data:[]
      }
    },
    pageSize:20,
    queryParams:JSON.parse(JSON.stringify(queryParamsDefault)),
    schemaList:[],//增量字段列表
    userList:{},//数据调研列表
  },
  mutations: {
    setFilterItmeList(state,obj){
      state.fliterItemList[obj.name].ready = true;
      state.fliterItemList[obj.name].data = obj.data;
    },
    selDept(state,id){
      state.deptId = id;
    },
		setChangingRoute(state,flag){
			state.changingRoute = flag;
		},
		setRouteFlag(state,obj){
			state.routeFlag = flag;
		},
    setQueryParams(state,obj){
      state.queryParams[obj.name] = obj.data;
    },
    resetQueryParam(state,obj){
      var newObj = JSON.parse(JSON.stringify(queryParamsDefault));
      for(var value of obj.resetData){  //这里obj.data是一个数组，表示不需要重置的
        if(state.queryParams[value]){
          newObj[value] = JSON.parse(JSON.stringify(state.queryParams[value]));
        }
      }
      state.queryParams = newObj;
    },
		setParamItem(state,obj){
			console.log('-----------------');
			for(var i in obj.data){  //这里obj.data是一个数组，表示不需要重置的
				state.queryParams[obj.name][i] = obj.data[i];
      }
			console.log(state.queryParams[obj.name]);
		},
    setSchemaList(state,obj){
      state.schemaList = [];
      state.schemaList = obj;
    },
    //数据调研列表
    setUserList(state,obj){
      state.userList = {};
      state.userList= obj;
    }
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
