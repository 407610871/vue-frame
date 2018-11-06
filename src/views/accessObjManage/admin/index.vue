<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container" v-loading="loading">
      <el-header class="filter-container" :height="headerHeight">
        <a v-on:click="collapseExpand" class="right-btn collapse-btn"><i :class="{'el-icon-circle-plus':collapse,'el-icon-remove':!collapse}"></i></a>
        <formFliter v-if="queryParamReady" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @formFilter="changeFormFilter" />
      </el-header>
      <el-main class="main-container">
        <div class="table-tools">
          <el-button v-on:click="updataSource" class="right-btn" style="margin-left:10px;">接入源更新</el-button>
          <table-inver class="right-btn"></table-inver>
          <set-task class="right-btn"></set-task>
        </div>
        <el-table :data="mainTableData" stripe :height="tableHeight" border style="width: 100%" tooltip-effect="light">
          <el-table-column type="selection" @selection-change="handleSelectionChange">
          </el-table-column>
          <el-table-column prop="diyComments" label="资源名称" width="180" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="接入对象" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href="javascript:void(0)" v-on:click="goAccessObjInfo(scope.row)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="extendParams.objectType" label="接入对象类型">
          </el-table-column>
          <el-table-column prop="owner" label="持有者">
          </el-table-column>
          <el-table-column prop="totalRows" label="源端数据量">
          </el-table-column>
          <el-table-column prop="comments" label="描述">
          </el-table-column>
          <el-table-column prop="lastChangeTime" label="同步跟新时间">
          </el-table-column>
          <el-table-column prop="dataRange" label="数量范围">
          </el-table-column>
          <el-table-column prop="objectStatus" label="状态信息">
          </el-table-column>
          <el-table-column prop="collectName" label="数据采集方式">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" v-on:click="updataSourceSingle(scope.$index, scope.row)">数据量更新</el-button>
              <div class="survey">
                <userSurvey :pdata="scope"></userSurvey>
              </div>
              <div class="survey">
                <single-task :pdata="scope"></single-task>
              </div>
              <div class="survey">
                <data-inver :pdata="scope"></data-inver>
              </div>
              <div class="survey">
                <norela-coll :pdata="scope"></norela-coll>
              </div>
              <div class="survey">
                <path-ftp></path-ftp>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="enc-pagination">
          <el-pagination v-if="queryParamReady" style="float:right; margin:10px;" @current-change="goPage" background :page-size="20" :total="mainTableDataTotal" layout="prev, pager, next, jumper" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
    <el-dialog title="提示" :visible.sync="alertVisible" width="30%">
      <span>{{alertContent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="alertVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import add1 from './../dialog/'
import formFliter from './../../../components/formFliter'
import userSurvey from '@/views/accessObjManage/dialog/admin/user_survey'
import setTask from '@/views/accessObjManage/dialog/admin/set_task'
import singleTask from '@/views/accessObjManage/dialog/admin/single_task'
import tableInver from '@/views/accessObjManage/dialog/admin/table_inver'
import dataInver from '@/views/accessObjManage/dialog/admin/data_inver'
import pathFtp from '@/views/mainLay/dialog/path_ftp'
import norelaColl from '@/views/mainLay/dialog/norela_coll'
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      loading: false,
      queryParamReady: false,
      collapse: true,
      mainTableReady: true,
      mainTableData: [{ "id": 10650589, "name": "nam4", "owner": "jkl1", "accessSys": { "id": 92955, "name": "10.37.149.191-100_Copy_92955", "accessSysType": { "id": 10003, "name": null }, "accessSysWay": { "id": 1001, "name": null }, "accessSysDialect": { "id": 10001, "name": "mysql", "accSysWay": null, "accessSyses": [] }, "contactsPhone": "", "contactsEmail": "", "comments": "", "verfication_code": "", "accessSysAttributes": [], "accessSysObjInfos": [], "accessSysStatistics": [], "extendParams": {}, "accessSysDeptInfo": null, "status": "0", "lastOperatingTime": "2018-11-05 10:39:07", "createTime": null }, "comments": "", "diyComments": "", "accessSysId": null, "totalRows": "0", "collectName": null, "diyCommentsFrom": "0", "isHistory": "1", "isDeleted": "2", "exitTask": false, "exitDataSurvey": false, "extendParams": { "isRefresh": "0", "separator": "\t", "objectType": "1" }, "accessSysObjInfoStatistics": [], "accessConnectorSource": {}, "createImpalaTable": false, "lastChangeTime": "2018-09-08 19:14:48" }],
      currentPage: 1,
      mainTableDataTotal: 1,
      dialogVisible: false,
      myDialogRouter: 'adminAdd',
      dialogTitle: '新增',
      alertVisible: false,
      alertContent: '',
      seledRows: [],
      collapse: true,
      formFilterData: []
    }
  },
  computed: {
    tableParams: function() {
      return this.$store.state.queryParams.accessObjManage;
    },
    tableHeight: function() {
      return this.collapse ? window.innerHeight - 280 : window.innerHeight - 315;
    },
    headerHeight: function() {
      return this.collapse ? '50px' : '85px';
    }
  },
  components: {
    add1,
    formFliter,
    userSurvey,
    setTask,
    singleTask,
    tableInver,
    dataInver,
    pathFtp,
    norelaColl
  },
  watch: {
    tableParams(newVal, oldVal) {
      this.loadTable();
    },
  },
  mounted() {
    this.storeReady();
  },
  created() {
    this.$root.eventHub.$on('search', (keyword) => {
      this.search(keyword);
    })
  },
  methods: {
    collapseExpand: function() {
      this.collapse = !this.collapse;
    },
    loadTable: function() {
      var _self = this;
      _self.loading = true;
      var paramsObj = { //不要问我为什么，后台接口就是这2个参数名
        pagNum: this.tableParams.pageNum,
        count: this.$store.state.pageSize
      };
      paramsObj.condition = this.tableParams.condition ? this.tableParams.condition : "";
      paramsObj.objectType = this.tableParams.objectType.length > 0 ? this.tableParams.objectType.join(',') : "";
      paramsObj.dataRange = this.tableParams.dataRange.length > 0 ? this.tableParams.dataRange.join(',') : "";
      paramsObj.accessSysId = this.$route.params.sourceId;
      this.$ajax.post('http://10.19.160.25:8088/demo/ctables/datas', paramsObj).then(function(res) {
          console.log(res)
          if (res.data.success) {
            _self.mainTableData = res.data.data.list;
            _self.mainTableDataTotal = res.data.data.total;
            //这里是异步的，存在延迟，所以没问题,如果是同步的话可能存在问题
            _self.currentPage = _self.tableParams.pageNum;
          } else {
            console.log(res.code);
          }
          _self.loading = false;
        })
        .catch(function(err) {
          _self.currentPage = _self.tableParams.pageNum;
          console.log(err);
          _self.loading = false;
        });
    },
    setStore: function(obj) {
      let storeData = JSON.parse(JSON.stringify(this.$store.state.queryParams[this.$route.name]));
      for (var i in obj) {
        storeData[i] = obj[i];
      }
      this.$store.commit('setQueryParams', {
        name: this.$route.name,
        data: storeData
      });
    },
    goPage: function(val) {
      this.setStore({
        pageNum: val
      });
    },
    goAccessObjInfo: function(row) {
      this.$store.commit('setParamItem', {
        name: 'accessObjInfo',
        data: {
          ACCESS_SYS_DIALECT_ID: this.mainTableData[0].accessSys.accessSysDialectId,
          accessSysId: this.mainTableData[0].accessSys.id
        }
      });
      this.$router.push({
        name: "accessObjInfo",
        params: {
          sourceId: this.$route.params.sourceId,
          sourceName: this.$route.params.sourceName,
          objId: row.id,
          objName: encodeURI(row.name)
        }
      });
    },
    search: function(keyword) {
      this.setStore({
        pageNum: 1,
        condition: keyword
      });
    },
    showAdd: function() {
      this.myDialogRouter = 'adminAdd';
      this.dialogTitle = '新增';
      this.dialogVisible = true;
    },
    showEdit: function() {
      this.myDialogRouter = 'adminEdit';
      this.dialogTitle = '修改';
      this.dialogVisible = true;
    },
    updataSource: function(index, row) {
      var id;
      if (row) {
        id = row.id;
      } else {
        var ids = [];
        for (var value of this.seledRows) {
          ids.push(value.id);
        }
        id = ids.join(',');
      }
      this.$ajax.get('http://10.19.160.25:8088/demo/ctables/refreshAmount', {
        objectInfoId: id
      }).then(function(res) {
        this.alertContent = '更新成功';
        this.alertVisible = true;
      }).catch(function(err) {
        console.log(err)
      });
    },
    updataSourceSingle: function(index, row) {
      this.$ajax.get('http://10.19.160.25:8088/demo/ctables/refreshAmount', {
        params: {
          objectInfoId: row.id
        }
      }).then(function(res) {
        this.alertContent = '更新成功';
        this.alertVisible = true;
      }).catch(function(err) {
        console.log(err)
      });
    },
    handleSelectionChange: function(val) {
      this.seledRows = val;
    },
    changeFormFilter: function(fliterParams) {
      console.log('---------fliterParams-----------');
      console.log(fliterParams);
      this.setStore(fliterParams);
    },
    storeReady() {
      var queryParams = this.$store.state.queryParams.accessObjManage;
      this.loadTable();
      this.formFilterData = [{
        name: "接入对象类型：",
        id: 'objectType',
        type: 'checkbox',
        checkData: [{
          id: 'TABLE',
          name: '表'
        }, {
          id: 'VIEW',
          name: '视图'
        }, {
          id: 'OTHER',
          name: '其他'
        }],
        seledData: this.tableParams.objectType ? this.tableParams.objectType : []
      }, {
        name: "数据范围：",
        id: 'dataRange',
        type: 'radio',
        checkData: [{
          id: 'city',
          name: '全市'
        }, {
          id: 'province',
          name: '全省'
        }, {
          id: 'country',
          name: '全国'
        }, {
          id: 'other',
          name: '其他'
        }],
        seledData: this.tableParams.dataRange ? this.tableParams.dataRange : []
      }];
      this.queryParamReady = true;
      // var fliterItemList = this.$store.state.fliterItemList
      // if(fliterItemList.network.ready&&fliterItemList.dataSourceName.ready&&fliterItemList.platform.ready){
      //   this.setFliter(fliterItemList);
      //   this.loadTable();
      // }else{
      //   var _self = this;
      //   setTimeout(function(){
      //     _self.storeReady();
      //   },200);
      // }
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  background: #fff;
  .filter-container {
    padding-top: 10px;
    background: #fff;
    form {
      margin-right: 350px;
    }
    .el-form-item {
      margin-bottom: 2px;
    }
    .right-btn {
      float: right;
    }
    .collapse-btn {
      margin: 5px 20px 0 0;
      color: #069;
      font-size: 22px;
    }
  }
  .main-container {
    padding-bottom: 0;
    padding-top: 0;
    .table-tools {
      padding-top: 10px;
      height: 55px;
      border-top: 1px solid #eee;
      .right-btn {
        float: right;
      }
    }
  }
  .table-container {
    padding: 32px;
  }
  .enc-pagination {
    float: right;
  }
}

</style>
