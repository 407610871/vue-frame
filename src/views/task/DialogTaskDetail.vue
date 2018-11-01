<template>
  <div class="taskMDialog" style="padding-bottom:15px;">
    <el-dialog width="60%" :title="title" :visible.sync="showInnerDialog" @closed="closeDia">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form label-width="150px" class="demo-ruleForm">
        <span style="float:right">当前状态:<el-button style="margin-left:10px" type="primary" size="small" >{{taskBaseInfo.statusDesc}}</el-button></span>
        <div class="daiInfo proInfo">
          <div class="daiInfo-title proInfo-title">
            <h2>接入基本信息</h2>
          </div>
          <div class="proInfo-box clearfix">
            <el-col :span="10">
              <el-form-item label="接入源名称:">
                <span>接入源名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="目标库:">
                <span>接入源名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="接入源ID:">
                <span>接入源名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="目标表:">
                <span>接入源名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="接入源类型:">
                <span>接入源名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="接入类型:">
                <span>周期 间隔5分钟运行一次</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="接入对象:">
                <span>接入源名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="增量字段:">
                <span>接入源名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="bank">bank</el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="增量字段类型:">
                <span>接入源名称</span>
              </el-form-item>
            </el-col>
          </div>
        </div>

        <div class="daiInfo dockInfo">
          <div class="daiInfo-title">
            <h2>接入数据更新</h2>
          </div>
          <div class="daiInfo-box clearfix">
            <el-col :span="10">
              <el-form-item label="已接入数据量:">
                <span>1230000</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" @click="testConnect()">数据核验</el-button>
            </el-col>
            <el-col :span="10">
              <el-form-item label="剩余数据量预估:">
                <span>1230000</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="当前数据接入速率:">
                <span>10Mbps</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="待处理数据量:">
                <span>12300</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="缓存数据量:">
                <span>1230000</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="接入队列数据量:" >
                <span>2018-10-07 22:23:49</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="待存储数据量:">
                <span>1230000</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="bank">bank</el-col>
          </div>
        </div>

        <div class="daiInfo dockInfo">
          <div class="daiInfo-title">
            <h2>任务基本信息</h2>
          </div>
          <div class="daiInfo-box clearfix">
            <el-col :span="10">
              <el-form-item label="当前任务状态:">
                <span>{{taskBaseInfo.statusDesc}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="任务创建时间:">
                <span>{{taskBaseInfo.createTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
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
            <el-col :span="10">
              <el-form-item label="最近一次任务开始时间:">
                <span>{{taskBaseInfo.startTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="接入数量:">
                <span>暂时未有数据</span>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="最近一次任务结束时间:" >
                <span>{{taskBaseInfo.endTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="任务创建人:">
                <span>暂时未有数据</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="bank">bank</el-col>
          </div>
          <div class="daiInfo-tabs">
            <el-tabs type="border-card">
              <el-tab-pane label="汇聚任务日志信息">汇聚任务日志信息</el-tab-pane>
              <el-tab-pane label="数据核验日志信息">数据核验日志信息</el-tab-pane>
              <el-tab-pane label="网络连接信息">网络连接信息</el-tab-pane>
              <el-tab-pane label="数据预览">数据预览</el-tab-pane>
            </el-tabs>
          </div>
          
        </div>
        
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "taskMDialog",
  data: function() {
    return {
      showInnerDialog: true,
      activeName:"first",
      taskBaseInfo:{
        createTime: "",
        endTime: "",  
        networkStatus: "",
        startTime: "",
        status: "1" ,  
      },
      lightBackground: {
        'background':''
      }
    };
  },
  props: ["title",'reqObj'],
  created(){
    this.getTaskInfo();
  },
  methods: {
    //关闭对话框
    closeDia(){
      console.log("广播事件进入")
      this.$emit('closeDia',);
    },
    //测试连接
    testConnect(){
      alert("方法待添加！");
    },
    //查询任务基本信息
    getTaskInfo(){

      let that = this;
      //数据获取
      let searchData = {
        params: {
          taskInfoId:that.reqObj.taskInfoId
        }
      };
      axios
        .get("http://10.19.160.67:8081/DEMO/manager/task/taskinfo", searchData)
        .then(function(response) {
          response.data = {
            createTime: "2018-07-25 19:08:50", // ---任务创建时间
            endTime: "2018-07-25 19:08:50",    //---最近一次任务结束时间
            networkStatus: 0,                  //---任务指示灯 
            startTime: "2018-07-25 19:08:47",  //---最近一次任务开始时间
            status: "1",                       //---当前任务状态:0--CREATE, 1--RUNNING, 2--PAUSED, 3--FAILED, 4--FINISH
          }
          that.taskBaseInfo = response.data;
          let statusMap = {
            0:'创建',
            1:'运行',
            2:'暂停',
            3:'失败',
            4:'完成'
          }
          that.taskBaseInfo.statusDesc = statusMap[that.taskBaseInfo.status];
          let newWorkMap = {
            0:'rgb(27, 255, 0)',
            1:'rgb(255, 153, 0)',
            2:'rgb(255, 153, 0)',
            3:'rgb(255, 35, 0)'
          }
          that.lightBackground.background = newWorkMap[that.taskBaseInfo.networkStatus];
          let newWorkDescMap = {
            0:'正常',
            1:'主机网络中断',
            2:'数据库中断',
            3:'主机网络和数据库均中断'
          }
          that.taskBaseInfo.newWorkDesc = newWorkDescMap[that.taskBaseInfo.networkStatus];
        })
        .catch(function(err) {
          console.log(err);
        });
    }
    
},
components: {

  },
};

</script>
<style lang="scss" scoped>
// @import "@/assets/css/base.scss";
// @import "@/assets/css/dialog.scss";
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
</style>
