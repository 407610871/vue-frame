<template>
  <div class="taskMDialog" style="padding-bottom:15px;" >
    <el-dialog width="60%" title="任务详情信息" :visible.sync="showInnerDialog" @closed="closeDia">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form label-width="100px" class="demo-ruleForm">
        
        <!-- 任务基本信息 模块开始 -->
        <div class="daiInfo dockInfo"  v-loading="loading1">
          <div class="daiInfo-box clearfix">
            <el-col :span="12">
              <div style="height:323px;width:434px;border:1px solid blue">
                  <a :href="taskBaseInfo.flowChartPath" target="_blank">
                    <img :src="taskBaseInfo.flowChartPath">
                  </a>
              </div>
            </el-col>
            <el-col :span="12" class="info-right">
              <div class="taskStatus">
                <span>处理任务:</span><span>{{reqObj.taskName}}</span>
                <span v-if="reqObj.status=='create'" style="float:right;color:red;font-weight:700;width:50px">新建</span>
                <span v-if="reqObj.status=='Running'" style="float:right;color:red;font-weight:700;width:50px">运行</span>
                <span v-if="reqObj.status=='Paused'" style="float:right;color:red;font-weight:700;width:50px">暂停</span>
                <span v-if="reqObj.status=='Finished (with errors)'" style="float:right;color:red;font-weight:700;width:50px">失败</span>
                <span v-if="reqObj.status=='Finished'" style="float:right;color:red;font-weight:700;width:50px">完成</span>
              </div>
              <div>
                  <span>输入：</span><span>{{taskBaseInfo.input}}</span>
              </div>
              <div style="height:78px">
                  <span style="vertical-align:top">处理步骤：</span>
                  <div class="steps">
                      <P style="margin-top:0px;" v-for="(item,index) in taskBaseInfo.steps" :key="item.jobEntryType">步骤{{index+1}}：{{item.jobEntryName}}</P>
                   </div>
              </div>
              <div>
                  <span>输出：</span><span>{{taskBaseInfo.output}}</span>
              </div>
              <div>
                  <span>创建时间：</span><span>{{reqObj.createTime}}</span>
              </div>
              <div>
                  <span>任务开始时间：</span><span>{{reqObj.startTime}}</span>
              </div>
              <div>
                  <span>任务结束时间：</span><span>{{reqObj.endTime}}</span>
              </div>
            </el-col>
          </div>
          <el-button class="button-log" type="primary" size="small" @click="loading2=true;queryLogs()">日志</el-button>
          <!-- 四个日志tab 开始 -->
          <div class="daiInfo-tabs">
            <div type="border-card" style="height:265px;">
                <div class="dataCheck-tab" v-loading="loading2">
                    <textarea v-show="taskBaseInfo.log!=''" name="" id="" cols="30" rows="12" disabled="disabled" style="resize:none;width: 100%; height: 180px;border:none;background:inherit" >{{taskBaseInfo.log}}</textarea>
                    <div class="tips-none" v-show="taskBaseInfo.log==''">暂无数据</div>
                </div>
            </div>
          </div>
          <!-- 四个日志tab 结束 -->
        </div>
        <!-- 任务基本信息 模块结束 -->
        
      </el-form>
    </el-dialog>
    <!-- <dialogIsCheck :msgCheck="reqObj" v-if="isShowCheck"></dialogIsCheck> -->
  </div>
</template>
<style lang="scss" scoped>
    
.taskMDialog .el-dialog__body .daiInfo-box{
    padding:0px 0px;
}
.tips-none{
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  color: #a7a2a2;
}
.button-log{
    margin-top: 12px;
    margin-bottom: 12px;
}
.taskStatus{
    border-bottom: 1px solid #83b2fb;
    height: 30px;
    margin-bottom: 18px;
}
.taskStatus span{
    display: inline-block;
    width: 97px;
}
.info-right>div{
    height: 38px;
}
.info-right>div span{
    display: inline-block;
    width: 107px;
}
.info-right>div span:last-child{
    color: #2f6ac5;
    cursor: pointer;
    width: 300px;
}
.daiInfo-tabs{
    border:1px solid blue;
}
img{
    height:100%;
    width:100%;
}
.steps{
    display: inline-block;
    height: 62px;
    overflow: auto;
    width: 300px;
}

</style>
<script>
import axios from "axios";
// import DialogIsCheck from "./DialogIsCheck";
export default {
  name: "taskMDialog",
  data: function() {
    return {
      //外层loading
      loading1:true,//接入基本信息的loading
      loading2:false,//日志查询的loading
      showInnerDialog:true,
      httpUrlOld:window.ENV.API_DOWN+'/',
      httpUrl2:window.ENV.API_DACM+'/',
      taskBaseInfo:{
          output:'',//输出
          input:'',//输入
          log:'',//日志
          steps:[],//步骤
          flowChartPath:''//流程图地址
      },
      serveFinishCount:0
    };
  },
  props: ["title",'reqObj'],
  
  created(){
    console.log("页面入参",this.reqObj);
    //时间格式转换
    this.reqObj.createTime = this.transData(this.reqObj.createTime);
    //时间格式转换
    this.reqObj.startTime = this.transData(this.reqObj.startTime);
    //时间格式转换
    this.reqObj.endTime = this.transData(this.reqObj.endTime);
    //查询流程图
    this.getFlowChartPath();
    //查询输入输出
    this.getInputAndOutput();
    //查询步骤
    this.getTransInfo();
    //查询日志
    this.queryLogs();
    
  },
  methods: {
    //关闭对话框
    closeDia(){
      this.$emit('closeDia',);
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
    //时间格式转换，将毫秒转换成2018-11-13 14:46:23
    transData(times){
        if(typeof(times)=="undefined"||times==""||times==null){
            return "";
        }else{
            let date = new Date(times);
            let years = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            return years+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
        }
    },
    //获取流程图
    getFlowChartPath(){
        let that  = this;
        let reqData = {
            params:{
                "jobPath": that.reqObj.jobPath,
                "jobName": that.reqObj.taskName,
                "carteObjectId": that.reqObj.carteObjectId
            }
        }
        axios.post(that.httpUrlOld+'manager/govern/getFlowChartPath',reqData.params).then(function(res){
            if(res.data.code==undefined||res.data.code==null||res.data.code==""){
                that.doMsg("“manager/govern/getFlowChartPath”服务响应为空！","error");
            }else if(res.data.code != "200"&&res.data.code != "0000"){
                that.doMsg('“manager/govern/getFlowChartPath”'+res.data.message,"error");
            }else{
                that.taskBaseInfo.flowChartPath = res.data.data.path;
            }
            that.serveFinishCount++;
        }).catch(function(err){
            console.log(err);
            that.serveFinishCount++;            
        })
    },
    //获取输入输出
    getInputAndOutput(){
        let that  = this;
        let reqData = {
            params:{
                "jobPath": that.reqObj.jobPath,
                "jobName": that.reqObj.taskName,
                "carteObjectId": that.reqObj.carteObjectId
            }
        }
        axios.post(that.httpUrlOld+'manager/govern/getInputAndOutput',reqData.params).then(function(res){
            if(res.data.code==undefined||res.data.code==null||res.data.code==""){
                that.doMsg("“manager/govern/getInputAndOutput”服务响应为空！","error");
            }else if(res.data.code != "200"&&res.data.code != "0000"){
                that.doMsg('“manager/govern/getInputAndOutput”'+res.data.message,"error");
            }else{
                that.taskBaseInfo.input = res.data.data.input;
                that.taskBaseInfo.output = res.data.data.output;
            }
            that.serveFinishCount++;
        }).catch(function(err){
            console.log(err);
            that.serveFinishCount++;
        })
    },
    //查询步骤
    getTransInfo(){
        let that  = this;
        let reqData = {
            params:{
                "jobPath": that.reqObj.jobPath,
                "jobName": that.reqObj.taskName,
                "carteObjectId": that.reqObj.carteObjectId
            }
        }
        axios.post(that.httpUrlOld+'manager/govern/getTransInfo',reqData.params).then(function(res){
            if(res.data.code==undefined||res.data.code==null||res.data.code==""){
                that.doMsg("“/manager/govern/getTransInfo”服务响应为空！","error");
            }else if(res.data.code != "200"&&res.data.code != "0000"){
                that.doMsg('“/manager/govern/getTransInfo”'+res.data.message,"error");
            }else{
                that.taskBaseInfo.steps = res.data.data;
            }
            that.serveFinishCount++;
        }).catch(function(err){
            console.log(err);
            that.serveFinishCount++;
        })
    },
    //查询日志
    queryLogs(){
        let that  = this;
        let reqData = {
            params:{
                "jobPath": that.reqObj.jobPath,
                "jobName": that.reqObj.taskName,
                "carteObjectId": that.reqObj.carteObjectId
            }
        }
        axios.post(that.httpUrlOld+'manager/govern/queryLogs',reqData.params).then(function(res){
            if(res.data.code==undefined||res.data.code==null||res.data.code==""){
                that.doMsg("“/manager/govern/queryLogs”服务响应为空！","error");
            }else if(res.data.code != "200"&&res.data.code != "0000"){
                that.doMsg('“/manager/govern/queryLogs”'+res.data.message,"error");
            }else{
                that.taskBaseInfo.log = res.data.data.log;
            }
            that.serveFinishCount++;
            that.loading2 = false;
        }).catch(function(err){
            console.log(err);
            that.serveFinishCount++;
            that.loading2 = false;
        })
    },
  },
  watch:{
      serveFinishCount:{
        handler:function(val,old){
            if(val==4){
                this.loading1 = false;
                console.log(val);
            }
        },
        deep: true
      }
  }
};

</script>

