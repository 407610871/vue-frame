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
                    <el-radio label="0">基础匹配
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
                            <el-option v-for="item in regxData" :label="item.dateFormat" :value="item.dateRegex"></el-option>
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
                    <el-radio label="1">高级匹配
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
    <div class="btn tcenter">
      <el-button type="primary" style="margin-top: 12px;" @click="pres()">上一步</el-button>
      <el-button type="primary" style="margin-top: 12px;" @click="nre()">下一步</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: "userSurvey",
  data: function() {
    return {
      dialogVisible: false,
      regxData: [],
      ruleForm: {
        matchType: '表', //匹配类型
        typeKind: '0',
        baseStart: '', //表开头
        baseEnd: '', //表结尾
        highMatch: '', //高级匹配
      },
      formRules: {},
    };
  },
  methods: {
    ...mapMutations([
      'setRegInfo'
    ]),
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
    pres() {
      this.$emit('pre');
    },
    nre() {
      let reflag = true;
      let varegex;
      if (this.ruleForm.typeKind == '0') {
        let start = this.ruleForm.baseStart;
        let end = this.ruleForm.baseEnd;
        varegex = new RegExp('^' + start + '.*' + end + '$');

      } else {
        varegex = new RegExp(this.ruleForm.highMatch);
      }
      for (let i = 0; i < this.rowList.length; i++) {
        if (varegex.test(this.rowList[i].name)) {

        } else {
          reflag = false;
        }
      }
      if (reflag == false) {
        this.$message.warning('表中有不匹配的表名');
        return false;
      } else {
        if (this.ruleForm.typeKind == '0') {
          var RegInfo={
            baseStart: this.ruleForm.baseStart,
            baseEnd: this.ruleForm.baseEnd,
            baseflag: this.ruleForm.typeKind
          }
          this.setRegInfo(RegInfo);
        } else {
          var RegInfo={
            baseStart: "",
            baseEnd: this.ruleForm.highMatch,
            baseflag: this.ruleForm.typeKind
          }
          this.setRegInfo(RegInfo);
        }
        this.$emit('nre');
      }
    },
    _getRegexList() {
      this.$ajax({
        method: "get",
        url: 'http://10.19.160.168:8080/DACM/task/getRegexList',
        params: {

        }
      }).then(res => {
        if (res.data.success) {
          this.regxData = res.data.data;
        }
      })
    }
  },
  components: {

  },
  mounted() {

  },
  created() {
    this._getRegexList();
  },
  computed: {

  },
  props: ['rowList']

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

.mtsItem .wildbg {
  .el-form-item--medium .el-form-item__content {
    margin-left: 0px !important;
  }
}

.wildbg .el-input,
.wildbg .el-select {
  width: 30%;
}

.wildbg .el-select .el-input {
  width: 100%;
}

.el-radio-group.wid100 {
  width: 100%;
}

.wildbg {
  margin-left: 10px;

  padding-top: 10px;
  padding-bottom: 15px;
  .el-radio__label {
    line-height: 30px;
  }
}

</style>
