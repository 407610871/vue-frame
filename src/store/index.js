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
    pageNum:1,
		timeFlag:0
  },
  accessObjManage:{
    objectType:[],
    dataRange:[],
    condition:'',
    pageNum:1,
		timeFlag:0
  },
  accessObjInfo:{
		ACCESS_SYS_DIALECT_ID:'',
		accessSysId:'',
		diyComments:'',
    pageNum1:1,
    pageNum2:1,
    keyword:'',
    tabPosition:'metadataManage',
		timeFlag:0
  },
  recyclingBins:{
    dataSourceName:[],
    network:'',
    platform:[],
    condition:'',
    pageNum:1,
		timeFlag:0
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
    regInfo:{},//正则
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
			var changeObj = newObj[obj.resetData];
			changeObj.timeFlag = new Date().getTime();
      state.queryParams[obj.resetData] = changeObj;
    },
		setParamItem(state,obj){
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
    },
    //正则表达式
    setRegInfo(state,obj){
      state.regInfo = {};
      state.regInfo = obj;
    }
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
