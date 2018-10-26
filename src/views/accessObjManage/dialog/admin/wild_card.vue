<template>
  <div class="taskMDialog userSurveyDialog">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
      <div class="daiInfo proInfo">
        <div class="proInfo-box clearfix">
          <el-col :span="24">
            <el-form-item label="选择匹配类型:" prop="matchType">
              <el-radio-group v-model="ruleForm.matchType">
                <el-radio label="表"></el-radio>
                <el-radio label="文件"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mtsItem">
            <el-form-item class="mtsItem">
              <el-radio-group v-model="ruleForm.typeKind" class="wid100">
                <el-col :span="24">
                  <el-col :span="2">
                    <el-radio label="基础匹配">
                    </el-radio>
                  </el-col>
                  <el-col :span="22">
                    <el-col :span="24" class="surveybg wildbg plr10">
                      <el-col :span="24" class="ml0 tcenter mt10">
                        <el-form-item class="clearfix">
                          <span class="fl mr10">表以</span>
                          <el-input class="fl" v-model="ruleForm.baseStart"></el-input>
                          <span class="fl ml10 mr10">开头,以</span>
                          <el-select class="fl" v-model="ruleForm.baseEnd" placeholder="请选择">
                            <el-option label="全国" value="0"></el-option>
                            <el-option label="全省" value="1"></el-option>
                            <el-option label="全市" value="2"></el-option>
                            <el-option label="行政区" value="3"></el-option>
                          </el-select>
                          <span class="fl ml10">结尾</span>
                        </el-form-item>
                      </el-col>
                      
                      <el-col :span="4" class="ml0  mt10">
                        <el-form-item>
                         <span>匹配示例:xxxxxxxxxxx</span>
                        </el-form-item>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24" class="mt25 wildbg">
                  <el-col :span="2">
                  <el-radio label="高级匹配">
                    
                  </el-radio>
                  </el-col>
                    <el-col :span="22">
                       <el-form-item>
                        <el-input v-model="ruleForm.highMatch"></el-input>
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
export default {
  name: "userSurvey",
  data: function() {
    return {
      dialogVisible: false,
      ruleForm: {
        matchType: '表', //匹配类型
        typeKind: '基础匹配',
        baseStart: '', //表开头
        baseEnd: '', //表结尾
        highMatch: '',//高级匹配
      },
      formRules: {},
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    //实现树的单选
    handleClick(data, checked, node) {
      this.i++;

      if (this.i % 2 == 0) {
        if (checked) {
          this.$refs.treeForm.setCheckedNodes([]);
          this.$refs.treeForm.setCheckedKeys([]);
          this.$refs.treeForm.setCheckedNodes([data]);
          console.log(this.$refs.treeForm.getCheckedNodes());
          this.ruleForm.dockdata = data.label;
          //交叉点击节点
        } else {
          this.$refs.treeForm.setCheckedNodes([]);
          //点击已经选中的节点，置空
          this.ruleForm.dockdata = '';
        }
      }
    },
    //关闭
    closeForm() {
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

.mtsItem {
  .el-form-item--medium .el-form-item__content {
    margin-left: 10px !important;
  }
}
.mtsItem .wildbg{
  .el-form-item--medium .el-form-item__content {
    margin-left: 0px !important;
  }
}
.wildbg .el-input,.wildbg .el-select {
  width: 30%;
}
.wildbg .el-select .el-input{
  width:100%;
}
.el-radio-group.wid100 {
  width: 100%;
}
.wildbg{
  margin-left: 10px;
     
    padding-top: 10px;
    padding-bottom: 15px;
    .el-radio__label{
      line-height: 30px;
    }
}
</style>
