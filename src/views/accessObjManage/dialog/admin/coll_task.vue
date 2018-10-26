<template>
  <div class="taskMDialog collTaskDia">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
      <div class="daiInfo proInfo">
        <div class="proInfo-box clearfix">
          <el-col :span="24">
            <el-col :span="6">
              <el-form-item label="接入目的库:" prop="dLibrary">
                <el-select v-model="ruleForm.dLibrary" placeholder="请选择">
                  <el-option label="全国" value="0"></el-option>
                  <el-option label="全省" value="1"></el-option>
                  <el-option label="全市" value="2"></el-option>
                  <el-option label="行政区" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="bank">bank</el-col>
            <el-col :span="6">
              <el-input v-model="ruleForm.tablename"></el-input>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-form-item label="接入方式:" prop="accessMode">
              <el-radio-group v-model="ruleForm.accessMode">
                <el-radio label="一次性接入"></el-radio>
                <el-radio label="周期接入"></el-radio>
                <el-radio label="实时接入"></el-radio>
                <el-radio label="全量接入"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="8" class="collbg">
              <el-form-item label="增量字段:" prop="increment">
                <el-input v-model="ruleForm.increment" class="fl"></el-input>
                <el-button type="primary" class="fl increbtn" @click="innerVisible = true">选择</el-button>
                <incre-map :msg='innerVisible' :alincre="this.increArr" @showIncre="showIncrement()" @saveIncre="saveIncrement($event)"></incre-map>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采集技术:" prop="actech">
                <el-select v-model="ruleForm.actech" placeholder="请选择">
                  <el-option label="全国" value="0"></el-option>
                  <el-option label="全省" value="1"></el-option>
                  <el-option label="全市" value="2"></el-option>
                  <el-option label="行政区" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-form-item label="周期设置:" prop="cycleSet">
              <el-radio-group v-model="ruleForm.cycleSet" class="wid100 collradio">
                <el-col :span="24">
                  <el-col :span="1" class="bank">bank</el-col>
                  <el-col :span="4" class="line40">
                    <el-radio label="间隔执行">
                    </el-radio>
                  </el-col>
                  <el-col :span="10">
                   <el-col :span="4">
                    <el-form-item class="clearfix">
                      <span class="mr10">每隔</span>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item>
                        <el-time-picker  v-model="value2"  placeholder="天小时分"> 
                        </el-time-picker>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col :span="1" class="bank">bank</el-col>
                  <el-col :span="4" class="line40">
                    <el-radio label="定时执行">
                    </el-radio>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item class="clearfix">
                      <span class="mr10">每隔</span>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </div>
      </div>
    </el-form>
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
      increArr: [],
      ruleForm: {
        dLibrary: '', //接入目的库
        tablename: '', //建立的表名
        accessMode: '', //接入方式
        increment: '', //增量字段
        actech: '', //采集技术
        cycleSet: '', //周期设置
      },
      formRules: {},
      value2: new Date(2016, 9, 10, 18, 40)
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },

    //关闭
    closeForm() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    //增量字段弹框的再次打开
    showIncrement() {
      
      this.innerVisible = false;
    },
    saveIncrement(value) {
      this.increArr = value;
      console.log("****" + this.increArr);
       this.innerVisible = false;
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

</style>
