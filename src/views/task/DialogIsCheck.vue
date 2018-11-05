<template>
<div class="taskMDialog" style="padding-bottom:15px;">
<el-dialog width="60%" :title="title"  top="25px" :visible.sync="showInnerDialog" class="check-data-dialog" @closed="closeDiaChk">
  <div class="title-gra">
    <span class="grab gra-l"></span>
    <span class="grab gra-r"></span>
  </div>
  <div  v-loading="loading" 
     element-loading-text="核验中，请稍等..."
     element-loading-spinner="el-icon-loading"
     element-loading-background="rgba(255, 251, 251, 0.77)">
      <div class="dialig_table"  id="dialig_table"  >
      </div>
      <div class="checkData">
        校验设置：
        <el-radio v-model="radio" label="0" @change="checkChange" style="color:rgb(96, 98, 102);">全量核验</el-radio>
        <el-radio v-model="radio" label="1" @change="checkChange" style="color:rgb(96, 98, 102);">根据时间范围核验</el-radio>
        <el-button type="" size="small" class="checkBtn" @click="doCheck" v-model="status" >{{status}}</el-button>
        <div class="" >
          <div class="range">
              <span style="color:rgb(96, 98, 102);">核验误差范围:&nbsp;&nbsp;</span>      
              <el-input-number v-model="range"  controls-position="right"  size="small" :min="0" :max="100" :step="1"></el-input-number>%
          </div>
          <div class="time"  v-show="timeCheck">
            <el-date-picker
              size="small"
                :picker-options="pickerOptions"
              v-model="startTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>  
        </div>
      </div>
<div class="contanst">
  <div class="contanst_source">
    <ul>
      <li>源库：</li>
      <li>源端表：</li>
      <li>源端数据量：</li>
    </ul>
    <ul>
      <li :title="resData.source_library">{{resData.source_library||"无"}}</li>
      <li :title="resData.source_tableName">{{resData.source_tableName||"无"}}</li>
      <li :title="resData.source_tableNum">{{resData.source_tableNum||"无"}}</li>
    </ul>
  </div>

  <div class="contanst_vs">
    vs
  </div>
  <div class="contanst_goal">
    <ul>
      <li>目标库</li>
      <li>目标表：</li>
      <li>平台数据量：</li>
    </ul>
    <ul>
      <li :title="resData.target_library">{{resData.target_library||"无"}}</li>
      <li :title="resData.target_tableName">{{resData.target_tableName||"无"}}</li>
      <li :title="resData.target_tableNum">{{resData.target_tableNum||"无"}}</li>
    </ul>
  </div>
</div>

<div class="checkResult">
  <div class="checkResultData">
    <ul >
      <li>核验结果：</li>
      <li>数据量差值：</li>
    </ul>
    <ul>
      <li class="resultIcon"> 
        <span class="yes" v-if="this.resData.testresults_result==0"></span>        
        <span class="wrong" v-else-if="this.resData.testresults_result==1"></span>
        <span v-else-if="this.resData.testresults_result==null" style="color:#606266">无</span>
      </li>
       <li>{{resData.testresults_dvalue||"无"}}</li>
    </ul>
  </div>
  <div class="checkResultData">
    <ul>
      <li>纠错：</li>
        <li><a @click="doDetail">查看日志</a></li>
    </ul>
    <ul>
      <li class="manual_check_result"> 
        <el-radio  v-if="this.resData.testresults_manual_check_result==='0'"  >合格</el-radio>
        <el-radio v-else-if="this.resData.testresults_manual_check_result==='1'"  >不合格</el-radio>
        <span v-else-if="this.resData.testresults_manual_check_result==null" style="color:#606266">无</span>
      </li>
      <li style="opacity:0">h</li>
    </ul>
 </div>
</div>


  <div class="checkDetail" style="height:261px;" v-loading="loading2" >
    <textarea name="" id="" disabled="disabled" v-show="textShow" >{{loginfo}}</textarea>
  </div>

  <h5>核验历史记录：</h5>
  <el-table :data="resDataHistory" class="check-history-table">
    <el-table-column
      prop="accessCheckTime"
      label="核验时间">
    </el-table-column>
    <el-table-column
      label="核验方式">
      <template slot-scope="scope">
        <span v-if="scope.row.config_key == '0'">全量核验</span>
        <span v-if="scope.row.config_key == '1'">时间范围</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="config_range"
      label="核验误差"
      width="100">
    </el-table-column>
    <el-table-column
      prop="testresults_manual_check_result"
      label="核验结果"
      width="100">
    </el-table-column>
    <el-table-column
      label="核验报告"
      width="100">
      <template slot-scope="scope">
        <a :href='baseUrl+"/ccheckData/downloadCheckDataById?browser=fox&accessName=ww&id="+scope.row.id'>导出</a>
      </template>
    </el-table-column>
  </el-table>
</div>
</el-dialog>
</div>
</template>

<script>
const baseUrl = 'http://10.19.160.59:8088/demo';
export default {
  name: "check",
  beforeCreate() {
    window.dialogIsCheck = this;
  },
  props: ["msgCheck"],
  created() {
    this.init();
  },
  data: function() {
    return {
      baseUrl:baseUrl,
      showInnerDialog: true,
      dialogVisible: false,
      diaTitle: "",
      radio: "0",
      dialogWidth: "1060px",
      startTime: [],
      result: "",
      range: 0,
      status: "开始核验",
      timeCheck: false,
      resData: {},
      resDataHistory:[],
      loginfo: "",
      loading: false,
      timer: null,
      textShow: false,
      loading2: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      }
    };
  },
  computed:{
    title(){
      return `表 ${this.msgCheck.dataTableName}  数据核验`;
    },
  },
  methods: {
    closeDiaChk(){
      this.$emit('closeDiaChk',);
    },
    setTimer: function() {
      this.timer = setTimeout(() => {
        // this.init();
      }, 1000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
    openDialog() {
      this.dialogVisible = true;
      // this.diaTitle = `表 ${this.msgCheck.dataTableName}  数据核验`;
      // this.init();
    },
    init() {
      let that = this;
      this.$ajax.get(baseUrl+'/ccheckData/tableNum',{
        params:{
          taskId:that.msgCheck.taskInfoId
          //taskId:92066
        }
      }).then(res => {
        // if (res.result == "false" || res.message == "还未核验暂无数据,请核验") {
        //   this.$alert(res.message, "核验结果", {
        //     confirmButtonText: "确定"
        //   });
        // }
        if (!this.dialogVisible) {
          //return;
        }
        //this.resData = res.datas;
       this.resData = res.data;
        if (res.data.status == "1") {
          this.textShow = false;

          window.clearInterval(this.timer);
          this.timer = null;
          this.loading = false;
          this.status = "开始核验";
          this.radio = res.data.config_key;
          this.radio == 1 ? (this.timeCheck = true) : (this.timeCheck = false);

          if (res.data.config_key == 1) {
            this.startTime = [
              res.data.config_startTime,
              res.data.config_endTime
            ];
          } else {
            this.startTime = [];
          }

          this.range = res.data.config_range;
          //  let loadingInstance = Loading.service({text:"核验中，请稍等...",target:document.getElementsByName("el-dialog")});
        } else if (res.data.status == "0") {
          this.loading = true;
          this.setTimer();
          this.status = "核验中";
        }
        // this.liData = res.data.result;
      });
      //核验历史记录
      this.$ajax.get(baseUrl+'/ccheckData/tableNumAllByTaskId',{
        params:{
          taskId:that.msgCheck.taskInfoId
         // taskId:92066
        }
      }).then(res => {
        if(res.data.success){
          this.resDataHistory = res.data.data;
        }
      });
    },
    checkChange() {
      this.radio == 1 ? (this.timeCheck = true) : (this.timeCheck = false);
    },
    closeDialog() {
      this.radio = "0";
      this.startTime = [];
      this.timeCheck = false;
      this.loginfo = "";
      this.range = 0;
      window.clearInterval(this.timer);
      this.resData = {};
      this.textShow = false;
    },
    // 开始核验按钮
    doCheck() {
      if (this.radio == "0") {
        this.startTime = ["",""];
      } else if (this.radio == "1" && this.startTime == null) {
        this.$alert("请填写开始与结束时间", "核验", {
          confirmButtonText: "确定"
        });
        return;
      } else if (this.radio == "1" && this.startTime.length == 0) {
        this.$alert("请填写开始与结束时间", "核验", {
          confirmButtonText: "确定"
        });
        return;
      }

      this.$ajax.get(baseUrl+`/ccheckData/tableCheck`,{
        params: {
          taskId: this.msgCheck.taskInfoId,
         //taskId:92066,
          key: this.radio,
          range: this.range,
          startTime: this.startTime[0],
          endTime: this.startTime[1]
        }
      }).then(res => {
        if (res.data.result) {
          this.$alert(res.data.message, "核验结果", {
            confirmButtonText: "确定",
            callback: action => {
              // this.init();
            }
          });
        } else {
          this.$alert("核验请求失败！", "核验结果", {
            confirmButtonText: "确定"
          });
        }
      });
    },
    //查看日志按钮
    doDetail() {
      this.loading2 = true;
      let that = this;
      this.$ajax.get(baseUrl+'/ccheckData/checkLog',{
        params:{
          id:that.resData.id
        }
      }).then(res => {
        this.loading2 = false;

        if (res.result == "false") {
          this.textShow = false;

          this.$alert("查看日志失败", "查看日志", {
            confirmButtonText: "确定"
          });
        } else {
          this.textShow = true;

          let result = res.data.testresults_result == 0 ? "成功" : "失败";
          this.loginfo = `源库：${res.data.source_library}\n
源表：${res.data.source_tableName}\n
执行结果：${res.data.source_tableNum}\n
数据核验查询语句：${res.data.source_sql}\n
\n
目标库：${res.data.target_library}\n
目标表：${res.data.target_tableName}\n
执行结果：${res.data.target_tableNum}\n
数据核验查询语句：${res.data.target_sql}\n
\n
核验结果:${result}\n
核验差值:${res.data.testresults_dvalue}\n
`;
        }
      });
    }
  },
  components: {}
};
</script>

<style  lang="scss" scoped>
.time {
  display: inline-block;
  margin-left: 50px;
  margin-top: 15px;
}
.range {
  display: inline-block;
  margin-top: 15px;
}
.checkData {
  border-bottom: 1px solid #2f6ac5;
  height: 85px;
}
.checkBtn {
  color: white !important;
  background-color: #2f6ac5 !important;
  border: none !important;
  position: absolute;
  right: 5%;
  span {
    color: white !important;
  }
}
.contanst {
  font-size: 14px;
  border-bottom: 1px solid #2f6ac5;
  padding-bottom: 20px;
}
.contanst_source {
  width: calc(50%-75px);
  display: inline-block;
}
.contanst_goal {
   width: calc(50%-75px);
  display: inline-block;
}
.contanst_source ul,
.contanst_goal ul {
  display: inline-block;
}
.contanst_source ul li,
.contanst_goal ul li {
  margin-top: 30px;
  max-width: 220px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.el-radio__label {
  color: rgb(96, 98, 102) !important;
}
.contanst_vs {
  font-size: 50px;
  color: #2f6ac5;
 // width: 23%;
  text-align: center;
 // max-width: 260px;
 width:150px;
 height:170px;
 line-height:170px;
 vertical-align: text-bottom;
  display: inline-block;
}
.checkResult {
  border-bottom: 1px solid #2f6ac5;
  padding-bottom: 20px;
}
.checkResultData {
  width: 35%;
  display: inline-block;
}
.checkResultData ul li {
  margin-top: 30px;
}

.checkResult ul {
  display: inline-block;
}
.checkDetail {
  margin-top: 20px;

  border-bottom: 1px solid #2f6ac5;
  padding-bottom: 20px;
}
.checkDetail textarea {
  width: 99%;
  height: 230px;
  resize: none;
}
.checkResult a {
  display: inline-block;
  color: #2f6ac5;
  text-decoration: underline;
  cursor: pointer;
}
.resultIcon .yes {





  background: url("../../assets/images/data_ri.png") no-repeat;

  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}
.resultIcon .wrong {


  background: url("../../assets/images/data_err.png") no-repeat;



  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}
h5{
  font-size:14px;
}
</style>
<style lang="scss">
.check-data-dialog{
  .el-dialog{
    min-width:810px;
    max-height:calc(100% - 50px);
    overflow:auto;
  }
}
.el-picker-panel__icon-btn{
  color: #303133;
  &:hover{
    color: #303133;
  }
}
.check-history-table{
  width:100%;
  th > .cell{
    line-height:normal;
    font-size:14px;
  }
  td{
    padding:5px 0;
  }
  td > .cell{
    line-height:normal;
  }
  thead{
    color:#333;
    background-color:#FFF;
  }
  th.is-leaf{
    border-bottom:1px solid #dcdddd;
  }
  .el-table__body tr:hover > td{
    background-color:#e6eaed!important;
    color:#333;
  }
}
</style>