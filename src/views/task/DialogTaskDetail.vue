<template>
  <div class="taskMDialog" style="padding-bottom:15px;">
    <el-dialog :title="reqObj.taskName" :close-on-click-modal="false" :visible.sync="showInnerDialog" @closed="closeDia" :height="600" width="65%">
      <div class="title-gra plr30">
        <div class="grab gra-r">
          <span class="grab gra-l"></span>
        </div>
      </div>
      <el-form label-width="150px" class="demo-ruleForm">
        <span v-show="taskBaseInfo.status==1||taskBaseInfo.status==2||(taskBaseInfo.status==5&&reqObj.startTime!=''&&reqObj.startTime!='undefined')" style="float:right;">当前状态:
          <el-select
            v-model="flagDesc"
            :disabled="loading3"
            placeholder="请选择"
            @change="changeStatus"
            class="select taskselect"
          >
            <el-option
              v-for="(item,index) in operateList"
              :key="index"
              :label="item.type"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </span>
        <!-- 接入基本信息 模块开始-->
        <div class="daiInfo proInfo" v-loading="loading1">
          <div class="daiInfo-title proInfo-title">
            <h2>接入基本信息</h2>
          </div>
          <div class="proInfo-box plr20 clearfix">
            <el-col :span="10">
              <el-form-item label="接入源名称:" :title="sourceBaseInfo.resourceName">
                <span>{{sourceBaseInfo.resourceName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="目标库:">
                <span>{{sourceBaseInfo.targetDBName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="接入源ID:">
                <span>{{sourceBaseInfo.sourceId}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="目标表:" :title="sourceBaseInfo.targetTableName">
                <span>{{sourceBaseInfo.targetTableName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="接入源类型:">
                <span>{{sourceBaseInfo.dbType}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="接入类型:">
                <span>{{sourceBaseInfo.periodDesc}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-col :span="12">
                <el-col :span="20">
                  <el-form-item label="接入对象:">
                    <div style="height:80px;width:70%;overflow:auto;" :class="sourceBaseInfo.sourceObjNameList.length>1?'jrborder':''">
                      <span style="display:block" v-for="(item, index) in sourceBaseInfo.sourceObjNameList" :key="index" v-show="item.type=='TABLE'||item.type=='VIEW'">{{item.type=="TABLE"?'表':'视图'}}:{{item.tableName}}</span>
                      <span v-show="sourceBaseInfo.sourceObjNameStr!=''">{{sourceBaseInfo.sourceObjNameStr}}</span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="bank">bank</el-col>
              </el-col>
              <el-col :span="12">
                <el-col :span="4" class="bank">bank</el-col>
                <el-col :span="20">
                  <el-form-item label="增量字段:" v-show="isShow">
                    <span>{{sourceBaseInfo.incrementColumn}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="bank">bank</el-col>
                <el-col :span="10">
                  <el-form-item label="增量字段类型:" v-show="isShow">
                    <span>{{sourceBaseInfo.columnType}}</span>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-col>
          </div>
        </div>
        <!-- 接入基本信息 模块结束 -->
        <!-- 接入数据更新 模块开始 -->
        <div class="daiInfo dockInfo" v-loading="loading2||isCheckLoading">
          <div class="daiInfo-title">
            <h2>接入数据更新</h2>
          </div>
          <div class="daiInfo-box clearfix">
            <el-col :span="10">
              <el-form-item label="已接入数据量:">
                <span>{{sourceDataInfo.writeNum||'0'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" :class="{bank:!((reqObj.status==1||reqObj.status==2||reqObj.status==4)&&reqObj.isPeriod!=0)}">
              {{((reqObj.status==1||reqObj.status==2||reqObj.status==4)&&reqObj.isPeriod!=0)?' ':'bank'}}
              <el-button v-show="(reqObj.status==1||reqObj.status==2||reqObj.status==4)&&reqObj.isPeriod!=0" type="primary" size="small" @click="checkData">数据核验</el-button>
            </el-col>
            <el-col :span="10">
              <el-form-item label="剩余数据量预估:">
                <span>{{sourceDataInfo.left||'0'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="当前数据接入速率:">
                <span>{{Number(sourceDataInfo.source_record_poll_rate||'0.0').toFixed(2)}} 条/秒</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="待处理数据量:">
                <span>{{sourceDataInfo.waiting4processing||'0'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="bank">bank</el-col>
          </div>
        </div>
        <!-- 接入数据更新 模块结束 -->
        <!-- 任务基本信息 模块开始 -->
        <div class="daiInfo dockInfo">
          <div class="daiInfo-title">
            <h2>任务基本信息</h2>
          </div>
          <div class="daiInfo-box clearfix" v-loading="loading3">
            <el-col :span="10">
              <el-form-item label="当前任务状态:">
                <span>{{taskBaseInfo.statusDesc}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10" class="bank">bank</el-col>
            <el-col :span="17">
              <el-form-item label="任务指示灯:">
                <div class="item-label">
                  <span class="label-color" v-bind:style="lightBackground"></span> {{taskBaseInfo.newWorkDesc}}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" @click="testConnect()">测试连接</el-button>
            </el-col>
            <el-col :span="24" v-show="reqObj.isPeriod!=0 && reqObj.isPeriod!=3">
              <el-form-item label="任务周期设置:">
                <span>{{taskBaseInfo.periodSet}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最近一次任务开始时间:">
                <span>{{reqObj.startTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务创建时间:">
                <span>{{taskBaseInfo.createTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最近任务成功结束时间:">
                <span>{{(reqObj.status=='1'&&reqObj.isPeriod=='3')?'':reqObj.endTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务创建人:">
                <span>{{taskBaseInfo.creater}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="bank">bank</el-col>
          </div>
          <!-- 四个日志tab 开始 -->
          <div class="daiInfo-tabs">
            <el-tabs type="border-card" style="height:265px;">
              <el-tab-pane label="汇聚任务日志信息" v-if="taskLog!=''">
                <div class="dataCheck-tab" v-loading="loading4">
                  <textarea v-show="taskLog!=''" name id cols="30" rows="12" disabled="disabled" style="resize:none;width: 100%; height: 180px;border:none;background:inherit" v-model="taskLog"></textarea>
                  <div class="tips-none" v-show="taskLog==''">暂无数据</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="数据核验日志信息">
                <div class="dataCheck-tab" v-loading="loading5">
                  <div class="logItem" v-for="(item, index) in dataCheckList" :key="index">
                    <span class="lab">源库：</span>
                    <span>{{item.source_library}}</span>
                    <br>
                    <span class="lab">源表：</span>
                    <span>{{item.source_tableName}}</span>
                    <br>
                    <span class="lab">执行结果：</span>
                    <span>{{item.source_tableNum}}</span>
                    <br>
                    <span class="lab">数据核验查询语句：</span>
                    <span>{{item.source_sql}}</span>
                    <br>
                    <br>
                    <span class="lab">目标库：</span>
                    <span>{{item.target_library}}</span>
                    <br>
                    <span class="lab">目标表：</span>
                    <span>{{item.target_tableName}}</span>
                    <br>
                    <span class="lab">执行结果：</span>
                    <span>{{item.target_tableNum}}</span>
                    <br>
                    <span class="lab">数据核验查询语句：</span>
                    <span>{{item.target_sql}}</span>
                    <br>
                    <br>
                    <span class="lab">核验结果：</span>
                    <span>{{item.testresults_result==0?'成功':'失败'}}</span>
                    <br>
                    <span class="lab">核验差值</span>
                    <span>{{item.testresults_dvalue}}</span>
                    <br>
                    <br>
                    <div class="logItem-line"></div>
                    <br>
                    <br>
                  </div>
                  <div class="tips-none" v-show="dataCheckList.length==0">暂无数据核验日志信息</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="网络连接信息">
                <div class="dataCheck-tab" v-loading="loading3">{{taskBaseInfo.newWorkDesc}}</div>
              </el-tab-pane>
              <el-tab-pane class="test" label="数据预览">
                <!-- 数据预览 表格开始 -->
                <!-- 数据预览表头不确定，根据接口返回的list集合对象里的key值来确定，所以采用如下写法实现 -->
                <div class="dataViews-table" v-loading="loading6">
                  <table style="width:100%;">
                    <thead>
                      <th v-for="(val, index) in keyList" :key="index">{{val}}</th>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in dataViewsList" :key="index">
                        <td v-for="(keyitem, index) in keyList" :key="index" :title="item[index]">{{item[index]}}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="tips-none" v-show="dataViewsList.length==0">暂无数据</div>
                </div>
                <!-- 数据预览 表格结束 -->
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 四个日志tab 结束 -->
        </div>
        <!-- 任务基本信息 模块结束 -->
      </el-form>
    </el-dialog>
    <dialogIsCheck :msgCheck="reqObj" :title="'数据校验'" :types="jrtype" v-if="showCheckData" @closeDiaChk="closeDiaChk()"></dialogIsCheck>
  </div>
</template>
<style lang="scss" scoped>
.el-radio+.el-radio {
  margin-left: 19px;
}

.label-color {
  display: inline-block;
  margin-right: 8px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
}

.el-radio+.el-radio {
  margin-left: 19px;
}

.label-color {
  display: inline-block;
  margin-right: 8px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
}

.dataViews-table {
  height: 200px;
  overflow: auto;
}

.dataViews-table th,
td {
  text-align: center;
  vertical-align: middle;
  height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #e4e7ed;
}

.dataViews-table .table-tr-line {
  margin-bottom: 10px;
}

.dataCheck-tab {
  padding-left: 12px;
  padding-top: 12px;
  height: 200px;
  overflow: auto;
}

.dataCheck-tab .logItem span {
  display: inline-block;
  margin-top: 2px;
  margin-bottom: 2px;
}

.dataCheck-tab .logItem .logItem-line {
  width: 100%;
  border-bottom: 1px solid #e4e7ed;
}

.dataCheck-tab .lab {
  letter-spacing: 6px;
}

.tips-none {
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  color: #a7a2a2;
}

.select {
  width: 70%;
}

.plr20 {
  padding: 0 20px;
}

</style>
<style>
.daiInfo-tabs .el-tabs__nav {
  float: none;
  text-align: left !important;
}

.jrborder {
  border: 1px solid #c9cdd0;
}

.taskselect .el-input__inner {
  height: 35px !important;
}

.taskselect .el-input__inner {
  height: 35px !important;
}

</style>
<script>
import axios from "axios";
import DialogIsCheck from "./DialogIsCheck";
export default {
  name: "taskMDialog",
  data: function() {
    return {
      //外层loading
      loading1: true, //接入基本信息的loading
      loading2: true, //接入数据更新的loading
      loading3: true, //任务基本信息的loading
      loading4: true, //汇聚任务日志信息的loading
      loading5: true, //数据核验日志信息的loading
      loading6: true, //数据预览的loading
      flagDesc: "",
      jrtype: "",
      showInnerDialog: true,
      showCheckData: false,
      entFromCheck: false, //是否从数据核验处点击入口
      isCheckLoading: false, //是否因为点击数据核验而展示loading
      httpUrl: window.ENV.API_DOWN + "/",
      httpUrl2: window.ENV.API_DACM + "/",
      operateList: [
        { value: "stop", type: "暂停", disabled: false },
        { value: "run", type: "运行", disabled: false }
      ],
      //任务基本信息
      taskBaseInfo: {
        createTime: "",
        endTime: "",
        networkStatus: "",
        startTime: "",
        status: "0",
        creater: "",
        periodSet: "" //周期设置
      },
      //接入基本信息
      sourceBaseInfo: {
        resourceName: "",
        targetDBName: "",
        sourceId: "",
        targetTableName: "",
        dbType: "",
        period: "",
        sourceObjName: "",
        incrementColumn: "",
        columnType: "",
        sourceObjNameList: "",
        sourceObjNameStr: ""
      },
      //接入数据更新信息
      sourceDataInfo: {
        left: "0",
        source_record_poll_rate: "0.0",
        waiting4processing: "0",
        writeNum: "0"
      },
      //数据预览列表集合
      dataViewsList: [],
      keyList: {},
      //数据核验日志集合
      dataCheckList: [],
      //任务指示灯背景颜色
      lightBackground: {
        background: ""
      },
      //汇聚任务日志信息
      taskLog: ""
    };
  },
  props: ["title", "reqObj"],
  components: {
    DialogIsCheck
  },
  computed: {
    isShow() {
      if (this.sourceBaseInfo.period == 1 || this.sourceBaseInfo.period == 2) {
        if (
          this.sourceBaseInfo.dbType == "mongodb" ||
          this.sourceBaseInfo.dbType == "ftp"
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  },
  created() {
    //查询接入基本信息
    this.getSourceInfo();
    //查询任务基本信息
    this.getTaskInfo();
    //查询接入数据更新
    this.getSourceDataInfo();
    //查询接入任务日志信息
    this.getSourceTaskLog();
    //查询数据核验日志信息
    this.getDataCheckLog();
    //查询数据预览
    this.getDataViews();
  },
  methods: {
    closeDiaChk() {
      this.showCheckData = false;
    },
    setHeadStyle() {
      return {
        background: "#fff",
        color: "#909399"
      };
    },
    //关闭对话框
    closeDia() {
      this.$emit("closeDia");
    },
    //切换当前任务状态
    changeStatus() {
      let that = this;
      this.loading3 = true;
      let statusKey = [
        { stop: "pause/", run: "start/" },
        { stop: 2, run: 1 },
        { stop: "run", run: "stop" }
      ];
      axios
        .put(
          this.httpUrl +
          "manager/taskOperate/" +
          statusKey[0][this.flagDesc] +
          this.reqObj.taskInfoId
        )
        .then(res => {
          res = res.data;
          this.loading3 = false;
          if (res.success) {
            this.doMsg(res.message, "success");
            this.reqObj.status = statusKey[1][this.flagDesc];
            this.getTaskInfo();
          } else {
            this.doMsg(res.message, "error");
            this.flagDesc = statusKey[2][this.flagDesc];
          }
        })
        .catch(err => {
          this.loading3 = false;
          this.flagDesc = statusKey[2][this.flagDesc];
        });

      /* if(that.flagDesc=='stop'){
        //调用暂停接口
        axios.put(that.httpUrl+'manager/taskOperate/pause/'+that.reqObj.taskInfoId).then(
          function(res){
            if(res.data.code!='200'&&res.data.code!='0000'){
              that.doMsg(res.data.message,'error');
              //如果任务状态未切换成功，任务状态下拉框仍显示原来的值“run--运行”
              that.flagDesc ='run';
              that.loading3 = false;
                        

            }else{
              that.doMsg(res.data.message,'success');
              that.reqObj.status = 2;
              //重新查询任务基本信息
                 
              that.getTaskInfo();
            }
          }  
        ).catch(function(err){
          //如果任务状态未切换成功，任务状态下拉框仍显示原来的值“run--运行”
          that.flagDesc=='run';
          that.loading3 = false;
        })
      }else if(that.flagDesc=='run'){
        //调用运行接口
        axios.put(that.httpUrl+'manager/taskOperate/start/'+that.reqObj.taskInfoId).then(
          function(res){
            if(res.data.code!='200'&&res.data.code!='0000'){
              that.doMsg(res.data.message,'error');
              //如果任务状态未切换成功，任务状态下拉框仍显示原来的值“stop--暂停”
              that.flagDesc ='stop';
              that.loading3 = false;
             
            }else{
              that.doMsg(res.data.message,'success');
              that.reqObj.status = 1;
              //重新查询任务基本信息
             
              that.getTaskInfo();
            }
          }
        ).catch(function(err){
          //如果任务状态未切换成功，任务状态下拉框仍显示原来的值“stop--暂停”
          that.flagDesc=='stop';
          that.loading3 = false;
        })
      } */
    },
    //将毫秒转换成周期
    translatePeriodFromMS(ms) {
      //一天的毫秒数
      let dayMS = 86400000;
      //一小时的毫秒数
      let hourMS = 3600000;
      //一分钟的毫秒数
      let minineMS = 60000;
      //一秒钟的毫秒数
      let secondMS = 1000;
      let day = 0;
      let hour = 0;
      let minine = 0;
      let second = 0;
      let mod = 0;
      let str = "每隔";
      day = Math.floor(ms / dayMS); //天数
      mod = ms % dayMS; //天的余数
      hour = Math.floor(mod / hourMS); //小时数
      mod = mod % hourMS; //小时的余数
      minine = Math.floor(mod / minineMS); //分钟数
      mod = mod % minineMS; //分钟的余数
      second = mod / secondMS; //秒数，此时不会有余数，因为毫秒数最小也是1000，即1秒钟
      str = str + (day == 0 ? "" : day + "天");
      str = str + (hour == 0 ? "" : hour + "小时");
      str = str + (minine == 0 ? "" : minine + "分钟");
      return str;
    },

    //将corn表达式转换成周期
    translatePeriodFromCorn(str, timeType) {
      // str="0,5 5 15 ? ? 2 ";
      var result = str.split(" ");
      if (timeType == 2) {
        //月
        let day = result[3] > 9 ? result[3] : "0" + result[3];
        let hour = result[2] > 9 ? result[2] : "0" + result[2];
        let min = result[1] > 9 ? result[1] : "0" + result[1];
        return "每月" + day + "号" + hour + "时" + min + "分";
      } else if (timeType == 3) {
        //周
        var en2cnMap = {
          SUN: "周日",
          MON: "周一",
          TUE: "周二",
          WED: "周三",
          THU: "周四",
          FRI: "周五",
          SAT: "周六"
        };
        let day = en2cnMap[result[5]];
        let hour = result[2] > 9 ? result[2] : "0" + result[2];
        let min = result[1] > 9 ? result[1] : "0" + result[1];
        return "每" + day + hour + "时" + min + "分";
      } else if (timeType == 4) {
        //天
        let hour = result[2] > 9 ? result[2] : "0" + result[2];
        let min = result[1] > 9 ? result[1] : "0" + result[1];
        return "每天" + hour + "时" + min + "分";
      }
    },
    //查询接入基本信息
    getSourceInfo() {
      let that = this;
      that.loading1 = true;
      let reqData = {
        params: {
          taskInfoDetailId: that.reqObj.taskInfoDetailId,
          sourceObjType: that.reqObj.sourceObjType
        }
      };
      axios
        .get(that.httpUrl + "manager/task/detail/source", reqData)
        .then(function(res) {
          if (
            res.data.code == undefined ||
            res.data.code == null ||
            res.data.code == ""
          ) {
            that.doMsg("“/manager/task/detail/source”服务响应为空！", "error");
            that.loading1 = false;
            return;
          }
          if (res.data.code != "200" && res.data.code != "0000") {
            that.doMsg(
              "“/manager/task/detail/source”" + res.data.message,
              "error"
            );
            that.loading1 = false;
            return;
          }
          let sourceObjNameList = res.data.data.sourceTableName;
          let sourceObjNameStr = "";
          let len = res.data.data.sourceTableName.length;
          for (let i = 0; i < len; i++) {
            if (
              res.data.data.sourceTableName[i].type != "VIEW" &&
              res.data.data.sourceTableName[i].type != "TABLE"
            ) {
              sourceObjNameStr =
                sourceObjNameStr + res.data.data.sourceTableName[i].tableName;
              sourceObjNameStr = sourceObjNameStr + (i == len - 1 ? "" : ",");
            }
          }
          let innerReqData = {
            params: {
              taskInfoDetailId: that.reqObj.taskInfoDetailId,
              sourceTableName: res.data.data.sourceTableName[0].tableName
            }
          };
          axios
            .get(that.httpUrl + "manager/task/detail/target", innerReqData)
            .then(function(innerRes) {
              if (
                innerRes.data.code == undefined ||
                innerRes.data.code == null ||
                innerRes.data.code == ""
              ) {
                that.doMsg(
                  "“/manager/task/detail/target”服务响应为空！",
                  "error"
                );
                that.loading1 = false;
                return;
              }
              if (innerRes.data.code != "200" && innerRes.data.code != "0000") {
                that.doMsg(
                  "“/manager/task/detail/target”" + innerRes.data.message,
                  "error"
                );
                that.loading1 = false;
                return;
              }

              that.sourceBaseInfo = innerRes.data.data;
              that.sourceBaseInfo.dbType = res.data.data.dbType;
              let periodMap = {
                0: "实时",
                1: "周期间隔增量",
                2: "周期定时增量",
                3: "一次性接入",
                4: "周期间隔全量",
                5: "周期定时全量"
              };
              //接入类型翻译
              that.sourceBaseInfo.period = innerRes.data.data.period;
              that.sourceBaseInfo.periodDesc =
                periodMap[innerRes.data.data.period];
              //接入对象展示集合
              that.sourceBaseInfo.sourceObjNameList = sourceObjNameList;
              that.sourceBaseInfo.sourceObjNameStr = sourceObjNameStr;
              //接入源名称
              that.sourceBaseInfo.resourceName = res.data.data.sourceSysName;
              that.loading1 = false;
            })
            .catch(function(err) {
              console.log(err);
              that.loading1 = false;
            });
        })
        .catch(function(err) {
          console.log(err);
          that.loading1 = false;
        });
    },
    //查询任务基本信息
    getTaskInfo() {
      let that = this;
      that.loading3 = true;
      //数据获取
      let searchData = {
        params: {
          taskInfoId: that.reqObj.taskInfoId
        }
      };
      axios
        .get(that.httpUrl + "manager/task/taskinfo", searchData)
        .then(function(response) {
          if (response.data.code != "200" && response.data.code != "0000") {
            that.doMsg("/manager/task/taskinfo" + response.data.message, error);
            that.loading3 = false;
          } else {
            that.taskBaseInfo = response.data.data;
            //创建人
            that.taskBaseInfo.creater = that.taskBaseInfo.creater ?
              that.taskBaseInfo.creater.split("/")[1] :
              "";
            let statusMap = {
              0: "创建",
              1: "运行",
              2: "暂停",
              6: "采集失败",
              7: "汇聚失败",
              4: "完成",
              5: "准备中"
            };
            //网络指示灯判断
            that.newWorkTrans(
              that.taskBaseInfo.networkStatus,
              response.data.data.speed,
              true
            );
            //可操作类型
            let t = that.taskBaseInfo.status;
            that.flagDesc = t == 0 || t == 1 || t == 5 ? "run" : "stop";
            //that.reqObj.status = t;
            that.taskBaseInfo.statusDesc =
              that.reqObj.status == 1 ?
              "运行" :
              statusMap[that.taskBaseInfo.status];
            if (that.flagDesc == "stop") {
              that.operateList[1].disabled = false;
              that.operateList[0].disabled = true;
            } else {
              that.operateList[1].disabled = true;
              that.operateList[0].disabled = false;
            }
            //获取周期设置信息 periodSet
            if (that.reqObj.isPeriod == 0 || that.reqObj.isPeriod == 3) {
              //如果任务类型为一次性任务或实时任务，则页面不展示周期设置，所以在此不需要获取，无需操作
            } else {
              //如果任务类型为全量或增量，需要对接口返回的周期任务做转换，显示成可读数据，展示在页面
              /**
               * 周期任务返回规则：(但是interval_ms字段并没有用到，根据入参即可判断任务周期类型)
               * 如果interval_ms为-1即为一次性任务
               * 如果interval_ms不为-1且timeType不等于2、3、4即为间隔执行单位为ms
               * 如果interval_ms不为-1且timeType等于2、3、4即为定时执行执行，interval_ms为corn表达式
               */
              let timeType = that.taskBaseInfo.timeType;
              let intervalMs = that.taskBaseInfo.intervalMs;
              if (timeType != 2 && timeType != 3 && timeType != 4) {
                //timeType不等于2、3、4即为间隔执行单位为ms
                that.taskBaseInfo.periodSet = that.translatePeriodFromMS(
                  intervalMs
                );
              } else if (timeType == 2 || timeType == 3 || timeType == 4) {
                //timeType等于2、3、4即为定时执行执行，interval_ms为corn表达式
                that.taskBaseInfo.periodSet = that.translatePeriodFromCorn(
                  intervalMs,
                  timeType
                );
              }
            }
            that.loading3 = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          that.loading3 = false;
        });
    },
    //数据核验按钮点击
    checkData() {
      //isTestLink控制是否展示数据核验弹框
      var _self = this;
      _self.isCheckLoading = true;
      _self.jrtype = _self.sourceBaseInfo.dbType;
      if (_self.jrtype == 'ftp') {
        _self.$ajax({
          method: 'get',
          url: _self.GLOBAL.api.API_DACM + '/ctables/checkFtpTaskFileExist',
          //url: 'http://10.19.160.59:8080/DACM/ctables/checkFtpTaskFileExist',
          params: { 'taskId': _self.reqObj.taskInfoId },
        }).then(res => {
          _self.loading = false;
          if (res.data.success && res.data.data.length > 0) {
            res.data.data.forEach(res => {
              if (res.isExitFile == 'true') {
                if (_self.taskBaseInfo.statusDesc == '运行') {
                  _self.$confirm('当前任务正在运行中， 数据核验结果可能不精准，请确认是否要继续数据核验？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: "el-button--primary",
                    type: 'warning'
                  }).then(() => {
                    _self.showCheckData = true;
                    _self.entFromCheck = false;
                    //接入数据更新是否通过测试连接接口展示loading，这个时候是点击“数据核验”时加载的loading
                    _self.isCheckLoading = false;
                    _self.loading3 = false;
                  }).catch(() => {
                    _self.isCheckLoading = false;
                    _self.loading3 = false;
                  })
                } else {
                  _self.showCheckData = true;
                  _self.entFromCheck = false;
                  //接入数据更新是否通过测试连接接口展示loading，这个时候是点击“数据核验”时加载的loading
                  _self.isCheckLoading = false;
                  _self.loading3 = false;
                }

              } else {
                _self.isCheckLoading = false;
                _self.loading3 = false;
                _self.doMsg(res.message, "error");
              }
            })
          } else {
            _self.isCheckLoading = false;
            _self.loading3 = false;
            _self.doMsg(res.data.message, "error");
          }
        })
      } else {
        if (_self.taskBaseInfo.statusDesc == '运行') {
          _self.$confirm('当前任务正在运行中， 数据核验结果可能不精准，请确认是否要继续数据核验？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: "el-button--primary",
            type: 'warning'
          }).then(() => {
            _self.showCheckData = true;
            _self.entFromCheck = false;
            //接入数据更新是否通过测试连接接口展示loading，这个时候是点击“数据核验”时加载的loading
            _self.isCheckLoading = false;
            _self.loading3 = false;
          }).catch(() => {
            _self.isCheckLoading = false;
            _self.loading3 = false;
          })
        } else {
          _self.showCheckData = true;
          _self.entFromCheck = false;
          //接入数据更新是否通过测试连接接口展示loading，这个时候是点击“数据核验”时加载的loading
          _self.isCheckLoading = false;
          _self.loading3 = false;
        }
      }

    },
    //点击测试连接按钮，进行接口条用
    testConnect() {
      let that = this;
      that.loading3 = true;
      let reqData = {
        params: {
          taskInfoId: that.reqObj.taskInfoId
        }
      };
      axios
        .get(that.httpUrl + "manager/task/testTaskNetworkStatus", reqData)
        .then(function(res) {
          if (res.data == undefined || res.data == null || res.data === "") {
            that.doMsg("服务无数据返回", "error");
          } else if (res.data.code != "200" && res.data.code != "0000") {
            that.doMsg(
              "/manager/task/testTaskNetworkStatus:" + res.data.message,
              "error"
            );
          } else {
            that.taskBaseInfo.networkStatus = res.data.data.networkStatus;
            that.newWorkTrans(
              that.taskBaseInfo.networkStatus,
              res.data.data.speed
            );
            if (that.taskBaseInfo.networkStatus == 2) {
              that.isTestLink = false;
              if (that.entFromCheck) {
                that.doMsg("数据核验失败！", "error");
              }
            } else {
              that.isTestLink = true;
            }
          }
          that.loading3 = false;
          that.isCheckLoading = false;
          that.entFromCheck = false;
        })
        .catch(function(err) {
          console.log(err);
          that.loading3 = false;
          that.isCheckLoading = false;
          that.entFromCheck = false;
        });
    },
    //查询接入数据更新
    getSourceDataInfo() {
      let that = this;
      that.loading2 = true;
      axios
        .put(
          that.httpUrl +
          "manager/taskOperate/dataInfo/" +
          that.reqObj.taskInfoId
        )
        .then(function(res) {
          if (res.data == undefined || res.data == null || res.data === "") {
            that.doMsg("服务无数据返回", "error");
          } else if (res.data.code != "0000" && res.data.code != "200") {
            that.doMsg(
              "/manager/taskOperate/dataInfo/" + res.data.data.message,
              "error"
            );
          } else {
            if (that.reqObj.status != "5") {
              that.sourceDataInfo = res.data.data;
            }
          }
          that.loading2 = false;
        })
        .catch(function(err) {
          that.loading2 = false;
        });
    },
    //查询接入任务日志信息
    getSourceTaskLog() {
      let that = this;
      that.loading4 = true;
      axios
        .put(
          that.httpUrl +
          "manager/taskOperate/taskLogInfo/" +
          that.reqObj.taskInfoId
        )
        .then(function(res) {
          //判断响应是否异常
          if (res.data.code != "200" && res.data.code != "0000") {
            that.doMsg(
              "/manager/taskOperate/taskLogInfo/" + res.data.data.message,
              "error"
            );
          } else {
            that.taskLog =
              (res.data.data.logInfo || "") == "" ?
              "" :
              `\t${res.data.data.logInfo}`;
          }
          that.loading4 = false;
        })
        .catch(function(err) {
          console.log(err);
          that.loading4 = false;
        });
    },
    //查询数据核验日志信息
    getDataCheckLog() {
      let that = this;
      that.loading5 = true;
      let reqData = {
        params: {
          taskId: that.reqObj.taskInfoId
        }
      };
      axios
        .get(that.httpUrl2 + "ccheckData/checkLogByTaskId", reqData)
        .then(function(res) {
          if (res.data.code != "200" && res.data.code != "0000") {
            that.doMsg(
              "/ccheckData/checkLogByTaskId" + res.data.message,
              "error"
            );
          } else {
            that.dataCheckList = res.data.data;
          }
          that.loading5 = false;
        })
        .catch(function(err) {
          console.log(err);
          that.loading5 = false;
        });
    },
    //查询数据预览
    getDataViews() {
      let that = this;
      that.loading6 = true;
      axios
        .put(
          that.httpUrl +
          "manager/taskOperate/dataPreview/" +
          that.reqObj.taskInfoId
        )
        .then(function(res) {
          if (res.data.code != "200" && res.data.code != "0000") {
            that.doMsg(
              "/manager/taskOperate/dataPreview：" + res.data.message,
              "error"
            );
          } else if (res.data.data.length != 0) {
            that.dataViewsList = res.data.data;
            that.keyList = {};
            let newMap = {};
            for (var p in that.dataViewsList[0]) {
              let value = that.dataViewsList[0][p];
              let headerValue = p.split("/")[0];
              //let headerKey = p.split('/')[1];
              that.keyList[headerValue] = headerValue;
              //newMap[headerKey] = value;
            }
            //that.dataViewsList.shift(0);
            //that.dataViewsList.unshift(newMap);
          }
          that.loading6 = false;
        })
        .catch(function(err) {
          console.log(err);
          that.loading6 = false;
        });
    },
    //网络测试指示灯及内容翻译
    newWorkTrans(value, speed, flag) {
      let newWorkMap = {
        0: "rgb(27, 255, 0)",
        1: "rgb(255, 153, 0)",
        2: "rgb(255, 35, 0)"
      };
      this.lightBackground.background = newWorkMap[value];
      let newWorkDescMap = {
        0: "数据源连接正常（数据源访问正常，ping的响应时间在10秒内）",
        1: "数据源连接不稳定（数据源能访问，ping的响应时间在10秒-30秒内）",
        2: "数据源不通"
      };
      if (flag) {
        this.taskBaseInfo.newWorkDesc = newWorkDescMap[value];
      } else {
        speed = speed || 0;
        this.taskBaseInfo.newWorkDesc =
          newWorkDescMap[value] + " " + speed + "kb/s";
      }
    },
    //信息提示
    doMsg(msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type,
        duration: 3500
      });
    }
  }
};

</script>
