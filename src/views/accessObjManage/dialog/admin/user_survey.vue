<template>
  <div class="taskMDialog userSurveyDialog">
    <el-button size="mini" class="diabtn incbtn" type="danger" @click="dialogVisible = true">用户调研</el-button>
    <!--  <i class="el-icon-info" @click="dialogVisible = true">用户调研</i> -->
    <el-dialog title="用户调研" :visible.sync="dialogVisible" width="60%" :before-close="closeDialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules" v-loading="loading">
        <div class="daiInfo proInfo">
          <div class="proInfo-box bornone clearfix">
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
                      <el-option v-for="item in sIndustry" :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :id="item.dICT_ID"></el-option>
                      <!-- <el-option label="一次性接入" value="1"></el-option>
                      <el-option label="全量接入" value="2"></el-option>
                      <el-option label="实时接入" value="3"></el-option> -->
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="znb">
                    <el-select v-model="ruleForm.znb" placeholder="请选择">
                      <el-option v-for="item in sZnb" :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :id="item.dICT_ID"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="fcc">
                    <el-select v-model="ruleForm.fcc" placeholder="请选择">
                      <el-option v-for="item in sFcc" :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :id="item.dICT_ID"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="tlc">
                    <el-select v-model="ruleForm.tlc" placeholder="请选择">
                      <el-option v-for="item in sTlc" :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :id="item.dICT_ID"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="bdc">
                    <el-select v-model="ruleForm.bdc" placeholder="请选择">
                      <el-option v-for="item in sBdc" :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :id="item.dICT_ID"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0">
                  <el-form-item prop="abc">
                    <el-select v-model="ruleForm.abc" placeholder="请选择">
                      <el-option v-for="item in sAbc" :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :id="item.dICT_ID"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="ml0 tcenter mt10">
                  <el-form-item>
                    <span>{{rnum}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="ml0 mt10">
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
                    <el-option v-for="item in sDum" :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :id="item.dICT_ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="24" class="plr30 mt20">
              <el-col :span="6">
                <el-form-item label="数据范围:" prop="datarange">
                  <el-select v-model="ruleForm.datarange" placeholder="请选择">
                    <el-option v-for="item in sDrg" :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :id="item.dICT_ID"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="3" class="ml0" v-if="ruleForm.datarange!='3'">
                <el-form-item prop="pro">
                  <el-select v-model="ruleForm.pro" placeholder="请选择" @change="proChange()">
                   <el-option v-for="item in proArr" :label="item.name" :value="item.code" :id="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="bank" v-if="ruleForm.datarange!='3'">bank</el-col>
              <el-col :span="3" class="ml0" v-if="ruleForm.datarange=='2'||ruleForm.datarange=='1'">
                <el-form-item prop="city">
                  <el-select v-model="ruleForm.city" placeholder="请选择" @change = "cityChange()">
                    <el-option v-for="item in cityArr" :label="item.name" :value="item.code" :id="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="bank" v-if="ruleForm.datarange=='1'||ruleForm.datarange=='2'">bank</el-col>
              <el-col :span="3" class="ml0" v-if="ruleForm.datarange=='4'">
                <el-form-item prop="urban">
                  <el-select v-model="ruleForm.urban" placeholder="请选择">
                   <el-option v-for="item in urbanArr" :label="item.name" :value="item.code" :id="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="10" class="plr30">
              <el-form-item label="初始数据量:" prop="datanum">
                <el-input v-model="ruleForm.datanum" required></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="tcenter mt30 sursavebtn">
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">完成</el-button>
                <el-button @click="closeForm()">取消</el-button>
              </el-form-item>
            </el-col>
          </div>
        </div>
      </el-form>
    </el-dialog>
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
      loading: true,
      sIndustry: [],
      id: "",
      tableid: '10101623',
      sZnb: [],
      sFcc: [],
      sTlc: [],
      sBdc: [],
      sAbc: [],
      sDum: [],
      sDrg: [],
      proArr:[],
      cityArr:[],
      urbanArr:[],
      ruleForm: {
        rename: '', //资源名称
        tablename: '', //表名
        datarange: '', //数据范围
        datamode: '', //数据接入方式
        pro: '',
        city: '',
        urban: '',
        datanum: '', //初始数据量
        industry: '',
        znb: '',
        fcc: '',
        tlc: '',
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
          this.loading = true;
          var saveInfo = {
            iD: "44952", //非必填
            tABLE_ID: this.tableid, //表id
            rESOURCE_DIRECTORY_NUMBER: "D-010000300000ZNB-01-111127262", // '资源目录编号',
            iNDUSTRY_CATEGORY: this.ruleForm.industry, // '行业类别',
            pOLICE_BUSINESS: this.ruleForm.znb, // '公安业务',
            fIRST_CLASS_CLASSIFICATION: this.ruleForm.fcc, //'一级分类',
            tWO_LEVEL_CLASSIFICATION: this.ruleForm.tlc, // '二级分类',
            tAXONOMY: this.ruleForm.bdc, //'细目分类',
            aTTRIBUTE_CLASSIFICATION: this.ruleForm.abc, // '属性分类',
            dATA_TIMELINESS: "", // '数据时效性',
            dATA_UPDATE_MODE: this.ruleForm.datamode, // '数据更新方式',
            iNITIAL_DATA_VOLUME: this.ruleForm.datanum, // '初始数据量',
            dATA_RANGE: this.ruleForm.datarange, //'数据范围',
            xzqy: [{ "pro": this.ruleForm.pro }, { "city": this.ruleForm.city }, { "urban": this.ruleForm.urban }], //行政区域
            remarks: "" //备注，非必填
          }
          this.$ajax({
            method: 'post',
            url: 'http://10.19.160.171:8088/demo/dataTable/inputSurvey',
            data: saveInfo
          }).then(res => {
            this.loading = false;
            if (res.data.success) {
              this.$alert('数据标记成功', '信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.dialogVisible = false;
                }
              });
            }
          }, (res) => {
            this.loading = false;
            this.$alert('数据标记失败', '信息', {
              confirmButtonText: '确定'
            });
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
        url: 'http://10.19.160.171:8088/demo/dataTable/queryDictionary',
        params: {

        }
      }).then(res => {

        //得到Industry
        this.sIndustry = res.data.staticDatas.INDUSTRY;
        this.ruleForm.industry = this.sIndustry[0].sTATIC_CODE;
        //ZNB
        this.sZnb = res.data.staticDatas.ZNB;
        this.ruleForm.znb = this.sZnb[0].sTATIC_CODE;
        //FCC
        this.sFcc = res.data.staticDatas.FCC;
        this.ruleForm.fcc = this.sFcc[0].sTATIC_CODE;
        //TLC
        this.sTlc = res.data.staticDatas.TLC;
        this.ruleForm.tlc = this.sTlc[0].sTATIC_CODE;
        //BDC
        this.sBdc = res.data.staticDatas.BDC;
        this.ruleForm.bdc = this.sBdc[0].sTATIC_CODE;
        //ABC
        this.sAbc = res.data.staticDatas.ABC;
        this.ruleForm.abc = this.sAbc[0].sTATIC_CODE;
        //romId
        this.ruleForm.randomId = res.data.randomId
        //DUM
        this.sDum = res.data.staticDatas.DUM;
        this.ruleForm.datamode = this.sDum[0].sTATIC_CODE;
        //DRG
        this.sDrg = res.data.staticDatas.DRG;
        this.ruleForm.datarange = this.sDrg[2].sTATIC_CODE;
        this._queryStaticDatas();
      })
    },
    //查询标记信息
    _queryStaticDatas() {
      console.log(this.tableid);
      this.$ajax({
        method: "get",
        url: 'http://10.19.160.171:8088/demo/dataTable/getSurvey',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
          tableId: this.tableid
        }

      }).then(res => {
        this.loading = false;
        this.ruleForm.industry = res.data.data.iNDUSTRY_CATEGORY;
        this.ruleForm.znb = res.data.data.pOLICE_BUSINESS;
        this.ruleForm.fcc = res.data.data.fIRST_CLASS_CLASSIFICATION;
        this.ruleForm.tlc = res.data.data.tWO_LEVEL_CLASSIFICATION;
        this.ruleForm.bdc = res.data.data.tAXONOMY;
        this.ruleForm.abc = res.data.data.aTTRIBUTE_CLASSIFICATION;
        this.ruleForm.datamode = res.data.data.dATA_UPDATE_MODE;
        this.ruleForm.datanum = res.data.data.iNITIAL_DATA_VOLUME;
        this.ruleForm.datarange = res.data.data.dATA_RANGE;
        let xzqyData = JSON.parse(res.data.data.xzqy);
        this.ruleForm.pro = xzqyData[0].pro;
        this.ruleForm.city = xzqyData[1].city;
        this._queryCity(this.ruleForm.pro,'city');
        this.ruleForm.urban = xzqyData[2].urban;
        this._queryCity(this.ruleForm.city,'urban');


      }, res => {
        this.loading = false;
        console.log("error");
      })
    },
    //查询全省市
    _queryCity(value,flag) {
      this.$ajax({
        method: "get",
        url: 'http://10.19.160.171:8088/demo/commonInterUtils/getAreas?parentid='+value,
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
         
        }

      }).then(res => {
           if(flag=='pro'){
             this.proArr = res.data.data;
           }
           if(flag == 'city'){
            this.cityArr = res.data.data;
           }
           if(flag == 'urban'){
            this.urbanArr = res.data.data;
           }
           
        })
    },
    //资源目录下载
    downTxt() {
      window.location.href = "/api/dataTable/downloadSpecification";
    },
    //通过省查询市
    proChange(){
      console.log(this.ruleForm.pro);
      this._queryCity(this.ruleForm.pro,'city');
    },
    //通过市获取区域
    cityChange(){
      console.log(this.ruleForm.city);
      this._queryCity(this.ruleForm.city,'urban');
    },
    //查詢系統配置
    _querySys(){
      this.$ajax({
        method: "get",
        url: 'http://10.19.160.176:8088/demo/caccesssysRelationWorkInfo/getSystemSet.do',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
         
        }

      }).then(res => {
        console.log(res);
      })
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
        console.log("----");
        console.log(this.pdata);
        this._getStaticDatas();
        this._queryCity('0','pro');
        this._querySys();
        //资源名称
        if (this.pdata.comments == '' || this.pdata.comments == null) {
          this.ruleForm.rename = this.pdata.diyComments
        } else {
          this.ruleForm.rename = this.pdata.comments;
        }
        this.ruleForm.tablename = this.pdata.name;
        this.tableId = this.pdata.id;
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

</style>
