<template>
  <div class="taskMDialog regcon edit_dialog2">
    <el-tooltip class="item" effect="light" content="编辑" placement="top">
      <i @click="dialogVisible = true" class="enc-icon-bianji table-action-btn"></i>
    </el-tooltip>
    <el-dialog title="接入数据源" :visible.sync="dialogVisible" width="72%" :before-close="closeDialog" class="edit-dialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules" v-loading="loading">
        <div class="daiInfo proInfo">
          <div class="daiInfo-title proInfo-title">
            <h2>提供方信息</h2>
          </div>
          <div class="proInfo-box bornone clearfix">
            <el-col :span="10">
              <el-form-item label="接入源名称:" prop="jrname">
                <el-input v-model="ruleForm.jrname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="数据提供人姓名:" prop="proname">
                <el-input v-model="ruleForm.proname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="接入数据来源:" prop="resource">
                <el-select v-model="ruleForm.resource" placeholder="请选择">
                  <el-option :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :key="item.sTATIC_CODE" v-for="item in SJLY"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="数据提供人电话:" prop="prophone">
                <el-input v-model="ruleForm.prophone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="数据授权情况:" prop="author">
                <el-radio-group v-model="ruleForm.author" disabled>
                  <el-radio label="true">已授权</el-radio>
                  <el-radio label="false">未授权</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="数据提供人邮箱:" prop="proemail">
                <el-input v-model="ruleForm.proemail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="bank">bank</el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="数据提供人QQ:" prop="proqq">
                <el-input v-model="ruleForm.proqq"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </div>
        <div class="daiInfo dockInfo">
          <div class="daiInfo-title">
            <h2>对接方信息</h2>
          </div>
          <div class="daiInfo-box clearfix">
            <el-col :span="10">
              <el-col :span="16">
                <el-form-item label="数据所属部门:">
                  <el-input v-model="ruleForm.dockdata" disabled placeholder prop="dockdata" class="disele"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-popover placement="right" width="400" trigger="click">
                  <el-tree :data="treedata" show-checkbox node-key="id" :check-strictly="true" :props="defaultProps" accordion @check-change="handleClick" @check="nodeClick" :default-checked-keys="[ruleForm.dockid]" :default-expanded-keys="[deIndex]" ref="treeForm" class="treeAuto"></el-tree>
                  <span class="deicon" slot="reference" title="选择部门树"></span>
                </el-popover>
              </el-col>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="注册人姓名:" prop="dockname">
                <el-input v-model="ruleForm.dockname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="对接部门:" prop="dockpart">
                <el-select v-model="ruleForm.dockpart" placeholder="请选择">
                  <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in DJBM"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="对接平台:" prop="dockPlat">
                <el-select v-model="ruleForm.dockPlat" placeholder="请选择">
                  <el-option :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :key="item.sTATIC_CODE" v-for="item in DJPT"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="对接业务类别:">
                <el-col :span="24">
                  <el-form-item prop="authorf">
                    <el-select v-model="ruleForm.authorf" placeholder="请选择">
                      <el-option :label="item.sTATIC_NAME" :value="item.sTATIC_CODE" :key="item.sTATIC_CODE" v-for="item in SSJZ"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="注册人电话:" prop="dockphone">
                <el-input v-model="ruleForm.dockphone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" class="bank">bank</el-col>
          </div>
        </div>
        <div class="daiInfo otherInfo">
          <div class="daiInfo-title">
            <h2>接入源设置</h2>
          </div>
          <div class="daiInfo-box clearfix">
            <el-form-item class="my_form_item" label="接入源类型:" prop="syskind">
              <el-radio-group v-model="ruleForm.syskind" style="margin-top:-12px;">
                <el-radio v-for="item in syskindList" :label="item.id" :key="item.id" disabled><span>{{item.name}}</span><span v-if="item.id=='10010' || item.id=='10020'" class="enc-icon-beta betaspan"></span></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-button type="primary" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'" @click="testForm('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">测试连接</el-button>
            <el-row>
              <el-col style="text-align:right;margin-bottom:10px;">
                <el-col :span="15" class="tleft">
                  <span class="tleft cred">tips:数据源连接更新仅适用于数据源用户信息变更或数据源无变更迁移</span>
                </el-col>
                <p v-if="isDisableClassFlag" class="isRed">*修改接入源设置需测试连接</p>
              </el-col>
            </el-row>
            <el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&&ruleForm.syskind!='10023'">*</span>
                <el-form-item class="fl unrequired" label="IP地址/主机名:" prop="ipname" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'">
                  <el-input v-model="ruleForm.ipname" @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&&ruleForm.syskind!='10023'">*</span>
                <el-form-item class="fl unrequired" label="端口号:" prop="iport" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'">
                  <el-input v-model="ruleForm.iport" @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&&ruleForm.syskind!='10023'">*</span>
                <el-form-item class="fl unrequired" label="登录名:" prop="username" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'">
                  <el-input v-model="ruleForm.username" @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&&ruleForm.syskind!='10023'">*</span>
                <el-form-item class="fl unrequired" label="密码:" prop="password" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'">
                  <el-input v-model="ruleForm.password" @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind=='10001'||ruleForm.syskind=='10003'||ruleForm.syskind=='10002'||ruleForm.syskind=='10004'||ruleForm.syskind=='10020'">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&(ruleForm.syskind=='10001'||ruleForm.syskind=='10003'||ruleForm.syskind=='10002'||ruleForm.syskind=='10004'||ruleForm.syskind=='10020')">*</span>
                <el-form-item class="fl unrequired" label="实例/数据库名:" prop="instanceName" v-if="ruleForm.syskind=='10001'||ruleForm.syskind=='10003'||ruleForm.syskind=='10002'||ruleForm.syskind=='10004'||ruleForm.syskind=='10020'">
                  <el-input v-model="ruleForm.instanceName" @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind=='10002'">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&(ruleForm.syskind=='10002')">*</span>
                <el-form-item class="fl unrequired" label="模式名/架构/Schema:" prop="model" v-if="ruleForm.syskind=='10002'">
                  <el-input v-model="ruleForm.model"  @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">*</span>
                <el-form-item class="fl unrequired" label="集群根目录" prop="hadoopDir" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.hadoopDir" @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">*</span>
                <el-form-item class="fl unrequired" label="集群目录" prop="hadoopHomes" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.hadoopHomes" @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">*</span>
                <el-form-item class="fl unrequired" label="vhost" prop="vhost" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.vhost" @change="changeContentInfo()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10" v-if="ruleForm.syskind=='10010'||ruleForm.syskind=='10011'" class="uncolls ftptype">
                <el-form-item label="传输模式:" prop="transmode">
                  <el-select v-model="ruleForm.transmode" placeholder="请选择" @change="changeContentInfo('transmode')">
                    <el-option label="主动" value="true"></el-option>
                    <el-option label="被动" value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </div>
        </div>
        <div class="daiInfo reginfo">
          <div class="daiInfo-box clearfix">
            <el-form-item>
              <el-col :span="24">
                <el-button v-if="isDisableClassFlag" type="primary" size="small" class="isDisable" disabled>保存</el-button>
                <el-button v-if="!isDisableClassFlag" type="primary" size="small" @click="submitForm('ruleForm')" :class="{ isDisable: isDisableClassFlag }">保存</el-button>
                <el-button @click="closeForm()" size="small">关闭</el-button>
              </el-col>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "taskMDialog",
  data: function() {
    const _self = this;
    const validatePhone = (rule, value, callback) => {
      if (_self.testflag && rule.field == "dockphone") {
        callback();
      } else {
        const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        const isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|17[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
        if (rule.required) {
          if (value == "") {
            callback(new Error("请输入正确的号码"));
          } else {
            if (isPhone.test(value) || isMob.test(value)) {
              callback();
            } else {
              callback(new Error("请输入正确的号码"));
            }
          }
        }
        if (value != "") {
          if (isPhone.test(value) || isMob.test(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的号码"));
          }
        } else {
          callback();
        }
      }
    };
    //判断是否必选项为空
    const validateNull = (rule, value, callback) => {
      if (_self.testflag && rule.field == "dockname") {
        callback();
      } else {
        if (value == "") {
          callback(new Error("不能为空"));
        } else {
          callback();
        }
      }
    };
    const validateSq = (rule, value, callback) => {
      if (this.ruleForm.author == "true") {
        if (value == "") {
          callback(new Error("不能为空"));
        } else {

          callback();
        }
      } else {
        callback();
      }
    }
    //校验ip
    const validateIp = (rule, value, callback) => {
      if (this.ruleForm.author == 'true') {
        if (value == "" || /.*[\u4e00-\u9fa5]+.*$/.test(value)) {
          callback(new Error("请输入正确的ip"));
        } else {
          callback()
        }
      } else {
        callback();
      }

    };
    const validatePort = (rule, value, callback) => {
      if (this.ruleForm.author == 'true') {
        if (value == "" || /[^0-9]+/.test(value)) {
          callback(new Error("请输入正确的端口号"));
        } else {
          callback()
        }
      } else {
        callback()
      }

    }
    return {
      i: 0, //树节点只允许单选
      dialogVisible: false,
      fullscreenLoading: false,
      syskindList: [], //接入类型列表
      SJLY: [], //数据来源
      SSJZ: [], //业务类别
      DJBM: [], //对接部门
      DJPT: [], //对接平台
      fileList: [], //上传的文件列表
      deptData: [],
      deIndex: 0,
      tableMsg: [],
      loading: false,
      testflag: false,
      isDisableClassFlag: false,
      modyData: [],
      appId: '',
      ruleForm: {
        jrname: '',
        proname: '',
        resource: '',
        prophone: '',
        author: 'true',
        authorf: '',
        authors: '',
        proemail: '',
        proqq: '',
        dockdata: '', //所属部门名称
        dockid: '', //所属部门id
        dockname: '',
        dockpart: '',
        dockphone: '',
        syskind: '',
        ipname: '',
        username: '',
        instanceName: '',
        password: '',
        iport: '',
        model: '',
        dockPlat: '',
        url: '',
        transmode: 'false',
        operationName: '',
        parameterName: '',
        timeout: '',
        tableStructure: '',
        fromPath: '',
        toPath: '',
        hadoopDir: '',
        hadoopHomes: '',
        vhost: '',
        upfile: ''

      },
      formRules: {
        jrname: [
          { required: true, message: '不能为空', validator: validateNull, trigger: "blur" }
        ],
        ipname: [
          { required: false, message: '不能为空', validator: validateIp, trigger: "blur" }
        ],
        username: [
          { required: false, message: '不能为空', validator: validateSq, trigger: "blur" }
        ],
        password: [
          { required: false, message: '不能为空', validator: validateSq, trigger: "blur" }
        ],
        dockname: [
          { required: true, message: '不能为空', validator: validateNull, trigger: "blur" }
        ],
        iport: [
          { required: false, message: '请输入正确的端口号', validator: validatePort, trigger: "blur" }
        ],
        instanceName: [
          { required: false, message: '不能为空', validator: validateSq, trigger: "blur" }
        ],
        model: [
          { required: false, message: '不能为空', validator: validateSq, trigger: "blur" }
        ],
        hadoopDir: [
          { required: false, message: '不能为空', validator: validateSq, trigger: "blur" }
        ],
        hadoopHomes: [
          { required: false, message: '不能为空', validator: validateSq, trigger: "blur" }
        ],
        vhost: [
          { required: false, message: '不能为空', validator: validateSq, trigger: "blur" }
        ],
        dockdata: [
          { required: true, message: '不能为空', validator: validateNull, trigger: "blur" }
        ],
        proemail: [
          { validator: this.GLOBAL.validateEmail, trigger: 'blur' }
        ],
        proqq: [
          { validator: this.GLOBAL.validateNumber, trigger: 'blur' }
        ],
        prophone: [
          { validator: this.GLOBAL.validatePhone, trigger: 'blur' }
        ],
        dockphone: [
          { required: true, message: '输入正确的号码', validator: validatePhone, trigger: 'blur' }
        ]
      },
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
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
      if (checked == true) {
        this.checkedId = data.id;
        this.$refs.treeForm.setCheckedNodes([data]);
      }
    },
    //树的点击
    nodeClick(data, checked, node) {
      this.checkedId = data.id
      this.$refs.treeForm.setCheckedNodes([data]);
      this.ruleForm.dockdata = data.deptName;
      this.ruleForm.dockid = data.id;
    },
    //关闭
    closeForm() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    //文件的上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    _getSJLYandSSJZ() {
      let _self = this;
      _self.$ajax({
        methods: "get",
        url: this.GLOBAL.api.API_DACM + '/commonInter/getDictDataCategory',
        params: {

        }
      }).then(res => {
        if (res.data.staticDatas.SJLY == undefined) {
          this.$alert('获取资产数据失败', '信息', {
            confirmButtonText: '确定',
            callback: action => {
              return false;
            }
          });
          return false;
        }
        _self.SJLY = res.data.staticDatas.SJLY;
        _self.SSJZ = res.data.staticDatas.SSJZ;
        console.log(_self.SSJZ);
        if (_self.ruleForm.resource == '') {
          _self.ruleForm.resource = _self.SJLY[0].sTATIC_CODE;
        }
        if (_self.ruleForm.authorf == '') {
          _self.ruleForm.authorf = _self.SSJZ[0].sTATIC_CODE;
        }
      })
    },
    _getAccessDialect() {
      this.$ajax({
        methods: "get",
        url: this.GLOBAL.api.API_DACM + '/commonInter/sysdialect',
        params: {
          type: '2'
        }
      }).then(res => {
        this.syskindList = res.data;
      })
    },
    //对接部门
    _getDJBM() {
      this.$ajax({
        methods: "get",
        url: this.GLOBAL.api.API_DACM + '/commonInter/sysDepartment',
        params: {

        }
      }).then(res => {

        this.DJBM = res.data;
        this.ruleForm.dockpart = res.data[0].id;
      })
    },
    //对接平台
    _getDJPT() {
      this.$ajax({
        methods: "get",
        url: this.GLOBAL.api.API_DACM + '/commonInter/getListStaticData.do',
        params: {
          dictCode: 'ButtPlatForm'
        }
      }).then(res => {

        this.DJPT = res.data;
        if (this.ruleForm.dockPlat == '') {
          this.ruleForm.dockPlat = res.data[0].sTATIC_CODE;
        }

      })
    },
    //数据所属部门
    _getSYBM() {
      var _self = this;
      this.$ajax({
        method: "post",
        url: this.GLOBAL.api.API_DACM + '/deptInfo/getDeptInfo',
      }).then(res => {
        console.log(res);
        _self.treedata = res.data.datas;
        for (let i = 0; i < _self.treedata.length; i++) {
          _self.deptData.push({
            id: _self.treedata[i].id,
            name: _self.treedata[i].deptName,
            pid: _self.treedata[i].pid
          })
          if (_self.treedata[i].children.length != 0 && _self.treedata[i].children.length != undefined) {
            this._getDepId(_self.treedata[i].children);
          }
        }
      })
    },
    //找到id的index值
    _getDepId(value) {
      for (let n = 0; n < value.length; n++) {
        this.deptData.push({
          id: value[n].id,
          name: value[n].deptName,
          pid: value[n].pid
        })
        if (value[n].children.length != 0 && value[n].children.length != undefined) {
          this._getDepId(value[n].children);
        }
      }
    },
    //保存信息
    submitForm(formName) {
      this.testflag = false;
      console.log(this.ruleForm.syskind);
      var _self = this;
      var modifyFlag = '';
      console.log(this.modyData['ipname']);
      if (_self.ruleForm.ipname != this.modyData[0].ipname || _self.ruleForm.username != this.modyData[3].username || _self.ruleForm.password != this.modyData[4].password || _self.ruleForm.iport != this.modyData[1].iport || _self.ruleForm.instanceName != this.modyData[2].instanceName || _self.ruleForm.model != this.modyData[5].model) {
        modifyFlag = '1';
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let save = {};
          save = {
            "id": _self.appId,
            "name": _self.ruleForm.jrname, // 接入源名称
            "accessSysDialectId": _self.ruleForm.syskind, //mysql,oracle接入源类型
            "registerName": _self.ruleForm.dockname, // 注册人姓名 
            "registerPhone": _self.ruleForm.dockphone, // 注册人电话 
            "contactsPhone": _self.ruleForm.prophone, //数据提供人电话
            "contactsEmail": _self.ruleForm.proemail, //数据提供人 邮箱
            "accessSysDeptInfoId": _self.ruleForm.dockid, //所属部门
            "modifyFlag": modifyFlag,
            "attr": [{
                //数据提供人姓名
                "key": "sourceQQ",
                "value": _self.ruleForm.proqq
              },

              {
                //数据提供人电话
                "key": "sourceEmail",
                "value": _self.ruleForm.proemail
              },
              {
                "key": "network",
                "value": _self.ruleForm.resource //  接入数据来源
              },
              {
                //数据授权
                "key": "accredit",
                "value": _self.ruleForm.author
              },
              {
                //对接部门
                "key": "abutment",
                "value": _self.ruleForm.dockpart
              },
              {
                //数据所属部门
                "key": "department",
                "value": _self.ruleForm.dockdata
              },
              {
                "key": "depId",
                "value": _self.ruleForm.dockid
              },
              {
                //归属大类
                "key": "ascription",
                "value": ""
              },
              {
                //对接平台
                "key": "platform",
                "value": _self.ruleForm.dockPlat
              },
              {
                //业务类别
                "key": "rcategory",
                "value": _self.ruleForm.authorf
              },
              //属性值
              {
                "key": "ip",
                "value": _self.ruleForm.ipname
              },
              {
                "key": "port",
                "value": _self.ruleForm.iport
              },
              {
                "key": "url",
                "value": _self.ruleForm.url
              },
              {
                "key": "timeOut",
                "value": _self.ruleForm.timeout
              },
              {
                "key": "databasename",
                "value": _self.ruleForm.instanceName
              },
              {
                "key": "username",
                "value": _self.ruleForm.username
              },
              {
                "key": "password",
                "value": _self.ruleForm.password
              },
              {
                "key": "model",
                "value": _self.ruleForm.model
              },
              {
                "key": "linkman",
                "value": _self.ruleForm.proname
              },
              {
                "key": "dept_name",
                "value": _self.ruleForm.dockdata
              },
              {
                "key": 'vhost',
                "value": _self.ruleForm.vhost
              },
              {
                "key": 'isActive',
                "value": _self.ruleForm.transmode
              },
              {
                "key": 'fromPath',
                "value": _self.ruleForm.fromPath
              },
              {
                "key": 'toPath',
                "value": _self.ruleForm.toPath
              },
              {
                "key": 'tableStructure',
                "value": _self.ruleForm.tableStructure
              }

            ]
          }
          console.log(typeof(save));
          this.$ajax({
            method: "get",
            url: this.GLOBAL.api.API_DACM + '/register/dataSourceCheck',
            params: {
              ip: this.ruleForm.ipname,
              username: this.ruleForm.username,
              name: this.ruleForm.jrname,
              id: this.appId
            }

          }).then(res => {
            if (res.data.data.exist) {
              if (res.data.data.existName) {
                this.$message.warning('接入源名称已存在');
                return false;
              }
              this.$confirm('已经存在同IP地址同用户的数据源，确定保存?', '信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                this.loading = true;
                this.$ajax({
                  method: "POST",
                  url: this.GLOBAL.api.API_DACM + '/update/dataSourceUpdate',
                  data: save

                }).then(res => {
                  this.loading = false;
                  if (res.data.success) {
                    this.$alert('更新成功', '信息', {
                      confirmButtonText: '确定',
                      callback: action => {
                        this.$refs['ruleForm'].resetFields();
                        this.dialogVisible = false;
                        this.$emit('refreshTable');
                        this.$emit('storeReady');
                      }
                    });

                  } else {
                    this.$alert(res.data.message, '信息', {
                      confirmButtonText: '确定',
                      callback: action => {}
                    });
                  }

                })

              }).catch(() => {

              })
            } else {

              this.$confirm('确认保存修改?', '信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                this.loading = true;
                this.$ajax({
                  method: "POST",
                  url: this.GLOBAL.api.API_DACM + '/update/dataSourceUpdate',
                  data: save

                }).then(res => {
                  this.loading = false;
                  if (res.data.success) {
                    this.$alert('更新成功', '信息', {
                      confirmButtonText: '确定',
                      callback: action => {
                        this.$refs['ruleForm'].resetFields();
                        this.dialogVisible = false;
                        this.$emit('refreshTable');
                        this.$emit('storeReady');
                      }
                    });
                  } else {
                    this.$alert(res.data.message, '信息', {
                      confirmButtonText: '确定',
                      callback: action => {

                      }
                    });
                  }

                })
              }).catch(() => {

              })
            }
          })
        }
      });
    },
    //测试连接
    testForm(formName) {
      this.testflag = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          let testData = {};
          testData = {
            "ip": this.ruleForm.ipname,
            "port": this.ruleForm.iport,
            "instanceName": this.ruleForm.instanceName,
            "model": this.ruleForm.model,
            "username": this.ruleForm.username,
            "password": this.ruleForm.password,
            "url": this.ruleForm.url,
            "accessDialectId": this.ruleForm.syskind
          }
          this.$ajax({
            method: "POST",
            url: this.GLOBAL.api.API_DACM + '/register/dataSourceConnect',
            data: testData
          }).then(res => {
            this.loading = false;
            if (res.data.success) {
              this.isDisableClassFlag = false; //控制保存按钮是否可点击
              this.$alert('连接成功', '信息', {
                confirmButtonText: '确定'
              });
            } else {
              this.isDisableClassFlag = true; //控制保存按钮是否可点击
              this.$alert('连接失败', '信息', {
                confirmButtonText: '确定'
              });
            }

          })
        } else {
          this.isDisableClassFlag = true; //控制保存按钮是否可点击
          return false;
        }
      });
    },
    //初始化数据
    _getInit() {
      this.loading = true;
      this.$ajax({
        method: "get",
        url: this.GLOBAL.api.API_DACM + '/update/dataSourceSelect',
        params: {
          id: this.appId
        }
      }).then(res => {
        this.loading = false;
        if (res.data.success) {
          var data = res.data.data;
          let _self = this;
          _self.ruleForm.jrname = data.name;
          _self.ruleForm.syskind = parseInt(data.accessSysDialectId);
          _self.ruleForm.dockname = data.registerName;
          _self.ruleForm.dockphone = data.registerPhone;
          _self.ruleForm.prophone = data.contactsPhone;
          _self.ruleForm.proemail = data.contactsEmail;
          _self.ruleForm.dockid = data.accessSysDeptInfoId;
          for (let m = 0; m < _self.deptData.length; m++) {
            if (_self.deptData[m].id == data.accessSysDeptInfoId) {
              _self.ruleForm.dockid = _self.deptData[m].id;
              _self.ruleForm.dockdata = _self.deptData[m].name;
              _self.deIndex = _self.deptData[m].pid
            }
          }
          //属性
          for (let i = 0; i < data.attr.length; i++) {
            if (data.attr[i].key == 'sourceQQ') {
              _self.ruleForm.proqq = data.attr[i].value;
            }
            if (data.attr[i].key == 'network') {
              _self.ruleForm.resource = data.attr[i].value;
            }
            if (data.attr[i].key == 'accredit') {
              _self.ruleForm.author = data.attr[i].value;
            }
            if (data.attr[i].key == 'abutment') {
              _self.ruleForm.dockpart = parseInt(data.attr[i].value);
            }
            if (data.attr[i].key == 'department') {
              _self.ruleForm.dockdata = data.attr[i].value;
            }
            if (data.attr[i].key == 'depId') {
              _self.ruleForm.dockid = data.attr[i].value;

            }
            if (data.attr[i].key == 'rcategory') {
              _self.ruleForm.authorf = data.attr[i].value;
            }
            if (data.attr[i].key == 'platform') {
              _self.ruleForm.dockPlat = data.attr[i].value;
            }
            if (data.attr[i].key == 'ip') {
              _self.ruleForm.ipname = data.attr[i].value;
              _self.modyData.push({
                'ipname': data.attr[i].value
              })
            }
            if (data.attr[i].key == 'port') {
              _self.ruleForm.iport = data.attr[i].value;
              _self.modyData.push({
                'iport': data.attr[i].value
              })
            }
            if (data.attr[i].key == 'url') {
              _self.ruleForm.url = data.attr[i].value;
            }
            if (data.attr[i].key == 'databasename') {
              _self.ruleForm.instanceName = data.attr[i].value;
              _self.modyData.push({
                'instanceName': data.attr[i].value
              })
            }
            if (data.attr[i].key == 'username') {
              _self.ruleForm.username = data.attr[i].value;
              _self.modyData.push({
                'username': data.attr[i].value
              })
            }
            if (data.attr[i].key == 'password') {
              _self.ruleForm.password = data.attr[i].value;
              _self.modyData.push({
                'password': data.attr[i].value
              })
            }
            if (data.attr[i].key == 'model') {
              _self.ruleForm.model = data.attr[i].value;
              _self.modyData.push({
                'model': data.attr[i].value
              })
            }
            if (data.attr[i].key == 'linkman') {
              _self.ruleForm.proname = data.attr[i].value;
            }
            if (data.attr[i].key == 'vhost') {
              _self.ruleForm.vhost = data.attr[i].value;
            }
            if (data.attr[i].key == 'isActive') {
              _self.ruleForm.transmode = data.attr[i].value;
              _self.modyData.push({
                'transmode': data.attr[i].value
              })
            }
            if (data.attr[i].key == 'fromPath') {
              _self.ruleForm.fromPath = data.attr[i].value;
            }
            if (data.attr[i].key == 'toPath') {
              _self.ruleForm.toPath = data.attr[i].value;
            }
            if (data.attr[i].key == 'tableStructure') {
              _self.ruleForm.tableStructure = data.attr[i].value;
            }
          }
        } else {
          this.$alert('获取数据失败', '信息', {
            confirmButtonText: '确定',
            callback: action => {

            }
          });
        }
      }, (res) => {
        this.loading = false;
      })
    },
    changeContentInfo(e) { //参数留下做判断，如果用户返回初始数据是否需要判断
      this.isDisableClassFlag = true;
    }
  },
  components: {

  },
  props: ['acId'],

  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.appId = this.acId;
        this.isDisableClassFlag = false; //保存按钮初始值设置
        //得到数据库方言
        this._getAccessDialect();
        //数据来源
        this._getSJLYandSSJZ();
        //对接部门
        this._getDJBM();
        //对接平台
        this._getDJPT();
        //数据所属部门
        this._getSYBM();
        //初始数据
        this._getInit();
      }
    },
  }

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.edit_dialog2{
  .el-form-item{
    height:30px!important;
  }
  .my_form_item{
    margin-bottom:-10px;
    width: 82%;
    display: inline-block;
    label{
      text-align: left;
    }
  }
}
.taskMDialog {
  display: inline-block;
}

.cred {
  color: red;
}

.el-select {
  width: 100%;
}

.deicon {
  background: url("../../../../assets/images/tree.svg");
  width: 42px;
  height: 34px;
  display: inline-block;
  /* float: left; */
  vertical-align: top;
  margin-top: -3px;
  background-size: contain;
  background-repeat: no-repeat;
  margin-left: 10px;
  cursor: pointer;
}

.otherInfo .el-radio {
  margin-left: 8px;
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

.regcon .el-dialog .otherInfo .el-form-item__label {
  width: 140px !important;
}

.regcon .otherInfo .el-form-item--medium .el-form-item__content {
  margin-left: 140px !important;
}

.el-dialog .otherInfo .fileItem .el-form-item__label {
  width: 235px !important;
}

i {
  cursor: pointer;
}

.el-table .cell .taskMDialog .el-form .isDisable {
  cursor: not-allowed;
  color: #fff;
  background-color: #999;
  border: 1px solid #dcdfe6;
  ;
}

.uncol span {
  color: red;
  line-height: 30px;
  margin-right: 6px;
}

.uncol label {
  text-align: left;
}

.otherInfo .unrequired .el-form-item__content {
  width: 100%;
}

.isRed {
  margin: 0;
  color: red;
}

.edit-dialog {
  .el-dialog {
    min-width: 920px;
  }
}

.otherInfo .uncolls .el-form-item--medium .el-form-item__content {
  margin-left: 115px !important;
}

.uncolls .el-form-item__label {
  text-align: left;
}

.uncolls .el-input {
  width: 67%;
}

@media screen and ( max-width: 1580px) {
  .regcon .otherInfo .unrequired .el-form-item__content {
    width: 70%;
  }
}

.regcon .otherInfo .ftptype .el-form-item--medium .el-form-item__content {
  margin-left: 151px !important;
}
.betaspan {
  font-size: 30px;
}
</style>
