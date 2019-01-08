<template>
    <el-dialog title="主题" :visible.sync="dialogVisible" :before-close="closeDialog">
      <div class="title-gra plr30">
        <div class="grab gra-r">
          <span class="grab gra-l"></span>
        </div>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="formRules" v-loading="loading">
          <el-form-item label="主题颜色:" prop="themeName">
            <el-select v-model="ruleForm.themeName" placeholder="请选择">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in themes">
                <span :class="item.value" style="width:16px;height:16px;border-radius:50%; float: left; margin-right:15px; margin-top:8px;"></span>
                <span>{{item.label}}</span>
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <div class="mr-btn clearfix">
          <el-button type="primary" size="small" @click="save()">保存</el-button>
          <el-button @click="closeDialog()" size="small">关闭</el-button>
      </div>
    </el-dialog>
</template>
<script type="text/javascript" src="../release/js/xml2json.min.js"></script>
<script>
export default {
  name: "taskMDialog",
  data: function() {
    return {
      dialogVisible: true,
      versionDes: '',
      versionDate: '',
      loading: false,
      themes: [
        { value: 'DEFAULT', label: '默认' },
        { value: 'PURPLE', label: '紫' },
        { value: 'BLUE', label: '蓝' },
        { value: 'GREEN', label: '绿' },
        { value: 'GOLDEN', label: '金' }
      ],
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
    this._getDefault();
  },
  methods: {
    _getColor() {
     
    },
    _getDefault() {
      let userProperty = window.localStorage.getItem('data-theme');
      if (userProperty == 'theme1') {
        this.ruleForm.themeName = 'PURPLE';
      } else if (userProperty == 'theme2') {
        this.ruleForm.themeName = 'GREEN';
      } else if (userProperty == 'theme3') {
        this.ruleForm.themeName = 'BLUE';
      } else if (userProperty == 'theme4') {
        this.ruleForm.themeName = 'GOLDEN';
      }
      else{
        this.ruleForm.themeName = 'DEFAULT';
      }
    },
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
      userProperty.userId = window.localStorage.getItem('userID');
      userProperty.userName = window.localStorage.getItem('userNames');
      this.$ajax({
        method: "POST",
        url: this.GLOBAL.skin.API_SKIN + '/BCM/skin/update',
        data: userProperty
      }).then(res => {
        if (res.data.success) {
          this.$alert("设置主题成功", "信息", {
            confirmButtonText: "确定",
            callback: action => {
              if (_self.ruleForm.themeName == 'DEFAULT') {
                value = 'theme';
              }
              if (_self.ruleForm.themeName == 'PURPLE') {
                value = 'theme1';
              }
              if (_self.ruleForm.themeName == 'GREEN') {
                value = 'theme2';
              }
              if (_self.ruleForm.themeName == 'BLUE') {
                value = 'theme3';
              }
              if (_self.ruleForm.themeName == 'GOLDEN') {
                value = 'theme4';
              }
              window.localStorage.setItem('data-theme', value);
              window.document.documentElement.setAttribute('data-theme', value);
              _self.$store.commit('setThemes', _self.ruleForm.themeName);
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

span.DEFAULT {
  background: #47505d;
}

span.PURPLE {
  background: #54448f;
}

span.BLUE {
  background: #1ca9de;
}

span.GOLDEN {
  background: #8e764b;
}

span.GREEN {
  background: #448f6b;
}

</style>