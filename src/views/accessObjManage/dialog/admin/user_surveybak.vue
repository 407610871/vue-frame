<template>
  <div class="taskMDialog userSurveyDialog">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
      <div class="daiInfo proInfo" ref="h1">
        <div class="proInfo-box clearfix">
          <el-col :span="24" class="plr30">
            <el-col :span="10">
              <el-form-item label="资源名称:" prop="rename">
                <el-input v-model="ruleForm.rename" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="表名:" prop="tablename">
                <el-input v-model="ruleForm.tablename" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24" class="surveybg plr30">
            <el-form-item label="资源目录编号:">
              <el-col :span="4" class="ml0">
                <el-form-item prop="industry">
                  <el-select v-model="ruleForm.industry" placeholder="请选择">
                    <el-option v-for="item in sIndustry" :label="item.static_NAME" :value="item.static_CODE" :id="item.dict_ID"></el-option>
                    <!-- <el-option label="一次性接入" value="1"></el-option>
                      <el-option label="全量接入" value="2"></el-option>
                      <el-option label="实时接入" value="3"></el-option> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="ml0">
                <el-form-item prop="znb">
                  <el-select v-model="ruleForm.znb" placeholder="请选择">
                    <el-option v-for="item in sZnb" :label="item.static_NAME" :value="item.static_CODE" :id="item.dict_ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="ml0">
                <el-form-item prop="fcc">
                  <el-select v-model="ruleForm.fcc" placeholder="请选择">
                    <el-option v-for="item in sFcc" :label="item.static_NAME" :value="item.static_CODE" :id="item.dict_ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="ml0">
                <el-form-item prop="tlc">
                  <el-select v-model="ruleForm.tlc" placeholder="请选择">
                    <el-option v-for="item in sTlc" :label="item.static_NAME" :value="item.static_CODE" :id="item.dict_ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="ml0">
                <el-form-item prop="bdc">
                  <el-select v-model="ruleForm.bdc" placeholder="请选择">
                    <el-option v-for="item in sBdc" :label="item.static_NAME" :value="item.static_CODE" :id="item.dict_ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="ml0">
                <el-form-item prop="abc">
                  <el-select v-model="ruleForm.abc" placeholder="请选择">
                    <el-option v-for="item in sAbc" :label="item.static_NAME" :value="item.static_CODE" :id="item.dict_ID"></el-option>
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
                  <el-input v-model="ruleForm.industry + '-' + ruleForm.znb + '-' + ruleForm.fcc + ruleForm.tlc + ruleForm.bdc + ruleForm.abc+ruleForm.randomId" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="ml0 tcenter mt10">
                <el-form-item>
                  <el-button size="small" type="primary" @click="downTxt()">资源目录规范下载</el-button>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="plr30 mt25">
            <el-col :span="6">
              <el-form-item label="数据接入方式:" prop="datamode">
                <el-select v-model="ruleForm.datamode" placeholder="请选择">
                  <el-option v-for="item in sDum" :label="item.static_NAME" :value="item.static_CODE" :id="item.dict_ID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
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
            <el-col :span="3" class="ml0" v-if="ruleForm.datarange!='0'">
              <el-form-item prop="pro">
                <el-select v-model="ruleForm.pro" placeholder="请选择">
                  <el-option label="江苏省" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="bank" v-if="ruleForm.datarange!='0'">bank</el-col>
            <el-col :span="3" class="ml0" v-if="ruleForm.datarange=='3'||ruleForm.datarange=='2'">
              <el-form-item prop="city">
                <el-select v-model="ruleForm.city" placeholder="请选择">
                  <el-option label="南京市" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="bank" v-if="ruleForm.datarange=='3'||ruleForm.datarange=='2'">bank</el-col>
            <el-col :span="3" class="ml0" v-if="ruleForm.datarange=='3'">
              <el-form-item prop="urban">
                <el-select v-model="ruleForm.urban" placeholder="请选择">
                  <el-option label="江宁区" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="10" class="plr30">
            <el-form-item label="初始数据量:" prop="datanum">
              <el-input v-model="ruleForm.datanum" required></el-input>
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
    //判断初始数据量
    const validateNum = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("不能为空"));
      } else {
        let types = "^[0-9]*[1-9][0-9]*$";
        let rs = new RegExp(types);
        let rflag = rs.test(value);
        if (!rflag) {
          callback(new Error("请输入正确的初始数据量"));
        } else {
          callback();
        }
      }
    }
    return {
      dialogVisible: false,
      rnum: '234234',
      sIndustry: [],
      tableId: '',
      sZnb: [],
      sFcc: [],
      sTlc: [],
      sBdc: [],
      sAbc: [],
      sDum: [],
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
        renumber: '',
        randomId: ''

      },
      formRules: {
        datanum: [
          { required: true, validator: validateNum, trigger: "blur" }
        ]
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
    //关闭
    closeForm() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },

    //保存信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax({
            methods: 'post',
            url: '/api/dataTable/inputSurvey',
            params: {
              ID: "", //非必填
              tableId: "", //表id
              resourceDirectoryNumber: "", // '资源目录编号',
              industryCategory: this.ruleForm.industry, // '行业类别',
              policeBusiness: this.ruleForm.znb, // '公安业务',
              firstClassClassification: this.ruleForm.fcc, //'一级分类',
              twoLevelClassification: this.ruleForm.tlc, // '二级分类',
              taxonomy: this.ruleForm.bdc, //'细目分类',
              attributeClassification: this.ruleForm.abc, // '属性分类',
              dataTimeliness: "", // '数据时效性',
              dataUpdateMode: "", // '数据更新方式',
              initialDataVolume: this.ruleForm.datanum, // '初始数据量',
              dateRange: "", //'数据范围',
              xzqy: [{ "pro": "320000" }, { "city": "320100" }, { "urban": "320104" }], //行政区域
              remarks: "" //备注，非必填

            }
          }).then(res => {

          }, (res) => {
            console.log('error');
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //_getStaticDatas
    _getStaticDatas() {
      this.$ajax({
        methods: 'post',
        url: '/api/dataTable/queryDictionary.do',
        params: {

        }
      }).then(res => {
        //得到Industry
        this.sIndustry = res.data.staticDatas.INDUSTRY;
        this.ruleForm.industry = this.sIndustry[0].static_CODE;
        //ZNB
        this.sZnb = res.data.staticDatas.ZNB;
        this.ruleForm.znb = this.sZnb[0].static_CODE;
        //FCC
        this.sFcc = res.data.staticDatas.FCC;
        this.ruleForm.fcc = this.sFcc[0].static_CODE;
        //TLC
        this.sTlc = res.data.staticDatas.TLC;
        this.ruleForm.tlc = this.sTlc[0].static_CODE;
        //BDC
        this.sBdc = res.data.staticDatas.BDC;
        this.ruleForm.bdc = this.sBdc[0].static_CODE;
        //ABC
        this.sAbc = res.data.staticDatas.ABC;
        this.ruleForm.abc = this.sAbc[0].static_CODE;
        //romId
        this.ruleForm.randomId = res.data.randomId
        //DUM
        this.sDum = res.data.staticDatas.DUM;
        this.ruleForm.datamode = this.sDum[0].static_CODE;
      })
    },
    //资源目录下载
    downTxt() {
      window.location.href = "/api/dataTable/downloadSpecification";
    },
    //清空表格
    _clearForm(){
      this.$refs['ruleForm'].resetFields();
    }
   
  },
  components: {

  },
  mounted() {
    //清空form的值
     this._clearForm();
  },
  watch: {

  },
  created() {
    
    this._getStaticDatas();
    if (this.info.comments == '' || this.info.comments == null) {
      this.ruleForm.rename = this.info.diyComments
    } else {
      this.ruleForm.rename = this.info.comments;
    }
    this.ruleForm.tablename = this.info.name;

  },
  computed: {

  },
  props: ['info']

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
