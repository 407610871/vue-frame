<template>
	
  <el-dialog  :title="diaTitle" :visible.sync="dialogVisible"	:width="dialogWidth"  top="8vh" id="addPersonnel" @close='closeDialog' 
 
   v-if="resData.table">

   <div  v-loading="loading" 
     element-loading-text="核验中，请稍等..."
     element-loading-spinner="el-icon-loading"
     element-loading-background="rgba(255, 251, 251, 0.77)"
     >

   
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
      <li :title="resData.table.source.library">{{resData.table.source.library||"无"}}</li>
      <li :title="resData.table.source.tableName">{{resData.table.source.tableName||"无"}}</li>
      <li :title="resData.table.source.tableNum">{{resData.table.source.tableNum||"无"}}</li>

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
      <li :title="resData.table.target.library">{{resData.table.target.library||"无"}}</li>
      <li :title="resData.table.target.tableName">{{resData.table.target.tableName||"无"}}</li>
      <li :title="resData.table.target.tableNum">{{resData.table.target.tableNum||"无"}}</li>
     

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
<span class="yes" v-if="this.resData.testresults.result==0"></span>        
<span class="wrong" v-else-if="this.resData.testresults.result==1"></span>
<span v-else-if="this.resData.testresults.result==null" style="color:#606266">无</span>

   </li>
       <li>{{resData.testresults.dvalue||"无"}}</li>
     

    </ul>
  </div>
  

  <div class="checkResultData">
  <ul>
      <li>纠错：</li>
       <li><a @click="doDetail">查看日志</a></li>
      

    </ul>
    <ul>
      <li class="manual_check_result">  
      
       <el-radio  v-if="this.resData.testresults.manual_check_result==='0'"  >合格</el-radio>
      <el-radio v-else-if="this.resData.testresults.manual_check_result==='1'"  >不合格</el-radio>
      <span v-else-if="this.resData.testresults.manual_check_result==null" style="color:#606266">无</span>
      
         </li>
      
     <li style="opacity:0">h</li>

    </ul>
 </div>
</div>


<div class="checkDetail" style="height:261px;" v-loading="loading2" >
<textarea name="" id="" disabled="disabled" v-show="textShow" >{{loginfo}}</textarea>

</div>
</div>




</el-dialog>



</template>

<script>
export default {
  name: "check",
  beforeCreate() {
    window.dialogIsCheck = this;
  },
  props: ["MsgCheck"],
  created() {
    // this.init();
  },
  data: function() {
    return {
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

  methods: {
    setTimer: function() {
      this.timer = setTimeout(() => {
        this.init();
      }, 1000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
    openDialog() {
      this.dialogVisible = true;
      this.diaTitle = `表 ${this.MsgCheck.dataTableName}  数据核验`;
      this.init();
    },
    init() {
      this.$ajax({
        methods: "get",
        url: `/manager/cricles/tableNum?taskInfoId=${this.MsgCheck.taskInfoId}`
      }).then(res => {
        // if (res.result == "false" || res.message == "还未核验暂无数据,请核验") {
        //   this.$alert(res.message, "核验结果", {
        //     confirmButtonText: "确定"
        //   });
        // }
        if (!this.dialogVisible) {
          return;
        }
        this.resData = res.datas;
        if (res.datas.status == "1") {
          this.textShow = false;

          window.clearInterval(this.timer);
          this.timer = null;
          this.loading = false;
          this.status = "开始核验";
          this.radio = res.datas.config.key;
          this.radio == 1 ? (this.timeCheck = true) : (this.timeCheck = false);

          if (res.datas.config.key == 1) {
            this.startTime = [
              res.datas.config.startTime,
              res.datas.config.endTime
            ];
          } else {
            this.startTime = [];
          }

          this.range = res.datas.config.range;
          //  let loadingInstance = Loading.service({text:"核验中，请稍等...",target:document.getElementsByName("el-dialog")});
        } else if (res.datas.status == "0") {
          this.loading = true;
          this.setTimer();
          this.status = "核验中";
        }
        // this.liData = res.data.result;
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

      this.$ajax({
        methods: "get",
        url: `manager/cricles/tableCheck`,
        params: {
          taskInfoId: this.MsgCheck.taskInfoId,
          key: this.radio,
          range: this.range,
          startTime: this.startTime[0],
          endTime: this.startTime[1]
        }
      }).then(res => {
        if (res.result) {
          this.$alert(res.message, "核验结果", {
            confirmButtonText: "确定",
            callback: action => {
              this.init();
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
      this.$ajax({
        methods: "get",
        url: `/manager/cricles/checkLog?taskInfoId=${this.MsgCheck.taskInfoId}`
      }).then(res => {
        this.loading2 = false;

        if (res.result == "false") {
          this.textShow = false;

          this.$alert("查看日志失败", "查看日志", {
            confirmButtonText: "确定"
          });
        } else {
          this.textShow = true;

          let result = res.datas.testresults.result == 0 ? "成功" : "失败";
          this.loginfo = `源库：${res.datas.loginfo.source.library}\n
源表：${res.datas.loginfo.source.tableName}\n
执行结果：${res.datas.loginfo.source.num}\n
数据核验查询语句：${res.datas.loginfo.source.sql}\n
\n
目标库：${res.datas.loginfo.target.library}\n
目标表：${res.datas.loginfo.target.tableName}\n
执行结果：${res.datas.loginfo.target.num}\n
数据核验查询语句：${res.datas.loginfo.target.sql}\n
\n
核验结果:${result}\n
核验差值:${res.datas.testresults.dvalue}\n
`;
        }
      });
    }
  },
  components: {}
};
</script>

<style  lang="scss">
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
  margin-top: 20px;
  border-bottom: 1px solid #2f6ac5;
  padding-bottom: 20px;
}
.contanst_source {
  width: 30%;
  display: inline-block;
}
.contanst_goal {
  width: 35%;
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
  font-size: 150px;
  color: #2f6ac5;
  width: 23%;
  text-align: left;
  max-width: 260px;
  display: inline-block;
}
.checkResult {
  margin-top: 20px;

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
.resultIcon span {
}
.resultIcon .yes {
  background: url("../../assets/image/yes.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}
.resultIcon .wrong {
  background: url("../../assets/image/wrong.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}
</style>
