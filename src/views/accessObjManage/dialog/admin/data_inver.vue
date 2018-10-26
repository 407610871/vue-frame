<template>
  <div class="taskMDialog userSurveyDialog">
    <el-button size="mini" class="diabtn incbtn" type="danger" @click="dialogVisible = true">数据核验</el-button>
    <!--  <i class="el-icon-info" @click="dialogVisible = true">用户调研</i> -->
    <el-dialog title="数据核验" :visible.sync="dialogVisible" width="60%" :before-close="closeDialog">
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
                    <el-radio :label="1">全量核验</el-radio>
                  </el-col>
                  <el-col :span="4" class="bank">bank</el-col>
                  <el-col :span="6">
                    <el-radio :label="2">根据时间范围核验</el-radio>
                  </el-col>
                  <el-col :span="10">
                    <el-button type="primary" size="small" @click="inverCheck()">开始核验</el-button>
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
              <div class="time" v-show="ruleForm.setVer=='2'">
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
                <li title="">{{"无"}}</li>
                <li title="">{{"无"}}</li>
                <li title="">{{"无"}}</li>
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
                <li title="">{{"无"}}</li>
                <li title="">{{"无"}}</li>
                <li title="">{{"无"}}</li>
              </ul>
            </el-col>
          </el-col>
        </div>
        <div class="proInfo-box clearfix ptb20">
          <el-col :span="8">
             <span>核验结果:</span>
             <span class="yes" v-if="result==0"></span>
             <span class="wrong" v-else-if="result==1"></span>
             <span v-else-if="result==null" style="color:#606266">无</span>
          </el-col>
          <el-col :span="8">
             <span>数据量差值:</span>
          </el-col>
          <el-col :span="8">
             <el-button type="primary" size="small" >查看日志</el-button>
          </el-col>
        </div>
         <div class="proInfo-box log-box clearfix ptb20">
           <textarea name="" id="" disabled="disabled" v-show="textShow" >{{loginfo}}</textarea>
         </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "dataInver",
  data: function() {
    return {
      dialogVisible: false,
      loginfo: '123123',
      textShow:'true',
      result: '0',
      ruleForm: {
        setVer: 1, //核验设置
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
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}
.resultIcon .wrong {
  background: url("../../../../assets/images/data_err.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}
textarea{
  width:80%;
}
</style>
