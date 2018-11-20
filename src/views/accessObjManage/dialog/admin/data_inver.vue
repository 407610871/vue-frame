<template>
  <div class="taskMDialog userSurveyDialog diaicon datein">
    <!-- <el-button size="mini" class="diabtn incbtn" type="danger" @click="dialogVisible = true">数据核验</el-button> -->
    <el-tooltip class="item" effect="light" content="数据核验" placement="top">
      <i class="enc-icon-shujuheyan" @click="dialogVisible = true"></i>
    </el-tooltip>
    <el-dialog title="数据核验" :visible.sync="dialogVisible" width="73%" :before-close="closeDialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="proInfo-box clearfix">
          <el-col :span="24">
            <el-form-item label="核验设置:" class="radiow100">
              <el-radio-group v-model="ruleForm.setVer">
                <el-col :span="24">
                  <el-col :span="6">
                    <el-radio :label="0">全量核验</el-radio>
                  </el-col>
                  <el-col :span="4" class="bank">bank</el-col>
                  <el-col :span="6">
                    <el-radio :label="1">根据时间范围核验</el-radio>
                  </el-col>
                  <el-col :span="10">
                    <el-button type="primary" size="small" @click="inverCheck()">{{status}}</el-button>
                  </el-col>
                </el-col>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="8">
              <el-form-item label="核验误差范围:">
                <el-input-number v-model="ruleForm.range" controls-position="right" size="small" :min="0" :max="100" :step="1"></el-input-number>%
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div class="time" v-show="ruleForm.setVer=='1'">
                <el-date-picker size="small" :picker-options="ruleForm.pickerOptions" v-model="ruleForm.startTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </el-col>
          </el-col>
        </div>
        <div class="proInfo-box clearfix">
          <el-col :span="9">
            <el-col :span="8">
              <ul>
                <li>源库：</li>
                <li>源端表：</li>
                <li>源端数据量：</li>
              </ul>
            </el-col>
            <el-col :span="14">
              <ul>
                <li :title="resData.source_library">{{resData.source_library || '无'}}</li>
                <li :title="resData.source_tableName">{{resData.source_tableName || "无"}}</li>
                <li :title="resData.source_tableNum">{{resData.source_tableNum || "无"}}</li>
              </ul>
            </el-col>
          </el-col>
          <el-col :span="4" class="vs">vs</el-col>
          <el-col :span="9">
            <el-col :span="8">
              <ul>
                <li>目标库</li>
                <li>目标表：</li>
                <li>平台数据量：</li>
              </ul>
            </el-col>
            <el-col :span="14">
              <ul>
                <li :title="resData.target_library">{{resData.target_library || "无"}}</li>
                <li :title="resData.target_tableName">{{resData.target_tableName || "无"}}</li>
                <li :title="resData.target_tableNum">{{resData.target_tableNum || "无"}}</li>
              </ul>
            </el-col>
          </el-col>
        </div>
        <div class="proInfo-box clearfix ptb20 resultIcon">
          <el-col :span="8">
            <span>核验结果:</span>
            <span class="yes" v-if="resData.testresults_result=='0'"></span>
            <span class="wrong" v-else-if="resData.testresults_result=='1'"></span>
            <span v-else-if="resData.testresults_result=='null'" style="color:#606266">无</span>
          </el-col>
          <el-col :span="8">
            <span>数据量差值: {{resData.testresults_dvalue}}</span>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="small" @click="checkLog()">查看日志</el-button>
          </el-col>
        </div>
        <div class="proInfo-box log-box clearfix ptb20" v-loading="loading2">
          <textarea name="" id="" disabled="disabled" v-show="textShow">{{loginfo}}</textarea>
        </div>
        <div class="proInfo-box clearfix ptb20 hisInver">
          <span>核验历史记录:</span>
          <div class="comTable">
            <el-table :data="tableData" style="width: 100%" height="250" stripe>
              <el-table-column prop="accessCheckTime" label="核验时间">
              </el-table-column>
              <el-table-column label="核验方式">
                <template slot-scope="scope">
                  <span>{{scope.row.config_key=="0"?'全量':'时间范围'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="source_library" label="核验误差">
                <template slot-scope="scope">
                  <span>{{scope.row.config_range}}%</span>
                </template>
              </el-table-column>
              <el-table-column prop="source_library" label="核验结果">
                <template slot-scope="scope">
                  <span>{{scope.row.testresults_manual_check_result=="1"?'不一致':'一致'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="source_library" label="核验报告">
                <template slot-scope="scope">
                  <el-button size="mini" type="info" class="" @click="download(scope.row)">导出</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { myBrowser } from '@/utils/mix.js'
import request from "@/utils/request"
export default {
  name: "dataInver",
  data: function() {
    return {
      taskInfoId: '1',
      taskId: '',
      dialogVisible: false,
      loginfo: '',
      loading2: false,
      textShow: false,
      status: '开始核验',
      result: '0',
      timer: null,
      loading: false,
      logId: '',
      resData: {},
      tableData: [],
      ruleForm: {
        setVer: 0, //核验设置
        range: 0, //核验误差范围
        startTime: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        }
      }
    }
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    setTimer: function() {
      this.timer = setTimeout(() => {
        this._queryInver();
      }, 5000);
    },
    _queryInver() {
      this.$ajax({
        method: "GET",
        url: this.GLOBAL.api.API_DACM + '/ccheckData/tableNum',
        /* url:'http://10.19.160.59:8080/DACM/ccheckData/tableNum',*/
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
          taskId: this.taskId
        }

      }).then(res => {
        if (res.data.success == "true" || res.data.success == true) {
          this.resData = res.data.data;
          this.logId = res.data.data.id;
          if (res.data.data.status == "1") {
            this.textShow = false;
            window.clearInterval(this.timer);
            this.timer = null;
            this.loading = false;
            this.status = '开始核验';
            if (res.data.data.config_key != undefined && res.data.data.config_key != null) {
              //全量
              if (res.data.data.config_key == "0") {
                this.ruleForm.setVer = 0;
                this.ruleForm.startTime = [];
              } else {
                //时间范围
                this.ruleForm.setVer = 1;
                this.ruleForm.startTime = [
                  res.data.data.config_startTime,
                  res.data.data.config_endTime
                ]
              }
              this.ruleForm.range = res.data.data.config_range;

            }
          } else if (res.data.data.status == "0") {
            this.loading = true;
            this.setTimer();
            this.status = '核验中'
          } else {
            this.$alert("还未核验暂无数据,请核验", "核验结果", {
              confirmButtonText: "确定"
            });
          }
        } else {
          this.$alert("核验数据失败", "核验结果", {
            confirmButtonText: "确定",
            callback: action => {
              this.dialogVisible = false;
            }
          });
        }
      }, res => {
        this.$alert("核验数据失败", "核验结果", {
          confirmButtonText: "确定",
          callback: action => {
            this.dialogVisible = false;
          }
        });
      })
    },
    //查询日志
    checkLog() {
      this.loading2 = true;
      this.$ajax({
        method: "GET",
        url: this.GLOBAL.api.API_DACM + '/ccheckData/checkLog',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
          id: this.logId
        }

      }).then(res => {
        this.loading2 = false;
        if (res.data.success == "true" || res.data.success == true) {

          if (res.data.data.result == false) {
            this.textShow = false;
            this.$alert("查看日志失败", "查看日志", {
              confirmButtonText: "确定"
            });
            return false;
          }
          this.textShow = true;
          let logData = res.data.data.testresults_result == 0 ? "一致" : "不一致";
          this.loginfo = `源库：${res.data.data.source_library}\n
源表：${res.data.data.source_tableName}\n
数据核验查询语句：${res.data.data.source_sql}\n
执行结果：${res.data.data.source_tableNum}\n
\n
目标库：${res.data.data.target_library}\n
目标表：${res.data.data.target_tableName}\n
数据核验查询语句：${res.data.data.target_sql}\n
执行结果：${res.data.data.target_tableNum}\n
\n
核验结果:${logData}\n
核验差值:${res.data.data.testresults_dvalue}\n
`;
        } else {
          this.loading2 = false;
          if (res.data.data.result == false) {
            this.textShow = false;
            this.$alert("查看日志失败", "查看日志", {
              confirmButtonText: "确定"
            });
          }
        }
      })
    },
    //开始核验
    inverCheck() {
      if (this.ruleForm.setVer == "0") {
        this.startTime = ["", ""];
        debugger;
      } else if (this.ruleForm.setVer == "1" && this.ruleForm.startTime == null) {
        this.$alert("请填写开始与结束时间", "核验", {
          confirmButtonText: "确定"
        });
        return;
      } else if (this.ruleForm.setVer == "1" && this.ruleForm.startTime.length == 0) {
        this.$alert("请填写开始与结束时间", "核验", {
          confirmButtonText: "确定"
        });
        return;
      }
      this.$ajax({
        method: "get",
        url: `${this.GLOBAL.api.API_DACM}/ccheckData/tableCheck`,
        /*url:'http://10.19.160.59:8080/DACM/ccheckData/tableCheck',*/
        params: {
          taskId: this.taskId,
          key: this.ruleForm.setVer,
          range: this.ruleForm.range,
          startTime: this.ruleForm.startTime[0],
          endTime: this.ruleForm.startTime[1]
        }
      }).then(res => {
        if (res.data.data.result == true || res.data.data.result == "true") {
          this.$alert(res.data.data.message, "核验结果", {
            confirmButtonText: "确定",
            callback: action => {
              this._queryInver();
            }
          });
        } else {
          this.$alert("核验请求失败！", "核验结果", {
            confirmButtonText: "确定"
          });
        }
      });
    },
    //核验历史记录
    _queryHis() {
      this.$ajax({
        method: "get",
        url: `${this.GLOBAL.api.API_DACM}/ccheckData/tableNumAllByTaskId`,
        params: {
          taskId: this.taskId
        }
      }).then(res => {
        debugger;
        if (res.data.success) {
          this.tableData = res.data.data.data;
          console.log(this.tableData);
        } else {
          this.$alert('获取核验历史记录失败', '信息', {
            confirmButtonText: '确定'
          });
        }
      })
    },
    //导出报告
    download(item) {
      var browser = myBrowser();
      if (!browser) {
        browser = 'IE'
      }
      request({
       /* url: 'http://10.19.160.59:8080/DACM/ccheckData/downloadCheckDataById?id=32&browser=fox&accessName=ww',*/
        url: `${this.GLOBAL.api.API_DACM}/ccheckData/downloadCheckDataById?id=${item.id}&browser=${browser}&accessName=${this.$route.params.sourceName}`,
        method: "GET",
        responseType: "blob"
      }).then(res => {
        console.log(res);　
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        　　
        var downloadElement = document.createElement('a');　　
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        　　
        downloadElement.href = href;　　
        downloadElement.download = res.headers.filename; //下载后文件名
        　　
        document.body.appendChild(downloadElement);　　
        downloadElement.click(); //点击下载
        　　
        document.body.removeChild(downloadElement); //下载完成移除元素
        　　
        window.URL.revokeObjectURL(href); //释放掉blob对象 
      })
      /*window.location.href = `${this.GLOBAL.api.API_DACM}/ccheckData/downloadCheckDataById?id=${item.id}&browser=${browser}&accessName=${this.$route.params.sourceName}`*/
    }
  },
  components: {

  },
  mounted() {

  },
  created() {

  },
  computed: {

  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.taskId = this.pdata.accessConnectorSource.taskInfoId;
        this._queryInver();
        this._queryHis();
      }
    }

  },
  props: ['pdata']

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.userSurveyDialog .el-dialog__body {
  padding-left: 0px;
  padding-right: 0px;
}

.el-select {
  width: 100%;
}

.otherInfo .el-radio {
  margin-bottom: 12px;
  margin-top: 8px;
  margin-left: 30px;
}

.test-btn {
  .el-form-item--medium .el-form-item__content {
    margin-left: 0px !important;
  }
}

.el-radio+.el-radio {
  margin-left: 19px;
}

.reginfo .el-form-item__content {
  margin-left: 0px !important;
  text-align: center;
  margin-top: 30px;
}

.el-dialog .otherInfo .el-form-item__label {
  width: 103px !important;
}

.otherInfo .el-form-item--medium .el-form-item__content {
  margin-left: 103px !important;
}

.el-dialog .otherInfo .fileItem .el-form-item__label {
  width: 235px !important;
}

.surveybg {
  background: #f0f3f6;
  padding-top: 20px;
}

.plr30 {
  padding-left: 30px;
  padding-right: 30px;
}

.sursavebtn .el-form-item--medium .el-form-item__content {
  margin-left: 0px;
}

.radiow100 {
  .el-radio-group {
    width: 100%;
  }
}

form {
  padding: 0 20px;
}

.proInfo-box {
  border-bottom: 1px solid $border-color-dai;
}

.vs {
  color: #2f6ac5;
  display: inline-block;
  font-size: 100px;
  max-width: 260px;
  text-align: left;
  margin-top: 30px;
}

.resultIcon .yes {
  background: url("../../../../assets/images/data_ri.png") no-repeat;
  width: 14px;
  height: 14px;
  display: inline-block;
  background-size: 100% 100%;
  margin-left: 10px;
}

.resultIcon .wrong {
  background: url("../../../../assets/images/data_err.png") no-repeat;
  width: 14px;
  height: 14px;
  display: inline-block;
  background-size: 100% 100%;
  margin-left: 10px;
}

textarea {
  width: 90%;
  height: 230px;
}

li {
  white-space: nowrap;
}

.log-box {
  border-bottom: none;
}

.resultIcon {
  padding-left: 35px !important;
}

.hisInver .el-table--medium td,
.hisInver .el-table--medium th {
  padding: 0px !important;
}

.hisInver .el-table th>.cell {
  line-height: 32px !important;
}

.diaicon i {
  cursor: pointer;
  font-size: 20px;
}
.datein span i{
  font-size: 14px;
}
</style>
