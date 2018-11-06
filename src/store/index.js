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
    queryParams:JSON.parse(JSON.stringify(queryParamsDefault))
  },
  mutations: {
    setFilterItmeList(state,obj){
      state.fliterItemList[obj.name].ready = true;
      state.fliterItemList[obj.name].data = obj.data;
    },
    selDept(state,id){
      state.deptId = id;
    },
    // setNetwork(state,obj){
    //   var list = [];
    //   for(var value of obj.data){
    //     list.push({
    //       id:value.id,
    //       name:value.name
    //     });
    //   }
    //   state.network = list;
    // },
    // setDataSourceName(state,obj){
    //   var list = [];
    //   for(var value of obj.data){
    //     list.push({
    //       id:value.static_CODE,
    //       name:value.static_NAME
    //     });
    //   }
    //   state.dataSourceName = list;
    // },
    // setPlatform(state,obj){
    //   var list = [];
    //   for(var value of obj.data){
    //     list.push({
    //       id:value.static_CODE,
    //       name:value.static_NAME
    //     });
    //   }
    //   state.platform = list;
    // },
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
    },
		setParamItem(state,obj){
			console.log('-----------------');
			for(var i in obj.data){  //这里obj.data是一个数组，表示不需要重置的
				state.queryParams[obj.name][i] = obj.data[i];
      }
			console.log(state.queryParams[obj.name]);
		}
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
