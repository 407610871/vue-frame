<template>
  <div class="taskMDialog userSurveyDialog setTaskDia diaicon">
    <!--  <el-button size="mini" class="diabtn incbtn" type="danger" @click="dialogVisible = true">设置通配符</el-button> -->
    <el-tooltip class="item" effect="light" content="单表采集" placement="top">
      <i class="enc-icon-danbiaocaiji" @click="dialogVisible = true"></i>
    </el-tooltip>
    <el-dialog title="单表采集任务向导" :visible.sync="dialogVisible" width="73%" :before-close="closeDialog" class="single-task-dialog" :close-on-click-modal="false">
      <div class="title-gra plr30">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <div class="taskSteps plr30">
        <el-tabs v-model="activeName">
          <el-tab-pane name="first" disabled>
            <span slot="label"><i class="el-icon-circle">1</i>用户标记</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>提供方信息</h2>
              </div>
            </div>
            <user-surveybak :msg="this.num" :batch="false" :info="this.pdata" @pre="next('second')" @closeuser="closeDialog()" ref="survey"></user-surveybak>
            <!--  <div class="btn tcenter">
             <el-button type="primary" style="margin-top: 12px;" @click="next('second')">下一步</el-button>
             <el-button style="margin-top: 12px;" @click="closeDialog">取消</el-button>
           </div> -->
          </el-tab-pane>
          <el-tab-pane name="second" disabled><span slot="label"><i class="el-icon-circle">2</i> 建立数据映射关系</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>字段类型映射</h2>
              </div>
            </div>
            <type-map :tableId="this.pdata.id" :maptype="this.$route.params.type" @pre="next('first')" @nre="next('third')"></type-map>
          </el-tab-pane>
          <el-tab-pane name="third" disabled><span slot="label"><i class="el-icon-circle">3</i>设置接入信息</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>设置采集任务</h2>
              </div>
            </div>
            <coll-task :pdata="pdata" :msg="activeName" @pre="next('second')" @close="closeDialog()" @fresh="fresh()"></coll-task>
            <!-- <div class="btn tcenter mt30">
              <el-button type="primary" style="margin-top: 12px;" @click="next('second')">上一步</el-button>
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
import typeMap from '@/views/accessObjManage/dialog/admin/type_map' //建立数据映射关系
import collTask from '@/views/accessObjManage/dialog/admin/coll_task' //设置采集任务
export default {
  name: "userSurvey",
  data: function() {
    return {
      activeName: 'first',
      dialogVisible: false,
      tabs: '',
      event: '',
      num: 0
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.activeName = 'first';
      this.$store.commit("setMode", "");
      //this.$refs.survey._clearForm();
    },
    //步骤条
    handleClick(tab, event) {
      console.log(tab, event);
      console.log(this.activeName);

    },
    next(steps) {
      this.activeName = steps;
    },
    fresh() {
      this.$emit('fre');
      this.activeName = 'first';
      this.$store.commit("setMode", "");
      this.dialogVisible = false;

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
  props: ['pdata'],
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.num++;
      }
    }
  }

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
  padding: 20px 20px 0;
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

.diaicon i {
  cursor: pointer;
  font-size: 20px;
}

.single-task-dialog {
  .el-dialog {
    min-width: 990px;
  }
}

</style>
