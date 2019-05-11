<template>
    <el-dialog title="主题" :visible.sync="dialogVisible" width="550px" :before-close="closeDialog">
      <div class="title-gra plr30">
        <div class="grab gra-r">
          <span class="grab gra-l"></span>
        </div>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="formRules" v-loading="loading">
          <el-form-item label="主题颜色:" prop="themeName">
            <el-select v-model="ruleForm.themeName" placeholder="请选择" style="width:100%">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in themes">
                <span :class="item.value" style="width:16px;height:16px;border-radius:50%; float: left; margin-right:15px; margin-top:8px;"></span>
                <span>{{item.label}}</span>
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <div class="mr-btn clearfix">
          <el-button type="primary" @click="closeDialog()" >关闭</el-button>
          <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </el-dialog>
</template>
<script>
export default {
  name: "taskMDialog",
  data: function() {
    return {
      dialogVisible: true,
      loading: false,
      themes: [
        { value: 'DEFAULT', label: '默认' },
        { value: 'PURPLE', label: '紫' },
        { value: 'BLUE', label: '蓝' },
        { value: 'GREEN', label: '绿' },
        { value: 'GOLDEN', label: '金' }
      ],
      ruleForm: {
        themeName: 'DEFAULT',
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
    _getDefault() {
      let params = {
          "userId": this.$keycloak.tokenParsed.sub,
          "appId": this.$keycloak.tokenParsed.aud,
      }
      this.$ajax.post(`${window.ENV.API_SKIN}/BCM/skin/query`, params).then((res)=>{
          let values = "theme"
          if (res.data.success && res.data.data) {
            let userProperty = res.data.data.color;
            if (userProperty == 'PURPLE') {
                this.ruleForm.themeName = 'PURPLE';
                values = 'theme1';
            } else if (userProperty == 'BLUE') {
                this.ruleForm.themeName = 'BLUE';
                values = 'theme2';
            } else if (userProperty == 'GREEN') {
                this.ruleForm.themeName = 'GREEN';
                values = 'theme3';
            } else if (userProperty == 'GOLDEN') {
                this.ruleForm.themeName = 'GOLDEN';
                values = 'theme4';
            } else {
                this.ruleForm.themeName = 'DEFAULT';
                values = 'theme';
            }
          } else {
            this.ruleForm.themeName = 'DEFAULT';
            values = 'theme';
          }
          this.$store.commit('setThemes', res.data.data.color);
          window.localStorage.setItem('data-theme', values);
          window.document.documentElement.setAttribute('data-theme', values);
      })
    },
    //关闭对话框
    closeDialog() {
      this.$emit('closeDia', );
      this.dialogVisible = false;
    },
    save() {
      let params = {
          "cnName": this.$keycloak.tokenParsed.name,
          "color": this.ruleForm.themeName,
          "appId": this.$keycloak.tokenParsed.aud,
          "userId":  this.$keycloak.tokenParsed.sub,
          "userName": this.$keycloak.tokenParsed.name
        }
      this.$ajax({
        method: "POST",
        url: window.ENV.API_SKIN + '/BCM/skin/update',
        data: params
      }).then(res => {
        if (res.data.success) {
          this.$alert("设置主题成功", "信息", {
            confirmButtonText: "确定",
            callback: action => {
              this.$store.commit('setThemes', this.ruleForm.themeName);  
              this.$emit('closeDia', );
            }
          });
        } else {
          this.$alert('设置主题失败', "信息", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      })
    }
  },
  components: {

  },
  watch: {

  }

};

</script>
<style lang="scss">

    span.DEFAULT {
        background: #4A60A2;
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