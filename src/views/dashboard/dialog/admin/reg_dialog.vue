<template>
  <div class="taskMDialog icon-dai">
    <!-- <el-button @click="dialogVisible = true" class="add-btn">注册</el-button> -->
    <el-tooltip class="item" effect="light" content="注册" placement="top">
      <i @click="dialogVisible = true" class="enc-icon-zhuce table-action-btn" style="margin-right:15px; font-size:30px;"></i>
    </el-tooltip>
    <el-dialog title="接入数据源" :visible.sync="dialogVisible" width="72%" :before-close="closeDialog" class="reg-dialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules" v-loading="loading">
        <div class="daiInfo proInfo">
          <div class="daiInfo-title proInfo-title">
            <h2>提供方信息</h2>
          </div>
          <div class="proInfo-box clearfix">
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
                <!-- <el-radio-group v-model="ruleForm.resource">
                  <el-radio v-for="item in SJLY" :label="item.static_CODE" :key="item.static_CODE">{{item.static_NAME}}</el-radio>
                  <el-radio label="私网"></el-radio>
                 <el-radio label="委办网"></el-radio>
                </el-radio-group>-->
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
                <el-radio-group v-model="ruleForm.author">
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
              <el-form-item label="数据所属部门:">
                <el-popover placement="right" width="400" trigger="click">
                  <el-tree :data="treedata" show-checkbox node-key="id" :check-strictly="true" :props="defaultProps" accordion @check-change="handleClick" @check="nodeClick" :default-checked-keys="[ruleForm.dockid]" :default-expanded-keys="[deIndex]" ref="treeForm" class="treeAuto"></el-tree>
                  <el-input v-model="ruleForm.dockdata" disabled placeholder prop="dockdata" slot="reference" class="disele"></el-input>
                </el-popover>
              </el-form-item>
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
                <!--                 <el-col :span="4" class="bank">bank</el-col>
<el-col :span="10">
  <el-form-item prop="authors">
    <el-select v-model="ruleForm.authors" placeholder="请选择">
      <el-option label="部门一" value="first"></el-option>
      <el-option label="部门二" value="second"></el-option>
    </el-select>
  </el-form-item>
                </el-col>-->
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="注册人电话:" prop="dockphone">
                <el-input v-model="ruleForm.dockphone"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="10">
              <el-form-item label="数据提供人邮箱:" prop="proemail">
                <el-input v-model="ruleForm.proemail"></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :span="10" class="bank">bank</el-col>
          </div>
        </div>
        <div class="daiInfo otherInfo">
          <div class="daiInfo-title">
            <h2>接入源设置</h2>
          </div>
          <div class="daiInfo-box clearfix">
            <el-form-item label="接入源类型:" prop="syskind">
              <el-radio-group v-model="ruleForm.syskind">
                <el-radio v-for="(item,index) in syskindList" :label="item.id" :key="item.id" v-if="index<5||accdiaFlag">{{item.name}}</el-radio>
                <!--  <el-radio label="mysql"></el-radio>
               <el-radio label="oracle"></el-radio>
               <el-radio label="activemq"></el-radio>
               <el-radio label="sqlserver"></el-radio>
               <el-radio label="postgresql"></el-radio>
               <el-radio label="ftp"></el-radio>
               <el-radio label="rabbitmq"></el-radio>
               <el-radio label="mongodb"></el-radio>
               <el-radio label="本地文件"></el-radio>
                <el-radio label="其他"></el-radio>-->
              </el-radio-group>
              <span class="curspan" @click="more(accdiaFlag)">{{accdiaName}}</span>
            </el-form-item>
            <el-row>
              <el-col style="text-align:right;margin-bottom:10px;">
                <el-button type="primary" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'" @click="testForm('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">测试连接</el-button>
              </el-col>
            </el-row>
            <el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&&ruleForm.syskind!='10023'">*</span>
                <el-form-item class="fl unrequired" label="IP地址/主机名:" prop="ipname" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'">
                  <el-input v-model="ruleForm.ipname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&&ruleForm.syskind!='10023'">*</span>
                <el-form-item class="fl unrequired" label="登录名:" prop="username" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'">
                  <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
              </el-col>
              <!--               <el-col :span="2" class="bank">bank</el-col>
<el-col :span="10">
  <el-form-item label="路径" required prop="url" v-if="ruleForm.syskind=='9'">
    <el-input v-model="ruleForm.url"></el-input>
  </el-form-item>
              </el-col>-->
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&&ruleForm.syskind!='10023'">*</span>
                <el-form-item class="fl unrequired" label="密码:" prop="password" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'">
                  <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&&ruleForm.syskind!='10023'">*</span>
                <el-form-item class="fl unrequired" label="端口号:" prop="iport" v-if="ruleForm.syskind!=''&&ruleForm.syskind!='10023'">
                  <el-input v-model="ruleForm.iport"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind=='10001'||ruleForm.syskind=='10003'||ruleForm.syskind=='10002'||ruleForm.syskind=='10004'||ruleForm.syskind=='10020'">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&(ruleForm.syskind=='10001'||ruleForm.syskind=='10003'||ruleForm.syskind=='10002'||ruleForm.syskind=='10004'||ruleForm.syskind=='10020')">*</span>
                <el-form-item class="fl unrequired" label="实例/数据库名:" prop="instanceName" v-if="ruleForm.syskind=='10001'||ruleForm.syskind=='10003'||ruleForm.syskind=='10002'||ruleForm.syskind=='10004'||ruleForm.syskind=='10020'">
                  <el-input v-model="ruleForm.instanceName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind=='10002'||ruleForm.syskind=='10020'">bank</el-col>
              <el-col :span="10" class="uncol">
              <span class="fl" v-show="this.ruleForm.author=='true'&&(ruleForm.syskind=='10002')">*</span>
                <el-form-item class="fl unrequired" label="模式名/架构:" prop="model" v-if="ruleForm.syskind=='10002'||ruleForm.syskind=='10020'">
                  <el-input v-model="ruleForm.model"></el-input>
                </el-form-item>
              </el-col>
              <!--  <el-col :span="10">
               <el-form-item label="接口名称" required prop="operationName">
                 <el-input v-model="ruleForm.operationName"></el-input>
               </el-form-item>
             </el-col>
              <el-col :span="2" class="bank">bank</el-col>-->
              <!--               <el-col :span="10">
  <el-form-item label="参数名" required prop="parameterName">
    <el-input v-model="ruleForm.parameterName"></el-input>
  </el-form-item>
</el-col>
<el-col :span="2" class="bank">bank</el-col>
<el-col :span="10">
  <el-form-item label="timeout" required prop="timeout">
    <el-input v-model="ruleForm.timeout"></el-input>
  </el-form-item>
</el-col>
<el-col :span="2" class="bank">bank</el-col>
<el-col :span="10">
  <el-form-item label="表结构" required prop="tableStructure">
    <el-input v-model="ruleForm.tableStructure"></el-input>
  </el-form-item>
</el-col>
<el-col :span="2" class="bank">bank</el-col>
<el-col :span="10">
  <el-form-item label="源路径" required prop="fromPath">
    <el-input v-model="ruleForm.fromPath"></el-input>
  </el-form-item>
</el-col>
<el-col :span="2" class="bank">bank</el-col>
<el-col :span="10">
  <el-form-item label="目标路径" required prop="toPath">
    <el-input v-model="ruleForm.toPath"></el-input>
  </el-form-item>
</el-col> 
              <el-col :span="2" class="bank">bank</el-col>-->
              <!-- hive专有 -->
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">*</span>
                <el-form-item class="fl unrequired" label="集群根目录" prop="hadoopDir" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.hadoopDir"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">*</span>
                <el-form-item class="fl unrequired" label="集群目录" prop="hadoopHomes" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.hadoopHomes"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10" class="uncol">
                <span class="fl" v-show="this.ruleForm.author=='true'&&ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">*</span>
                <el-form-item class="fl unrequired" label="vhost" prop="vhost" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.vhost"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-if="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10" v-if="ruleForm.syskind=='10010'||ruleForm.syskind=='10011'">
                <el-form-item label="传输模式:" prop="transmode">
                  <el-select v-model="ruleForm.transmode" placeholder="请选择">
                    <el-option label="主动" value="true"></el-option>
                    <el-option label="被动" value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="ruleForm.syskind=='10023'" class="fileItem">
                <el-form-item label="选择本地文件(仅支持txt,excel,csv文件):" prop="upfile">
                  <el-upload class="upload-demo" name="files" ref="upload" action :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                    <!--  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-col>
          </div>
        </div>
        <div class="daiInfo reginfo">
          <div class="daiInfo-box clearfix">
            <el-form-item>
              <el-col :span="24">
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
                <el-button @click="closeDialog()" size="small">关闭</el-button>
              </el-col>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { validateEmail } from "@/utils/validate.js";
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
    };
    //校验ip
    const validateIp = (rule, value, callback) => {
      if (this.ruleForm.author == "true") {
        if (value == "" || /.*[\u4e00-\u9fa5]+.*$/.test(value)) {
          callback(new Error("请输入正确的ip"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validatePort = (rule, value, callback) => {
      if (this.ruleForm.author == "true") {
        if (value == "" || /[^0-9]+/.test(value)) {
          callback(new Error("请输入正确的端口号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    //校验email
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
      tableMsg: [],
      deptData: [],
      testflag: false,
      accdiaName: "更多",
      accdiaFlag: false,
      deIndex: 0,
      loading: false,
      ruleForm: {
        jrname: "",
        proname: "",
        resource: "",
        prophone: "",
        author: "true",
        authorf: "",
        authors: "",
        proemail: "",
        proqq: "",
        dockdata: "", //所属部门名称
        dockid: "", //所属部门id
        dockname: "",
        dockpart: "",
        dockphone: "",
        syskind: "",
        ipname: "",
        username: "",
        instanceName: "",
        password: "",
        iport: "",
        model: "",
        dockPlat: "",
        url: "",
        transmode: "false",
        operationName: "",
        parameterName: "",
        timeout: "",
        tableStructure: "",
        fromPath: "",
        toPath: "",
        hadoopDir: "",
        hadoopHomes: "",
        vhost: "",
        upfile: ""
      },
      formRules: {
        jrname: [{
          required: true,
          message: "不能为空",
          validator: validateNull,
          trigger: "blur"
        }],
        ipname: [{
          required: false,
          message: "不能为空",
          validator: validateIp,
          trigger: "blur"
        }],
        username: [{
          required: false,
          message: "不能为空",
          validator: validateSq,
          trigger: "blur"
        }],
        dockname: [{
          required: true,
          message: "不能为空",
          validator: validateNull,
          trigger: "blur"
        }],
        password: [{
          required: false,
          message: "不能为空",
          validator: validateSq,
          trigger: "blur"
        }],
        iport: [{
          required: false,
          message: "请输入正确的端口号",
          validator: validatePort,
          trigger: "blur"
        }],
        instanceName: [{
          required: false,
          message: "不能为空",
          validator: validateSq,
          trigger: "blur"
        }],
        model: [{
          required: false,
          message: "不能为空",
          validator: validateSq,
          trigger: "blur"
        }],
        hadoopDir: [{
          required: false,
          message: "不能为空",
          validator: validateSq,
          trigger: "blur"
        }],
        hadoopHomes: [{
          required: false,
          message: "不能为空",
          validator: validateSq,
          trigger: "blur"
        }],
        vhost: [{
          required: false,
          message: "不能为空",
          validator: validateSq,
          trigger: "blur"
        }],
        dockdata: [{
          required: true,
          message: "不能为空",
          validator: validateNull,
          trigger: "blur"
        }],
        proemail: [{ validator: this.GLOBAL.validateEmail, trigger: "blur" }],
        proqq: [{ validator: this.GLOBAL.validateNumber, trigger: "blur" }],
        prophone: [{ validator: this.GLOBAL.validatePhone, trigger: "blur" }],
        dockphone: [{
          required: true,
          message: "输入正确的号码",
          validator: validatePhone,
          trigger: "blur"
        }]
      },
      treedata: [],
      defaultProps: {
        children: "children",
        label: "deptName"
      }

      // msgId:this.dialogMsg?this.dialogMsg[1]:''
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs["ruleForm"].resetFields();
      this.accdiaFlag = false;
      this.accdiaName = "更多";
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
      this.checkedId = data.id;
      this.$refs.treeForm.setCheckedNodes([data]);
      this.ruleForm.dockdata = data.deptName;
      this.ruleForm.dockid = data.id;
    },
    //关闭
    closeForm() {
      this.dialogVisible = false;
      this.$refs["ruleForm"].resetFields();
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
      _self
        .$ajax({
          methods: "get",
          url: this.GLOBAL.api.API_DACM + "/commonInter/getDictDataCategory",
          params: {}
        })
        .then(res => {
          if (res.data.staticDatas.SJLY == undefined) {
            this.$alert("获取资产数据失败", "信息", {
              confirmButtonText: "确定",
              callback: action => {
                return false;
              }
            });
            return false;
          }
          _self.SJLY = res.data.staticDatas.SJLY;
          _self.SSJZ = res.data.staticDatas.SSJZ;
          console.log(_self.SSJZ);
          _self.ruleForm.resource = _self.SJLY[0].sTATIC_CODE;
          _self.ruleForm.authorf = _self.SSJZ[0].sTATIC_CODE;
        });
    },
    _getAccessDialect() {
      this.$ajax({
        methods: "get",
        url: this.GLOBAL.api.API_DACM + "/commonInter/sysdialect",
        params: {
          type: "2"
        }
      }).then(res => {
        this.syskindList = res.data;
        this.ruleForm.syskind = res.data[0].id;
      });
    },
    more(flag) {
      if (flag) {
        this.accdiaFlag = false;
        this.accdiaName = "更多";
      } else {
        this.accdiaFlag = true;
        this.accdiaName = "收起";
      }
    },
    //对接部门
    _getDJBM() {
      this.$ajax({
        methods: "get",
        url: this.GLOBAL.api.API_DACM + "/commonInter/sysDepartment",
        params: {}
      }).then(res => {
        this.DJBM = res.data;
        this.ruleForm.dockpart = res.data[0].id;
      });
    },
    //对接平台
    _getDJPT() {
      var _self = this;
      this.$ajax({
        methods: "get",
        url: this.GLOBAL.api.API_DACM + "/commonInter/getListStaticData.do",
        params: {
          dictCode: "ButtPlatForm"
        }
      }).then(res => {
        _self.DJPT = res.data;
        _self.ruleForm.dockPlat = res.data[0].sTATIC_CODE;
      });
    },
    //数据所属部门
    _getSYBM() {
      var _self = this;
      /*  this.$ajax.post('http://10.19.160.29:8088/demo/deptInfo/getDeptInfo',{}).then(res=>{
           console.log(res);
        })*/
      this.$ajax({
        method: "post",
        url: this.GLOBAL.api.API_DACM + "/deptInfo/getDeptInfo"
      }).then(res => {
        console.log(res);
        _self.treedata = res.data.datas;
        if (_self.$store.state.deptId.length == 0) {
          _self.ruleForm.dockid = _self.treedata[0].id;
          _self.ruleForm.dockdata = _self.treedata[0].deptName;
        } else {
          let depIds = _self.$store.state.deptId;
          console.log(depIds);
          for (let i = 0; i < _self.treedata.length; i++) {
            _self.deptData.push({
              id: _self.treedata[i].id,
              name: _self.treedata[i].deptName,
              pid: _self.treedata[i].pid
            });
            if (
              _self.treedata[i].children.length != 0 &&
              _self.treedata[i].children.length != undefined
            ) {
              this._getDepId(_self.treedata[i].children);
            }
          }
          for (let m = 0; m < _self.deptData.length; m++) {
            if (_self.deptData[m].id == depIds[0]) {
              _self.ruleForm.dockid = _self.deptData[m].id;
              _self.ruleForm.dockdata = _self.deptData[m].name;
              _self.deIndex = _self.deptData[m].pid;
            }
          }
        }
      });
    },
    //找到id的index值
    _getDepId(value) {
      for (let n = 0; n < value.length; n++) {
        this.deptData.push({
          id: value[n].id,
          name: value[n].deptName,
          pid: value[n].pid
        });
        if (
          value[n].children.length != 0 &&
          value[n].children.length != undefined
        ) {
          this._getDepId(value[n].children);
        }
      }
    },
    //保存信息
    submitForm(formName) {
      this.testflag = false;
      console.log(this.ruleForm.syskind);
      var _self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (_self.ruleForm.syskind != "10023") {
            let save = {};
            save = {
              name: _self.ruleForm.jrname, // 接入源名称
              accessSysDialectId: _self.ruleForm.syskind, //mysql,oracle接入源类型
              registerName: _self.ruleForm.dockname, // 注册人姓名
              registerPhone: _self.ruleForm.dockphone, // 注册人电话
              contactsPhone: _self.ruleForm.prophone, //数据提供人电话
              contactsEmail: _self.ruleForm.proemail, //数据提供人 邮箱
              accessSysDeptInfoId: _self.ruleForm.dockid, //所属部门
              attr: [{
                  //数据提供人姓名
                  key: "sourceQQ",
                  value: _self.ruleForm.proqq
                },
                {
                  //数据提供人电话
                  key: "sourceEmail",
                  value: _self.ruleForm.proemail
                },
                {
                  key: "network",
                  value: _self.ruleForm.resource //  接入数据来源
                },
                {
                  //数据授权
                  key: "accredit",
                  value: _self.ruleForm.author
                },
                {
                  //对接部门
                  key: "abutment",
                  value: _self.ruleForm.dockpart
                },
                {
                  //数据所属部门
                  key: "department",
                  value: _self.ruleForm.dockdata
                },
                {
                  key: "depId",
                  value: _self.ruleForm.dockid
                },
                {
                  //归属大类
                  key: "ascription",
                  value: ""
                },
                {
                  //对接平台
                  key: "platform",
                  value: _self.ruleForm.dockPlat
                },
                {
                  //业务类别
                  key: "rcategory",
                  value: _self.ruleForm.authorf
                },
                //属性值
                {
                  key: "ip",
                  value: _self.ruleForm.ipname
                },
                {
                  key: "port",
                  value: _self.ruleForm.iport
                },
                {
                  key: "url",
                  value: _self.ruleForm.url
                },
                {
                  key: "timeOut",
                  value: _self.ruleForm.timeout
                },
                {
                  key: "databasename",
                  value: _self.ruleForm.instanceName
                },
                {
                  key: "username",
                  value: _self.ruleForm.username
                },
                {
                  key: "password",
                  value: _self.ruleForm.password
                },
                {
                  key: "model",
                  value: _self.ruleForm.model
                },
                {
                  key: "linkman",
                  value: _self.ruleForm.proname
                },
                {
                  key: "dept_name",
                  value: _self.ruleForm.dockdata
                },
                {
                  key: "vhost",
                  value: _self.ruleForm.vhost
                },
                {
                  key: "isActive",
                  value: _self.ruleForm.transmode
                },
                {
                  key: "fromPath",
                  value: _self.ruleForm.fromPath
                },
                {
                  key: "toPath",
                  value: _self.ruleForm.toPath
                },
                {
                  key: "tableStructure",
                  value: _self.ruleForm.tableStructure
                }
              ]
            };
            console.log(typeof save);
            this.$ajax({
              method: "get",
              url: this.GLOBAL.api.API_DACM + "/register/dataSourceCheck",
              // headers:{
              //   'Content-Type':'application/json;charset=utf-8',
              // },
              params: {
                ip: this.ruleForm.ipname,
                username: this.ruleForm.username,
                name: this.ruleForm.jrname
              }
            }).then(res => {
              console.log(res);
              if (res.data.data.exist) {
                if (res.data.data.existName) {
                  this.$message.warning("接入源名称已存在");
                  return false;
                }
                this.$confirm(
                    "已经存在同IP地址同用户的数据源，确定保存?",
                    "信息", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消"
                    }
                  )
                  .then(() => {
                    this.loading = true;
                    this.$ajax({
                      method: "POST",
                      url: this.GLOBAL.api.API_DACM + "/register/dataSourceInsert",
                      // headers:{
                      //   'Content-Type':'application/json;charset=utf-8',
                      // },
                      data: save
                    }).then(res => {
                      this.loading = false;
                      if (res.data.success) {
                        this.$alert("注册成功", "信息", {
                          confirmButtonText: "确定",
                          callback: action => {
                            this.$refs["ruleForm"].resetFields();
                            this.dialogVisible = false;
                            this.$emit("refreshTable");
                            this.$emit("refreshCount");

                          }
                        });
                      } else {
                        this.$alert(res.data.message, "信息", {
                          confirmButtonText: "确定",
                          callback: action => {}
                        });
                      }
                    });
                  })
                  .catch(() => {});
              } else {
                this.loading = true;
                this.$ajax({
                  method: "POST",
                  url: this.GLOBAL.api.API_DACM + "/register/dataSourceInsert",
                  // headers:{
                  //   'Content-Type':'application/json;charset=utf-8',
                  // },
                  data: save
                }).then(res => {
                  this.loading = false;
                  if (res.data.success) {
                    this.$alert("注册成功", "信息", {
                      confirmButtonText: "确定",
                      callback: action => {
                        this.$refs["ruleForm"].resetFields();
                        this.dialogVisible = false;
                        this.$emit("refreshTable");

                        this.$emit("refreshCount");
                      }
                    });
                  } else {
                    this.$alert(res.data.message, "信息", {
                      confirmButtonText: "确定",
                      callback: action => {}
                    });
                  }
                });
              }
            });
          } else {
            if (
              this.ruleForm.syskind == "10023" &&
              this.ruleForm.jrname != ""
            ) {
              var formData = new FormData();
              var save = {};
              save = {
                name: _self.ruleForm.jrname, // 接入源名称
                accessSysDialectId: _self.ruleForm.syskind, //mysql,oracle接入源类型
                registerName: _self.ruleForm.dockname, // 注册人姓名
                registerPhone: _self.ruleForm.dockphone, // 注册人电话
                contactsPhone: _self.ruleForm.prophone, //数据提供人电话
                contactsEmail: _self.ruleForm.proemail, //数据提供人 邮箱
                accessSysDeptInfoId: _self.ruleForm.dockid, //所属部门
                attr: [{
                    //数据提供人姓名
                    key: "sourceQQ",
                    value: _self.ruleForm.proqq
                  },
                  {
                    //数据提供人电话
                    key: "sourceEmail",
                    value: _self.ruleForm.proemail
                  },
                  {
                    key: "network",
                    value: _self.ruleForm.resource //  接入数据来源
                  },
                  {
                    //数据授权
                    key: "accredit",
                    value: _self.ruleForm.author
                  },
                  {
                    //对接部门
                    key: "abutment",
                    value: _self.ruleForm.dockpart
                  },
                  {
                    //数据所属部门
                    key: "department",
                    value: _self.ruleForm.dockdata
                  },
                  {
                    key: "depId",
                    value: _self.ruleForm.dockid
                  },
                  {
                    //归属大类
                    key: "ascription",
                    value: ""
                  },
                  {
                    //对接平台
                    key: "platform",
                    value: _self.ruleForm.dockPlat
                  },
                  {
                    //业务类别
                    key: "rcategory",
                    value: _self.ruleForm.authorf
                  },
                  //属性值
                  {
                    key: "ip",
                    value: _self.ruleForm.ipname
                  },
                  {
                    key: "port",
                    value: _self.ruleForm.iport
                  },
                  {
                    key: "url",
                    value: _self.ruleForm.url
                  },
                  {
                    key: "timeOut",
                    value: _self.ruleForm.timeout
                  },
                  {
                    key: "databasename",
                    value: _self.ruleForm.instanceName
                  },
                  {
                    key: "username",
                    value: _self.ruleForm.username
                  },
                  {
                    key: "password",
                    value: _self.ruleForm.password
                  },
                  {
                    key: "model",
                    value: _self.ruleForm.model
                  },
                  {
                    key: "linkman",
                    value: _self.ruleForm.proname
                  },
                  {
                    key: "dept_name",
                    value: _self.ruleForm.dockdata
                  },
                  {
                    key: "vhost",
                    value: _self.ruleForm.vhost
                  },
                  {
                    key: "isActive",
                    value: _self.ruleForm.transmode
                  },
                  {
                    key: "fromPath",
                    value: _self.ruleForm.fromPath
                  },
                  {
                    key: "toPath",
                    value: _self.ruleForm.toPath
                  },
                  {
                    key: "tableStructure",
                    value: _self.ruleForm.tableStructure
                  }
                ]
              };
              if (_self.$refs.upload.uploadFiles.length == 0) {
                this.$message.error("请至少选择一个本地文件");
              } else {
                var formbak = _self.$refs.upload.uploadFiles;
                for (var i = 0; i < formbak.length; i++) {
                  formData.append("files", formbak[i].raw);
                }
                formData.append("save", JSON.stringify(save));
                this.$message.success("正在上传,请稍后刷新");
                this.$refs.upload.clearFiles();
                this.$refs["ruleForm"].resetFields();
                this.dialogVisible = false;
                //this.dialogVisible = false;
                this.$ajax({
                  method: "POST",
                  url: this.GLOBAL.api.API_DACM + "/register/fileSourceInsert",
                  /* url:'http://10.19.160.211:8080/DACM/register/fileSourceInsert',*/
                  processData: false,
                  contentType: false,
                  data: formData
                }).then(res => {
                  if (res.data.success) {
                    this.$alert(res.data.message, "信息", {
                      confirmButtonText: "确定"
                    });
                  } else {
                    this.$alert(res.data.message, "信息", {
                      confirmButtonText: "确定"
                    });
                  }
                });
              }
            }
          }
        } else {
          const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
          const isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
          if (
            this.ruleForm.syskind == "10023" &&
            this.ruleForm.jrname != "" &&
            this.ruleForm.dockname != "" &&
            (isPhone.test(this.ruleForm.dockphone) ||
              isMob.test(this.ruleForm.dockphone))
          ) {
            var formData = new FormData();
            var save = {};
            save = {
              name: _self.ruleForm.jrname, // 接入源名称
              accessSysDialectId: _self.ruleForm.syskind, //mysql,oracle接入源类型
              registerName: _self.ruleForm.dockname, // 注册人姓名
              registerPhone: _self.ruleForm.dockphone, // 注册人电话
              contactsPhone: _self.ruleForm.prophone, //数据提供人电话
              contactsEmail: _self.ruleForm.proemail, //数据提供人 邮箱
              accessSysDeptInfoId: _self.ruleForm.dockid, //所属部门
              attr: [{
                  //数据提供人姓名
                  key: "sourceQQ",
                  value: _self.ruleForm.proqq
                },
                {
                  //数据提供人电话
                  key: "sourceEmail",
                  value: _self.ruleForm.proemail
                },
                {
                  key: "network",
                  value: _self.ruleForm.resource //  接入数据来源
                },
                {
                  //数据授权
                  key: "accredit",
                  value: _self.ruleForm.author
                },
                {
                  //对接部门
                  key: "abutment",
                  value: _self.ruleForm.dockpart
                },
                {
                  //数据所属部门
                  key: "department",
                  value: _self.ruleForm.dockdata
                },
                {
                  key: "depId",
                  value: _self.ruleForm.dockid
                },
                {
                  //归属大类
                  key: "ascription",
                  value: ""
                },
                {
                  //对接平台
                  key: "platform",
                  value: _self.ruleForm.dockPlat
                },
                {
                  //业务类别
                  key: "rcategory",
                  value: _self.ruleForm.authorf
                },
                //属性值
                {
                  key: "ip",
                  value: _self.ruleForm.ipname
                },
                {
                  key: "port",
                  value: _self.ruleForm.iport
                },
                {
                  key: "url",
                  value: _self.ruleForm.url
                },
                {
                  key: "timeOut",
                  value: _self.ruleForm.timeout
                },
                {
                  key: "databasename",
                  value: _self.ruleForm.instanceName
                },
                {
                  key: "username",
                  value: _self.ruleForm.username
                },
                {
                  key: "password",
                  value: _self.ruleForm.password
                },
                {
                  key: "model",
                  value: _self.ruleForm.model
                },
                {
                  key: "linkman",
                  value: _self.ruleForm.proname
                },
                {
                  key: "dept_name",
                  value: _self.ruleForm.dockdata
                },
                {
                  key: "vhost",
                  value: _self.ruleForm.vhost
                },
                {
                  key: "isActive",
                  value: _self.ruleForm.transmode
                },
                {
                  key: "fromPath",
                  value: _self.ruleForm.fromPath
                },
                {
                  key: "toPath",
                  value: _self.ruleForm.toPath
                },
                {
                  key: "tableStructure",
                  value: _self.ruleForm.tableStructure
                }
              ]
            };
            if (_self.$refs.upload.uploadFiles.length == 0) {
              this.$message.error("请至少选择一个本地文件");
            } else {
              var formbak = _self.$refs.upload.uploadFiles;
              for (var i = 0; i < formbak.length; i++) {
                formData.append("files", formbak[i].raw);
              }
              formData.append("save", JSON.stringify(save));
              this.$message.success("正在上传,请稍后刷新");
              this.$refs.upload.clearFiles();
              this.$refs["ruleForm"].resetFields();
              this.dialogVisible = false;
              this.$ajax({
                method: "POST",
                url: this.GLOBAL.api.API_DACM + "/register/fileSourceInsert",
                /* url:'http://10.19.160.211:8080/DACM/register/fileSourceInsert',*/
                processData: false,
                contentType: false,
                data: formData
              }).then(res => {
                if (res.data.success) {
                  this.$alert(res.data.message, "信息", {
                    confirmButtonText: "确定"
                  });
                } else {
                  this.$alert(res.data.message, "信息", {
                    confirmButtonText: "确定"
                  });
                }
              });
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        }
      });
    },
    //测试连接
    testForm(formName) {
      this.testflag = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          let testData = {};
          testData = {
            ip: this.ruleForm.ipname,
            port: this.ruleForm.iport,
            instanceName: this.ruleForm.instanceName,
            model: this.ruleForm.model,
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            url: this.ruleForm.url,
            accessDialectId: this.ruleForm.syskind.toString()
          };
          this.$ajax({
            method: "POST",
            url: this.GLOBAL.api.API_DACM + "/register/dataSourceConnect",
            // headers:{
            //   'Content-Type':'application/json;charset=utf-8',
            // },
            data: testData
          }).then(res => {
            this.loading = false;
            if (res.data.success) {
              this.$alert("连接成功", "信息", {
                confirmButtonText: "确定"
              });
            } else {
              this.$alert("连接失败", "信息", {
                confirmButtonText: "确定"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  components: {},
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
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
      }
    }
  }
};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
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

.icon-dai i {
  cursor: pointer;
}

.otherInfo .unrequired .el-form-item__content {
  width: 100%;
}

.uncol span {
  color: red;
  line-height: 30px;
  margin-right: 6px;
}

.uncol label {
  text-align: left;
}

.reg-dialog {
  .el-dialog {
    min-width: 920px;
  }
}

</style>
