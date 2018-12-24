<template>
  <div class="taskMDialog themesDialog">
    <!-- <el-tooltip class="item" effect="light" content="版本信息" placement="bottom">
      <el-button @click="dialogVisible = true" class="document" icon="enc-icon-documents"></el-button>
    </el-tooltip> -->
    <!--  <a href="javascript:void(0)" @click="dialogVisible = true" >版本信息</a> -->
    <el-dialog :title="versionDes + '  '+ versionDate" :visible.sync="dialogVisible" width="30%" :before-close="closeDialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules" v-loading="loading">
        <el-col :span="24" class="chDe">
          <el-col :span="3" class="bank">bank</el-col>
          <el-form-item label="主题颜色:" prop="themeName">
            <el-select v-model="ruleForm.themeName" placeholder="请选择">
              <el-option :label="item" :value="item" :key="item" v-for="item in themes"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="thDe">
          <el-col :span="8" class="bank">bank</el-col>
          <el-checkbox v-model="ruleForm.delete"></el-checkbox>是否选用暗色主题
        </el-col>
        <el-col :span="24" class="mt30 tcenter ftpbtn">
          <el-form-item class="mrf20">
            <el-button type="primary" size="small" @click="save()">保存</el-button>
            <el-button @click="closeDialog()" size="small">关闭</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/javascript" src="../release/js/xml2json.min.js"></script>
<script>
/*import version from '@/views/mainLay/dialog/release_version'*/
// import versionBank from '@/views/mainLay/release/data/version1.2.2.xml'
/*console.log(versionBank);*/
export default {
  name: "taskMDialog",
  data: function() {
    return {
      dialogVisible: true,
      versionDes: '',
      versionDate: '',
      loading: false,
      themes: ['PURPLE', 'BLUE', 'GREEN', 'YELLOW'],
      ruleForm: {
        themeName: '',
        default: false
      },
      formRules: {
        themeName: [{
          required: true,
          trigger: "blur"
        }],
      }
    };
  },
  mounted() {

  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.$emit('closeDia', );
      this.dialogVisible = false;
    },
    save() {
      let _self = this;
      let value = '';

      let userProperty = JSON.parse(localStorage.getItem("userSet"));
      userProperty.color = _self.ruleForm.themeName;

      this.$ajax({
        method: "POST",
        url: this.GLOBAL.api.API_DACM + "/users/updateProperty",
        data: userProperty
      }).then(res => {
        if (res.data.success) {
          this.$alert("设置主题成功", "信息", {
            confirmButtonText: "确定",
            callback: action => {
              if (_self.ruleForm.themeName == 'PURPLE') {
                value = 'theme1';
              }
              if (_self.ruleForm.themeName == 'GREEN') {
                value = 'theme2';
              }
              if (_self.ruleForm.themeName == 'BLUE') {
                value = 'theme3';
              }
              if (_self.ruleForm.themeName == 'YELLOW') {
                value = 'theme4';
              }
              window.localStorage.setItem('data-theme', value);
              window.document.documentElement.setAttribute('data-theme', value);
              _self.$store.commit('setThemes',_self.ruleForm.themeName);
               this.$emit('closeDia', );
            }
          });
        } else {
          this.$alert('设置主题失败', "信息", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      });

    }
  },
  components: {

  },
  watch: {

  }

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.themesDialog {
  .el-select {
    width: 64%;
  }
  .thDe {
    .bank {
      height: 30px;
      line-height: 30px;
      margin-left: -5px;
    }
    .el-checkbox {
      margin-right: 10px;
    }
  }
  .chDe {
    height: 30px;
    .bank {
      line-height: 30px;
      height: 30px;
    }
  }
  .tcenter .el-form-item--medium .el-form-item__content {
    text-align: right;
  }
  .mrf20 {
    margin-right: 20px;
  }
}

.themesDialog .el-dialog {
  height: 330px !important;
}

</style>
