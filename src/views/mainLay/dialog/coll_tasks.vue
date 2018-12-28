<template>
  <div class="taskMDialog collTaskDia" v-loading="loading">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
      <div class="daiInfo proInfo">
        <div class="proInfo-box clearfix">
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="接入目的库:" prop="dLibrary">
                <el-select v-model="ruleForm.dLibrary" placeholder="请选择">
                  <!-- <el-option label="全国" value="0"></el-option>
                  <el-option label="全省" value="1"></el-option>
                  <el-option label="全市" value="2"></el-option>
                  <el-option label="行政区" value="3"></el-option> -->
                  <el-option v-for="item in treeData" :label="item.label" :value="item.storageId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="bank">bank</el-col>
            <el-col :span="6">
              <!--  <el-input v-model="ruleForm.tablename"></el-input> -->
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-form-item label="接入方式:" prop="accessMode">
              <el-radio-group v-model="ruleForm.accessMode">
                <el-radio label="1">增量接入</el-radio>
                <el-radio label="3">全量接入</el-radio>
                <!-- <el-radio label="0">实时接入</el-radio> -->
                <el-radio label="2">一次性接入</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="接入优先级:" prop="accessPri">
              <el-radio-group v-model="ruleForm.accessPri">
                <el-radio label="1">高</el-radio>
                <el-radio label="2">中</el-radio>
                <el-radio label="3">低</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任务提交方式:" prop="taskSubMode">
              <el-radio-group v-model="ruleForm.taskSubMode">
                <el-radio label="true">自动提交</el-radio>
                <el-radio label="false">手工提交</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="8" class="collbg" v-if="this.ruleForm.accessMode=='1'">
              <el-form-item label="增量字段:" prop="increment">
                <el-input v-model="ruleForm.increment" class="fl"></el-input>
                <el-button type="primary" class="fl increbtn" @click="innerVisible = true">选择</el-button>
                <incre-map :msg='innerVisible' :incid="this.rowList[0].id" :alincre="this.increArr" @showIncre="showIncrement()" @saveIncre="saveIncrement($event)"></incre-map>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="采集技术:" prop="actech">
                <el-select v-model="ruleForm.actech" placeholder="请选择" disabled>
                  <el-option label="JDBC" value="JDBC"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-col>
          <el-col :span="24" v-show="ruleForm.accessMode=='1'||ruleForm.accessMode=='3'">
            <el-form-item label="周期设置:" prop="cycleSet">
              <div class="wid100 collradio cycdiv">
                <el-col :span="24">
                  <el-col :span="1" class="bank">bank</el-col>
                  <el-col :span="4" class="line40">
                    <el-radio label="0" v-model="ruleForm.cycleSet">间隔执行
                    </el-radio>
                  </el-col>
                  <el-col :span="19">
                    <el-col :span="2">
                      <el-form-item class="clearfix">
                        <span class="mr10">每隔</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-input v-model="ruleForm.jday"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item class="clearfix tcenter">
                        <span class="mr10">天</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-select v-model="ruleForm.jhour" placeholder="请选择">
                          <el-option v-for="item in hourData" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item class="clearfix tcenter">
                        <span class="mr10">时</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-select v-model="ruleForm.jmin" placeholder="请选择">
                          <el-option v-for="item in minData" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item class="clearfix tcenter">
                        <span class="mr10">分</span>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col :span="1" class="bank">bank</el-col>
                  <el-col :span="4" class="line40">
                    <el-radio label="1" v-model="ruleForm.cycleSet">定时执行
                    </el-radio>
                  </el-col>
                  <el-col :span="19">
                    <el-col :span="24" class="line40">
                      <el-col :span="1" class="oparadio">
                        <el-radio v-model="radio" label="2"> </el-radio>
                      </el-col>
                      <el-col :span="21">
                        <el-col :span="2">
                          <el-form-item class="clearfix">
                            <span class="mr10">每月</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="ruleForm.dfmon" placeholder="请选择">
                              <el-option v-for="item in monthData" :key="item" :label="item" :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item class="clearfix tcenter">
                            <span class="mr10">号</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="ruleForm.dfhour" placeholder="请选择">
                              <el-option v-for="item in hourData" :key="item" :label="item" :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item class="clearfix tcenter">
                            <span class="mr10">时</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="ruleForm.dfmin" placeholder="请选择">
                              <el-option v-for="item in minData" :key="item" :label="item" :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item class="clearfix tcenter">
                            <span class="mr10">分</span>
                          </el-form-item>
                        </el-col>
                      </el-col>
                    </el-col>
                    <el-col :span="24" class="line40">
                      <el-col :span="1" class="oparadio">
                        <el-radio v-model="radio" label="3"> </el-radio>
                      </el-col>
                      <el-col :span="21">
                        <el-col :span="2">
                          <el-form-item class="clearfix">
                            <span class="mr10">每周</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item class="clearfix tcenter">
                            <span class="mr10">星期</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="ruleForm.dsweek" placeholder="请选择">
                              <el-option v-for="item in weekData" :label="item.name" :value="item.val">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="ruleForm.dshour" placeholder="请选择">
                              <el-option v-for="item in hourData" :key="item" :label="item" :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item class="clearfix tcenter">
                            <span class="mr10">时</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="ruleForm.dsmin" placeholder="请选择">
                              <el-option v-for="item in minData" :key="item" :label="item" :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item class="clearfix tcenter">
                            <span class="mr10">分</span>
                          </el-form-item>
                        </el-col>
                      </el-col>
                    </el-col>
                    <el-col :span="24" class="line40">
                      <el-col :span="1" class="oparadio">
                        <el-radio v-model="radio" label="4"> </el-radio>
                      </el-col>
                      <el-col :span="21">
                        <el-col :span="2">
                          <el-form-item class="clearfix">
                            <span class="mr10">每天</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="ruleForm.dthour" placeholder="请选择">
                              <el-option v-for="item in hourData" :key="item" :label="item" :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item class="clearfix tcenter">
                            <span class="mr10">时</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="ruleForm.dtmin" placeholder="请选择">
                              <el-option v-for="item in minData" :key="item" :label="item" :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <el-form-item class="clearfix tcenter">
                            <span class="mr10">分</span>
                          </el-form-item>
                        </el-col>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
              </div>
            </el-form-item>
          </el-col>
        </div>
      </div>
    </el-form>
    <div class="btn tcenter mt30">
      <el-button type="primary" style="margin-top: 12px;" @click="pre()">上一步</el-button>
      <el-button type="primary" style="margin-top: 12px;" @click="finish()">完成</el-button>
    </div>
  </div>
</template>
<script>
import increMap from '@/views/mainLay/dialog/incre_map' //增量字段

export default {
  name: "userSurvey",
  data: function() {
    return {
      dialogVisible: false,
      innerVisible: false,
      increArr: {},
      monthData: [],
      minData: [],
      hourData: [],
      weekData: [],
      treeData: [],
      appId: '',
      accId: '',
      loading: false,
      radio: '',
      ruleForm: {
        dLibrary: '', //接入目的库
        tablename: '', //建立的表名
        accessMode: '1', //接入方式
        increment: '', //增量字段
        actech: 'JDBC', //采集技术
        cycleSet: '0', //周期设置
        jday: '', //间隔执行天数
        jmin: '',
        jhour: '',
        dfmon: '', //定时执行月数
        dfmin: '',
        dsmin: '',
        dshour: '',
        dsweek: '',
        dfhour: '',
        dthour: '',
        dtmin: '',
        accessPri: '1', //优先级
        taskSubMode: 'true' //提交方式
      },
      formRules: {
        increment: [{
          required: true,
          message: '请选择增量字段',
        }]
      },
      value2: new Date(2016, 9, 10, 18, 40)
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
                  this.websocketclose();

    },

    //关闭
    closeForm() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
                  this.websocketclose();

    },
    //增量字段弹框的再次打开
    showIncrement() {

      this.innerVisible = false;
    },
    saveIncrement(value) {
      this.increArr = value;
      console.log("****" + this.increArr);
      this.ruleForm.increment = this.increArr.name;
      this.innerVisible = false;
    },
    //月数
    _monthData() {
      for (let i = 1; i < 29; i++) {
        this.$set(this.monthData, i, i);
      }
      console.log(this.monthData);
    },
    _minData() {
      for (let i = 0; i < 60; i++) {
        this.$set(this.minData, i, i);
      }
    },
    _hourData() {
      for (let i = 0; i < 24; i++) {
        this.$set(this.hourData, i, i);
      }
    },
    _weekData() {
      for (let i = 1; i < 8; i++) {
        var weekday = '';
        if (i == 1) {
          weekday = '一';
        }
        if (i == 2) {
          weekday = '二';
        }
        if (i == 3) {
          weekday = '三';
        }
        if (i == 4) {
          weekday = '四';
        }
        if (i == 5) {
          weekday = '五';
        }
        if (i == 6) {
          weekday = '六';
        }
        if (i == 7) {
          weekday = '日';
        }
        this.weekData.push({
          name: weekday,
          val: i
        })
      }
    },
    _saveUser() {

    },
    pre() {
      this.$emit('pre');
    },
    weekTrans(val) {
      if (val == '1') {
        return 'MON';
      }
      if (val == '2') {
        return 'TUE';
      }
      if (val == '3') {
        return 'WED';
      }
      if (val == '4') {
        return 'THU';
      }
      if (val == '5') {
        return 'FRI';
      }
      if (val == '6') {
        return 'SAT';
      }
      if (val == '7') {
        return 'SUN';
      }
    },
    finish() {
      //间隔执行
      var pollIntervalMs = "-1";
      var actech = this.ruleForm.actech;
      if (this.ruleForm.cycleSet == '0' && this.ruleForm.accessMode != "0" && this.ruleForm.accessMode != "2") {
        let jday = 0;;
        let jhour = 0;
        let jmin = 0;
        if (this.ruleForm.jmin === '' || this.ruleForm.jmin == undefined) {
          if (this.ruleForm.jhour == '' && this.ruleForm.jday == '') {
            this.$message.warning('请输入正确的间隔时间');
            return false;
          }
        } else if (this.ruleForm.jmin == 0) {
          if (this.ruleForm.jhour == '' && this.ruleForm.jday == '') {
            this.$message.warning('请输入正确的间隔时间');
            return false;
          }
        }
        if (this.ruleForm.jday !== '' && this.ruleForm.jday != undefined) {
          if (this.ruleForm.jday == '0'&&this.ruleForm.jhour==='0'&&this.ruleForm.jmin==='0') {
            this.$message.warning('请输入正确的间隔时间');
            return false;
          }
          else{
            jday = this.ruleForm.jday;
          }
        }
        if (this.ruleForm.jhour !== '' && this.ruleForm.jhour != undefined) {
          jhour = this.ruleForm.jhour;
        }
        if (this.ruleForm.jmin !== '' && this.ruleForm.jmin != undefined) {
          jmin = this.ruleForm.jmin;
        }
        var pollIntervalMs = this.formateTime(parseInt(jday), parseInt(jhour), parseInt(jmin));
        console.log(pollIntervalMs);
      } else if (this.ruleForm.cycleSet == '1' && this.ruleForm.accessMode != "0" && this.ruleForm.accessMode != "2") {
        if (this.radio == '') {
          this.$message.warning('请选择定时执行时间');
          return false;
        }
        if (this.radio == '2') {
          //第一队列
          //第一队列
          let dfmin;
          let dfhour;
          let dfmon;
          if (this.ruleForm.dfmin === '' || this.ruleForm.dfhour === '' || this.ruleForm.dfmon == '' || this.ruleForm.dfmon == undefined) {
            this.$message.warning('请将定时执行时间填写完整');
            return false;
          }
          if (this.ruleForm.dfmin !== '' && this.ruleForm.dfmin != undefined) {
            dfmin = this.ruleForm.dfmin;
          }
          if (this.ruleForm.dfhour !== '' && this.ruleForm.dfhour != undefined) {
            dfhour = this.ruleForm.dfhour;
          }
          if (this.ruleForm.dfmon !== '' && this.ruleForm.dfmon != undefined) {
            dfmon = this.ruleForm.dfmon;
          }
          var pollIntervalMs = `0 ${dfmin} ${dfhour} ${dfmon} * ?`;
          console.log(pollIntervalMs);
        }
        if (this.radio == '3') {
          //第二队列
          let dsmin;
          let dshour;
          let dsweek;
          if (this.ruleForm.dsmin === '' || this.ruleForm.dshour === '' || this.ruleForm.dsweek == '' || this.ruleForm.dsweek == undefined) {
            this.$message.warning('请将定时执行时间填写完整');
            return false;
          }
          if (this.ruleForm.dsmin !== '' && this.ruleForm.dsmin != undefined) {
            dsmin = this.ruleForm.dsmin;
          }
          if (this.ruleForm.dshour !== '' && this.ruleForm.dshour != undefined) {
            dshour = this.ruleForm.dshour;
          }
          if (this.ruleForm.dsweek !== '' && this.ruleForm.dsweek != undefined) {
            dsweek = this.weekTrans(this.ruleForm.dsweek);
          }
          var pollIntervalMs = `0 ${dsmin} ${dshour} ? * ${dsweek}`;
          console.log(pollIntervalMs);
        }
        if (this.radio == '4') {
          //第三队列
          let dtmin;
          let dthour;
          if (this.ruleForm.dtmin === '' || this.ruleForm.dthour === '') {
            this.$message.warning('请将定时执行时间填写完整');
            return false;
          }
          if (this.ruleForm.dtmin !== '' && this.ruleForm.dtmin != undefined) {
            dtmin = this.ruleForm.dtmin;
          }
          if (this.ruleForm.dthour !== '' && this.ruleForm.dthour != undefined) {
            dthour = this.ruleForm.dthour;
          }

          var pollIntervalMs = `0 ${dtmin} ${dthour} * * ? *`;
          console.log(pollIntervalMs);
        }
      }
      var ctt = '';
      if (this.ruleForm.accessMode == "0") { //实时
        ctt = '0';
        //actech = this.$route.params.type;
      }
      if (this.ruleForm.accessMode == "2") { //实时
        ctt = '3'
      }
      if (this.ruleForm.accessMode == "1" && this.ruleForm.cycleSet == "0") { //间隔
        ctt = '1';
        if (this.increArr.id == undefined) {
          this.$message.warning('请选择增量字段');
          return false;
        }
      }
      if (this.ruleForm.accessMode == "1" && this.ruleForm.cycleSet == "1") { //实时
        ctt = '2';
        if (this.increArr.id == undefined) {
          this.$message.warning('请选择增量字段');
          return false;
        }
      }
      if (this.ruleForm.accessMode == "3" && this.ruleForm.cycleSet == "0") { //间隔
        ctt = '4';
        /* if (this.increArr.id == undefined) {
           this.$message.warning('请选择增量字段');
           return false;
         }*/
      }
      if (this.ruleForm.accessMode == "3" && this.ruleForm.cycleSet == "1") { //实时
        ctt = '5';
        /*if (this.increArr.id == undefined) {
          this.$message.warning('请选择增量字段');
          return false;
        }*/
      }
      this._reveAcmode();
      var save = {
        "accessSysObjDetails": this.increArr,
        "priority": this.ruleForm.accessPri,
        "jobType": actech,
        "accessSysObjInfoId": this.accId,
        "pollIntervalMs": pollIntervalMs,
        "schemaMappingDTOList": this.$store.state.schemaList,
        "separator": this.$store.state.separator,
        "accessRelationWorkInfoId": this.ruleForm.dLibrary,
        "collectionTaskType": ctt,
        "isStartOverTask": this.ruleForm.taskSubMode,
        "timeType": this.radio,
        "regexInfo": this.$store.state.regInfo.baseEnd,
        "isCustom": this.$store.state.regInfo.baseflag,
        "tableCommonName": this.$store.state.regInfo.baseStart,
        "accessSysId": this.rowList[0].accessSys.id
      }
      this.loading = true;
      let saves = {};

      if (this.$store.state.isSign == "false" || this.$store.state.isSign == false) {
        saves = this.$store.state.userList;
        saves.dATA_UPDATE_MODE = this.$store.state.modeStyle;
        saves.tABLE_ID = this.accId;
      } else {
        saves = this.$store.state.userList;
        saves.dATA_UPDATE_MODE = this.$store.state.modeStyle;
        saves.isCustom = this.$store.state.regInfo.baseflag;
        saves.isBatch = true;
        saves.regexInfo = this.$store.state.regInfo.baseEnd;
        saves.tableCommonName = this.$store.state.regInfo.baseStart;

      }
      this.$ajax({
        method: 'post',
        url: this.GLOBAL.api.API_DACM + '/dataTable/inputSurvey',
        data: saves
      }).then(res => {

        if (res.data.success) {
          this.$ajax({
            method: "post",
            /* url:'http://10.19.160.168:8080/DACM/task/saveRegexHeliumTask',*/
            url: this.GLOBAL.api.API_DACM + '/task/saveRegexHeliumTask',
            // headers:{
            //   'Content-Type':'application/json;charset=utf-8',
            // },
            data: save

          }).then(res => {
            this.loading = false;
            if (res.data.success) {
              let ctips = '采集任务启动成功！';
              if (this.ruleForm.taskSubMode == "false") {
                ctips = '采集任务创建成功！';
              }
              this.$alert(ctips, '信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$emit('fresh');
                }
              });
            } else {
              this.$alert('采集任务启动失败！', '信息', {
                confirmButtonText: '确定',
                callback: action => {

                }
              });
            }
          })
        } else {
          this.loading = false;
          this.$alert('用户标记失败', '信息', {
            confirmButtonText: '确定'
          });
        }
      }, (res) => {
        this.loading = false;
        this.$alert('用户标记失败', '信息', {
          confirmButtonText: '确定'
        });
      })
    },
    formateTime(day, hour, min) {
      return parseInt(day * 86400000 + hour * 3600000 + min * 60000);
    },
    _getAcmode() {
      if (this.$store.state.modeStyle == '1') { //增量接入
        this.ruleForm.accessMode = '1'
      }
      if (this.$store.state.modeStyle == '3') { //增量接入
        this.ruleForm.accessMode = '3'
      }
      if (this.$store.state.modeStyle == '5') { //增量接入
        this.ruleForm.accessMode = '1'
      }
      if (this.$store.state.modeStyle == '4') { //增量接入
        this.ruleForm.accessMode = '2'
      }
    },
    _reveAcmode() {
      if (this.ruleForm.accessMode == '1') {
        this.$store.commit('setMode', '1');
      }
      if (this.ruleForm.accessMode == '3') {
        this.$store.commit('setMode', '3');
      }
      if (this.ruleForm.accessMode == '0') {
        this.$store.commit('setMode', '5');
      }
      if (this.ruleForm.accessMode == '2') {
        this.$store.commit('setMode', '4');
      }
    },
    //获取源树
    _getTree() {
      this.$ajax({
        method: 'get',
        url: this.GLOBAL.api.API_DACM + '/caccesssysRelationWorkInfo/getDataAreaNode',

      }).then(res => {
        this.treeData = res.data;
        this.ruleForm.dLibrary = res.data[0].storageId
      })
    }
  },
  components: {
    increMap
  },
  mounted() {

  },
  created() {

  },
  computed: {

  },
  props: ['rowList', 'msg'],
  watch: {

    msg() {
      if (this.msg == "fourth") {
        if (this.rowList.length != undefined) {
          this.accId = this.rowList[0].id;
        } else {
          this.accId = this.rowList.id;
        }
        this._getAcmode();
        this._monthData();
        this._minData();
        this._hourData();
        this._weekData();
        this._getTree();
      }
    }

  }

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.cycdiv {
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  font-size: 0;
}

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

.increbtn.el-button--medium {
  padding: 7px 20px;
  margin-left: 10px;
  margin-top: 1px;
}

.collbg {
  .el-input,
  .wildbg .el-select {
    width: 50%;
  }
}

.collradio {
  .line40 {
    line-height: 40px;
  }
}

.oparadio {
  .el-radio__label {
    display: none;
  }
}

</style>
