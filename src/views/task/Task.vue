<template>
  <div v-loading="loading" :element-loading-text="tips" class="task-template">
    <div>
      <el-breadcrumb separator>
        <el-breadcrumb-item>汇聚任务</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索栏 -->
      <div class ref="searchArea">
        <!-- 查询按钮 -->
        <div class="searchDiv">
          <div class="dataSearch">
            <el-input
              type="text"
              v-model="keyword"
              placeholder="请输入查询条件"
              @keyup.enter.native="search"
            />
          </div>
          <el-button type="primary" class="doCearch" icon="enc-icon-sousuo1" @click="search"></el-button>
          <span @click="doMoreSearch">
            高级搜索
            <i :class="!moreSearch?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          </span>
        </div>
        <div class="checkDiv task-query-form" v-if="moreSearch" @mouseleave="mouseleave($event)">
          <el-form ref="form" label-width="110px">
            <el-form-item label="任务类型:">
              <el-checkbox-group v-model="taskPeriodType">
                <el-checkbox label="0" name="taskPeriodType">实时</el-checkbox>
                <el-checkbox label="1" name="taskPeriodType">周期间隔增量</el-checkbox>
                <el-checkbox label="2" name="taskPeriodType">周期定时增量</el-checkbox>
                <el-checkbox label="3" name="taskPeriodType">一次性接入</el-checkbox>
                <el-checkbox label="4" name="taskPeriodType">周期间隔全量</el-checkbox>
                <el-checkbox label="5" name="taskPeriodType">周期定时全量</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="任务状态:">
              <el-checkbox-group v-model="status">
                <el-checkbox label="0" name="status">新建</el-checkbox>
                <el-checkbox label="5" name="status">准备中</el-checkbox>
                <el-checkbox label="1" name="status">运行</el-checkbox>
                <el-checkbox label="2" name="status">暂停</el-checkbox>
                <el-checkbox label="6" name="status">采集失败</el-checkbox>
                <el-checkbox label="7" name="status">汇聚失败</el-checkbox>
                <el-checkbox label="4" name="status">完成</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="任务优先级:">
              <el-checkbox-group v-model="priority">
                <el-checkbox label="1" name="priority">高</el-checkbox>
                <el-checkbox label="2" name="priority">中</el-checkbox>
                <el-checkbox label="3" name="priority">低</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="任务开始时间:">
              <div @mouseleave="mouseleave($event)" style="margin-left:15px;">
                <el-date-picker
                  v-model="time"
                  :picker-options="pickerOptions"
                  type="datetimerange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="timeDefaultShow"
                ></el-date-picker>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div
      class="el-breadcrumb"
      style="text-align:right; padding-top:5px;"
      v-if="keyword!=''||taskPeriodType.length>0||status.length>0||priority.length>0||(time!=null && time.length>0)"
    >
      <el-form ref="form" label-width="0px" class="task-query-form">
        <el-form-item style="overflow: auto;">
          <div class="selected-task-type" style="display: inline-block;"></div>
          <div v-show="keyword!=''" class="selected-task-type" style="display: inline-block;">
            <span>
              <em class="limtLength">{{keyword}}</em>
              <span @click="keyword='';">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
          </div>
          <div
            v-show="taskPeriodType.length>0"
            class="selected-task-type"
            style="display: inline-block;"
          >
            <span v-show="taskPeriodType.indexOf('0')>-1">
              实时
              <span @click="pop('0',taskPeriodType);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('1')>-1">
              周期间隔增量
              <span @click="pop('1',taskPeriodType);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('2')>-1">
              周期定时增量
              <span @click="pop('2',taskPeriodType);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('3')>-1">
              一次性接入
              <span @click="pop('3',taskPeriodType);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('4')>-1">
              周期间隔全量;
              <span @click="pop('4',taskPeriodType);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('5')>-1">
              周期定时全量
              <span @click="pop('5',taskPeriodType);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
          </div>
          <div v-show="status.length>0" class="selected-task-type" style="display: inline-block;">
            <span v-show="status.indexOf('0')>-1">
              新建
              <span @click="pop('0',status);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="status.indexOf('5')>-1">
              准备中
              <span @click="pop('5',status);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="status.indexOf('1')>-1">
              运行
              <span @click="pop('1',status);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="status.indexOf('2')>-1">
              暂停
              <span @click="pop('2',status);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="status.indexOf('6')>-1">
              采集失败
              <span @click="pop('6',status);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="status.indexOf('7')>-1">
              汇聚失败
              <span @click="pop('7',status);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="status.indexOf('4')>-1">
              完成
              <span @click="pop('4',status);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
          </div>
          <div v-show="priority.length>0" class="selected-task-type" style="display: inline-block;">
            <span v-show="priority.indexOf('1')>-1">
              高
              <span @click="pop('1',priority);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="priority.indexOf('2')>-1">
              中
              <span @click="pop('2',priority);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
            <span v-show="priority.indexOf('3')>-1">
              低
              <span @click="pop('3',priority);">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
          </div>
          <div
            v-show="time!=null && time.length>0"
            class="selected-task-type"
            style="display: inline-block;"
          >
            <span style="margin-right:10px;">任务开始时间:</span>
            <span>
              {{time==null?'':time[0]}} - {{time==null?'':time[1]}}
              <span @click="time=[]">
                <i class="enc-icon-guanbi"></i>
              </span>
            </span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div class="count-operate main-content clearfix">
      <div class="task-btn">
        <el-tooltip class="item" effect="light" content="重新汇聚" placement="top">
          <el-button
            type="primary"
            icon="icon-title enc-icon-huiju"
            @click="doMore('manager/taskOperate/batchConverge',1)"
          >重新汇聚</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="批量启动" placement="top">
          <el-button
            type="primary"
            icon="icon-title enc-icon-qidongyunhang1"
            @click="doMore('manager/taskOperate/batchStart',2)"
          >批量启动</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="批量停止" placement="top">
          <el-button
            type="primary"
            icon="icon-title enc-icon-zanting"
            @click="doMore('manager/taskOperate/batchPause',3)"
          >批量停止</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="刷新" placement="top">
          <el-button type="primary" icon="icon-title enc-icon-shuaxin" @click="refresh">刷新</el-button>
        </el-tooltip>
      </div>
    </div>
    <!-- 表格数据 -->
    <div class="mainTable main-content clearfix">
      <el-table
        :row-class-name="tableRowClassName"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        :height="tableHeight"
        style="width: 100%;min-height:300px;"
        @select-all="selectAll"
        @select="select"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column fixed label="接入指示" width="100">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="light"
              content="数据源连接正常"
              placement="top"
              v-if="scope.row.networkStatus==0"
            >
              <i class="indicate" style="backgroundColor:green"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="light"
              content="数据源链接不稳定"
              placement="top"
              v-else-if="scope.row.networkStatus==1"
            >
              <i class="indicate" style="backgroundColor:yellow"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="light"
              content="数据源不通"
              placement="top"
              v-else-if="scope.row.networkStatus==2"
            >
              <i class="indicate" style="backgroundColor:red"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskInfoId"
          fixed
          label="ID"
          width="100"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-button
              @click="doDetail(scope.$index, scope.row)"
              type="text"
              size="small"
              style="text-decoration: underline;"
            >{{scope.row.taskInfoId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="sourceDBName"
          label="接入源名称"
          width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="dataTableName"
          label="接入对象"
          width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="targetDBName" label="目标库" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          prop="targetTableName"
          label="目标表"
          width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="任务开始时间" prop="startTime" width="200" show-overflow-tooltip>
          <template
            slot-scope="scope"
          >{{scope.row.status==5 ? '' : scope.row.startTime | formateDateTime }}</template>
        </el-table-column>
        <el-table-column label="任务结束时间" width="200" show-overflow-tooltip>
          <template
            slot-scope="scope"
          >{{(scope.row.status==5||(scope.row.status==1&&scope.row.isPeriod=='3')) ? '' : scope.row.endTime | formateDateTime}}</template>
        </el-table-column>
        <el-table-column label="任务类型" width="130" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.isPeriod==0">实时</span>
            <span v-if="scope.row.isPeriod==1">周期间隔增量</span>
            <span v-else-if="scope.row.isPeriod==2">周期定时增量</span>
            <span v-else-if="scope.row.isPeriod==3">一次性接入</span>
            <span v-else-if="scope.row.isPeriod==4">周期间隔全量</span>
            <span v-else-if="scope.row.isPeriod==5">周期定时全量</span>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">新建</span>
            <span v-if="scope.row.status==1">运行</span>
            <span v-else-if="scope.row.status==2">暂停</span>
            <span v-else-if="scope.row.status==6" style="color:red">采集失败</span>
            <span v-else-if="scope.row.status==7" style="color:red">汇聚失败</span>
            <span v-else-if="scope.row.status==4">完成</span>
            <span v-else-if="scope.row.status==5">准备中</span>
          </template>
        </el-table-column>
        <el-table-column label="已接入数据量" :show-overflow-tooltip="true" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.status=='0'?'':scope.row.joinDataNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <div class="el-tleft">
              <el-tooltip
                v-if="scope.row.status==0||scope.row.status==2"
                class="item"
                effect="light"
                content="运行"
                placement="top"
              >
                <i class="enc-icon-qidongyunhang1" @click="doRun(scope.$index, scope.row)"></i>
              </el-tooltip>

              <el-tooltip
                v-if="scope.row.status==1 || scope.row.status==5"
                class="item"
                effect="light"
                content="暂停"
                placement="top"
              >
                <i class="enc-icon-zanting" @click="doRun(scope.$index, scope.row)"></i>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.status!=1"
                class="item"
                effect="light"
                content="删除"
                placement="top"
              >
                <i class="enc-icon-shanchu" @click="doDel(scope.$index, scope.row)"></i>
              </el-tooltip>
              <el-tooltip
                v-if="(scope.row.status==1||scope.row.status==2||scope.row.status==4)&&scope.row.isPeriod!=0&&scope.row.ftpIsDelete!='true'"
                class="item"
                effect="light"
                content="数据核验"
                placement="top"
              >
                <i class="enc-icon-shujuheyan" @click="doCheck(scope.$index, scope.row)"></i>
              </el-tooltip>
              <el-tooltip
                v-if="(scope.row.status==2||scope.row.status==4||scope.row.status==6||scope.row.status==7)&&scope.row.isPeriod!=0&&scope.row.ftpIsDelete!='true'"
                class="item"
                effect="light"
                content="重新汇聚"
                placement="top"
              >
                <i class="enc-icon-huiju" @click="doConverge(scope.$index, scope.row)"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-footer>
      <div class="clearfix mr-btn enc-pagination">
        <el-pagination
          style="float:right; margin:10px;"
          @current-change="handleCurrentChange"
          background
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :total="mainTableDataTotal"
          layout="prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </el-footer>
    <!-- 任务详情 -->
    <dialogTaskDetail :reqObj="reqObj" v-if="showTaskDetail" v-on:closeDia="showTaskDetail=false"></dialogTaskDetail>
    <DialogIsCheck
      v-if="showTaskCheck"
      v-on:closeDiaChk="showTaskCheck=false"
      :msgCheck="check"
      :title="dialogIsCheckTitile"
      :types = "checktype"
    ></DialogIsCheck>
  </div>
</template>
<script>
import DialogIsCheck from "./DialogIsCheck";
import DialogTaskDetail from "./DialogTaskDetail";
import { deleteTask } from "@/api/commonApi.js";

//盐城环境地址
const httpUrl = window.ENV.API_DOWN + "/";
//websocket地址
const wsUrl = `ws${httpUrl.substring(4, httpUrl.length - 1)}/websocket`;

var tableZC;
export default {
  name: "task",
  data() {
    return {
      tips: "",
      loading: false,
      taskPeriodType: JSON.parse(
        JSON.stringify(this.$store.state.taskParam.taskPeriodType)
      ), //任务类型
      status: JSON.parse(JSON.stringify(this.$store.state.taskParam.status)), //任务状态
      time: JSON.parse(JSON.stringify(this.$store.state.taskParam.time)),
      check: "",
      checktype:'',
      priority: JSON.parse(
        JSON.stringify(this.$store.state.taskParam.priority)
      ),
      pageNum: 1,
      showTaskDetail: false,
      showTaskCheck: false,
      moreSearch: false,
      websock: null,
      allSecectData: {},
      keyword: JSON.parse(JSON.stringify(this.$store.state.taskParam.keyword)),
      isDeleted: 0,
      tableData: [],
      selectionChangeData: [],
      timeDefaultShow: ["00:00:00", "23:59:59"],

      mainTableDataTotal: 0,
      reqObj: "",
      pickerOptions: {
        disabledDate(time) {
          if (
            new Date(time.getTime()).toDateString() ===
            new Date().toDateString()
          ) {
            //今天
            if (time.getTime() > Date.now()) {
              //time.$emit('pick', ['00:00:00', Date.now()]);
              time.setTime(new Date());
            }
          }
          return time.getTime() > Date.now();
        }
      },
    };
  },
  components: {
    DialogIsCheck,
    DialogTaskDetail
  },
  watch: {
    //监听树节点deptID,操作数据
    departmentId(newVal, oldVal) {
      this.pageNum = 1;
      this.init("");
    },
    $route(to, from) {
      if (to.path == "/task") {
        this.init(this.keyword);
        this.initWebSocket();
      } else {
        this.websocketclose();
      }
    }
  },
  computed: {
    dialogIsCheckTitile() {
      return `表${this.check.taskName}数据核验`;
    },
    departmentId() {
      return this.$store.state.deptId;
    },
    tableHeight() {
      if (window.innerHeight > 768) {
        return window.innerHeight - 320;
      } else {
        return 420;
      }
    },
    pageSize() {
      return this.$store.state.pageSize;
    }
  },
  filters: {
    formateDateTime(time) {
      if (time && time != null) {
        return time.substring(0, 19);
      }
    }
  },
  created() {
    this.init(this.$store.state.taskParam.keyword);
    this.initWebSocket();
  },
  mounted() {
    this.$root.eventHub.$emit("selTreeNode", this.$store.state.deptId);
    this.$root.eventHub.$emit("setActiveNav", 3);
  },
  methods: {
    removeCla() {
      this.tableData.forEach(item => {
        if (item.zc == 1) item.zc = 0;
      });
    },
    //新增人物高亮
    tableRowClassName({ row, rowIndex }) {
      if (row.zc === 1 && rowIndex == 0) {
        return "animated slideInLeft success-row";
      } else if (row.zc === 0) {
        return "success-row";
      } else {
        return "";
      }
    },
    pop(val, arr) {
      if (arr.indexOf(val) > -1) {
        let ind = arr.indexOf(val);
        arr.splice(ind, 1);
      }
    },
    initWebSocket() {
      //初始化weosocket
      //ws地址
      // const wsuri = "ws://10.19.160.160:8080/";
      const wsuri = wsUrl;
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = this.websocketonopen;
      if (this.$route.path == "/task") {
        this.websock.onmessage = this.websocketonmessage;
      }
      this.websock.onclose = this.websocketclose;
    },
    //数据接收
    websocketonmessage(e) {
      let redata = JSON.parse(e.data);
      let redataTrue = true;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].taskInfoId == redata.taskInfoId) {
          redataTrue = false;
        }
      }

      if (redataTrue) {
        redata.zc = 1;
        this.removeCla();
        let tim = setTimeout(() => {
          this.$message({
            message: `实时播报：新增一条 ID为：${redata.taskInfoId}的任务`,
            type: "success"
          });
          this.tableData.unshift(redata);
          this.tableData = Array.from(new Set(this.tableData));

          clearTimeout(tim);
        }, 0);
      }
    },
    websocketclose(e) {
      //关闭
      this.websock.close();
      console.log("websocket连接已断开");
    },
    //连接成功回调方法
    websocketonopen() {
      console.log("websocket连接成功！");
    },
    // 刷新按钮
    refresh() {
      this.init(this.keyword);
    },
    //查询按钮
    search() {
      this.$store.state.taskParam.taskPeriodType = JSON.parse(
        JSON.stringify(this.taskPeriodType)
      );
      this.$store.state.taskParam.status = JSON.parse(
        JSON.stringify(this.status)
      );
      this.$store.state.taskParam.time = JSON.parse(JSON.stringify(this.time));
      this.$store.state.taskParam.priority = JSON.parse(
        JSON.stringify(this.priority)
      );
      this.$store.state.taskParam.keyword = JSON.parse(
        JSON.stringify(this.keyword)
      );
      this.pageNum = 1;
      this.allSecectData = {};
      this.init(this.keyword);
    },
    //高级搜索
    doMoreSearch() {
      this.moreSearch = !this.moreSearch;
    },
    //详情
    doDetail(index, row) {
      this.reqObj = row;
      this.showTaskDetail = true;
    },
    //核验弹窗
    doCheck(index, row) {
      this.check = row;
      this.checktype = row.sourceType;
      //ftp的核验
      if (row.sourceType == "ftp") {
        this.loading = true;
        this.$ajax({
            methods: "get",
            url: this.GLOBAL.api.API_DACM + "/ctables/checkFtpFileExist",
            params: {
              accessSysId: row.accessSysId,
              filePath: row.dataTableName,
              isSubDirectory: row.isSubDirectory,
              taskType: "0"
            }
          }).then(res => {
            this.loading = false;
            if (res.data.success) {
              if (res.data.data.isExitFile == "true") {
                //运行时弹出确认框
                if (row.status == "1") {
                  this.$confirm(
                      "当前任务正在运行中， 数据核验结果可能不精准，请确认是否要继续数据核验？",
                      "提示",
                      {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        cancelButtonClass: "el-button--primary",
                        type: "warning"
                      }
                    ).then(() => {
                      this.showTaskCheck = true;
                    }).catch(() => {});
                } else {
                  this.showTaskCheck = true;
                }
              } else {
                this.$alert(res.data.data.message, "提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
                return false;
              }
            } else {
              this.$alert(res.data.message, "提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          });
      } else {
        //运行时弹出确认框
        if (row.status == "1") {
          this.$confirm(
            "当前任务正在运行中， 数据核验结果可能不精准，请确认是否要继续数据核验？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              cancelButtonClass: "el-button--primary",
              type: "warning"
            }
          )
            .then(() => {
              this.showTaskCheck = true;
            })
            .catch(() => {});
        } else {
          this.showTaskCheck = true;
        }
      }
    },
    //重新汇聚
    doConverge(index, row) {
      this.loading = true;
      if (row.sourceType == "ftp") {
        this.$ajax({
          method: "get",
          url: this.GLOBAL.api.API_DACM + "/ctables/checkFtpTaskFileExist",
          params: { taskId: row.taskInfoId, taskType: "1" }
        }).then(res => {
          if (res.data.success && res.data.data.length > 0) {
            res.data.data.forEach(res => {
              if (res.isExitFile == "true") {
                this.singleCoverHandel(row);
              } else {
                this.loading = false;
                this.doMsg(res.message, "error");
              }
            });
          } else {
            this.loading = false;
            this.doMsg(res.data.message, "error");
          }
        });
      } else {
        this.singleCoverHandel(row);
      }
    },
    singleCoverHandel(row){
        this.$ajax({
          method: "get",
          url: this.GLOBAL.api.API_DACM + "/taskManager/deleteStatistic",
          params: { taskInfoId: row.taskInfoId }
        }).then(res => {
          if (res.data.code == "0000") {
            this.$ajax.put(httpUrl + "manager/taskOperate/converge/" + row.taskInfoId).then(res=> {
                this.loading = false;
                if (res.data.success) {
                  this.doMsg(`汇聚任务ID:"${row.taskInfoId}重新汇聚任务创建成功！`,"success");
                  this.init();
                } else {
                  this.doMsg(res.data.message, "error");
                }
              });
          } else {
            this.loading = false;
            this.doMsg(res.data.message, "error");
          }
        });
    },
    //删除
    doDel(index, row) {
      this.$confirm("确定删除该任务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "el-button--primary",
        type: "warning"
      }).then(() => {
          this.loading = true;
          this.$ajax.get(`${this.GLOBAL.api.API_DACM}/taskManager/verifyDelete/${row.taskInfoId}`).then(res=> {
              if (res.data.code == "0000") {
                this.$confirm(
                    "当前任务的数据已经废止，请确认是否要删除任务和对应汇聚数据。",
                    "提示",
                    {
                      confirmButtonText: "删除任务和数据",
                      cancelButtonText: "取消",
                      type: "warning"
                    }
                  ).then(() => {
                    this.$ajax.put(`${httpUrl}manager/taskOperate/delete/${row.taskInfoId}`).then(res=> {
                        this.loading = false;
                        if (res.data.success) {
                          // 调用/DACM/接口
                          this.$ajax.delete(`${window.ENV.API_DACM}${deleteTask}${row.taskInfoId}`);
                          this.doMsg("删除任务操作成功", "success");
                          this.init();
                        } else {
                          this.doMsg(res.data.message, "error");
                        }
                      });
                  })
              } else {
                this.loading = false;
                this.$confirm(
                    "当前任务的数据已在提供服务，请先到数据资产去废止数据。",
                    "提示",
                    {
                      distinguishCancelAndClose: true,
                      confirmButtonText: "到数据资产",
                      cancelButtonText: "取消",
                      cancelButtonClass: "el-button--primary",
                      type: "warning"
                    }
                  ).then(() => {
                    this.loading = false;
                    window.open(this.GLOBAL.dam.API_DAM);
                  })
              }
            })
            .catch(() => {});
        })
    },
    //运行、暂停
    doRun(index, row) {
      let url = "";
      this.loading = true;
      if (row.status == 0 || row.status == 2 || row.status == 3) {
        //执行运行
        url = httpUrl + "manager/taskOperate/start/" + row.taskInfoId;
        this.$ajax.put(url).then(res => {
          this.loading = false;
          if (res.data.success) {
            this.doMsg("运行成功", "success");
            this.init();
          } else {
            this.doMsg(res.data.message, "error");
          }
        });
      } else if (row.status == 1 || row.status == 5) {
        //执行暂停
        url = httpUrl + "manager/taskOperate/pause/" + row.taskInfoId;
        this.$ajax.put(url).then(res => {
          this.loading = false;
          if (res.data.code == "0000") {
            this.doMsg("暂停成功", "success");
            row.status = 2;
          } else {
            this.doMsg(res.data.message, "error");
          }
        });
      }
    },
    //分页切换
    handleCurrentChange() {
      this.init(this.keyword, true);
    },
    //信息提示
    doMsg(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type,
        duration: 3500
      });
    },
    //表格数据获取
    init(keyword, type) {
      if(!type){// 如果不是分页调用该接口
        this.allSecectData = {};
      }
      this.loading = true;
      let tableParams = {
        status: this.status.join(","),
        taskPeriodType: this.taskPeriodType.join(","),
        createTime: this.time[0],
        endTime: this.time[1],
        priority: this.priority.join(","),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskName: this.keyword,
        departmentId: this.departmentId.join(",")
      };
      this.$ajax.get(httpUrl + "manager/task/show/0", {
          params: tableParams
        }).then(res=> {
          if (res.data.code == 200) {
            this.tableData = res.data.data.result;
            this.tableData.forEach(res => {
              if (res.status == 5) {
                if (res.startTime) {
                  res.status = 1;
                } else {
                  res.startTime = "";
                  res.endTime = "";
                  res.joinDataNum = "";
                }
              }
            });
            tableZC = this.tableData[0];
            this.mainTableDataTotal = res.data.data.total * 1;
            this.loading = false;
            this.$nextTick(()=> {
              let row = [];
              let row1 = Object.keys(this.allSecectData);
              for (let i = 0; i < row1.length; i++) {
                for (let j = 0; j < this.allSecectData[row1[i]].length; j++) {
                  row.push(this.allSecectData[row1[i]][j]);
                }
              }
              for (let a = 0; a < row.length; a++) {
                for (let z = 0; z < this.tableData.length; z++) {
                  if (row[a].taskInfoId == this.tableData[z].taskInfoId) {
                    row[a].status = this.tableData[z].status;
                    this.$refs.multipleTable.toggleRowSelection( this.tableData[z], true);
                  }
                }
              }
            });
          }
        })
    },
    //选中事件
    handleSelectionChange(val) {

    },
    //手动选择事件
    select(selection, row) {
      this.allSecectData[this.pageNum] = JSON.parse(JSON.stringify(selection));
    },
    //手动全选事件
    selectAll(selection) {
      this.allSecectData[this.pageNum] = JSON.parse(JSON.stringify(selection));
    },
    pLDataHandel(rowNew, params) {
      //批量汇聚
      let errorData = [];
      for (let i = 0; i < rowNew.length; i++) {
        if (
          rowNew[i].status == 1 ||
          rowNew[i].status == 0 ||
          rowNew[i].isPeriod == 0
        ) {
          errorData.push(rowNew[i]);
        }
      }
      if (errorData.length == 0) {
        this.loading = true;
        this.tips = "批量汇聚中...";
        let tparams = {
          taskInfoId: params.taskInfoIds
        }
        this.$ajax({
          method: "get",
          url: this.GLOBAL.api.API_DACM + "/taskManager/deleteStatistic",
          params: tparams
        }).then(res => {
          if (res.data.code == "0000") {
            this.$ajax({
                url: httpUrl + "manager/taskOperate/batchConverge",
                method: "POST",
                params: params
              }).then(res=> {
                this.infoTipsHandel(res, "批量汇聚", "汇聚");
              })
          } else {
            this.loading = false;
            this.doMsg(res.data.message, "error");
          }
        });
      } else {
        let errerHtml = "";
        for (let j = 0; j < errorData.length; j++) {
          errerHtml += `${j+1}.${errorData[j].taskName}：${errorData[j].taskInfoId}</br>`
        }
        this.$alert(
          `重新汇聚时，以下任务不能被汇聚，请重新选择：</br>${errerHtml}`,
          "重新汇聚",
          {
            dangerouslyUseHTMLString: true
          }
        );
      }
    },
    //批量操作
    doMore(url, a) {
      let tableParams = [];
      let row = [];
      let row1 = Object.keys(this.allSecectData);
      let counter = 0;
      for (let i = 0; i < row1.length; i++) {
        if (this.allSecectData[row1[i]].length !== 0) {
          counter += 1;  
        }
      }
      if (row1.length === 0 || counter===0) {
        this.$alert("请选择相应的任务！", "提示", {
          height: 50,
          dangerouslyUseHTMLString: true
        });
        return;
      }

      for (let i = 0; i < row1.length; i++) {
        for (let j = 0; j < this.allSecectData[row1[i]].length; j++) {
          row.push(this.allSecectData[row1[i]][j]);
          tableParams.push(this.allSecectData[row1[i]][j].taskInfoId);
        }
      }
      let params = {
        taskInfoIds: tableParams.join(",")
      };
      let rowNew = Array.from(row);
      if (a == 1) {
        // 先判断是否有ftp的数据
        let ftpData = rowNew.filter(res => {
          return res.sourceType == "ftp";
        });
        if (ftpData.length > 0) {
          let taskInfoId = "";
          ftpData.forEach(res => {
            taskInfoId += res.taskInfoId + ",";
          });
          taskInfoId = taskInfoId.substr(0, taskInfoId.length - 1);
          this.$ajax({
            method: "get",
            url: this.GLOBAL.api.API_DACM + "/ctables/checkFtpTaskFileExist",
            params: { taskId: taskInfoId, taskType: "1" }
          }).then(res => {
            if (res.data.success) {
              let ftpRespose = res.data.data.filter(val => {
                return val.isExitFile == "false";
              });
              if (ftpRespose.length > 0) {
                let errerHtml = "";
                for (let j = 0; j < ftpRespose.length; j++) {
                  errerHtml += `${j + 1}.汇聚任务：${ftpRespose[j].taskId}</br>`;
                }
                this.$alert(
                  `重新汇聚时，以下任务不能被汇聚，请重新选择：</br>${errerHtml}`,"重新汇聚", {
                    dangerouslyUseHTMLString: true
                  }
                );
              } else {
                this.pLDataHandel(rowNew, params);
              }
            }
          });
        } else {
          this.pLDataHandel(rowNew, params);
        }
      } else if (a == 2) {
        //批量启动
        let errorData = [];
        for (let i = 0; i < rowNew.length; i++) {
          if (
            rowNew[i].status == 1 ||
            rowNew[i].status == 4 ||
            rowNew[i].status == 3
          ) {
            errorData.push(rowNew[i]);
          }
        }
        this.doMoreHandel(errorData, "批量启动", "启动",  url, params);
      } else if (a == 3) {
        //批量停止
        let errorData = [];
        for (let i = 0; i < rowNew.length; i++) {
          if (rowNew[i].status != 1) {
            errorData.push(rowNew[i]);
          }
        }
        this.doMoreHandel(errorData, "批量停止", "停止", url, params);
      }
    },
    doMoreHandel(errorData, name1, name2, url, params){
      if(errorData.length == 0){
          this.loading = true;
          this.tips = `${name1}中...`;
          this.$ajax({
            url: httpUrl + url,
            method: "POST",
            params: params
          }).then(res=> {
            this.infoTipsHandel(res, name1, name2);
          });        
      } else {
        let errerHtml = "";
        for (let j = 0; j < errorData.length; j++) {
            errerHtml += `${j + 1}.${errorData[j].taskName}：${errorData[j].taskInfoId}</br>`;
        }
        this.$alert(
          `${name1}时，以下任务不能被${name2}，请重新选择：</br>${errerHtml}`, `${name1}`,{
            dangerouslyUseHTMLString: true
          }
        );
      }
    },
    infoTipsHandel(res, name1, name2) {
      this.loading = false;
      this.tips = "";
      if(res.data.success){
        let successHtml = "";
        let errorHtml = "";
        for (let i = 0; i < res.data.data.successList.length; i++) {
          successHtml += `${i + 1}.${res.data.data.successList[i]}</br>`;
        }
        for (let i = 0; i < res.data.data.errorList.length; i++) {
          errorHtml += `${i + 1}.${res.data.data.errorList[i]}</br>`;
        }
        if (
          res.data.data.successList.length == 0 &&
          res.data.data.errorList.length > 0
        ) {
          this.$alert(`${name1}失败的任务如下：</br>${errorHtml}`, `${name1}`, {
            dangerouslyUseHTMLString: true
          });
        } else if (
          res.data.data.errorList.length == 0 &&
          res.data.data.successList.length > 0
        ) {
          this.$alert(
            `操作成功！${name1}成功的任务如下：</br>${successHtml}`,
            `${name1}`,
            {
              dangerouslyUseHTMLString: true
            }
          );
        } else {
          this.$alert(
            `操作成功！${name1}成功的任务如下：</br>${successHtml}；${name1}失败的任务如下：</br>${errorHtml}`,
            `${name1}`,
            {
              dangerouslyUseHTMLString: true
            }
          );
        }
        this.init();
      } else {
        this.$alert(`${name1}失败`, `${name1}`, {
          dangerouslyUseHTMLString: true
        });
      }
    },
    mouseleave(e) {
      var o = e.relatedTarget || e.toElement;
      if (o && o != null) {
        this.moreSearch = !this.moreSearch;
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.limtLength {
  display: inline-block;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-style: normal;
  margin-top: -3px;
}

.selected-task-type span {
  margin-right: 10px;
  color: #425365;
}

.selected-task-type span:first-child {
  font-weight: 600;
}

.selected-task-type span i {
  margin-left: 3px;
  cursor: pointer;
}

.count-container {
  background-color: #fff;
  border-bottom: 1px solid #d9d9d9;
  margin: 0 auto;
  padding-top: 20px;
}

.timeSearch {
  float: left;
}

.el-checkbox {
  width: 95px;
}

.count-operate {
  div {
    float: right;
  }
}

.indicate {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.enc-pagination {
  float: right;
}

.searchDiv {
  float: right;
  margin-top: -41px;
  margin-right: 20px;
  height: 40px;
  span {
    display: inline-block;
    font-size: 15px;
    cursor: pointer;
    width: 100px;
    height: 36px;
    border: 1px solid #c9cdd0;
    margin-left: 5px;
    line-height: 35px;
    text-align: center;
    position: relative;
  }
}

.dataSearch {
  display: inline-block;
  width: 220px;
  height: 40px;
  line-height: 40px;
  margin-right: 5px;
  ::-webkit-input-placeholder {
    color: #999;
    font-size: 15px;
  } ///* 使用webkit内核的浏览器 */
  :-moz-placeholder {
    color: #999;
    font-size: 15px;
  } ///* Firefox版本4-18 */
  ::-moz-placeholder {
    font-size: 15px;
    color: #999;
  } ///* Firefox版本19+ */
  :-ms-input-placeholder {
    font-size: 15px;
    color: #999;
  } ///* IE浏览器 */
}

.doCearch {
  display: inline-block;
  margin-top: 0;
  position: relative;
  i {
    text-indent: 5px;
    font-size: 21px;
  }
}

.checkDiv {
  padding: 30px;
  position: absolute;
  z-index: 1001;
  border: 1px solid #eff3f6;
  border-radius: 0px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  width: 700px;
  right: 0px;
}

.el-message-box {
  max-height: 50%;
  overflow: auto;
}

.el-message-box__wrapper {
  .el-message-box {
    max-height: 50%;
    overflow: auto;
  }
}

.right-tools {
  float: right;
  margin-left: 10px;
  a {
    font-size: 32px;
    i {
      font-size: 32px;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.task-template {
  .el-picker-panel__icon-btn {
    color: #303133 !important;
  }
  .zcTable .el-table__fixed {
    background-color: #fff;
  }
  .zcTable .el-table__body-wrapper {
    background-color: #fff;
  }
  .el-table__body tbody tr:nth-child(2n) {
    background-color: #e6e8ed;
  }
  .el-table__body tbody tr:nth-child(2n + 1) {
    background-color: #eff3f6;
  }
  .el-table__body tr.hover-row > td {
    /*  background-color: #95a1b3 !important; */
    color: #fff;
  }
  .el-message-box {
    max-height: 50%;
    overflow: auto;
  }
  .mainTable .el-table .success-row {
    background: #d9f9c8;
  }
  .el-message-box__wrapper .el-message-box {
    max-height: 50%;
    overflow: auto;
  }
  .task-query-form .el-checkbox {
    width: auto;
    margin-left: 15px;
    margin-right: 0px !important;
  }
  .el-breadcrumb .el-form-item {
    margin-bottom: 0px !important;
  }
}

.main-content {
  width: 100%;
}

.task-template {
  .el-table .cell .el-button i {
    font-size: 21px;
  }
  .el-tleft {
    /* width:100px;
    text-align: left;
    margin:auto; */
  }
}

.task-btn .el-button--primary span,
.task-btn .el-button--medium span {
  float: right;
}
.el-tleft {
  i {
    font-size: 24px;
    padding-right: 10px;
    cursor: pointer;
  }
}
</style>
