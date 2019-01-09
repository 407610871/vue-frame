<template>
  <div class="taskMDialog userSurveyDialog setTaskDia diaicon">
    <el-tooltip class="item" effect="light" :content="titleContent" placement="top">
      <i class="enc-icon-danbiaocaiji" @click="setVisible()"></i>
    </el-tooltip>
    <el-dialog :title="titleContent" :visible.sync="dialogVisible" width="73%" :before-close="closeDialog">
      <div class="title-gra plr30">
        <div class="grab gra-r">
          <span class="grab gra-l"></span>
        </div>
      </div>
      <div class="taskSteps plr30">
        <el-tabs v-model="activeName">
          <el-tab-pane name="first" disabled>
            <span slot="label"><i class="el-icon-circle">1</i>{{titleContent}}</span>
            <norela-unwild v-if="isParquet&&this.$route.params.type=='ftp'" :msg="msg" @pre="next('second')" @clo="closeDialog"></norela-unwild>
            <norela-wild v-else :msg="msg" :rowList="pdata" @pre="next('second')" @clo="closeDialog"></norela-wild>
          </el-tab-pane>
          <el-tab-pane name="second" disabled><span slot="label"><i class="el-icon-circle">2</i> 建立数据映射关系</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>字段类型映射</h2>
              </div>
            </div>
            <type-map :flag="msg" :rowList="pdata" @pre="next('first')" @next="next('third')" :msg="activeName"></type-map>
            <div class="btn tcenter mt30">
            </div>
          </el-tab-pane>
          <el-tab-pane name="third" disabled><span slot="label"><i class="el-icon-circle">3</i>设置接入信息</span>
            <div class="daiInfo proInfo">
              <div class="daiInfo-title proInfo-title">
                <h2>设置采集任务</h2>
              </div>
            </div>
            <coll-task :rowList="pdata" :msg="activeName" @pre="nexts('second')" @fresh="fresh()" > </coll-task>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import norelaWild from '@/views/mainLay/dialog/norela_wild' //设置通配符
import norelaUnwild from '@/views/mainLay/dialog/norela_unwild' //设置通配符
import typeMap from '@/views/mainLay/dialog/com_map' //建立数据映射关系
import collTask from '@/views/mainLay/dialog/coll_com' //设置采集任务
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: "userSurvey",
  data: function() {
    return {
      activeName: 'first',
      dialogVisible: false,
      tabs: '',
      event: '',
      clear: [],
      msg: true,
      titleContent:'设置通配符'
    };
  },
  methods: {
    setVisible() {
      this.dialogVisible = true;
    },
    fresh() {
      this.activeName = 'first';
      this.$store.commit('setSchemaList', this.clear);
      this.$store.commit('setNoreData', this.clear);
      this.$emit('fre');
      this.dialogVisible = false;


    },
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.msg = false;
      this.activeName = 'first';
      this.$store.commit('setSchemaList', this.clear);
      this.$store.commit('setNoreData', this.clear);
      this.$store.commit('setClearStepsData', this.clear);
    },
    //步骤条
    handleClick(tab, event) {


    },
    next(steps) {
      this.activeName = steps;
    },
    nexts(steps) {
      this.activeName = steps;
      this.msg = false;
    }
  },
  components: {
    norelaUnwild,
    norelaWild,
    typeMap,
    collTask
  },
  mounted() {

  },
  created() {
    if(this.type=="ftp"){
      this.titleContent="单目录采集";
    }else if(this.type=="mongodb"){
      this.titleContent="单表采集";
    }else{
      this.titleContent="设置通配符";
    }
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.msg = true;
        this.$store.commit('setSchemaList', this.clear);
      }

    }
  },
  computed: {
    isParquet() {
      return this.$store.state.isParquet;
    }
  },
  props: ['pdata','type'],

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
