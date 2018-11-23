<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container" v-loading="loading">
      <!-- <el-header class="filter-container" > -->
      <div class="moreSearch" style="margin-bottom:10px;">
        <!-- <a v-on:click="collapseExpand" class="right-btn collapse-btn"><i :class="{'el-icon-circle-plus':collapse,'el-icon-remove':!collapse}"></i></a> -->
        <formFliter :ObjManage="ObjManage" v-if="cleanData" @highMore="moreHeight" @highSeaech="hightrue" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @doSearch="search" @formFilter="changeFormFilter" />
        <!-- </el-header> -->
        <div class="table-tools">
          <!-- <i title="数据更新" class="enc-icon-shujugengxin"  v-on:click="updataSource"><i> -->
          <el-tooltip v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver'" class="item" effect="light" content="接入源更新" placement="top"> <span class="updatelogo right-btn" v-on:click="updataSource" style="margin-left:10px; margin-right: 79px;float:right"></span> </el-tooltip>
          <table-inver v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver'" class="right-btn" :pdata="tablePa"></table-inver>
          <path-ftp class="right-btn" @refresh="loadTable" v-if="type=='ftp'"></path-ftp>
          <el-tooltip v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver' || type=='file'" class="item" effect="light" content="批量采集" placement="top" style="float:right;"> <span class="setlogo right-btn" @click="showTask()"></span> </el-tooltip>
        </div>
      </div>
      <el-main class="main-container icon-dai">
        <el-table ref="multipleTable" :data="mainTableData" stripe :height="tableHeight" border style="width: 100%" tooltip-effect="light" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
          <el-table-column type="selection">
          </el-table-column>
          <!-- ftp -->
          <el-table-column label="状态" v-if="type=='ftp'" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{getPeriod(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="文件夹名" v-if="type=='ftp'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="extendParams.filePath" label="路径" v-if="type=='ftp'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="是否删除文件" v-if="type=='ftp'" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.isdelet">是</span>
              <span v-if="!scope.row.isdelet">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="extendParams.diyComments" label="自定义注释" v-if="type=='ftp'" show-overflow-tooltip>
          </el-table-column>
          <!-- RabbitMQ -->
          <el-table-column prop="name" label="队列名称" v-if="type=='rabbitmq'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="diyComments" label="队列描述" v-if="type=='rabbitmq'" show-overflow-tooltip>
          </el-table-column>
          <!-- ActiveMQ -->
          <el-table-column label="状态" v-if="type=='activemq'" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{getPeriod(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="extendParams.objectType" label="类型" v-if="type=='activemq'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="消息名称" v-if="type=='activemq'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="extendParams.messageSize" label="队列汇总剩余消息数" v-if="type=='activemq'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="extendParams.consumers" label="消费者数量" v-if="type=='activemq'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="extendParams.messagesDequeued" label="进入队列消息数" v-if="type=='activemq'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="extendParams.messagesEnqueued" label="出队列消息数" v-if="type=='activemq'" show-overflow-tooltip>
          </el-table-column>
          <!-- 本地文件 -->
          <el-table-column label="状态" v-if="type=='file'" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{getPeriod(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="文件名称" v-if="type=='file'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="文件类型" v-if="type=='file'" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{getFileType(scope.row.name)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastChangeTime" label="最后修改时间" v-if="type=='file'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="extendParams.fileSize" label="文件大小" v-if="type=='file'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="extendParams.messagesDequeued" label="更新方式" v-if="type=='file'" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>历史</span>
            </template>
          </el-table-column>
          <el-table-column prop="extendParams.messagesEnqueued" label="注释" v-if="type=='file'" show-overflow-tooltip>
          </el-table-column>
          <!-- oracle，mysql，postgresql -->
          <el-table-column label="资源名称" width="180" show-overflow-tooltip v-if="type=='oracle' || type=='mysql' || type=='postgresql'">
            <template slot-scope="scope">
              <div>
                <el-tooltip class="item" effect="light" content="修改" placement="top" show-overflow-tooltip>
                  <i @click="editingRow.index = scope.$index; editingRow.diyComments = scope.row.diyComments;scope.row.showEdit = !scope.row.showEdit" class="el-icon-edit-outline table-action-btn" v-show="!scope.row.showEdit" />
                </el-tooltip>
                <span v-show="!scope.row.showEdit">{{ scope.row.diyComments }}</span>
                <input type="text" v-model="editingRow.diyComments" v-show="scope.row.showEdit" @blur="changeName(scope.$index, scope.row)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="接入对象" width="180" show-overflow-tooltip v-if="type=='oracle' || type=='mysql' || type=='postgresql'">
            <template slot-scope="scope">
              <a href="javascript:void(0)" v-on:click="goAccessObjInfo(scope.row)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column label="接入对象类型" v-if="type=='oracle' || type=='mysql' || type=='postgresql'" min-width="160">
            <template slot-scope="scope">
              {{getObjType(scope.row.extendParams.objectType)}}
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="持有者" v-if="type=='oracle' || type=='mysql' || type=='postgresql'">
          </el-table-column>
          <el-table-column prop="totalRows" label="源端数据量" v-if="type=='oracle' || type=='mysql' || type=='postgresql'" min-width="160">
          </el-table-column>
          <el-table-column prop="comments" label="描述" v-if="type=='oracle' || type=='mysql' || type=='postgresql'">
          </el-table-column>
          <el-table-column prop="lastChangeTime" label="同步更新时间" v-if="type=='oracle' || type=='mysql' || type=='postgresql'" min-width="160">
          </el-table-column>
          <el-table-column prop="dataRange" label="数据范围" v-if="type=='oracle' || type=='mysql' || type=='postgresql'" min-width="160">
          </el-table-column>
          <el-table-column prop="objectStatus" label="状态信息" v-if="type=='oracle' || type=='mysql' || type=='postgresql'" min-width="160">
            <template slot-scope="scope">
              <span style="cursor: pointer" v-if="scope.row.extendParams.taskInfoId!=undefined" @click="doDetail(scope.$index, scope.row)">{{scope.row.objectStatus}}</span>
              <span v-if="scope.row.extendParams.taskInfoId==undefined">{{scope.row.objectStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="collectName" label="数据采集方式" v-if="type=='oracle' || type=='mysql' || type=='postgresql'" min-width="160">
          </el-table-column>
          <el-table-column label="操作" min-width="160">
            <template slot-scope="scope">
              <!-- <el-button size="mini" v-on:click="updataSourceSingle(scope.$index, scope.row)" title="数据量更新">数据量更新</el-button> -->
              <el-tooltip class="item" effect="light" content="数据量更新" placement="top" v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver'">
                <i class="enc-icon-shujugengxin" v-on:click="updataSourceSingle(scope.$index, scope.row)" title="数据量更新"></i>
              </el-tooltip>
              <div class="survey">
                <singleTask v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver'" :pdata="scope.row" @fre="loadTable()"></singleTask>
              </div>
              <div class="survey">
                <userSurvey v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver'" :pdata="scope.row" @fre="loadTable()"></userSurvey>
              </div>
              <div class="survey" v-if="(type=='mysql'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0')|| (type=='oracle'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0')|| (type=='postgresql'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0') || (type=='sqlserver'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0')">
                <data-inver :pdata="scope.row" @fre="loadTable()"></data-inver>
              </div>
              <div class="survey" v-if="type!='mysql' && type!='oracle' && type!='sqlserver' && type!='postgresql'">
                <norela-coll :pdata="scope.row"></norela-coll>
              </div>
              <!--  <div class="survey" v-if="jrtype=='ftp'">
               <path-ftp></path-ftp>
             </div> -->
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="enc-pagination">
          <el-pagination v-if="queryParamReady" v-show="pageShow" style="float:right; margin:10px;" @current-change="goPage" background :page-size="pageSize" :total="mainTableDataTotal" layout="prev, pager, next, jumper" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
    <!-- 任务详情 -->
    <dialogTaskDetail :reqObj="reqObj" v-if="showTaskDetail" v-on:closeDia="showTaskDetail=false"></dialogTaskDetail>
    <!--  批量采集 -->
    <set-task v-if="showSetTask" class="right-btn" :rowList="rowList" :jrtype="type" @close="closeTask()" @fre="loadTask()"></set-task>
  </div>
</template>
<script>
import { mapState } from "vuex";
import formFliter from "./../../../components/formFliter";
import userSurvey from "@/views/accessObjManage/dialog/admin/user_survey";
import setTask from "@/views/accessObjManage/dialog/admin/set_task";
import singleTask from "@/views/accessObjManage/dialog/admin/single_task";
import tableInver from "@/views/accessObjManage/dialog/admin/table_inver";
import dataInver from "@/views/accessObjManage/dialog/admin/data_inver";
import pathFtp from "@/views/mainLay/dialog/path_ftp";
import norelaColl from "@/views/mainLay/dialog/norela_coll";
import DialogTaskDetail from "@/views/mainLay/dialog/DialogTaskDetails";
export default {
  name: "DashboardAdmin",
  data() {
    return {
      reqObj: "",
      loading: false,
      queryParamReady: false,
      collapse: true,
      mainTableReady: true,
      mainTableData: [],
      currentPage: 1,
      pageSize: 20,
      ObjManage: true,
      mainTableDataTotal: 1,
      dialogVisible: false,
      showTaskDetail: false,
      searchParams: {
        condition: "",
        objectType: [],
        dataRange: []
      },
      showSetTask: false,
      moreData: 0,
      myDialogRouter: "adminAdd",
      dialogTitle: "新增",
      alertVisible: false,
      alertContent: "",
      pageShow: true,
      seledRows: [],
      cleanData: true,

      collapse: true,
      formFilterData: [],
      rowList: [],
      tablePa: [],
      editingRow: {
        index: 0,
        diyComments: ""
      },
      jrtype: "",
      objectType: [{
          id: 1,
          diyComments: ["TABLE"],
          name: "表"
        },
        {
          id: 2,
          diyComments: ["v", "VIEW"],
          name: "视图"
        },
        {
          id: 3,
          diyComments: ["OTHER"],
          name: "其他"
        }
      ],
      dataRange: [{
          id: 1,
          name: "全市"
        },
        {
          id: 2,
          name: "全省"
        },
        {
          id: 3,
          name: "全国"
        },
        {
          id: 4,
          name: "其他"
        }
      ],
      jrtype: "",
      accId: ""
    };
  },
  computed: {
    tableParams: function() {
      return this.$store.state.queryParams.accessObjManage;
    },
    tableHeight: function() {
      return this.collapse ?
        window.innerHeight - 330 :
        window.innerHeight - 315-40 * this.moreData;;
    },
    headerHeight: function() {
      return this.collapse ? "50px" : "85px";
    },
    type: function() {
      return this.$route.params.type;
    }
  },
  components: {
    formFliter,
    userSurvey,
    setTask,
    singleTask,
    tableInver,
    dataInver,
    pathFtp,
    norelaColl,
    DialogTaskDetail
  },
  watch: {
    tableParams(newVal, oldVal) {
      if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
        if (newVal.deptId == oldVal.deptId) {
          //判断树的调度不会影响
          // if (
          //   newVal.dataRange.toString() == oldVal.dataRange.toString() &&
          //   newVal.objectType.toString() == oldVal.objectType.toString()
          // ) {
          //判断高级搜索的词不会进入
          this.loadTable();
          // }
        }
      }
    },
    $route(to, from) {
      this.cleanData = false;
      this.searchParams.condition = "";
      this.searchParams.objectType = [];
      this.searchParams.dataRange = [];
      console.log(this.searchParams)

    }
  },
  mounted() {
    this.$root.eventHub.$emit("setActiveNav", 1);
    this.storeReady();
    this.setFliter();
  },
  created() {
    // this.$root.eventHub.$on('search', (keyword) => {
    //   this.search(keyword);
    // })
    // this.tableParams.condition="";
    // this.loadTable();
  },
  methods: {
    moreHeight(data) {
      this.moreData = data;
    },
    hightrue: function(a) {
      this.collapse = a;
    },
    tableRowClassName: function(scope, rowIndex) {
      if (scope.row.isDeleted == 1) {
        //删除
        return "delete-row";
      } else if (scope.row.isHistory == 2) {
        //新增
        return "add-row";
      }
      return "";
    },
    collapseExpand: function() {
      this.collapse = !this.collapse;
    },
    closeTask() {
      this.showSetTask = false;
    },
    loadTask() {
      this.showSetTask = false;
      this.loadTable();
    },
    showTask() {
      let flag = true;
      if (this.rowList.length == 0) {
        this.$message.warning("请选择批式采集的表");
        return false;
      } else {
        if (this.rowList.length == 1) {
          this.showSetTask = true;
        } else {
          for (let i = 1; i < this.rowList.length; i++) {
            if (this.rowList[0].diyComments != this.rowList[i].diyComments) {
              flag = false;
            }
          }
          if (flag) {
            this.showSetTask = true;
          } else {
            this.$message.warning("请选择资源名称相同的表");
            return false;
          }
        }
      }
    },
    loadTable: function() {
      var _self = this;
      let urlIndex = _self.$route.path.indexOf('[');
      let urlIds = '';
      if (urlIndex != -1) {
        urlIds = _self.$route.path.subString(urlIndex, _self.$route.path.length - 1);
      }
      _self.jrtype = this.$store.state.jrtype;

      _self.loading = true;
      _self.pageSize = this.$store.state.pageSize;
      var paramsObj = {
        //不要问我为什么，后台接口就是这2个参数名
        pagNum: this.tableParams.pageNum,
        count: _self.pageSize
      };
      paramsObj.condition = this.searchParams.condition ?
        this.searchParams.condition :
        "";
      paramsObj.objectType = this.searchParams.objectType.join(",");
      paramsObj.dataRange = this.searchParams.dataRange.join(",");
      paramsObj.accessSysId = parseInt(this.$route.params.sourceId);
      console.log(this.searchParams)
      this.$ajax({
          // url: window.ENV.API_DACM+'ctables/datas',
          url: window.ENV.API_DACM + "/ctables/datas",
          //  url:'http://10.19.160.25:8080/DACM/ctables/datas',

          method: "post",
          data: JSON.stringify(paramsObj),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          _self.cleanData = true;

          if (res.data.success) {
            var data = res.data.data.list;
            for (var value of data) {
              value.showEdit = false;
            }
            _self.mainTableData = data;

            _self.mainTableDataTotal = res.data.data.total;
            if (res.data.data.list.length > 0) {
              _self.tablePa = res.data.data.list[0];
              this.$store.commit(
                "setSeparator",
                res.data.data.list[0].extendParams.separator
              );
            }
            _self.currentPage = _self.tableParams.pageNum;
            _self.pageShow = true;
          } else {
            _self.$alert("加载接入对象列表失败", "提示", {
              confirmButtonText: "确定"
            });
            _self.pageShow = false;
            _self.mainTableData = [];
          }
          _self.loading = false;
        })
        .catch(function(err) {
          _self.pageShow = false;
          _self.mainTableData = [];
          console.log(err);
          _self.loading = false;
          _self.$alert("加载接入对象列表失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    changeName: function(index, row) {
      var _self = this;
      this.loading = true;
      // this.$ajax.post('http://10.19.160.25:8080/DACM/ctables/diyComments',{
      this.$ajax
        .post(window.ENV.API_DACM + "/ctables/diyComments", {
          objInfoId: row.id,
          value: this.editingRow.diyComments
        })
        .then(function(res) {
          if (res.data.success) {
            row.diyComments = _self.editingRow.diyComments;
            row.showEdit = false;
          } else {
            _self.$alert("字段中文名称修改失败", "提示", {
              confirmButtonText: "确定"
            });
          }
          _self.loading = false;
        })
        .catch(function(err) {
          console.log(err);
          _self.loading = false;
          _self.$alert("字段中文名称修改失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    setStore: function(obj) {
      let storeData = JSON.parse(
        JSON.stringify(this.$store.state.queryParams[this.$route.name])
      );
      for (var i in obj) {
        storeData[i] = obj[i];
      }
      this.$store.commit("setQueryParams", {
        name: this.$route.name,
        data: storeData
      });
    },
    goPage: function(val) {
      this.setStore({
        pageNum: val
      });
      this.loadTable();
    },
    goAccessObjInfo: function(row) {
      this.$store.commit("resetQueryParam", {
        resetData: "accessObjInfo"
      });
      this.$store.commit("setParamItem", {
        name: "accessObjInfo",
        data: {
          ACCESS_SYS_DIALECT_ID: this.mainTableData[0].accessSys
            .accessSysDialectId,
          accessSysId: this.mainTableData[0].accessSys.id,
          diyComments: row.diyComments
        }
      });
      this.$router.push({
        name: "accessObjInfo",
        params: {
          sourceId: this.$route.params.sourceId,
          sourceName: this.$route.params.sourceName,
          objId: row.id,
          objName: encodeURI(row.name),
          type: this.type
        }
      });
    },
    search: function(keyword) {
      this.setStore({
        pageNum: 1,
        condition: keyword,
        timeFlag: new Date().getTime()
      });

      this.loadTable();
    },

    updataSource: function() {
      var _self = this;
      self.loadTable = true;
      this.$ajax
        .get(window.ENV.API_DACM + "/ctables/synchronize", {
          params: {
            accessSysId: this.$route.params.sourceId
          }
        })
        .then(function(res) {
          if (res.data.success) {
            _self.$alert("更新成功", "提示", {
              confirmButtonText: "确定"
            });
            _self.loadTable();
          } else {
            _self.$alert("更新失败", "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(function(err) {
          console.log(err);
          _self.$alert("更新失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    updataSourceSingle: function(index, row) {
      var _self = this;
      this.$ajax
        .get(window.ENV.API_DACM + "/ctables/refreshAmount", {
          params: {
            objectInfoId: row.id
          }
        })
        .then(function(res) {
          if (res.data.success) {
            _self
              .$alert("更新成功", "提示", {
                confirmButtonText: "确定"
              })
              .then(() => {
                row.totalRows = res.data.data.totalRows;
              });
          } else {
            _self.$alert("更新失败", "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(function(err) {
          console.log(err);
          _self.$alert("更新失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    handleSelectionChange: function(val) {
      this.seledRows = val;
      this.rowList = val;
    },
    changeFormFilter: function(fliterParams) {
      this.searchParams = fliterParams;
      fliterParams.pageNum = 1;
      // this.setStore(fliterParams);

      fliterParams.keyword = "";
    },
    storeReady() {
      // var queryParams = this.$store.state.queryParams.accessObjManage;
      if (this.$store.state.pageReady) {
        this.loadTable();
      } else {
        var _self = this;
        setTimeout(function() {
          _self.storeReady();
        }, 200);
      }
    },
    setFliter() {
      var queryParams = this.$store.state.queryParams[this.$route.name];
      let objectType = queryParams.objectType ? queryParams.objectType : [];
      let dataRange = queryParams.dataRange ? queryParams.dataRange : [];

      this.formFilterData = [{
          name: "接入对象类型：",
          id: "objectType",
          type: "checkbox",
          checkData: this.objectType,
          seledData: [],
          limit: 4
        },
        {
          name: "数据范围：",
          id: "dataRange",
          type: "checkbox",
          checkData: this.dataRange,
          seledData: [],
          limit: 4
        }
      ];
      this.queryParamReady = true;
    },
    getObjType(id) {
      for (var value of this.formFilterData[0].checkData) {
        if (value.diyComments.indexOf(id) != -1) {
          return value.name;
        }
      }
      return "未知类型";
    },
    getPeriod(row) {
      //表删了，暂时空着
      return "";
    },
    getFileType(name) {
      var list = name.split(".");
      return list[list.length - 1];
    },
    getDiyComment(row) {
      var diyComments = row.diyComments == null ? "" : row.diyComments;
      return diyComments;
    },
    //详情
    doDetail(index, row) {
      this.reqObj = row;
      this.showTaskDetail = true;
    }
  }
};

</script>
<style lang="scss">
.el-table .delete-row {
  color: red;
}

.el-table .add-row {
  color: red;
}

</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.moreSearch {
  padding-top: 20px;
}

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

.icon-dai i {
  display: inline-block;
  font-size: 20px;
  margin: 0 5px;
}

.survey {
  display: inline-block;
  margin: 0 5px;
}

.survey i {
  font-size: 20px;
}

.cell i {
  cursor: pointer;
}

.updatelogo {
  width: 30px;
  height: 30px;
  background: url("../../../assets/images/dataupdate.svg");
  display: inline-block;
  cursor: pointer;
}

.setlogo {
  width: 30px;
  height: 30px;
  background: url("../../../assets/images/tasklogo.svg");
  display: inline-block;
  cursor: pointer;
}

</style>
