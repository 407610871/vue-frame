<template>
  <div v-loading="loading" :element-loading-text="tips" class="task-template">
    <!-- 搜索栏 -->
    <div class="" ref="searchArea" style="margin-bottom:20px;">
      <!-- 查询按钮 -->
      <div class="searchDiv">
        <div class="dataSearch">
          <i class="el-icon-search"></i>
          <input type="text" v-model="keyword" placeholder="请输入查询条件" @keyup.13="search">
        </div>
        <span @click="doMoreSearch">
          高级搜索
          <i :class="!moreSearch?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
        </span>
        <el-button type="primary" class="doCearch" @click="search">查询</el-button>
      </div>

      <el-form
        ref="form"
        label-width="110px"
        class="formGroup task-query-form"
        v-if="keyword!=''||taskPeriodType.length>0||status.length>0||priority.length>0||(time!=null && time.length>0)"
        style="padding-left: 27px;"
      >
        <el-form-item label="已选查询条件:" style="max-height: 60px;overflow: auto;">
          <div v-show="keyword!=''" class="selected-task-type" style="display: inline-block;">
            <span>查询条件:</span>
            <span>
              <em class="limtLength">{{keyword}}</em>
              <span @click="keyword='';">
                <i class="el-icon-error"></i>
              </span>
            </span>
          </div>
          <div
            v-show="taskPeriodType.length>0"
            class="selected-task-type"
            style="display: inline-block;"
          >
            <span>任务类型:</span>
            <span v-show="taskPeriodType.indexOf('0')>-1">
              实时
              <span @click="pop('0',taskPeriodType);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('1')>-1">
              周期间隔增量
              <span @click="pop('1',taskPeriodType);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('2')>-1">
              周期定时增量
              <span @click="pop('2',taskPeriodType);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('3')>-1">
              一次性接入
              <span @click="pop('3',taskPeriodType);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('4')>-1">
              周期间隔全量;
              <span @click="pop('4',taskPeriodType);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="taskPeriodType.indexOf('5')>-1">
              周期定时全量
              <span @click="pop('5',taskPeriodType);">
                <i class="el-icon-error"></i>
              </span>
            </span>
          </div>
          <div v-show="status.length>0" class="selected-task-type" style="display: inline-block;">
            <span>任务状态:</span>
            <span v-show="status.indexOf('0')>-1">
              新建
              <span @click="pop('0',status);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="status.indexOf('5')>-1">
              准备中
              <span @click="pop('5',status);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="status.indexOf('1')>-1">
              运行
              <span @click="pop('1',status);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="status.indexOf('2')>-1">
              暂停
              <span @click="pop('2',status);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="status.indexOf('3')>-1">
              失败
              <span @click="pop('3',status);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="status.indexOf('4')>-1">
              完成
              <span @click="pop('4',status);">
                <i class="el-icon-error"></i>
              </span>
            </span>
          </div>
          <div v-show="priority.length>0" class="selected-task-type" style="display: inline-block;">
            <span>任务优先级:</span>
            <span v-show="priority.indexOf('1')>-1">
              高
              <span @click="pop('1',priority);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="priority.indexOf('2')>-1">
              中
              <span @click="pop('2',priority);">
                <i class="el-icon-error"></i>
              </span>
            </span>
            <span v-show="priority.indexOf('3')>-1">
              低
              <span @click="pop('3',priority);">
                <i class="el-icon-error"></i>
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
                <i class="el-icon-error"></i>
              </span>
            </span>
          </div>
        </el-form-item>
      </el-form>
      <el-form
        ref="form"
        label-width="110px"
        class="formGroup task-query-form"
        v-if="moreSearch"
        style="padding-left: 27px;"
      >
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
            <el-checkbox label="3" name="status">失败</el-checkbox>
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
          <el-date-picker
            v-model="time"
            :picker-options="pickerOptions"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['12:00:00']"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div class="count-operate ">
        <el-button type="primary" @click="doMore('manager/taskOperate/batchConverge',1)">重新汇聚</el-button>
        <el-button type="primary" @click="doMore('manager/taskOperate/batchStart',2)">批量启动</el-button>
        <el-button type="primary" @click="doMore('manager/taskOperate/batchPause',3)">批量停止</el-button>
        <div class="right-tools">
          <el-tooltip class="item" effect="light" content="刷新" placement="top">
              <a href="javascript:void(0)" v-on:click="refresh"><i class="enc-icon-shuaxin"></i></a>
          </el-tooltip>
        </div>
    </div>
    <!-- 表格数据 -->
      <el-table
        border
        :row-class-name="tableRowClassName"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="light"
        :height="tableHeight"
        @select-all="selectAll"
        @select="select"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column fixed label="接入指示" width="100">
          <template slot-scope="scope">
            <i
              v-if="scope.row.networkStatus==0"
              class="indicate"
              style="backgroundColor:green"
              title="数据源连接正常"
            ></i>
            <i
              v-else-if="scope.row.networkStatus==1"
              class="indicate"
              style="backgroundColor:yellow"
              title="数据源链接不稳定"
            ></i>
            <i
              v-else-if="scope.row.networkStatus==2"
              class="indicate"
              style="backgroundColor:red"
              title="数据源不通"
            ></i>
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
        <el-table-column label="任务开始时间" width="150" :show-overflow-tooltip="true">
          <template
            slot-scope="scope"
          >{{scope.row.status==5 ? '' : scope.row.startTime | formateDateTime }}</template>
        </el-table-column>
        <el-table-column label="任务结束时间" width="150" :show-overflow-tooltip="true">
          <template
            slot-scope="scope"
          >{{scope.row.status==5 ? '' : scope.row.endTime | formateDateTime}}</template>
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
            <span v-else-if="scope.row.status==3" style="color:red">失败</span>
            <span v-else-if="scope.row.status==4">完成</span>
            <span v-else-if="scope.row.status==5">准备中</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="joinDataNum"
          label="已接入数据量"
          :show-overflow-tooltip="true"
          width="150"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==0||scope.row.status==2"
              type="text"
              size="small"
              @click="doRun(scope.$index, scope.row)"
            >运行</el-button>
            <el-button
              v-if="scope.row.status==1 || scope.row.status==5"
              type="text"
              size="small"
              @click="doRun(scope.$index, scope.row)"
            >暂停</el-button>
            <el-button
              v-if="scope.row.status!=1"
              type="text"
              size="small"
              @click="doDel(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              v-if="(scope.row.status==1||scope.row.status==2||scope.row.status==4)&&scope.row.isPeriod!=0"
              type="text"
              size="small"
              @click="doCheck(scope.$index, scope.row)"
            >数据核验</el-button>
            <el-button
              v-if="(scope.row.status==2||scope.row.status==4||scope.row.status==3)&&scope.row.isPeriod!=0"
              type="text"
              size="small"
              @click="doConverge(scope.$index, scope.row)"
            >重新汇聚</el-button>
          </template>
        </el-table-column>
      </el-table>

    <!-- 分页 -->
    <el-footer>
      <div class="enc-pagination">
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
      mainTableDataTotal: 0,
      reqObj: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      searchHeight: 71
    };
  },

  watch: {
    //监听树节点deptID,操作数据
    departmentId(newVal, oldVal) {
      this.init("");
    },
    keyword() {
      this.getSearchArea();
    },
    taskPeriodType() {
      this.getSearchArea();
    },
    status() {
      this.getSearchArea();
    },
    priority() {
      this.getSearchArea();
    },
    moreSearch() {
      this.getSearchArea();
    },
    time() {
      this.getSearchArea();
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
    departmentId: function() {
      return this.$store.state.deptId;
    },
    tableHeight() {
      return this.collapse ?
      400: window.innerHeight - 295;
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
  components: {
    DialogIsCheck,
    DialogTaskDetail
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
    getSearchArea() {
      this.$nextTick(() => {
        this.searchHeight = this.$refs.searchArea.clientHeight;
      });
    },
    pop: function(val, arr) {
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
      console.log(redata);
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
      let keyword = this.keyword;
      this.init(keyword);
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
      this.collapse = !this.collapse;
      this.moreSearch = !this.moreSearch;



    },
    //详情
    doDetail(index, row) {
      this.reqObj = row;
      this.showTaskDetail = true;
    },
    //选择事件
    select(val) {},
    //核验弹窗
    doCheck(index, row) {
      this.check = row;
      this.showTaskCheck = true;
    },
    //重新汇聚
    doConverge(index, row) {
      let _self = this;
      _self.loading = true;

      this.$ajax
        .put(httpUrl + "manager/taskOperate/converge/" + row.taskInfoId)
        .then(function(res) {
          _self.loading = false;
          if (res.data.success) {
            _self.doMsg(
              "汇聚任务已经生成，任务将在接下来的周期执行",
              "success"
            );
            _self.init();
          } else {
            _self.doMsg(res.data.message, "error");
          }
        });
    },
    //处理完毕
    doDel(index, row) {
      let _self = this;
      _self.loading = true;
      this.$ajax
        .put(httpUrl + "manager/taskOperate/delete/" + row.taskInfoId)
        .then(function(res) {
          _self.loading = false;
          if (res.data.success) {
            // 调用/DACM/接口
            _self.$ajax.delete(
              window.ENV.API_DACM + deleteTask + row.taskInfoId
            );
            _self.doMsg("处理成功", "success");
            _self.init();
          } else {
            _self.doMsg(res.data.message, "error");
          }
        });
    },
    //运行、暂停
    doRun(index, row) {
      let _self = this;
      let url = "";
      _self.loading = true;
      if (row.status == 0 || row.status == 2 || row.status == 3) {
        //执行运行
        url = httpUrl + "manager/taskOperate/start/" + row.taskInfoId;
        this.$ajax.put(url).then(function(res) {
          _self.loading = false;
          if (res.data.success) {
            _self.doMsg("运行成功", "success");
            _self.init();
          } else {
            _self.doMsg(res.data.message, "error");
          }
        });
      } else if (row.status == 1 || row.status == 5) {
        //执行暂停
        url = httpUrl + "manager/taskOperate/pause/" + row.taskInfoId;
        this.$ajax.put(url).then(function(res) {
          _self.loading = false;
          if (res.data.code == "0000") {
            _self.doMsg("暂停成功", "success");
            row.status = 2;
          } else {
            _self.doMsg(res.data.message, "error");
          }
        });
      }
    },
    //分页切换
    handleCurrentChange() {
      let keyword = this.keyword;
      this.init(keyword);
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
    init(keyword) {
      var _self = this;
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
        departmentId: _self.departmentId.join(",")
      };
      this.$ajax
        .get(httpUrl + "manager/task/show/0", {
          params: tableParams
        })
        .then(function(res) {
          if (res.data.code == 200) {
            _self.tableData = res.data.data.result;
            _self.tableData.forEach(res => {
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
            tableZC = _self.tableData[0];
            _self.mainTableDataTotal = res.data.data.total * 1;
            _self.loading = false;
            _self.$nextTick(function() {
              let row = [];
              let row1 = Object.keys(_self.allSecectData);
              for (let i = 0; i < row1.length; i++) {
                for (let j = 0; j < _self.allSecectData[row1[i]].length; j++) {
                  row.push(_self.allSecectData[row1[i]][j]);
                }
              }
              for (let a = 0; a < row.length; a++) {
                for (let z = 0; z < _self.tableData.length; z++) {
                  if (row[a].taskInfoId == _self.tableData[z].taskInfoId) {
                    row[a].status = _self.tableData[z].status;
                    _self.$refs.multipleTable.toggleRowSelection(
                      _self.tableData[z],
                      true
                    );
                  }
                }
              }
            });
          }
        })
        .catch(function(err) {});
    },
    //选中事件
    handleSelectionChange(val) {
      this.selectionChangeData = val;
    },
    //手动选择事件
    select(selection, row) {
      this.allSecectData[this.pageNum] = selection;
    },
    //手动全选事件
    selectAll(selection) {
      this.allSecectData[this.pageNum] = selection;
    },
    //批量操作
    doMore(url, a) {
      let tableParams = [];
      let _self = this;
      let row = [];
      let row1 = Object.keys(this.allSecectData);
      if (row1.length == 0) {
        this.$alert("请选择相应的任务！", "提示", {
          height: 50,
          dangerouslyUseHTMLString: true
        });
        return;
      }
      for (let i = 0; i < row1.length; i++) {
        if (this.allSecectData[row1[i]].length == 0 || row1.length == 0) {
          this.$alert("请选择相应的任务！", "提示", {
            dangerouslyUseHTMLString: true
          });
          return;
        }
      }

      for (let i = 0; i < row1.length; i++) {
        for (let j = 0; j < this.allSecectData[row1[i]].length; j++) {
          row.push(this.allSecectData[row1[i]][j]);
        }
      }

      tableParams = [];
      for (let i = 0; i < row.length; i++) {
        tableParams.push(row[i].taskInfoId);
      }

      let params = {
        taskInfoIds: tableParams.join(",")
      };

      let rowNew = Array.from(row);
      if (a == 1) {
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
          _self.loading = true;
          _self.tips = "批量汇聚中...";
          _self
            .$ajax({
              url: httpUrl + url,
              method: "POST",
              data: {},
              params: params
            })
            .then(function(res) {
              _self.loading = false;
              _self.tips = "";
              if (res.data.success) {
                let successHtml = "";
                let errorHtml = "";
                for (let i = 0; i < res.data.data.successList.length; i++) {
                  successHtml +=
                    i + 1 + "." + res.data.data.successList[i] + "</br>";
                }
                for (let i = 0; i < res.data.data.errorList.length; i++) {
                  errorHtml +=
                    i + 1 + "." + res.data.data.errorList[i] + "</br>";
                }
                _self.$alert(
                  "操作成功！重新汇聚成功的任务如下：</br>" +
                    successHtml +
                    "重新汇聚失败的任务如下：</br>" +
                    errorHtml,
                  "重新汇聚",
                  {
                    dangerouslyUseHTMLString: true
                  }
                );
                _self.init();
              } else {
                _self.$alert("重新汇聚失败", "重新汇聚", {
                  dangerouslyUseHTMLString: true
                });
              }
            })
            .catch(() => {});
        } else {
          let errerHtml = "";
          for (let j = 0; j < errorData.length; j++) {
            errerHtml +=
              j +
              1 +
              "." +
              errorData[j].taskName +
              "：" +
              errorData[j].taskInfoId +
              "</br>";
          }
          this.$alert(
            "重新汇聚时，以下任务不能被汇聚,请重新选择：</br>" + errerHtml,
            "重新汇聚",
            {
              dangerouslyUseHTMLString: true
            }
          );
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
        if (errorData.length == 0) {
          _self.loading = true;
          _self.tips = "批量启动中...";
          _self
            .$ajax({
              url: httpUrl + url,
              method: "POST",
              data: {},
              params: params
            })
            .then(function(res) {
              _self.loading = false;
              _self.tips = "";
              if (res.data.success) {
                let successHtml = "";
                let errorHtml = "";
                for (let i = 0; i < res.data.data.successList.length; i++) {
                  successHtml +=
                    i + 1 + "." + res.data.data.successList[i] + "</br>";
                }
                for (let i = 0; i < res.data.data.errorList.length; i++) {
                  errorHtml +=
                    i + 1 + "." + res.data.data.errorList[i] + "</br>";
                }
                _self.$alert(
                  "操作成功！批量启动成功的任务如下：</br>" +
                    successHtml +
                    "批量启动失败的任务如下：</br>" +
                    errorHtml,
                  "批量启动",
                  {
                    dangerouslyUseHTMLString: true
                  }
                );
                _self.init();
              } else {
                _self.$alert("批量启动失败", "批量启动", {
                  dangerouslyUseHTMLString: true
                });
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          let errerHtml = "";
          for (let j = 0; j < errorData.length; j++) {
            errerHtml +=
              j +
              1 +
              "." +
              errorData[j].taskName +
              "：" +
              errorData[j].taskInfoId +
              "</br>";
          }
          this.$alert(
            "批量启动时，以下任务不能被启动,请重新选择：</br>" + errerHtml,
            "批量启动",
            {
              dangerouslyUseHTMLString: true
            }
          );
        }
      } else if (a == 3) {
        //批量停止
        let errorData = [];
        for (let i = 0; i < rowNew.length; i++) {
          if (rowNew[i].status != 1) {
            errorData.push(rowNew[i]);
          }
        }
        if (errorData.length == 0) {
          _self.loading = true;
          _self.tips = "批量停止中...";
          _self
            .$ajax({
              url: httpUrl + url,
              method: "POST",
              data: {},
              params: params
            })
            .then(function(res) {
              _self.loading = false;
              _self.tips = "";
              if (res.data.success) {
                let successHtml = "";
                let errorHtml = "";
                for (let i = 0; i < res.data.data.successList.length; i++) {
                  successHtml +=
                    i + 1 + "." + res.data.data.successList[i] + "</br>";
                }
                for (let i = 0; i < res.data.data.errorList.length; i++) {
                  errorHtml +=
                    i + 1 + "." + res.data.data.errorList[i] + "</br>";
                }
                _self.$alert(
                  "操作成功！批量停止成功的任务如下：</br>" +
                    successHtml +
                    "批量停止失败的任务如下：</br>" +
                    errorHtml,
                  "批量停止",
                  {
                    dangerouslyUseHTMLString: true
                  }
                );
                _self.init();
              } else {
                _self.$alert("批量停止失败", "批量停止", {
                  dangerouslyUseHTMLString: true
                });
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          let errerHtml = "";
          for (let j = 0; j < errorData.length; j++) {
            errerHtml +=
              j +
              1 +
              "." +
              errorData[j].taskName +
              "：" +
              errorData[j].taskInfoId +
              "</br>";
          }
          this.$alert(
            "批量停止时，以下任务不能被停止,请重新选择：</br>" + errerHtml,
            "提示",
            {
              dangerouslyUseHTMLString: true
            }
          );
        }
      }
    }
  }
};
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
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

.timeSearch {
  float: left;
}
.el-checkbox {
  width: 95px;
}
.count-operate {
  margin: 20px 0;
  text-align: right;
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
.el-form-item {
  margin-bottom: 10px;
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
.searchDiv {
  span {
    display: inline-block;
    font-size: 15px;
    cursor: pointer;
    width: 100px;
    height: 30px;
    border: 1px solid #C8CFD5;
    border-left: none;
    line-height: 30px;
    text-align: center;
    position: relative;
  }
}
.dataSearch {
  display: inline-block;
  width: 210px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #C8CFD5;
  input {
    margin-left: 7px;
    width: 180px;
    background-color: transparent;
    border: 0 none;
    outline: 0 none;
  }
  i {
    text-indent: 5px;
  }
  ::-webkit-input-placeholder {
    color: #999;
  } ///* 使用webkit内核的浏览器 */
  :-moz-placeholder {
    color: #999;
  } ///* Firefox版本4-18 */
  ::-moz-placeholder {
    color: #999;
  } ///* Firefox版本19+ */
  :-ms-input-placeholder {
    color: #999;
  } ///* IE浏览器 */
}
.doCearch {
  display: inline-block;
  margin-left: 15px;
  margin-top: 0;
  position: relative;
  line-height: 12px;
}
.right-tools {
  float: right;
  margin-left: 5px;
  a {
    font-size: 24px;
    :hover {
      opacity: 0.5;
    }
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
  }
}
</style>


