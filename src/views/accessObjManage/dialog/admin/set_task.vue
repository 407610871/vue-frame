<template>
  <div class="taskMDialog userSurveyDialog setTaskDia">
    <el-button @click="setTask()" class="add-btn fr">批量采集</el-button>
    <!--  <i class="el-icon-info" @click="dialogVisible = true">设置通配符</i> -->
    <el-dialog title="批量接入任务向导" :visible.sync="dialogVisible" width="60%" :before-close="closeDialog">
      <div class="title-gra plr30">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <div class="taskSteps plr30">
        <el-tabs v-model="activeName">
          <el-tab-pane name="first" disabled>
            <span slot="label"><i class="el-icon-circle">1</i> 数据调研</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>提供方信息</h2>
              </div>
            </div>
            <user-surveybak  :info="rowList" @pre="next('second')" @closeuser="closeDialog()" ref="survey"></user-surveybak>
            <!--  <div class="btn tcenter">
             <el-button type="primary" style="margin-top: 12px;" @click="next('second')">下一步</el-button>
             <el-button style="margin-top: 12px;" @click="closeDialog">取消</el-button>
           </div> -->
          </el-tab-pane>
          <el-tab-pane name="second" disabled> <span slot="label"><i class="el-icon-circle">2</i> 批量匹配设置</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>批量匹配设置</h2>
              </div>
            </div>
            <wild-card :msg="activeName" :rowList="rowList" :jrtype="jrtype" @pre="next('first')" @nre="next('third')"></wild-card>
          </el-tab-pane>
          <el-tab-pane name="third" disabled><span slot="label"><i class="el-icon-circle">3</i> 建立数据映射关系</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>字段类型映射</h2>
              </div>
            </div>
            <type-map :msg="activeName" :flag="'0'" :rowList="rowList" @pre="next('second')" @next="next('fourth')"></type-map>
          </el-tab-pane>
          <el-tab-pane name="fourth" disabled><span slot="label"><i class="el-icon-circle">4</i>设置接入信息</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>设置采集任务</h2>
              </div>
            </div>
            <coll-task :msg="activeName" :rowList="rowList" @pre="next('third')" @fresh="closeDialog()"> </coll-task>
            <!-- <div class="btn tcenter mt30">
              <el-button type="primary" style="margin-top: 12px;" @click="next('third')">上一步</el-button>
              <el-button type="primary" style="margin-top: 12px;">完成</el-button>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import userSurveybak from '@/views/accessObjManage/dialog/admin/user_surveybak' //用户调研
import wildCard from '@/views/accessObjManage/dialog/admin/wild_card' //设置通配符
import typeMap from '@/views/mainLay/dialog/type_maps' //建立数据映射关系
import collTask from '@/views/mainLay/dialog/coll_tasks' //设置采集任务
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: "userSurvey",
  data: function() {
    return {
      activeName: 'first',
      dialogVisible: false,
      tabs: '',
      msg:false,
      event: '',
      idList: [],
      clear:[],
      regClear:{},
    };
  },
  methods: {
     ...mapMutations([
      'setRegInfo', 'setMatchType','setSchemaList'
    ]),
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.msg = false;
      this.activeName ="first"
       this.setMatchType(this.clear);
       this.setRegInfo(this.regClear);
       this.setSchemaList(this.clear);
 this.$emit('fre');
      //this.$refs['ruleForm'].resetFields();
    },
    //步骤条
    handleClick(tab, event) {
      console.log(tab, event);
      console.log(this.activeName);

    },
    fresh() {
      this.$emit('fre');
      this.activeName = 'first';
      this.dialogVisible = false;
    },
    next(steps) {
      this.activeName = steps;
    },
    setTask() {
      let flag = true;
      if (this.rowList.length == 0) {
        this.$message.warning('请选择批式采集的表');
        return false;
      } else {
        if (this.rowList.length == 1) {
          this.dialogVisible = true;
        } else {
          for (let i = 1; i < this.rowList.length; i++) {
            if (this.rowList[0].diyComments != this.rowList[i].diyComments) {
              flag = false;
            }
          }
          if (flag) {
            this.dialogVisible = true;
          } else {
            this.$message.warning('请选择资源名称相同的表');
            return false;
          }
        }

      }
    }
  },
  components: {
    userSurveybak,
    wildCard,
    typeMap,
    collTask
  },
  mounted() {

  },
  created() {

  },
  computed: {

  },
  watch:{
    dialogVisible(){
      if(this.dialogVisible){
        this.msg = true;
        console.log(this.jrtype + "54546465454");
      }
    }
  },
  props: ['rowList','jrtype']

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

.el-tabs__nav-wrap::after {
  background-color: none;
  opacity: 0;
}

.el-tabs__active-bar {
  background-color: none;
  width: 0px !important;
}

.el-tabs__nav {
  float: none;
  text-align: center;
}

.el-tabs__item.is-active i {
  background: $color-background-tabs;
  color: #fff;
}

.taskSteps .el-tabs__header {
  margin-bottom: 0px;
  margin-top: 30px;
}

.taskSteps .proInfo {
  margin-bottom: 30px;
}

.setTaskDia .el-tabs__item.is-disabled {
  color: #303133;
}

.setTaskDia .el-tabs__item.is-active {
  color: $color-background-tabs;
}

</style>
