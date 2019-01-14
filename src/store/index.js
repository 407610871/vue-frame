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
    network: [],
    platform: [],
    deptId: [],
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
    isSign: false, //采集中的数据标记是否保存
    jrstyle: '', //用户标记的接入方式
    nums: 0, //映射关系
    userInfo: {
      userName: "",
      roleName: "",
      userId: ""
    },
    taskParam: {
      keyword: '', //查询条件
      taskPeriodType: [], //任务类型
      status: [], //任务状态
      priority: [], //任务优先级
      time: [] //任务开始时间
    },
    kettleTask: {
      status: [],
      time: [],
      taskName: ''
    },
    userThemes: '',
    thirdStepsData: {},
    clearStepsData: "",
    majorData: {
      dataObj: "",
      formSeledShow: "",
      keyword: ""
    }
  },
  mutations: {
    setUserInfo(state, obj) {
      state.userInfo.userName = obj.userName;
      state.userInfo.roleName = obj.roleName;
      state.userInfo.userId = obj.userId;
    },
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
    //是否保存采集的用户标记
    setIsSign(state, obj) {
      state.isSign = true;
      state.isSign = obj;
    },
    //用户标记的接入方式
    setJrStyle(state, obj) {
      state.jrstyle = '';
      state.jrstyle = obj;
    },
    //用户的颜色
    setThemes(state, obj) {
      state.userThemes = '';
      state.userThemes = obj;
    },
    //设置映射关系
    setNums(state, obj) {
      state.nums = true;
      state.nums = obj;
    },
    setThirdStepsData(state, obj) {
      state.thirdStepsData = obj;
    },
    setClearStepsData(state, obj) {
      state.clearStepsData = obj;
    },
    setMajorData(state, obj) {
      state.majorData = obj;
    }
  },
  modules: {
    app,
    errorLog
  },
  getters
});

export default store;
