import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import errorLog from "./modules/errorLog";
import getters from "./getters";

Vue.use(Vuex);

const queryParamsDefault = {
  dashboard: {
    dataSourceName: [],
    network: [],
    platform: [],
    condition: '',
    deptId: [],
    pageNum: 1,
    timeFlag: 0
  },
  accessObjManage: {
    objectType: [],
    dataRange: [],
    condition: '',
    pageNum: 1,
    timeFlag: 0
  },
  accessObjInfo: {
    ACCESS_SYS_DIALECT_ID: '',
    accessSysId: '',
    diyComments: '',
    pageNum1: 1,
    pageNum2: 1,
    keyword: '',
    tabPosition: 'metadataManage',
    timeFlag: 0
  },
  recyclingBins: {
    dataSourceName: [],
    network: '',
    platform: [],
    condition: '',
    pageNum: 1,
    timeFlag: 0
  },
  setting: {
    timeFlag: 0
  }
}

const store = new Vuex.Store({
  state: {
    deptId: [],
    deptIdLess: [],
    routeFlag: '',
    fliterItemList: {
      network: {
        ready: false,
        data: []
      },
      dataSourceName: {
        ready: false,
        data: []
      },
      platform: {
        ready: false,
        data: []
      }
    },
    pageSize: 20,
    pageReady: false,
    queryParams: JSON.parse(JSON.stringify(queryParamsDefault)),
    schemaList: [], //增量字段列表
    userList: {}, //数据调研列表
    regInfo: {}, //正则
    matchType: [], //自定义表
    matchflag: '0', //表
    jrtype: '', //接入源的类型
    separator: '', //分隔符
    isParquet: true, //是否是parquet文件
    modeStyle: '', //用户选择的接入方式
    noreData: [], //非关系型数据
    delimiter: '', //非关系型分隔符
  },
  mutations: {
    setPageSize(state, pageSize) {
      state.pageSize = pageSize;
    },
    setPageReady(state) {
      state.pageReady = true;
    },
    setFilterItmeList(state, obj) {
      state.fliterItemList[obj.name].ready = true;
      state.fliterItemList[obj.name].data = obj.data;
    },
    selDept(state, ids) {
      state.deptId = ids;
    },
    setDeptIdLess(state, ids) {
      state.deptIdLess = ids;
    },
    setRouteFlag(state, obj) {
      state.routeFlag = flag;
    },
    setQueryParams(state, obj) {
      state.queryParams[obj.name] = obj.data;
    },
    resetQueryParam(state, obj) {
      var newObj = JSON.parse(JSON.stringify(queryParamsDefault));
      var changeObj = newObj[obj.resetData];
      changeObj.timeFlag = new Date().getTime();
      state.queryParams[obj.resetData] = changeObj;
    },
    setParamItem(state, obj) {
      for (var i in obj.data) { //这里obj.data是一个数组，表示不需要重置的
        state.queryParams[obj.name][i] = obj.data[i];
      }
      console.log(state.queryParams[obj.name]);
    },
    setSchemaList(state, obj) {
      state.schemaList = [];
      state.schemaList = obj;
    },
    //数据调研列表
    setUserList(state, obj) {
      state.userList = {};
      state.userList = obj;
    },
    //正则表达式
    setRegInfo(state, obj) {
      state.regInfo = {};
      state.regInfo = obj;
      state.matchflag = '0';
    },
    //自定义表
    setMatchType(state, obj) {
      state.matchType = [];
      state.matchflag = '0';
      state.matchType = obj;
      state.matchflag = '1';
    },
    setJrtype(state, obj) {
      state.jrtype = '';
      state.jrtype = obj;
    },
    //设置分隔符
    setSeparator(state, obj) {
      state.separator = '';
      state.separator = obj;
    },
    //设置parquet文件
    setParquet(state, obj) {
      state.isParquet = false;
      state.isParquet = obj;
    },
    //设置用户标记的接入方式   
    setMode(state, obj) {
      state.modeStyle = '';
      state.modeStyle = obj;
    },
    //非关系型建立的表
    setNoreData(state, obj) {
      state.noreData = [];
      state.noreData = obj;
    },
    //非关系型分隔符
    setDelimiter(state, obj) {
      state.delimiter = '';
      state.delimiter = obj;
    },
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
