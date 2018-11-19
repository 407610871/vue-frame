<template>
  <div v-loading="loading">
    <!-- 搜索栏 -->
    <div class="count-container">

      <!-- 查询按钮 -->
      <div class="searchDiv">
        <div class="dataSearch">
          <i class="el-icon-search"></i>
          <input type="text" v-model="keyword" placeholder="请输入查询条件" />
        </div>
        <span @click="doMoreSearch">高级搜索 <i :class="!moreSearch?'el-icon-caret-bottom':'el-icon-caret-top'"></i> </span>
        <el-button type="primary" class="doCearch" @click="search">查询</el-button>

      </div>

      <el-form ref="form" label-width="110px" class="formGroup" v-if="moreSearch">
        <el-form-item label="已选查询条件:">
          <div v-show="taskPeriodType.length>0" class="selected-task-type" style="display: inline-block;">
            <span>任务类型:</span>
            <span v-show="taskPeriodType.indexOf('0')>-1">实时<span @click="pop('0',taskPeriodType);"><i class="el-icon-error"></i></span></span>
            <span v-show="taskPeriodType.indexOf('1')>-1">周期间隔增量<span @click="pop('1',taskPeriodType);"><i class="el-icon-error"></i></span></span>
            <span v-show="taskPeriodType.indexOf('2')>-1">周期定时增量<span @click="pop('2',taskPeriodType);"><i class="el-icon-error"></i></span></span>
            <span v-show="taskPeriodType.indexOf('3')>-1">一次性接入<span @click="pop('3',taskPeriodType);"><i class="el-icon-error"></i></span></span>
            <span v-show="taskPeriodType.indexOf('4')>-1">周期间隔全量;<span @click="pop('4',taskPeriodType);"><i class="el-icon-error"></i></span></span>
            <span v-show="taskPeriodType.indexOf('5')>-1">周期定时全量<span @click="pop('5',taskPeriodType);"><i class="el-icon-error"></i></span></span>
          </div>
          <div label="任务状态:" v-show="status.length>0" class="selected-task-type" style="display: inline-block;">
            <span>任务状态:</span>
            <span v-show="status.indexOf('0')>-1">新建<span @click="pop('0',status);"><i class="el-icon-error"></i></span></span>
            <span v-show="status.indexOf('1')>-1">运行<span @click="pop('1',status);"><i class="el-icon-error"></i></span></span>
            <span v-show="status.indexOf('2')>-1">暂停<span @click="pop('2',status);"><i class="el-icon-error"></i></span></span>
            <span v-show="status.indexOf('3')>-1">失败<span @click="pop('3',status);"><i class="el-icon-error"></i></span></span>
            <span v-show="status.indexOf('4')>-1">完成<span @click="pop('4',status);"><i class="el-icon-error"></i></span></span>
          </div>
        <div label="任务优先级:" v-show="priority.length>0" class="selected-task-type" style="display: inline-block;">
            <span>任务状态:</span>
            <span v-show="priority.indexOf('1')>-1">高<span @click="pop('1',priority);"><i class="el-icon-error"></i></span></span>
            <span v-show="priority.indexOf('2')>-1">中<span @click="pop('2',priority);"><i class="el-icon-error"></i></span></span>
            <span v-show="priority.indexOf('3')>-1">底<span @click="pop('3',priority);"><i class="el-icon-error"></i></span></span>
            
          </div>

          <div v-show="time!=null && time.length>0" class="selected-task-type">
            <span style="margin-right:10px;">任务开始时间:</span>
            <span>{{time==null?'':time[0]}} - {{time==null?'':time[1]}}<span @click="time=[]"><i class="el-icon-error"></i></span></span>
          </div>
        </el-form-item>
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
            <el-checkbox label="3" name="priority">底</el-checkbox>
           
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="任务开始时间:">
          <el-date-picker v-model="time" :picker-options="pickerOptions" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['12:00:00']">
          </el-date-picker>

        </el-form-item>
      </el-form>

    </div>
    <!-- 操作按钮 -->
    <div class="count-operate">
      <div>
        <el-button type="primary" @click="doMore('manager/taskOperate/batchConverge',1)">重新汇聚</el-button>
        <el-button type="primary" @click="doMore('manager/taskOperate/batchStart',2)">批量启动</el-button>
        <el-button type="primary" @click="doMore('manager/taskOperate/batchPause',3)">批量停止</el-button>
      </div>
    </div>

    <!-- 表格数据 -->
    <div class="mainTable zcTable">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :height="tableHeight" style="width: 100%" @select-all="selectAll" @select="select" @selection-change="handleSelectionChange">
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column fixed label="接入指示" width="100">
          <template slot-scope="scope">
            <i v-if="scope.row.networkStatus==0" class="indicate" style="backgroundColor:green" title="数据源连接正常"></i>
            <i v-else-if="scope.row.networkStatus==1" class="indicate" style="backgroundColor:yellow" title="数据源链接不稳定"></i>
            <i v-else-if="scope.row.networkStatus==2" class="indicate" style="backgroundColor:red" title="数据源不通"></i>

          </template>

        </el-table-column>
        <el-table-column prop="taskInfoId" fixed label="ID" width="100" :show-overflow-tooltip='true'></el-table-column>

        <el-table-column fixed label="任务名称" width="200" :show-overflow-tooltip='true' @click="showTaskDetail=true">
          <template slot-scope="scope">
            <el-button @click="doDetail(scope.$index, scope.row)">{{scope.row.taskName}}</el-button>
          </template>

        </el-table-column>
        <el-table-column prop="sourceDBName" label="接入源名称" width="200" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="dataTableName" label="接入对象" width="200" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="targetDBName" label="目标库" width="200" :show-overflow-tooltip='true'> </el-table-column>
        <el-table-column prop="targetTableName" label="目标表" width="200" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="startTime" label="任务开始时间" width="140" :show-overflow-tooltip='true'> </el-table-column>
        <el-table-column prop="endTime" label="任务结束时间" width="140" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column label="任务类型" width="100">
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
          </template>
        </el-table-column>
        <el-table-column prop="joinDataNum" label="已接入数据量" :show-overflow-tooltip='true' width="150"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==0||scope.row.status==2" type="text" size="small" @click="doRun(scope.$index, scope.row)">运行</el-button>
            <!-- <el-button v-if="scope.row.status==3" type="text" size="small" @click="doRun(scope.$index, scope.row)">重启</el-button> -->

            <el-button v-if="scope.row.status==1" type="text" size="small" @click="doRun(scope.$index, scope.row)">暂停</el-button>
            <el-button v-if="scope.row.status!=1" type="text" size="small" @click="doDel(scope.$index, scope.row)">删除</el-button>
            <el-button  v-if="scope.row.status==1||scope.row.status==2||scope.row.status==4" type="text" size="small" @click="doCheck(scope.$index, scope.row)">数据核验</el-button>
            <el-button v-if="scope.row.status==2||scope.row.status==4||scope.row.status==3" type="text" size="small" @click="doConverge(scope.$index, scope.row)">重新汇聚</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-footer>
      <div class="enc-pagination">
        <el-pagination style="float:right; margin:10px;" @current-change="handleCurrentChange" background :current-page.sync="pageNum" :page-size="pageSize" :total="mainTableDataTotal" layout="prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-footer>

    <!-- 任务详情 -->
    <dialogTaskDetail :reqObj="reqObj" v-if="showTaskDetail" v-on:closeDia="showTaskDetail=false"></dialogTaskDetail>

    <DialogIsCheck v-if="showTaskCheck" v-on:closeDiaChk="showTaskCheck=false" :msgCheck="check"></DialogIsCheck>
  </div>
</template>
<script>
import DialogIsCheck from "./DialogIsCheck";
import DialogTaskDetail from "./DialogTaskDetail";
//盐城环境地址
const httpUrl = window.ENV.API_DOWN + "/";
//本地调试地址
// const httpUrl="http://10.19.160.67:8081/DOMN/";
// export const httpUrl="http://10.19.160.67:8081/DOMN/";

export default {
  name: "task",
  data() {
    return {
      loading: false,
      taskPeriodType: [], //任务类型
      status: [], //任务状态
      time: [],
      check: "",
      priority: [],
      pageNum: 1,
      pageSize: 10,
      showTaskDetail: false,
      showTaskCheck: false,
      moreSearch: false,
      allSecectData: {},
      keyword: "",
      isDeleted: 0,
      tableData: [],
      selectionChangeData: [],
      mainTableDataTotal: 0,
      reqObj: "",

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },

  watch: {
    //
    // taskPeriodType(newA, oldA) { this.init()},
    // status(newA, oldA) { init()},
    // time() {
    // }
    //监听树节点deptID,操作数据
    departmentId(newVal, oldVal) {
      //do something
      this.init("");
    }
  },
  computed: {
    departmentId: function() {
      return this.$store.state.deptId;

      // return 1;
    },
    tableHeight: function() {
      return !this.moreSearch
        ? window.innerHeight - 300
        : window.innerHeight - 511;
    }
  },
  created() {
    this.init(" ");
  },

  components: {
    DialogIsCheck,
    DialogTaskDetail
  },

  methods: {
    pop: function(val, arr) {
      if (arr.indexOf(val) > -1) {
        let ind = arr.indexOf(val);
        arr.splice(ind, 1);
      }
    },
    //查询按钮
    search() {
      let keyword = this.keyword;
      this.init(keyword);
    },
    //高级搜索
    doMoreSearch() {
      this.moreSearch = !this.moreSearch;
      this.taskPeriodType = [];
      this.status = [];
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
      this.$confirm(
        "重新汇聚完成之前，当前表的数据将会被全部删除，相应数据服务将终止，直到汇聚完成。 请确认！",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }
      )
        .then(() => {
          _self.loading = true;

          this.$ajax
            .put(httpUrl + "manager/taskOperate/converge/" + row.taskInfoId)
            .then(function(res) {
              _self.loading = false;
              if (res.data.success) {
                _self.doMsg("重新汇聚成功", "success");
              } else {
                _self.doMsg(res.data.message, "error");
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(() => {});
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
            _self.doMsg("处理成功", "success");
            _self.init();
          } else {
            _self.doMsg(res.data.message, "error");
          }
        })
        .catch(function(err) {
          console.log(err);
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
        this.$ajax
          .put(url)
          .then(function(res) {
            _self.loading = false;
            if (res.data.success) {
              _self.doMsg("运行成功", "success");
              row.status = 1;
            } else {
              _self.doMsg(res.data.message, "error");
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      } else if (row.status == 1) {
        //执行暂停
        url = httpUrl + "manager/taskOperate/pause/" + row.taskInfoId;
        this.$ajax
          .put(url)
          .then(function(res) {
            _self.loading = false;
            if (res.data.code == "0000") {
              _self.doMsg("暂停成功", "success");
              row.status = 2;
            } else {
              _self.doMsg(res.data.message, "error");
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    },
    //分页切换
    handleCurrentChange() {
      this.init();
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
        priority:this.priority.join(","),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskName: keyword,
        departmentId: _self.departmentId.join(",")
      };

      this.$ajax
        .get(httpUrl + "manager/task/show/0", {
          params: tableParams
        })
        .then(function(res) {
          if (res.data.code == 200) {
            _self.tableData = res.data.data.result;
            _self.mainTableDataTotal = res.data.data.total * 1;
            _self.loading = false;
            _self.$nextTick(function() {
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
                    this.$refs.multipleTable.toggleRowSelection(
                      this.tableData[z],
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
          dangerouslyUseHTMLString: true
        });
        return;
      }
      for (let i = 0; i < row1.length; i++) {
        for (let j = 0; j < this.allSecectData[row1[i]].length; j++) {
          row.push(this.allSecectData[row1[i]][j]);
        }
      }
      for (let i = 0; i < row.length; i++) {
        tableParams.push(row[i].taskInfoId);
      }

      let params = {
        taskInfoIds: tableParams.join(",")
      };
      if (a == 1) {
        //批量汇聚
        let errorData = [];
        for (let i = 0; i < row.length; i++) {
          if (row[i].status == 1||row[i].status == 0) {
            errorData.push(row[i]);
          }
        }
        if (errorData.length == 0) {
          _self
            .$confirm(
              "重新汇聚完成之前，当前表的数据将会被全部删除，相应数据服务将终止，直到汇聚完成。 请确认！",
              "重新汇聚",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info"
              }
            )
            .then(() => {
              _self.loading = true;
              _self
                .$ajax({
                  url: httpUrl + url,
                  method: "POST",
                  data: {},
                  params: params
                })
                .then(function(res) {
                  _self.loading = false;
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
                  } else {
                    this.$alert("重新汇聚失败", "重新汇聚", {
                      dangerouslyUseHTMLString: true
                    });
                  }
                })
                .catch(function(err) {
                  console.log(err);
                });
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
        for (let i = 0; i < row.length; i++) {
          if (row[i].status == 1 || row[i].status == 4|| row[i].status == 3) {
            errorData.push(row[i]);
          }
        }
        if (errorData.length == 0) {
          _self.loading = true;
          _self
            .$ajax({
              url: httpUrl + url,
              method: "POST",
              data: {},
              params: params
            })
            .then(function(res) {
              _self.loading = false;
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
                this.$alert("批量启动失败", "批量启动", {
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
        for (let i = 0; i < row.length; i++) {
          if (row[i].status == 1) {
            errorData.push(row[i]);
          }
        }
        if (errorData.length == 0) {
          _self.loading = true;
          _self
            .$ajax({
              url: httpUrl + url,
              method: "POST",
              data: {},
              params: params
            })
            .then(function(res) {
              _self.loading = false;
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
                this.$alert("批量停止失败", "批量停止", {
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
    },

    //批量汇聚
    // doConverge() {
    //   let tableParams = [];
    //   let _self = this;
    //   let row = [];

    //   let row1 = Object.keys(this.allSecectData);
    //   for (let i = 0; i < row1.length; i++) {
    //     for (let j = 0; j < this.allSecectData[row1[i]].length; j++) {
    //       row.push(this.allSecectData[row1[i]][j]);
    //     }
    //   }
    //   for (let i = 0; i < row.length; i++) {
    //     tableParams.push(row[i].taskInfoId);
    //   }

    //   let params = {
    //     taskInfoIds: tableParams.join(",")
    //   };

    // },

    //弹框信息提示1
    doMessage(message) {
      this.$alert(message, "提示", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    }
  }
};
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.selected-task-type span {
  margin-right: 10px;
  color: #425365;
}
.selected-task-type span:first-child {
  font-weight: 600;
}
.selected-task-type span i {
  margin-left: 3px;
}
.count-container {
  // width: 95%;
  // height: 150px;
  background-color: #fff;
  border-bottom: 1px solid #d9d9d9;
  margin: 0 auto;
  padding-top: 20px;
}

.formGroup {
  // width: 60%;
  // max-width: 680px;
  // float: left;
}
.timeSearch {
  // width: 40%;
  float: left;
  // margin-top: -5px;
}
.el-checkbox {
  width: 95px;
}
.count-operate {
  width: 95%;
  height: 50px;
  margin: 0 auto;
  div {
    width: 330px;
    float: right;
    padding-top: 10px;
  }
}
.indicate {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  // background-color: red;
}
.enc-pagination {
  float: right;
}

.mainTable {
  width: 95%;
  margin: 0 auto;
}
.dataSearch {
  display: inline-block;
  width: 210px;
  height: 30px;
  border: 1px solid #c9cdd0;
  input {
    margin-left: 5px;
    width: 180px;
    background-color: transparent;
    border: 0 none;
    outline: 0 none;
    height: 28px;
    font-size: 14px;
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
.searchDiv {
  margin-left: 2.5%;
  margin-bottom: 20px;
  span {
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    width: 100px;
    height: 30px;
    border: 1px solid #c9cdd0;
    border-left: none;
    line-height: 30px;
    text-align: center;
    position: relative;
    top: 1px;
  }
}
.doCearch {
  display: inline-block;
  height: 28px;
  margin-left: 15px;
  margin-top: 0;
  position: relative;
  top: 2px;
  line-height: 10px;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
<style>
.el-picker-panel__icon-btn {
  color: #303133 !important;
}
.zcTable .el-table__fixed {
  background-color: #fff;
}
.zcTable .el-table__body-wrapper {
  background-color: #fff;
}
</style>


