<template>
  <div class="taskMDialog" style="padding-bottom:15px;" >
    <el-dialog :title="reqObj.taskName" :close-on-click-modal="false" :visible.sync="showInnerDialog" @closed="closeDia" class="task-Detail-dialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form label-width="150px" class="demo-ruleForm">
        <span style="float:right">当前状态:
          <el-select v-model="flagDesc" :disabled="loading3" placeholder="请选择" @change="changeStatus" class="select">
            <el-option
              v-for="item in operateList"
              :key="item.value"
              :label="item.type"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
          <!-- <el-button style="margin-left:10px" type="primary" size="small" @click="changeStatus">{{flagDesc=='stop'?'暂停':'运行'}}</el-button> -->
          </span>
        <!-- 接入基本信息 模块开始-->
        <div class="daiInfo proInfo" v-loading="loading1">
          <div class="daiInfo-title proInfo-title">
            <h2>接入基本信息</h2>
          </div>
          <div class="proInfo-box clearfix">
            <el-col :span="10">
              <el-form-item label="接入源名称:">
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
              <el-form-item label="目标表:">
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
            <el-col :span="10">
              <el-form-item label="接入对象:">
                <span>{{sourceBaseInfo.sourceObjName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="增量字段:">
                <span>{{sourceBaseInfo.incrementColumn}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="bank">bank</el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="增量字段类型:">
                <span>{{sourceBaseInfo.columnType}}</span>
              </el-form-item>
            </el-col>
          </div>
        </div>
        <!-- 接入基本信息 模块结束 -->

        <!-- 接入数据更新 模块开始 -->
        <div class="daiInfo dockInfo" v-loading="loading2">
          <div class="daiInfo-title">
            <h2>接入数据更新</h2>
          </div>
          <div class="daiInfo-box clearfix">
            <el-col :span="10">
              <el-form-item label="已接入数据量:">
                <span>{{sourceDataInfo.writeNum}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" @click="isShowCheck=true">数据核验</el-button>
            </el-col>
            <el-col :span="10">
              <el-form-item label="剩余数据量预估:">
                <span>{{sourceDataInfo.left}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="当前数据接入速率:">
                <span>{{sourceDataInfo.source_record_poll_rate}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="待处理数据量:">
                <span>{{sourceDataInfo.waiting4processing}}</span>
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
                  <span class="label-color" v-bind:style="lightBackground"></span>{{taskBaseInfo.newWorkDesc}}
                </div>
              <!-- <span>网络当前不问题，当前速率为20kbps/s</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" @click="testConnect()">测试连接</el-button>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最近一次任务开始时间:">
                <span>{{taskBaseInfo.startTime}}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="4" class="bank">bank</el-col> -->
            <!-- <el-col :span="10" class="bank">bank</el-col> -->
            <el-col :span="12">
              <el-form-item label="任务创建时间:">
                <span>{{taskBaseInfo.createTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最近一次任务结束时间:" >
                <span>{{taskBaseInfo.endTime}}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="4" class="bank">bank</el-col> -->
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
              <el-tab-pane label="汇聚任务日志信息">
                <div class="dataCheck-tab" v-loading="loading4">
                  <textarea v-show="taskLog!=''" name="" id="" cols="30" rows="12" disabled="disabled" style="resize:none;width: 100%; height: 180px;border:none;background:inherit" >{{taskLog}}</textarea>
                  <div class="tips-none" v-show="taskLog==''">暂无数据</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="数据核验日志信息">
                <div class="dataCheck-tab" v-loading="loading5">
                  <div class="logItem" v-for="item in dataCheckList" :key="item.source_library">
                    <span class="lab">源库：</span><span>{{item.source_library}}</span>
                    <br>
                    <span class="lab">源表：</span><span>{{item.source_tableName}}</span>
                    <br>
                    <span class="lab">执行结果：</span><span>{{item.source_tableNum}}</span>
                    <br>
                    <span class="lab">数据核验查询语句：</span><span>{{item.source_sql}}</span>
                    <br>
                    <br>
                    <span class="lab">目标库：</span><span>{{item.target_library}}</span>
                    <br>
                    <span class="lab">目标表：</span><span>{{item.target_tableName}}</span>
                    <br>
                    <span class="lab">执行结果：</span><span>{{item.target_tableNum}}</span>
                    <br>
                    <span class="lab">数据核验查询语句：</span><span>{{item.target_sql}}</span>
                    <br>
                    <br>
                    <span class="lab">核验结果：</span><span>{{item.testresults_result==0?'成功':'失败'}}</span>
                    <br>
                    <span class="lab">核验差值</span><span>{{item.testresults_dvalue}}</span>
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
                <div class="dataCheck-tab" v-loading="loading3">
                  {{taskBaseInfo.newWorkDesc}}
                </div>
              </el-tab-pane>
              <el-tab-pane class="test" label="数据预览">
                <!-- 数据预览 表格开始 -->
                <!-- 数据预览表头不确定，根据接口返回的list集合对象里的key值来确定，所以采用如下写法实现 -->
                <div class="dataViews-table" v-loading="loading6">
                  <div class="table-header">
                    <div class="table-th">
                      <span v-for="keyitem in keyList" :key="keyitem">{{keyitem}}</span>
                    </div>
                    <div class=table-tr-line></div>
                  </div>
                  <div class="table-body">
                    <div class="table-tr" v-for="item in dataViewsList" :key="item[keyList[0]]">
                      <div class=table-tr-context>
                        <span v-for="keyitem in keyList" :key="keyitem">{{item[keyitem]}}</span>
                      </div>
                      <div class=table-tr-line></div>
                    </div>
                  </div>
                  <div class="tips-none" v-show="keyList.length==0">暂无数据</div>
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
    <dialogIsCheck :msgCheck="reqObj" v-if="isShowCheck"></dialogIsCheck>
  </div>
</template>
<style lang="scss">
.task-Detail-dialog {
  .el-dialog{
        min-width: 80%;
        max-height:calc(100% - 50px);
        overflow:auto;
        margin-bottom: 25px;
        margin-top: 25px!important;
        height: 100%!important;
    }
}
</style>

<style lang="scss" scoped>
.el-radio+.el-radio {
  margin-left: 19px;
}
.label-color{
  // background-color:rgb(255, 153, 0);
  display: inline-block;
  margin-right: 8px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
}
.dataViews-table{
  height: 200px;
  overflow: auto;
}
.dataViews-table span{
  display:inline-block;
  width:20%;
  text-align: center;
  vertical-align: middle;
  height: 30px;
}
.dataViews-table .table-tr-line{
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 10px;
}
.dataCheck-tab{
  padding-left: 12px;
  padding-top: 12px;
  height: 200px;
  overflow: auto;
}
.dataCheck-tab .logItem span{
  display: inline-block;
  margin-top: 2px;
  margin-bottom: 2px;
  
}
.dataCheck-tab .logItem .logItem-line{
  width: 100%;
  border-bottom: 1px solid #e4e7ed;
}
.dataCheck-tab .lab{
  letter-spacing: 6px;
}
.tips-none{
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  color: #a7a2a2;
}
.select{
  width: 70%;
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
      loading1:true,//接入基本信息的loading
      loading2:true,//接入数据更新的loading
      loading3:true,//任务基本信息的loading
      loading4:true,//汇聚任务日志信息的loading
      loading5:true,//数据核验日志信息的loading
      loading6:true,//数据预览的loading
      flagDesc:'',
      showInnerDialog: true,
      isShowCheck:false,
      httpUrl:window.ENV.API_DOWN+'/',
      httpUrl2:window.ENV.API_DACM+'/',
      operateList:[
        {'value':'stop','type':'暂停','disabled':false},
        {'value':'run','type':'运行','disabled':false},
      ],
      //任务基本信息
      taskBaseInfo:{
        createTime: "",
        endTime: "",  
        networkStatus: "",
        startTime: "",
        status: "1" ,
        creater:''
      },
      //接入基本信息
      sourceBaseInfo:{
        resourceName :"",
        targetDBName :"",
        sourceId :"",
        targetTableName :"", 
        dbType :"",
        period :"",
        sourceObjName :"",
        incrementColumn :"",
        columnType :""
      },
      //接入数据更新信息
      sourceDataInfo:{
        left:'',
        source_record_poll_rate:'',
        waiting4processing:'',
        writeNum:''
      },
      //数据预览列表集合
      dataViewsList:[],
      keyList:[],
      //数据核验日志集合
      dataCheckList:[],
      //任务指示灯背景颜色
      lightBackground: {
        'background':''
      },
      //汇聚任务日志信息
      taskLog:'',
    };
  },
  props: ["title",'reqObj'],
  components:{
    DialogIsCheck
  },
  created(){
    console.log("页面入参",this.reqObj);
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
    //查询网络连接信息--与上面查询任务基本信息一个接口，所以在此不需要调用专门的查询
    //this.getNewworkConLog();
    //查询数据预览
    this.getDataViews();
  },
  methods: {
    setHeadStyle(){
      return {
        background:"#fff",
        color:"#909399"
      }
    },
    //关闭对话框
    closeDia(){

      this.$emit('closeDia',);
    },
    //切换当前任务状态
    changeStatus(){
      let that = this;
      that.loading3 = true;
      if(that.flagDesc=='stop'){
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
              //重新查询任务基本信息
              that.getTaskInfo();
            }
          }  
        ).catch(function(err){
          console.log(err);
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
              //重新查询任务基本信息
              that.getTaskInfo();
            }
          }
        ).catch(function(err){
          console.log(err);
          //如果任务状态未切换成功，任务状态下拉框仍显示原来的值“stop--暂停”
          that.flagDesc=='stop';
          that.loading3 = false;
        })
      }
    },
    //查询接入基本信息
    getSourceInfo(){
      let that = this;
      that.loading1 = true;
      let reqData = {
        params:{
          taskInfoDetailId:that.reqObj.taskInfoDetailId,
          sourceObjType:that.reqObj.sourceObjType
        }
      };
      axios.get(that.httpUrl+"manager/task/detail/source",reqData).then(function(res){
        if(res.data.code==undefined||res.data.code==null||res.data.code==""){
          that.doMsg("“/manager/task/detail/source”服务响应为空！","error");
          that.loading1 = false;
          return;
        }
        if(res.data.code != "200"&&res.data.code != "0000"){
          that.doMsg('“/manager/task/detail/source”'+res.data.message,"error");
          that.loading1 = false;
          return;
        }
        let innerReqData = {
          params:{
            taskInfoDetailId:that.reqObj.taskInfoDetailId,
            sourceTableName:res.data.data.sourceTableName[0]
          }
        }
        axios.get(that.httpUrl+'manager/task/detail/target',innerReqData).then(function(innerRes){
          if(innerRes.data.code==undefined||innerRes.data.code==null||innerRes.data.code==""){
            that.doMsg("“/manager/task/detail/target”服务响应为空！","error");
            that.loading1 = false;
            return;
          }
          if(innerRes.data.code != "200"&&innerRes.data.code != "0000"){
            that.doMsg('“/manager/task/detail/target”'+innerRes.data.message,"error");
            that.loading1 = false;
            return;
          }

          that.sourceBaseInfo = innerRes.data.data;
          that.sourceBaseInfo.dbType = res.data.data.dbType;
          let periodMap={
            0:'实时性任务',
            1:'一次性任务',
            2:'周期任务',
            3:'全量任务'        
          }
          //接入类型翻译
          that.sourceBaseInfo.periodDesc = periodMap[innerRes.data.data.period];
          that.loading1 = false;
        }).catch(function(err) {
          console.log(err);
          that.loading1 = false;
        });
      }).catch(function(err) {
        console.log(err);
        that.loading1 = false;
      });
    },
    //查询任务基本信息
    getTaskInfo(){
      let that = this;
      that.loading3 = true;
      //数据获取
      let searchData = {
        params: {
          taskInfoId:that.reqObj.taskInfoId
        }
      };
      axios
        .get(that.httpUrl+"manager/task/taskinfo", searchData)
        .then(function(response) {
          if(response.data.code!='200'&&response.data.code!='0000'){
            that.doMsg("/manager/task/taskinfo"+response.data.message,error);
            that.loading3 = false;
          }else{
            that.taskBaseInfo = response.data.data;
            //创建人
            that.taskBaseInfo.creater = that.taskBaseInfo.creater?that.taskBaseInfo.creater.split('/')[1]:'';
            let statusMap = {
              0:'创建',
              1:'运行',
              2:'暂停',
              3:'失败',
              4:'完成'
            }
            that.taskBaseInfo.statusDesc = statusMap[that.taskBaseInfo.status];
            //网络指示灯判断
            that.newWorkTrans(that.taskBaseInfo.networkStatus,response.data.data.speed);
            //可操作类型
            let t=that.taskBaseInfo.status;
            that.flagDesc=(t==0||t==1)?'run':'stop';
            if(that.flagDesc=='stop'){
              that.operateList[1].disabled=false;
              that.operateList[0].disabled=true;
            }else{
              that.operateList[1].disabled=true;
              that.operateList[0].disabled=false;
            }
            that.loading3 = false;
          }
        })
        .catch(function(err) {
          console.log(err);
          that.loading3 = false;
        });
    },
    //点击测试连接按钮，进行接口条用
    testConnect(){
      let that = this;
      that.loading3 = true;
      let reqData = {
        params:{
          taskInfoId:that.reqObj.taskInfoId
        }
      }
      axios.get(that.httpUrl+'manager/task/testTaskNetworkStatus',reqData).then(
        function(res){
          if(res.data==undefined||res.data==null||res.data===''){
            that.doMsg('服务无数据返回','error');
          }else if(res.data.code!="200"&&res.data.code!="0000"){
            that.doMsg("/manager/task/testTaskNetworkStatus:"+res.data.message,'error');
          }else{
            that.taskBaseInfo.networkStatus = res.data.data.networkStatus;
            that.newWorkTrans(that.taskBaseInfo.networkStatus,res.data.data.speed);
          }
          that.loading3 = false;
        }
      ).catch(
        function(err){
          console.log(err);
          that.loading3 = false;
        }
      )
    },
    //查询接入数据更新
    getSourceDataInfo(){
      let that = this;
      that.loading2 = true;
      axios.put(that.httpUrl+'manager/taskOperate/dataInfo/'+that.reqObj.taskInfoId).then(
        function(res){
          if(res.data==undefined||res.data==null||res.data===''){
            that.doMsg('服务无数据返回','error');
          }else if(res.data.code!="0000"&&res.data.code!="200"){
            that.doMsg("/manager/taskOperate/dataInfo/"+res.data.data.message,'error');
          }else{
            that.sourceDataInfo = res.data.data; 
          }
          that.loading2 = false;
        }
      ).catch(
        function(err){
          console.log(err);
          that.loading2 = false;
        }
      )
    },
    //查询接入任务日志信息
    getSourceTaskLog(){
      let that = this;
      that.loading4 = true;
      axios.put(that.httpUrl+'manager/taskOperate/taskLogInfo/'+that.reqObj.taskInfoId).then(
        function(res){
          //判断响应是否异常
          if(res.data.code!="200"&&res.data.code!="0000"){
            that.doMsg("/manager/taskOperate/taskLogInfo/"+res.data.data.message,'error');
          }else{
            that.taskLog = res.data.data.logInfo==""?"":`\t${res.data.data.logInfo}`;
            // that.taskLog = `java.lang.IndexOutOfBoundsException: Index: 0, Size: 0 \n\t at java.util.ArrayList.rangeCheck(ArrayList.java:653)\n\tat java.util.ArrayList.get(ArrayList.java:429)\n\tat cn.enn.com.jdbc.source.JdbcSourceTask.poll(JdbcSourceTask.java:284)\n\tat org.apache.kafka.connect.runtime.WorkerSourceTask.execute(WorkerSourceTask.java:204)\n\tat org.apache.kafka.connect.runtime.WorkerTask.doRun(WorkerTask.java:170)\n\tat org.apache.kafka.connect.runtime.WorkerTask.run(WorkerTask.java:214)\n\tat java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)\n\tat java.util.concurrent.FutureTask.run(FutureTask.java:266)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)\n\tat java.lang.Thread.run(Thread.java:745)\n`;
          }
          that.loading4 = false;
        }
      ).catch(
        function(err){
          console.log(err);
          that.loading4 = false;
        }
      )
    },
    //查询数据核验日志信息
    getDataCheckLog(){
      let that = this;
      that.loading5 = true;
      let reqData = {
        params:{
          'taskId':that.reqObj.taskInfoId
          // 'taskId':92066
        }
      }//http://10.19.160.59:8081/DEMO/ccheckData/checkLogByTaskId
      axios.get(that.httpUrl2+'ccheckData/checkLogByTaskId',reqData).then(
        function(res){
          console.log('数据核验日志信息',res)
          if(res.data.code!="200"&&res.data.code!="0000"){
            that.doMsg("/ccheckData/checkLogByTaskId"+res.data.message,'error');
          }else{
            that.dataCheckList = res.data.data;
          }
          that.loading5 = false;
        }
      ).catch(
        function(err){
          console.log(err);
          that.loading5 = false;
        }
      )
    },
    //查询数据预览
    getDataViews(){
      let that = this;
      that.loading6 = true;
      axios.put(that.httpUrl+'manager/taskOperate/dataPreview/'+that.reqObj.taskInfoId).then(
        function(res){
          if(res.data.code!="200"&&res.data.code!="0000"){
            that.doMsg("/manager/taskOperate/dataPreview："+res.data.message,'error');
          }else{
            that.dataViewsList = res.data.data;
            that.keyList = [];
            for (var p in that.dataViewsList[0]){
              that.keyList.push(p);
            }  
            that.keyList.reverse();  
          }
          that.loading6 = false;
        }
      ).catch(
        function(err){
          console.log(err);
          that.loading6 = false;
        }
      )
    },
    //网络测试指示灯及内容翻译
    newWorkTrans(value,speed){
      let newWorkMap = {
        0:'rgb(27, 255, 0)',
        1:'rgb(255, 153, 0)',
        2:'rgb(255, 35, 0)'
      }
      this.lightBackground.background = newWorkMap[value];
      let newWorkDescMap = {
        0:'数据源连接正常（数据源访问正常，ping的响应时间在10秒内）',
        1:'数据源连接不稳定（数据源能访问，ping的响应时间在10秒-30秒内）',
        2:'数据源不通',
      }
      speed = speed||0;
      this.taskBaseInfo.newWorkDesc = newWorkDescMap[value]+' '+speed+"kb/s";
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
  }
};

</script>

