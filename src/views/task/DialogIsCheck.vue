<template>
  <div class="taskMDialog" style="padding-bottom:15px;">
    <el-dialog width="60%" :title="title" :visible.sync="showInnerDialog" class="check-data-dialog" @closed="closeDiaChk" :close-on-click-modal="false">
      <div slot="title">
        <span class="el-dialog__title">{{title}}</span>
        <div class="title-gra">
          <span class="grab gra-l"></span>
          <span class="grab gra-r"></span>
        </div>
      </div>
      <!-- loading -->
      <div v-loading="loading" element-loading-text="核验中，请稍等..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 251, 251, 0.77)">
        <div class="checkData" style="padding-left: 40px;">
          校验设置：
          <el-radio v-model="radio" label="0" @change="checkChange" style="color:rgb(96, 98, 102);">全量核验</el-radio>
          <el-radio v-model="radio" label="1" @change="checkChange" style="color:rgb(96, 98, 102);" :disabled="!this.queryTargetColumnList.length||types=='mongodb'||types=='ftp'" v-show="types!='mongodb'&&types!='ftp'">根据时间范围核验</el-radio>
          <el-button type="" size="small" class="checkBtn" @click="doCheck">{{status}}</el-button>
          <div class="">
            <div class="range">
              <span style="color:rgb(96, 98, 102);">核验误差范围:&nbsp;&nbsp;</span>
              <el-input-number v-model="range" controls-position="right" size="small" :min="0" :max="100" :step="1" @change="checkNumber"></el-input-number>%
            </div>
            <div class="time" v-show="timeCheck">
              <el-date-picker size="small" :picker-options="pickerOptions" v-model="startTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
              <el-select v-model="queryTargetColumn" placeholder="选择核验时间字段" style="width:160px;margin-left:5px;">
                <el-option v-for="item in queryTargetColumnList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="contanst">
          <div class="contanst_source">
            <ul>
              <li>源库：</li>
              <li>{{types=='ftp'?'源端文件：':'源端表：'}}</li>
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
              <li>目标数据量：</li>
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
            <ul>
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
                <span v-if="this.resData.testresults_manual_check_result==null" style="color:#606266">无</span>
                <template v-else>
                  <el-radio v-model="resData.testresults_manual_check_result" label="0" @change="error()">合格</el-radio>
                  <el-radio v-model="resData.testresults_manual_check_result" label="1" @change="error()">不合格</el-radio>
                </template>
              </li>
              <li style="opacity:0">h</li>
            </ul>
          </div>
        </div>
        <transition name="fade-transform" mode="out-in">
          <div class="checkDetail" style="height:261px;" v-loading="loading2" v-show="textShow">
            <textarea name="" id="" disabled="disabled" v-model="loginfo"></textarea>
          </div>
        </transition>
        <h5>核验历史记录：</h5>
        <el-table :data="resDataHistory" class="check-history-table" stripe border>
          <el-table-column prop="accessCheckTime" label="核验时间">
          </el-table-column>
          <el-table-column label="核验方式">
            <template slot-scope="scope">
              <span v-if="scope.row.config_key == '0'">全量核验</span>
              <span v-if="scope.row.config_key == '1'">时间范围</span>
            </template>
          </el-table-column>
          <el-table-column label="核验误差">
            <template slot-scope="scope">
              <span>{{scope.row.config_range | percentFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="核验结果">
            <template slot-scope="scope">
              <span v-if="scope.row.testresults_manual_check_result == '1'">失败</span>
              <span v-else>成功</span>
            </template>
          </el-table-column>
          <el-table-column label="核验报告">
            <template slot-scope="scope">
              <el-button @click="downTxt(scope.row.id)" class="export-btn" size="mini" v-if="scope.row.status == '1'">导出</el-button>
              <el-button @click="downTxt(scope.row.id)" class="export-btn" size="mini" v-else disabled>导出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { myBrowser } from '@/utils/mix.js'
import request from "@/utils/request"
//盐城
const baseUrl = ENV.API_DACM;
export default {
  name: "check",
  beforeCreate() {
    window.dialogIsCheck = this;
  },
  props: ["msgCheck", "title", "types"],
  created() {
    this.getHistory();
    this.init();
  },
  data: function() {
    return {
      queryTargetColumn: '',
      queryTargetColumnList: [],
      baseUrl: baseUrl,
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
      resDataHistory: [],
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
  computed: {

  },
  methods: {
    //纠错功能
    error() {
      this.loading = true;
      this.$ajax({
        method: "POST",
        url: baseUrl + '/ccheckData/modifyCheckResult',
        data: {
          "id": this.resData.id,
          "manual_check_result": this.resData.testresults_manual_check_result
        }

      }).then(res => {
        this.loading = false;
        if (res.data.success) {
          this.$alert("纠错成功");
          this.init();
        } else {
          this.$alert("纠错失败");
        }
      })
    },
    checkNumber(val) {
      let reg = /^-?\d+$/;
      if (!reg.test(val)) {
        this.range = Math.random();
        this.$nextTick(() => {
          this.range = parseInt(val);
        });
        this.$message.error('误差范围必须是整数');
      }
    },
    closeDiaChk() {
      this.$emit('closeDiaChk', );
      this.closeDialog();
    },
    setTimer: function() {
      this.timer = setTimeout(() => {
        this.init();
      }, 1000);
    },
    beforeDestroy() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    openDialog() {
      this.dialogVisible = true;
      // this.diaTitle = `表 ${this.msgCheck.dataTableName}  数据核验`;
      // this.init();
    },
    init() {
      let that = this;
      // this.loading = true;
      this.$ajax.get(baseUrl + '/ccheckData/tableNum', {
        //this.$ajax.get('http://10.19.160.25:8080/DACM/ccheckData/tableNum', {
        params: {
          taskId: that.msgCheck.taskInfoId
          //taskId: '68377'
        }
      }).then(res => {
        //  this.loading = false;
        res = res.data;
        if (res.data.result == "false" || res.data.message == "还未核验暂无数据,请核验") {
          this.$alert(res.data.message, "核验结果", {
            confirmButtonText: "确定"
          });
        }
        if (!this.dialogVisible) {
          //return;
        }
        //this.resData = res.datas;
        this.resData = res.data;
        //不知道这个的展示有没有什么限制，所以暂时先不作什么限制
        that.queryTargetColumnList = res.data.listIncrementCon;
        if(that.queryTargetColumnList.length!=0&&that.queryTargetColumnList.length!=undefined){
          that.queryTargetColumn = that.queryTargetColumnList[0];
        }
        if (res.data.status == "1") {
          this.textShow = false;

          window.clearTimeout(this.timer);
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
          if(res.data.queryTargetColumn!=''&&res.data.queryTargetColumn!=undefined){
             this.queryTargetColumn = res.data.queryTargetColumn;
          }
           //核验历史记录
         this.getHistory();
         //更新父级
         this.updateDataCheckLog();
          //  let loadingInstance = Loading.service({text:"核验中，请稍等...",target:document.getElementsByName("el-dialog")});
        } else if (res.data.status == "0") {
          //   this.loading = true;
          this.setTimer();
          this.status = "核验中";
        }
        // this.liData = res.data.result;
      });
    },
    //获取核验历史记录
    getHistory(){
      let that = this;
     this.$ajax.get(baseUrl + '/ccheckData/tableNumAllByTaskId', {
        params: {
          taskId: that.msgCheck.taskInfoId
        }
      }).then(res => {
        if (res.data.success) {
          this.resDataHistory = res.data.data.data;
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
      window.clearTimeout(this.timer);
      this.resData = {};
      this.textShow = false;
      this.queryTargetColumn = "";
    },
    // 开始核验按钮
    doCheck() {
      if (this.radio == "0") {
        if (this.range == null || typeof(this.range) == "undefined" || isNaN(this.range)) {
          this.$alert("请填写误差范围", "核验", {
            confirmButtonText: "确定"
          });
          return;
        } else {
          this.startTime = ["", ""];
        }
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
      } else if (this.radio == "1" && this.queryTargetColumn == "") {
        this.$alert("请选择核验时间字段", "核验", {
          confirmButtonText: "确定"
        });
        return;
      }
      //this.loading = true;
      this.$ajax.get(baseUrl + `/ccheckData/tableCheck`, {
        params: {
          taskId: this.msgCheck.taskInfoId,
          key: this.radio,
          range: this.range,
          startTime: this.startTime[0],
          endTime: this.startTime[1],
          queryTargetColumn: this.queryTargetColumn
        }
      }).then(res => {
        // this.loading = false;
        res.data = res.data.data;
        if (res.data.result) {
          this.$alert(res.data.message, "核验结果", {
            confirmButtonText: "确定",
            callback: () => {
              this.init();
            }
          });
        } else {
          this.$alert(res.data.message, "核验结果", {
            confirmButtonText: "确定"
          });
        }
      });
    },
    //查看日志按钮
    doDetail() {
     
      this.loading2 = true;
      let that = this;
      this.$ajax.get(baseUrl + '/ccheckData/checkLog', {
        params: {
          id: that.resData.id
        }
      }).then(res => {
        this.loading2 = false;
        res = res.data;
        if (res.success == "false" || res.success == false) {
          this.textShow = false;

          this.$alert("查看日志失败", "查看日志", {
            confirmButtonText: "确定"
          });
        } else {
          // this.textShow = true;
          if (res.data.result == false) {
            this.textShow = false;
            this.$message.warning(res.data.message);
          } else {
             this.textShow = !this.textShow;
            let result = res.data.testresults_result == 0 ? "成功" : "失败";
            let target_sqls = '';
            if(res.data.target_sql==undefined){
              target_sqls = ''
            }
            else{
              target_sqls = res.data.target_sql;
            }
            let source_sqls = '';
            if(res.data.source_sql ==undefined){
              source_sqls = ''
            }
            else{
              source_sqls = res.data.source_sql;
            }
            this.loginfo = `源库：${res.data.source_library}\n
源表：${res.data.source_tableName}\n
执行结果：${res.data.source_tableNum}\n
数据核验查询语句：${source_sqls}\n
\n
目标库：${res.data.target_library}\n
目标表：${res.data.target_tableName}\n
执行结果：${res.data.target_tableNum}\n
数据核验查询语句：${target_sqls}\n
\n
核验结果:${result}\n
核验差值:${res.data.testresults_dvalue}\n
`;
          }

        }
      });
    },
    //核验导出
    downTxt(value) {
      var browser = myBrowser();
      if (!browser) {
        browser = 'IE'
      }
      request({
        /* url: 'http://10.19.160.59:8080/DACM/ccheckData/downloadCheckDataById?id=32&browser=fox&accessName=ww',*/
        url: `${baseUrl}/ccheckData/downloadCheckDataById?id=${value}&browser=${browser}&accessName=${this.msgCheck.targetTableName}`,
        method: "GET",
        responseType: "blob"
      }).then(res => {
        console.log(res);　
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        　　
        var downloadElement = document.createElement('a');　　
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        　　
        downloadElement.href = href;　　
        downloadElement.download = unescape(res.headers.filename.replace(/\\u/g, '%u')); //下载后文件名
        　　
        document.body.appendChild(downloadElement);　　
        downloadElement.click(); //点击下载
        　　
        document.body.removeChild(downloadElement); //下载完成移除元素
        　　
        window.URL.revokeObjectURL(href); //释放掉blob对象 
      })
      /*window.location.href = `${this.GLOBAL.api.API_DACM}/ccheckData/downloadCheckDataById?id=${item.id}&browser=${browser}&accessName=${this.$route.params.sourceName}`*/
    },
    //更新父级数据核验日志信息
    updateDataCheckLog(){
      let fn = this.$parent.getDataCheckLog;
      fn&&fn();
    },
  },
  filters: {
    percentFormat(val) {
      if (val == 0) {
        return 0;
      } else {
        return val + '%';
      }
    },
  },
  components: {}
};

</script>
<style lang="scss" scoped>
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.time {
  display: inline-block;
  margin-left: 10px;
  margin-top: 15px;
}

.range {
  display: inline-block;
  margin-top: 15px;
}

.checkData {
  border-bottom: 1px solid #2f6ac5;
  height: 126px;
  position: relative;
}

.checkBtn {
  color: white !important;
  border: none !important;
  position: absolute;
  right: 5%;
  span {
    color: white !important;
  }
}

.contanst {
  font-size: 14px;
  
  padding-bottom: 20px;
  display: flex;
}

.contanst_source {
  width: calc(50% - 75px); //display: inline-block;
  display: flex;
}

.contanst_goal {
  width: calc(50% - 75px); //display: inline-block;
  display: flex;
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
 /*  color: #2f6ac5; */ // width: 23%;
  text-align: center; // max-width: 260px;
  width: 150px;
  height: 170px;
  line-height: 170px;
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
  padding-left: 0!important;
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
  /* color: #2f6ac5; */
  text-decoration: underline;
  cursor: pointer;
}

.resultIcon .yes {
  background: url("../../assets/images/data_ri.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
  margin-left: 0;
}

.resultIcon .wrong {
  background: url("../../assets/images/data_err.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
  margin-left: 10px;
}

h5 {
  font-size: 14px;
  margin-bottom: 10px;
}

.export-btn.el-button {
  color: white!important;
 /*  background-color: #2f6ac5!important; */
}

</style>
<style lang="scss">
.check-data-dialog {
  .el-dialog {
    min-width: 860px;
    max-height: calc(100% - 30vh);
  }
  .el-dialog__body {
    max-height: calc(100% - 82px);
    overflow: auto;
  }
}

.el-picker-panel__icon-btn {
  color: #303133;
  &:hover {
    color: #303133;
  }
}

.check-history-table {
  width: 100%;
  th>.cell {
    line-height: normal;
    font-size: 14px;
  }
  td {
    padding: 5px 0;
  }
  td>.cell {
    line-height: normal;
    font-size: 12px;
  }
  thead {
    //color: #333;
    //background-color: #FFF;
  }
  th.is-leaf {
    border-bottom: 1px solid #dcdddd;
  }
  .el-table__body tr:hover>td {
    background-color: #e6eaed!important;
    color: #333;
  }
}

</style>
