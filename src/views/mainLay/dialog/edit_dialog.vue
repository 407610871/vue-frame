<template>
  <div class="taskMDialog">
    <i class="el-icon-info" @click="dialogVisible = true">修改</i>
    <el-dialog title="接入数据源" :visible.sync="dialogVisible" width="60%" :before-close="closeDialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
        <div class="daiInfo proInfo">
          <div class="daiInfo-title proInfo-title">
            <h2>提供方信息</h2>
          </div>
          <div class="proInfo-box clearfix">
            <el-col :span="10">
              <el-form-item label="接入源名称:" prop="jrname" required>
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
                <el-radio-group v-model="ruleForm.resource">
                  <el-radio v-for="item in SJLY" :label="item.static_CODE" :key="item.static_CODE">{{item.static_NAME}}</el-radio>
                  <!--  <el-radio label="私网"></el-radio>
                 <el-radio label="委办网"></el-radio> -->
                </el-radio-group>
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
                  <el-radio label="已授权"></el-radio>
                  <el-radio label="未授权"></el-radio>
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
                  <el-tree :data="treedata" show-checkbox node-key="id" :check-strictly="true" :props="defaultProps" accordion @check-change="handleClick" ref="treeForm">
                  </el-tree>
                  <el-select v-model="ruleForm.dockdata" disabled placeholder="" prop="dockdata" slot="reference">
                  </el-select>
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
                  <el-option :label="item.static_NAME" :value="item.static_CODE" :key="item.static_CODE" v-for="item in DJPT"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="对接业务类别:">
                <el-col :span="24">
                  <el-form-item prop="authorf">
                    <el-select v-model="ruleForm.authorf" placeholder="请选择">
                      <el-option :label="item.static_NAME" :value="item.static_CODE" :key="item.static_CODE" v-for="item in SSJZ"></el-option>
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
</el-col> -->
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="注册人联系电话:" prop="dockphone">
                <el-input v-model="ruleForm.dockphone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="数据提供人邮箱:" prop="proemail">
                <el-input v-model="ruleForm.proemail"></el-input>
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
            <el-form-item label="接入源类型:" prop="syskind">
              <el-radio-group v-model="ruleForm.syskind">
                <el-radio v-for="item in syskindList" :label="item.name" :key="item.id">{{item.name}}</el-radio>
                <!--  <el-radio label="mysql"></el-radio>
               <el-radio label="oracle"></el-radio>
               <el-radio label="activemq"></el-radio>
               <el-radio label="sqlserver"></el-radio>
               <el-radio label="postgresql"></el-radio>
               <el-radio label="ftp"></el-radio>
               <el-radio label="rabbitmq"></el-radio>
               <el-radio label="mongodb"></el-radio>
               <el-radio label="本地文件"></el-radio>
               <el-radio label="其他"></el-radio> -->
              </el-radio-group>
            </el-form-item>
            <el-col :span="18">
              <el-col :span="10">
                <el-form-item label="IP地址/主机名:" prop="ipname" required v-show="ruleForm.syskind!=''&&ruleForm.syskind!='本地文件'">
                  <el-input v-model="ruleForm.ipname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10">
                <el-form-item label="登录名:" prop="username" required v-show="ruleForm.syskind!=''&&ruleForm.syskind!='本地文件'">
                  <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
              </el-col>
              <!--               <el-col :span="2" class="bank">bank</el-col>
<el-col :span="10">
  <el-form-item label="路径" required prop="url" v-show="ruleForm.syskind=='9'">
    <el-input v-model="ruleForm.url"></el-input>
  </el-form-item>
</el-col> -->
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10">
                <el-form-item label="密码:" prop="password" required v-show="ruleForm.syskind!=''&&ruleForm.syskind!='本地文件'">
                  <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank">bank</el-col>
              <el-col :span="10">
                <el-form-item label="端口号:" prop="iport" required v-show="ruleForm.syskind!=''&&ruleForm.syskind!='本地文件'">
                  <el-input v-model="ruleForm.iport"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-show="ruleForm.syskind=='mysql'||ruleForm.syskind=='sqlserver'||ruleForm.syskind=='oracle'||ruleForm.syskind=='postgresql'||ruleForm.syskind=='mongodb'">bank</el-col>
              <el-col :span="10">
                <el-form-item label="实例/数据库名:" prop="instanceName" required v-show="ruleForm.syskind=='mysql'||ruleForm.syskind=='sqlserver'||ruleForm.syskind=='oracle'||ruleForm.syskind=='postgresql'||ruleForm.syskind=='mongodb'">
                  <el-input v-model="ruleForm.instanceName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-show="ruleForm.syskind=='oracle'||ruleForm.syskind=='mongodb'">bank</el-col>
              <el-col :span="10">
                <el-form-item label="模式名/架构:" prop="model" v-show="ruleForm.syskind=='oracle'||ruleForm.syskind=='mongodb'">
                  <el-input v-model="ruleForm.model"></el-input>
                </el-form-item>
              </el-col>
              <!--  <el-col :span="10">
               <el-form-item label="接口名称" required prop="operationName">
                 <el-input v-model="ruleForm.operationName"></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="2" class="bank">bank</el-col> -->
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
              <el-col :span="10">
                <el-form-item label="集群根目录" required prop="hadoopDir" v-show="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.hadoopDir"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-show="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10">
                <el-form-item label="集群目录" required prop="hadoopHomes" v-show="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.hadoopHomes"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-show="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10">
                <el-form-item label="vhost" required prop="vhost" v-show="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">
                  <el-input v-model="ruleForm.vhost"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="bank" v-show="ruleForm.syskind!=''&& ruleForm.syskind=='vhost'">bank</el-col>
              <el-col :span="10" v-show="ruleForm.syskind=='ftp'||ruleForm.syskind=='rabbitmq'">
                <el-form-item label="传输模式:" prop="transmode">
                  <el-select v-model="ruleForm.transmode" placeholder="请选择">
                    <el-option label="主动" value="true"></el-option>
                    <el-option label="被动" value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!--  <el-col :span="24" v-show="ruleForm.syskind=='本地文件'" class="fileItem">
               <el-form-item label="选择本地文件(仅支持txt,excel,csv文件):" prop="upfile">
                 <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
                   <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                   <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                 </el-upload>
               </el-form-item>
             </el-col> -->
            </el-col>
            <el-col :span="6">
              <el-button type="primary" v-show="ruleForm.syskind!=''&&ruleForm.syskind!='本地文件'" @click="testForm('ruleForm')">测试连接</el-button>
            </el-col>
          </div>
        </div>
        <div class="daiInfo reginfo">
          <div class="daiInfo-box clearfix">
            <el-form-item>
              <el-col :span="24">
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
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
  name: "edit",
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
      i: 0, //树节点只允许单选
      dialogVisible: false,
      syskindList: [], //接入类型列表
      SJLY: [], //数据来源
      SSJZ: [], //业务类别
      DJBM: [], //对接部门
      DJPT: [], //对接平台
      tableMsg: [],
      ruleForm: {
        jrname: '',
        proname: '',
        resource: '',
        prophone: '',
        author: '已授权',
        authorf: '',
        authors: '',
        proemail: '',
        proqq: '',
        dockdata: '2312',
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
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        ipname: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        username: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        iport: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        instanceName: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        hadoopDir: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        hadoopHomes: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        vhost: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
      },
      treedata: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 11,
          label: '二级 1-1',
          children: [{
            id: 111,
            label: '三级 1-1-1'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 22,
          label: '二级 2-1',
          children: [{
            id: 222,
            label: '三级 2-1-1'
          }]
        }, {
          id: 23,
          label: '二级 2-2',
          children: [{
            id: 233,
            label: '三级 2-2-1'
          }]
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 31,
          label: '二级 3-1',
          children: [{
            id: 32,
            label: '三级 3-1-1'
          }]
        }, {
          id: 33,
          label: '二级 3-2',
          children: [{
            id: 34,
            label: '三级 3-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        id: 353,
        children: [{
          id: 36,
          label: '二级 3-1',
          children: [{
            id: 37,
            label: '三级 3-1-1'
          }]
        }, {
          id: 38,
          label: '二级 3-2',
          children: [{
            id: 39,
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
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

</style>
