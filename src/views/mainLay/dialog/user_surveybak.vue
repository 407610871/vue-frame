<template>
  <div class="taskMDialog userSurveyDialog">
  
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
        <div class="daiInfo proInfo">
          <div class="proInfo-box clearfix">
            <el-col :span="24" class="plr30">
              <el-col :span="10">
                <el-form-item label="资源名称:" prop="rename" required>
                  <el-input v-model="ruleForm.rename"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="bank">bank</el-col>
              <el-col :span="10">
                <el-form-item label="表名:" prop="tablename">
                  <el-input v-model="ruleForm.tablename"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" class="plr30">
              <el-col :span="6">
                <el-form-item label="数据接入方式:" prop="datamode">
                  <el-select v-model="ruleForm.datamode" placeholder="请选择">
                    <el-option label="周期接入" value="0"></el-option>
                    <el-option label="一次性接入" value="1"></el-option>
                    <el-option label="全量接入" value="2"></el-option>
                    <el-option label="实时接入" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" class="surveybg plr30">
              <el-form-item label="资源目录编号:">
                <el-col :span="4" class="ml0">
                  <el-form-item prop="industry">
                    <el-select v-model="ruleForm.industry" placeholder="请选择">
                      <el-option label="周期接入" value="0"></el-option>
                      <el-option label="一次性接入" value="1"></el-option>
                      <el-option label="全量接入" value="2"></el-option>
                      <el-option label="实时接入" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="znb">
                    <el-select v-model="ruleForm.znb" placeholder="请选择">
                      <el-option label="周期接入" value="0"></el-option>
                      <el-option label="一次性接入" value="1"></el-option>
                      <el-option label="全量接入" value="2"></el-option>
                      <el-option label="实时接入" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="fcc">
                    <el-select v-model="ruleForm.fcc" placeholder="请选择">
                      <el-option label="周期接入" value="0"></el-option>
                      <el-option label="一次性接入" value="1"></el-option>
                      <el-option label="全量接入" value="2"></el-option>
                      <el-option label="实时接入" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="tlc">
                    <el-select v-model="ruleForm.tlc" placeholder="请选择">
                      <el-option label="周期接入" value="0"></el-option>
                      <el-option label="一次性接入" value="1"></el-option>
                      <el-option label="全量接入" value="2"></el-option>
                      <el-option label="实时接入" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="bdc">
                    <el-select v-model="ruleForm.bdc" placeholder="请选择">
                      <el-option label="周期接入" value="0"></el-option>
                      <el-option label="一次性接入" value="1"></el-option>
                      <el-option label="全量接入" value="2"></el-option>
                      <el-option label="实时接入" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="abc">
                    <el-select v-model="ruleForm.abc" placeholder="请选择">
                      <el-option label="周期接入" value="0"></el-option>
                      <el-option label="一次性接入" value="1"></el-option>
                      <el-option label="全量接入" value="2"></el-option>
                      <el-option label="实时接入" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0 tcenter mt10">
                  <el-form-item>
                    <span>{{rnum}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0 mt10">
                  <el-form-item>
                    <el-input v-model="ruleForm.industry + '-' + ruleForm.znb + '-' + ruleForm.fcc + '-' + ruleForm.tlc + '-' + ruleForm.bdc + '-' + ruleForm.abc" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0 tcenter mt10">
                  <el-form-item>
                    <el-button size="small" type="primary">资源目录规范下载</el-button>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="plr30 mt20">
              <el-col :span="6">
                <el-form-item label="数据范围:" prop="datarange">
                  <el-select v-model="ruleForm.datarange" placeholder="请选择">
                    <el-option label="全国" value="0"></el-option>
                    <el-option label="全省" value="1"></el-option>
                    <el-option label="全市" value="2"></el-option>
                    <el-option label="行政区" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="3" class="ml0">
                <el-form-item prop="pro">
                  <el-select v-model="ruleForm.pro" placeholder="请选择">
                    <el-option label="江苏省" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="bank">bank</el-col>
              <el-col :span="3" class="ml0">
                <el-form-item prop="city">
                  <el-select v-model="ruleForm.city" placeholder="请选择">
                    <el-option label="南京市" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="bank">bank</el-col>
              <el-col :span="3" class="ml0">
                <el-form-item prop="urban">
                  <el-select v-model="ruleForm.urban" placeholder="请选择">
                    <el-option label="江宁区" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="10" class="plr30">
              <el-form-item label="初始数据量:" prop="datanum">
                <el-input v-model="ruleForm.datanum"></el-input>
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
    //判断是否必选项为空
    const validateNull = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      rnum: '234234',
      ruleForm: {
        rename: '', //资源名称
        tablename: '', //表名
        datarange: '', //数据范围
        datamode: '', //数据接入方式
        pro: '',
        city: '',
        urban: '',
        datanum: '', //初始数据量
        industry: '0',
        znb: '0',
        fcc: '0',
        tlc: '0',
        bdc: '0',
        abc: '0',
        renumber: ''


      },
      formRules: {

      },



      // msgId:this.dialogMsg?this.dialogMsg[1]:''
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
    },
    //文件的上传
    /*submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },*/
    _getSJLYandSSJZ() {
      this.$ajax({
        methods: "get",
        url: '/api/register/getDictDataCategory',
        params: {

        }
      }).then(res => {
        this.SJLY = res.staticDatas.SJLY;
        this.SSJZ = res.staticDatas.SSJZ;
        this.ruleForm.resource = this.SJLY[0].static_CODE;
        this.ruleForm.authorf = this.SSJZ[0].static_CODE;
      })
    },
    _getAccessDialect() {
      this.$ajax({
        methods: "get",
        url: '/api/caccess/sysdialect',
        params: {
          id: ""
        }
      }).then(res => {

        this.syskindList = res;
        this.ruleForm.syskind = res[0].name;
      })
    },
    //对接部门
    _getDJBM() {
      this.$ajax({
        methods: "get",
        url: '/api/caccess/sysdepartment',
        params: {

        }
      }).then(res => {

        this.DJBM = res;
        this.ruleForm.dockpart = res[0].id;
      })
    },
    //对接平台
    _getDJPT() {
      this.$ajax({
        methods: "get",
        url: '/api/dataTable/getListStaticData.do',
        params: {
          dictCode: 'ButtPlatForm'
        }
      }).then(res => {

        this.DJPT = res;
        this.ruleForm.dockPlat = res[0].static_CODE;
      })
    },
    //数据所属部门
    _getSYBM() {
      this.$ajax({
        methods: "post",
        url: '/api/deptInfo/getDeptInfo',
        params: {

        }
      }).then(res => {

        this.treedata = res.list;
      })
    },
    //保存信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // debugger;
        if (valid) {
          alert('submit!');
        } else {
          if (this.ruleForm.syskind == '本地文件' && this.ruleForm.jrname != '') {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }

        }
      });
    },
    //测试连接
    testForm(formName) {
      this.$refs[formName].validate((valid) => {
        // debugger;
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  components: {

  },
  mounted() {

  },
  created() {
    //得到数据库方言
    this._getAccessDialect();
    //数据来源
    this._getSJLYandSSJZ();
    //对接部门
    this._getDJBM();
    //对接平台
    this._getDJPT();
    //数据所属部门
    /* this._getSYBM();*/
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

</style>
