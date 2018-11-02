<template>
    <div v-loading="loading">
      <!-- 搜索栏 -->
       <div class="count-container"  >
        <el-form ref="form"  label-width="80px" class="formGroup">
          <el-form-item label="任务类型:" >
              <el-checkbox-group v-model="taskPeriodType">
                  <el-checkbox label="0"   name="taskPeriodType">实时任务</el-checkbox>
                  <el-checkbox label="1" name="taskPeriodType">一次性任务</el-checkbox>
                  <el-checkbox label="2" name="taskPeriodType">周期任务</el-checkbox>
                  <el-checkbox label="3" name="taskPeriodType">全量任务</el-checkbox>
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
          </el-form>
          <div class="timeSearch">
            <span class="el-form-item__label">任务时间:</span>
                <el-date-picker
                  v-model="time"
                   :picker-options="pickerOptions"
                  type="datetimerange"
                  start-placeholder="创建时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  :default-time="['12:00:00']">
               </el-date-picker>
          </div>
  
         
         
       
      </div>
       <!-- 操作按钮 -->
       <div class="count-operate">
         <div>
            <el-button type="primary">重新汇聚</el-button>
            <el-button type="primary">批量启动</el-button>
            <el-button type="primary">批量停止</el-button>
         </div>
       </div>

       <!-- 表格数据 -->
<div class="mainTable">
<el-table ref="multipleTable" :data="tableData" tooltip-effect="light"  :height="tableHeight" style="width: 100%"  @selection-change="handleSelectionChange" >
            <el-table-column type="selection" width="55"></el-table-column>
             <el-table-column label="接入指示" width="100"> 
                <template slot-scope="scope">
                  <i v-if="scope.row.isPeriod==0" class="indicate" style="backgroundColor:green" title="成功"></i>
                   <i v-else-if="scope.row.isPeriod==1" class="indicate" style="backgroundColor:yellow" title="主机网络不通"></i>
                    <i v-else-if="scope.row.isPeriod==2" class="indicate" style="backgroundColor:yellow" title="数据库不通"></i>
                    <i v-else-if="scope.row.isPeriod==3" class="indicate" style="backgroundColor:red" title="主机网络和数据库都不通"></i>
                </template>

             </el-table-column>
            <el-table-column  label="任务名称" width="200" :show-overflow-tooltip='true' @click="showTaskDetail=true">
<template slot-scope="scope">
                 <el-button @click="doDetail(scope.$index, scope.row)">{{scope.row.taskName}}</el-button>
                </template>

            </el-table-column>
            <el-table-column prop="sourceDBName" label="接入源名称"  width="200" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="dataTableName" label="接入对象" width="200"  :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="targetDBName" label="目标库" width="200"  :show-overflow-tooltip='true'> </el-table-column>
            <el-table-column prop="targetTableName" label="目标表" width="200"  :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="startTime" label="任务开始时间" width="140" :show-overflow-tooltip='true'> </el-table-column>
            <el-table-column prop="endTime" label="任务结束时间" width="140" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column  label="任务类型" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.isPeriod==0">实时性任务</span>
                  <span v-if="scope.row.isPeriod==1">一次性任务</span>
                  <span v-else-if="scope.row.isPeriod==2">周期任务</span>
                  <span v-else-if="scope.row.isPeriod==3">全量任务</span>
                </template>
            </el-table-column>
            <el-table-column  label="当前状态" width="100">
                <template slot-scope="scope" >
                  <span v-if="scope.row.status==0">新建</span>
                  <span v-if="scope.row.status==1">运行</span>
                  <span v-else-if="scope.row.status==2">暂停</span>
                  <span v-else-if="scope.row.status==3" style="color:red">失败</span>
                  <span v-else-if="scope.row.status==4">完成</span>
                </template>
            </el-table-column>
            <el-table-column  label="已接入数据量" :show-overflow-tooltip='true' width="150"></el-table-column>
             <el-table-column  label="操作"  width="200">
                <template slot-scope="scope">
                  <el-button  v-if="scope.row.status==0||scope.row.status==3||scope.row.status==2"  type="text" size="small" @click="doRun(scope.$index, scope.row)">运行</el-button>
                  <el-button  v-else-if="scope.row.status==1"  type="text" size="small" @click="doRun(scope.$index, scope.row)">暂停</el-button>
                  <el-button  v-else-if="scope.row.status==4"  type="text" size="small" @click="doDel(scope.$index, scope.row)">处理完毕</el-button>
                 <el-button type="text" size="small" >数据核验</el-button>
                 <el-button type="text" size="small">重新汇聚</el-button>
                </template>
             </el-table-column>
  </el-table>
</div>
      


<!-- 分页 -->
 <el-footer>
        <div class="enc-pagination">
          <el-pagination  style="float:right; margin:10px;"
           @current-change="handleCurrentChange"
            background
            :current-page.sync="pageNum"
            :page-size="pageSize"
            :total="mainTableDataTotal"
            layout="prev, pager, next, jumper"
            >
          </el-pagination>
        </div>
      </el-footer>
      
<!-- 任务详情 -->
      <dialogTaskDetail  :reqObj="reqObj" v-if="showTaskDetail" v-on:closeDia="showTaskDetail=false"></dialogTaskDetail>
    </div>
</template>
<script>
import { DialogIsCheck } from "./DialogIsCheck";
import DialogTaskDetail from "./DialogTaskDetail";
export default {
  data() {
    return {
      loading: false,
      taskPeriodType: [], //任务类型
      status: [], //任务状态
      time: [],
      pageNum: 1,
      pageSize: 10,
      departmentId: 1,
      showTaskDetail: false,
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
  },
  computed: {
    tableHeight: function() {
      return window.innerHeight - 390;
    }
  },
  created() {
    this.init(" ");
    this.$root.eventHub.$on("search", keyword => {
      this.init(keyword);
    });
  },

  components: {
    DialogIsCheck,
    DialogTaskDetail
  },
  methods: {
    //详情
    doDetail(index, row) {
      this.reqObj = row;
      this.showTaskDetail = true;
    },
    //运行
    doRun(index, row) {
      let _self = this;
      let url = "";
      _self.loading=true;
      if (row.status == 0 || row.status == 2 || row.status == 3) {
        //执行运行
        url =
          "http://10.19.160.67:8081/DEMO/manager/taskOperate/start/" +
          row.taskInfoId;
        this.$ajax
          .put(url)
          .then(function(res) {
            console.log(res);
             _self.loading=false;
            if (res.data.success) {
              _self.doMsg("运行成功", "success");
              row.status= 1;
            } else {
              _self.doMsg(res.data.message, "error");
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      } else if (row.status == 1) {
        //执行暂停
        url =
          "http://10.19.160.67:8081/DEMO/manager/taskOperate/pause/" +
          row.taskInfoId;
        this.$ajax
          .put(url)
          .then(function(res) {
            console.log(res);
             _self.loading=false;
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
    doCheck() {
      this.$nextTick(() => {
        this.$refs.isCheck.openDialog();
      });
    },
    //分页切换
    handleCurrentChange() {
      this.init();
    },

    doMsg(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type,
        duration: 1500
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
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskName: keyword
      };

      this.$ajax
        .get(
          "http://10.19.160.67:8081/DEMO/manager/task/show/" +
            _self.departmentId +
            "/0",
          {
            params: tableParams
          }
        )
        .then(function(res) {
          if (res.data.code == 200) {
            _self.tableData = res.data.data.result;
            _self.mainTableDataTotal = res.data.data.total * 1;
            _self.loading = false;
          }
        })
        .catch(function(err) {});
    },
    //选中事件
    handleSelectionChange(val) {
      this.selectionChangeData = val;
    }
  }
};
</script>
<style scoped lang="scss">
.count-container {
  width: 95%;
  height: 150px;
  background-color: #fff;
  border-bottom: 1px solid #d9d9d9;
  margin: 0 auto;
  padding-top: 20px;
}

.formGroup {
  width: 60%;
  max-width: 680px;
  float: left;
}
.timeSearch {
  width: 40%;
  float: left;
  margin-top: -5px;
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
</style>
<style>
.el-picker-panel__icon-btn {
  color: #303133 !important;
}
</style>


