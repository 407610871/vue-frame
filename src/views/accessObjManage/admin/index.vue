<template>
  <div style="height:100%;" class="dashboard-container">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">数据接入</el-breadcrumb-item>
        <el-breadcrumb-item>{{ breadcrumbName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <form-fliter
        :ObjManage="ObjManage"
        v-if="cleanData"
        @highMore="moreHeight"
        @highSeaech="hightrue"
        v-bind:formCollapse="collapse"
        v-bind:dataObj="formFilterData"
        v-bind:key_word="key_word"
        v-bind:deleteData="deleteData"
        @doSearch="search"
        @formFilter="changeFormFilter"
      />
    </div>
    <div
      class="el-breadcrumb"
      v-show="majorData.keyword!=''||majorData.formSeledShow.dataSourceName.length!=0
            ||majorData.formSeledShow.network.length!=0||majorData.formSeledShow.platform.length!=0
            ||majorData.formSeledShow.objectType.length!=0||majorData.formSeledShow.dataRange.length!=0"
    >
      <el-form>
        <el-form-item class="isSelect">
          <div v-show="majorData.keyword!=''">
            <span class="lookstyle">
              {{majorData.keyword}}
              <i class="enc-icon-guanbi" @click="key_word=''"></i>
            </span>
          </div>
          <div
            v-show="majorData.formSeledShow[item.id].length!=0"
            v-for="(item,index1) in majorData.dataObj"
            :key="index1"
          >
            <span
              class="lookstyle"
              v-for="(item1,index) in majorData.formSeledShow[item.id]"
              :key="index"
            >
              {{item1.name}}
              <i class="enc-icon-guanbi" @click="delSelect(index,index1)"></i>
            </span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="main main-content">
      <div class="moreSearch" style="margin-bottom:10px;">
        <div class="table-tools clearfix">
          <el-tooltip
            v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver'||type=='mongodb'"
            class="item"
            effect="light"
            content="接入源更新"
            placement="top"
          >
            <span
              class="icon-title enc-icon-jieruyuangengxin right-btn"
              v-on:click="updataSource"
              style="margin-left:10px; margin-right: 50px;float:right"
            ></span>
          </el-tooltip>
          <table-inver
            v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver'"
            class="right-btn"
            :pdata="tablePa"
            style="float:right"
          ></table-inver>
          <path-ftp class="right-btn" @refresh="loadTable" v-if="type=='ftp'" style="float:right"></path-ftp>
          <el-tooltip
            v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver' || type=='file'"
            class="item"
            effect="light"
            content="批量采集"
            placement="top"
            style="float:right;"
          >
            <span class="icon-title enc-icon-piliangcaiji right-btn" @click="showTask()"></span>
          </el-tooltip>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :height="tableHeight"
        v-loading="loading"
        :data="mainTableData"
        stripe
        border
        style="width: 100%; margin-top:10px;"
        tooltip-effect="light"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <!-- ftp -->
        <el-table-column label="状态" v-if="type=='ftp'||type=='mongodb'" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.collectName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="文件夹名" v-if="type=='ftp'" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="extendParams.filePath"
          label="路径"
          v-if="type=='ftp'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="是否包含子目录" v-if="type=='ftp'" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.extendParams.isSubDirectory=='true'">是</span>
            <span v-if="scope.row.extendParams.isSubDirectory=='false'">否</span>
          </template>
        </el-table-column>
        <el-table-column label="是否删除文件" v-if="type=='ftp'" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.extendParams.isdelet=='true'">是</span>
            <span v-if="scope.row.extendParams.isdelet=='false'">否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="extendParams.diyComments"
          label="自定义注释"
          width="160"
          v-if="type=='ftp'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              <el-tooltip
                class="item"
                effect="light"
                content="修改"
                placement="top"
                show-overflow-tooltip
              >
                <i
                  @click="editName(scope.row,scope.$index)"
                  class="el-icon-edit-outline table-action-btn"
                  v-show="!scope.row.showEdit"
                />
              </el-tooltip>
              <span v-show="!scope.row.showEdit">{{ scope.row.diyComments }}</span>
              <input
                type="text"
                v-model="editingRow.diyComments"
                v-show="scope.row.showEdit"
                autofocus
                @blur="changeName(scope.$index, scope.row)"
              >
            </div>
          </template>
        </el-table-column>
        <!-- mangoDB -->
        <el-table-column prop="name" label="对象名" v-if="type=='mongodb'" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalRows" label="数据量" v-if="type=='mongodb'" show-overflow-tooltip></el-table-column>
        <el-table-column prop="owner" label="持有者" v-if="type=='mongodb'" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="备注" v-if="type=='mongodb'" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.comments}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastChangeTime"
          label="最后更新时间"
          v-if="type=='mongodb'"
          min-width="180"
          show-overflow-tooltip
        ></el-table-column>
        <!-- RabbitMQ -->
        <el-table-column prop="name" label="队列名称" v-if="type=='rabbitmq'" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="diyComments"
          label="队列描述"
          v-if="type=='rabbitmq'"
          show-overflow-tooltip
        ></el-table-column>
        <!-- ActiveMQ -->
        <el-table-column label="状态" v-if="type=='activemq'" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getPeriod(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="extendParams.objectType"
          label="类型"
          v-if="type=='activemq'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="name" label="消息名称" v-if="type=='activemq'" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="extendParams.messageSize"
          label="队列汇总剩余消息数"
          v-if="type=='activemq'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="extendParams.consumers"
          label="消费者数量"
          v-if="type=='activemq'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="extendParams.messagesDequeued"
          label="进入队列消息数"
          v-if="type=='activemq'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="extendParams.messagesEnqueued"
          label="出队列消息数"
          v-if="type=='activemq'"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 本地文件 -->
        <el-table-column label="状态" v-if="type=='file'" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getPeriod(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="文件名称" v-if="type=='file'" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="文件类型" v-if="type=='file'" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{getFileType(scope.row.name)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastChangeTime"
          label="最后修改时间"
          v-if="type=='file'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="extendParams.fileSize"
          label="文件大小"
          v-if="type=='file'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="extendParams.messagesDequeued"
          label="更新方式"
          v-if="type=='file'"
          show-overflow-tooltip
        >
          <template>
            <span>历史</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="extendParams.messagesEnqueued"
          label="注释"
          v-if="type=='file'"
          show-overflow-tooltip
        ></el-table-column>
        <!-- oracle，mysql，postgresql -->
        <el-table-column
          label="资源名称"
          width="180"
          show-overflow-tooltip
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
        >
          <template slot-scope="scope">
            <div>
              <el-tooltip
                class="item"
                effect="light"
                content="修改"
                placement="top"
                show-overflow-tooltip
              >
                <i
                  @click="editName(scope.row,scope.$index)"
                  class="el-icon-edit-outline table-action-btn"
                  v-show="!scope.row.showEdit"
                />
              </el-tooltip>
              <span v-show="!scope.row.showEdit">{{ scope.row.diyComments }}</span>
              <input
                type="text"
                v-model="editingRow.diyComments"
                v-show="scope.row.showEdit"
                autofocus
                @blur="changeName(scope.$index, scope.row)"
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="接入对象"
          width="180"
          show-overflow-tooltip
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
        >
          <template slot-scope="scope">
            <a
              class="underdone"
              href="javascript:void(0)"
              v-on:click="goAccessObjInfo(scope.row)"
            >{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="接入对象类型"
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
          min-width="160"
        >
          <template slot-scope="scope">{{getObjType(scope.row.extendParams.objectType)}}</template>
        </el-table-column>
        <el-table-column
          prop="owner"
          label="持有者"
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="totalRows"
          label="源端数据量"
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="comments"
          label="描述"
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="lastChangeTime"
          label="同步更新时间"
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="dataRange"
          label="数据范围"
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="objectStatus"
          label="状态信息"
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
          min-width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              style="cursor: pointer"
              v-if="scope.row.extendParams.taskInfoId!=undefined"
              @click="doDetail(scope.$index, scope.row)"
            >{{scope.row.objectStatus}}</span>
            <span v-if="scope.row.extendParams.taskInfoId==undefined">{{scope.row.objectStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="collectName"
          label="数据采集方式"
          v-if="type=='oracle' || type=='mysql' || type=='postgresql'"
          min-width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div :class="(type=='ftp'||type=='mongodb')?'icon-other':'icon-center'">
              <div
                class="survey"
                v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver' || type=='mongodb'"
              >
                <el-tooltip class="item" effect="light" content="数据量更新" placement="top">
                  <i
                    class="enc-icon-shujugengxin"
                    v-on:click="updataSourceSingle(scope.$index, scope.row)"
                    title="数据量更新"
                  ></i>
                </el-tooltip>
              </div>
              <div
                class="survey"
                v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' 
                    || type=='sqlserver'"
              >
                <singleTask :pdata="scope.row" @fre="loadTable()"></singleTask>
              </div>
              <div
                class="survey"
                v-if="type=='mysql'|| type=='oracle'|| type=='postgresql' || type=='sqlserver'"
              >
                <userSurvey :pdata="scope.row" @fre="loadTable()"></userSurvey>
              </div>
              <div
                class="survey"
                v-if="type!='mysql' && type!='oracle' && type!='sqlserver' && type!='postgresql'"
              >
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="type=='ftp'?'单目录采集':'单表采集'"
                  placement="top"
                >
                  <i class="enc-icon-danbiaocaiji" @click="setNoreVisible(scope.row,scope.$index)"></i>
                </el-tooltip>
                <!-- <norela-coll :pdata="scope.row" :type="type" @fre="loadTable()"></norela-coll> -->
              </div>
              <div
                class="survey"
                v-if="(type=='mysql'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0'&&(scope.row.extendParams.taskStatus=='1'||scope.row.extendParams.taskStatus=='2'||scope.row.extendParams.taskStatus=='4'))
                    || (type=='oracle'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0'&&(scope.row.extendParams.taskStatus=='1'||scope.row.extendParams.taskStatus=='2'||scope.row.extendParams.taskStatus=='4'))
                    || (type=='postgresql'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0'&&(scope.row.extendParams.taskStatus=='1'||scope.row.extendParams.taskStatus=='2'||scope.row.extendParams.taskStatus=='4')) 
                    || (type=='sqlserver'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0'&&(scope.row.extendParams.taskStatus=='1'||scope.row.extendParams.taskStatus=='2'||scope.row.extendParams.taskStatus=='4'))
                    ||(type=='ftp'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0'&&(scope.row.extendParams.taskStatus=='1'||scope.row.extendParams.taskStatus=='2'||scope.row.extendParams.taskStatus=='4'))
                    ||(type=='mongodb'&&scope.row.accessConnectorSource!=undefined&&scope.row.accessConnectorSource.isPeriod!='0'&&(scope.row.extendParams.taskStatus=='1'||scope.row.extendParams.taskStatus=='2'||scope.row.extendParams.taskStatus=='4'))"
              >
                <el-tooltip class="item" effect="light" content="数据核验" placement="top">
                  <i class="enc-icon-shujuheyan" @click="dataInverCheck(scope.row)"></i>
                </el-tooltip>
              </div>
              <div class="survey" v-if="type==='ftp' && !scope.row.exitTask">
                <el-tooltip class="item" effect="light" content="删除" placement="top">
                  <i class="enc-icon-shanchu" @click="deleteFtp(scope.row)"></i>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="enc-pagination">
      <el-pagination
        v-if="queryParamReady"
        v-show="pageShow"
        style="float:right; margin:10px;"
        @current-change="goPage"
        background
        :page-size="pageSize"
        :total="mainTableDataTotal"
        layout="prev, pager, next, jumper"
        :current-page.sync="currentPage"
      ></el-pagination>
    </div>
    <!-- 任务详情 -->
    <dialogTaskDetail :reqObj="reqObj" v-if="showTaskDetail" v-on:closeDia="showTaskDetail=false"></dialogTaskDetail>
    <!--  批量采集 -->
    <set-task
      v-if="showSetTask"
      class="right-btn"
      :rowList="rowList"
      :jrtype="type"
      @close="closeTask()"
      @fre="loadTask()"
    ></set-task>
    <norela-coll
      v-if="showSetNore"
      @close="closeNore()"
      :pdata="noreData"
      :type="type"
      @fre="loadNore()"
    ></norela-coll>
    <!-- 数据核验 -->
    <dialog-is-check
      v-if="dialogVisible"
      :msgCheck="msgCheck"
      @closeDiaChk="dialogVisible=false"
      title="数据核验"
      :types="type"
    ></dialog-is-check>
  </div>
</template>
<script>
import { mapState } from "vuex";
import formFliter from "./../../../components/formFliter";
import userSurvey from "@/views/accessObjManage/dialog/admin/user_survey";
import setTask from "@/views/accessObjManage/dialog/admin/set_task";
import singleTask from "@/views/accessObjManage/dialog/admin/single_task";
import tableInver from "@/views/accessObjManage/dialog/admin/table_inver";
import pathFtp from "@/views/mainLay/dialog/path_ftp";
import norelaColl from "@/views/mainLay/dialog/norela_coll";
import DialogTaskDetail from "@/views/mainLay/dialog/DialogTaskDetails";
import DialogIsCheck from "@/views/task/DialogIsCheck";
import {
  getHdfsFormat,
  ctablesDatas,
  diyComments,
  synchronize,
  refreshAmount,
  ctablesDelete
} from "@/api/commonApi.js";

export default {
  data() {
    return {
      msgCheck: {},
      reqObj: "",
      loading: false,
      queryParamReady: false,
      collapse: true,
      noreData: {},
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
      showSetNore: false,
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
      objectType: [
        {
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
      dataRange: [
        {
          id: 4,
          name: "行政区"
        },
        {
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
          id: 99,
          name: "其他"
        }
      ],
      jrtype: "",
      accId: "",
      key_word: "",
      deleteData: {}
    };
  },

  computed: {
    tableParams: function() {
      return this.$store.state.queryParams.accessObjManage;
    },
    tableHeight: function() {
      /** 
      return this.collapse ?
        window.innerHeight - 300 :
        window.innerHeight - 400 - 40 * this.moreData; */
      if (window.innerHeight > 768) {
        return window.innerHeight - 275;
      }
      return 490;
    },
    headerHeight: function() {
      return this.collapse ? "50px" : "85px";
    },
    type: function() {
      return this.$route.params.type;
    },
    breadcrumbName() {
      if (this.$route.params.sourceName != undefined) {
        return decodeURI(this.$route.params.sourceName);
      }
    },
    majorData() {
      this.key_word = this.$store.state.majorData.keyword;
      return this.$store.state.majorData;
    }
  },
  components: {
    formFliter,
    userSurvey,
    setTask,
    singleTask,
    tableInver,
    pathFtp,
    norelaColl,
    DialogTaskDetail,
    DialogIsCheck
  },
  watch: {
    tableParams(newVal, oldVal) {
      if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
        if (newVal.deptId == oldVal.deptId) {
          //判断高级搜索的词不会进入
          this.loadTable();
        }
      }
    },
    $route(to, from) {
      this.cleanData = false;
      this.searchParams.condition = "";
      this.searchParams.objectType = [];
      this.searchParams.dataRange = [];
    }
  },
  mounted() {
    this.$root.eventHub.$emit("selTreeNode", this.$store.state.deptId);
    this.$root.eventHub.$emit("setActiveNav", 1);
    this.storeReady();
    this.setFliter();
    this.isParquet();
  },
  created() {},
  methods: {
    //非关系型采集
    setNoreVisible(data) {
      let _self = this;
      _self.noreData = data;
      if (_self.$route.params.type == "ftp") {
        _self.loading = true;
        this.$ajax({
          methods: "get",
          url: this.GLOBAL.api.API_DACM + "/ctables/checkFtpFileExist",
          params: {
            accessSysId: data.accessSysId,
            filePath: data.extendParams.filePath,
            isSubDirectory: data.extendParams.isSubDirectory
          }
        }).then(res => {
          _self.loading = false;
          if (res.data.success) {
            if (res.data.data.isExitFile == "true") {
              _self.showSetNore = true;
            } else {
              _self.$alert(res.data.data.message, "提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
              return false;
            }
          } else {
            _self.$alert(res.data.message, "提示", {
              confirmButtonText: "确定",
              callback: action => {}
            });
          }
        });
      } else {
        _self.showSetNore = true;
      }
    },
    editName(row, index) {
      this.editingRow.index = index;
      this.editingRow.diyComments = row.diyComments;
      row.showEdit = !row.showEdit;
      for (let i = 0; i < this.mainTableData.length; i++) {
        if (index == i) {
        } else {
          this.mainTableData[i].showEdit = false;
        }
      }
    },
    //数据核验
    dataInverCheck(row) {
      this.dialogVisible = true;
      this.msgCheck.taskInfoId = row.accessConnectorSource.taskInfoId;
      this.msgCheck.targetTableName = row.name;
    },
    //判断hdfs
    isParquet() {
      let _self = this;
      _self
        .$ajax({
          methods: "get",
          url: this.GLOBAL.api.API_DACM + getHdfsFormat,
          params: {}
        })
        .then(res => {
          if (res.data.hdfsFormat == "parquet") {
            _self.$store.state.commit("setParquet", true);
          } else if (res.data.hdfsFormat == "json") {
            _self.$store.state.commit("setParquet", false);
          }
        });
    },
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
    closeNore() {
      this.showSetNore = false;
    },
    loadTask() {
      this.showSetTask = false;
      this.loadTable();
    },
    loadNore() {
      this.showSetNore = false;
      this.loadTable();
    },
    showTask() {
      let flag = true;
      if (this.rowList.length == 0) {
        this.$message.warning("请选择批式采集的表");
        return false;
      } else {
        this.showSetTask = true;
      }
    },
    loadTable: function() {
      var _self = this;
      let objInfoIds = "";
      let urlIndex = decodeURI(_self.$route.query.objInfoIds).indexOf("[");
      let urlIds = "";
      if (urlIndex != -1) {
        objInfoIds = decodeURI(_self.$route.query.objInfoIds);
        urlIds = objInfoIds.substring(urlIndex + 1, objInfoIds.length - 1);
      }
      _self.jrtype = this.$store.state.jrtype;

      _self.loading = true;
      _self.pageSize = this.$store.state.pageSize;
      var paramsObj = {
        //不要问我为什么，后台接口就是这2个参数名
        pagNum: this.tableParams.pageNum,
        count: _self.pageSize
      };
      paramsObj.condition = this.searchParams.condition
        ? this.searchParams.condition
        : "";
      paramsObj.objectType = this.searchParams.objectType.join(",");
      paramsObj.dataRange = this.searchParams.dataRange.join(",");
      paramsObj.accessSysId = parseInt(this.$route.params.sourceId);
      paramsObj.objInfoId = urlIds;
      this.$ajax({
        url: window.ENV.API_DACM + ctablesDatas,
        /* url:'http://10.19.160.93:8080/DACM/ctables/datas',*/
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
            if (this.$route.params.type == "ftp") {
              //ftp根据id进行倒叙排列
              data.sort((a, b) => {
                if (a.id > b.id) {
                  return -1;
                } else if (a.id == b.id) {
                  return 0;
                } else {
                  return 1;
                }
              });
            }
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
            _self.$alert("加载接入对象列表失败，因为数据源链接错误。", "提示", {
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
          _self.loading = false;
          _self.$alert("加载接入对象列表失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    changeName: function(index, row) {
      var _self = this;
      this.loading = true;
      this.$ajax
        .post(window.ENV.API_DACM + diyComments, {
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
      this.searchParams.condition = keyword;
      this.loadTable();
    },

    updataSource: function() {
      var _self = this;
      self.loadTable = true;
      _self.loading = true;
      this.$ajax
        .get(window.ENV.API_DACM + synchronize, {
          params: {
            accessSysId: this.$route.params.sourceId
          }
        })
        .then(function(res) {
          _self.loading = false;
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
          _self.$alert("更新失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    updataSourceSingle: function(index, row) {
      var _self = this;
      this.$ajax
        .get(window.ENV.API_DACM + refreshAmount, {
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
      this.setStore(fliterParams);
    },
    storeReady() {
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
      objectType == true ? [] : objectType;
      dataRange == true ? [] : dataRange;
      this.formFilterData = [
        {
          name: "接入对象类型：",
          id: "objectType",
          type: "checkbox",
          checkData: this.objectType,
          seledData: objectType,
          limit: 4
        },
        {
          name: "数据范围：",
          id: "dataRange",
          type: "checkbox",
          checkData: this.dataRange,
          seledData: dataRange,
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
    },
    // ftp文件路径删除
    deleteFtp(row) {
      this.$confirm("确认要删除此目录吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "el-button--primary",
        type: "warning"
      })
        .then(() => {
          let params = {
            objInfoId: `${row.id}`
          };
          this.$ajax
            .post(window.ENV.API_DACM + ctablesDelete, params)
            .then(res => {
              if (res.data.success) {
                this.$message.success("删除成功");
                this.loadTable();
              } else {
                this.$message.error(res.data.message);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delSelect(id, index) {
      this.deleteData = {
        id,
        index
      };
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
  display: flex;
  flex-direction: column;
  height: 100%;
  .main {
    flex: 1;
    overflow: hidden;
  }
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

.icon-center {
  width: 100px;
  margin: auto;
  text-align: left;
}

.icon-other {
  width: 56px;
  margin: auto;
  text-align: left;
}

.cell i {
  cursor: pointer;
}

.updatelogo {
  width: 30px;
  height: 30px;
  -webkit-mask: url("../../../assets/images/dataupdate.svg");
  mask: url("../../../assets/images/dataupdate.svg");
  display: inline-block;
  cursor: pointer;
  background-color: #000;
}

.setlogo {
  width: 30px;
  height: 30px;
  -webkit-mask: url("../../../assets/images/tasklogo.svg");
  mask: url("../../../assets/images/tasklogo.svg");
  background-color: #000;
  /* background: url("../../../assets/images/tasklogo.svg"); */
  display: inline-block;
  cursor: pointer;
}

.underdone,
.underdone:focus,
.underdone:hover {
  text-decoration: underline;
}
.icon-title {
  font-size: 30px;
  display: inline-block;
  cursor: pointer;
}
.lookstyle {
  font-weight: normal;
  padding-right: 20px;
}
</style>
<style>
.el-breadcrumb .el-form-item__content {
  display: flex !important;
  height: 40px;
  line-height: 40px !important;
  justify-content: flex-end;
}
.el-breadcrumb .el-form-item {
  margin-bottom: 0px !important;
}
</style>

