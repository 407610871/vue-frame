<template>
  <div class="taskMDialog">
    <el-button size="mini" class="diabtn incbtn" type="danger" @click="dialogVisible = true">文件上传</el-button>
    <el-dialog title="上传文件" :visible.sync="dialogVisible" width="60%" :before-close="closeDialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
        <div class="daiInfo ftpInfo clearfix">
          <el-col :span="24">
            <el-col :span="8">
              <el-form-item label="路径:" prop="ftpurl" required>
                <el-input v-model="ruleForm.ftpurl" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="2" class="bank">bank</el-col>
            <el-col :span="8">
              <div class="path-box">
                <el-tree :data="treedata" show-checkbox node-key="id" :check-strictly="true" :props="defaultProps" accordion @check-change="handleClick" @check="nodeClick" ref="treeForm">
                </el-tree>
              </div>
            </el-col>
          </el-col>
          <el-col :span="24" class="tip-box">
            <el-col :span="2" class="bank">bank</el-col>
            <el-col :span="5">
              <el-radio v-model="ruleForm.delete" label="1">采集后源文件是否需要删除</el-radio>
            </el-col>
            <el-col :span="8">
              <span class="ftp-tip">*暂不支持中文路径采集</span>
            </el-col>
          </el-col>
          <el-col :span="24" class="mt30 tcenter ftpbtn">
            <el-form-item>
              <el-button type="primary" size="small" @click="save()">保存</el-button>
              <el-button @click="closeDialog()" size="small">关闭</el-button>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "taskMDialog",
  data: function() {
    //判断是否必选项为空
    const validateNull = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请选择路径"));
      } else {
        callback();
      }
    };
    return {
      i: 0, //树节点只允许单选
      dialogVisible: false,
      ruleForm: {
        ftpurl: '',
        delete: "1"
      },
      formRules: {
        ftpurl: [
          { required: true, validator: validateNull, trigger: "blur" }
        ]

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
      if (checked == true) {
        this.checkedId = data.id;
        this.$refs.treeForm.setCheckedNodes([data]);
      }
    },
    //树的点击
    nodeClick(data, checked, node) {
      this.checkedId = data.id
      this.$refs.treeForm.setCheckedNodes([data]);
      this.ruleForm.ftpurl = data.label;
    },
    //关闭
    closeForm() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    save() {
      if (this.ruleForm.ftpurl == '') {
        this.$message({
          message: '请选择文件路径',
          type: 'warning'
        });
      } else {
        this.dialogVisible = false;
        this.$refs['ruleForm'].resetFields();
      }

    },
    //得到ftp树
    _getPath() {
      var params = {
        accessSysId:'89311',
        linkPath:'/'
      }
      this.$ajax({
        method: "POST",
        url: 'http://10.19.160.25:8088/demo/ctables/getStructure',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        data: params

      }).then(res => {
        console.log(res);
      })
    }
  },
  components: {

  },
  created() {

  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this._getPath();
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

.path-box {
  border: 1px solid $border-color-dai;
  margin-left: 18px;
}

.ftp-tip {
  color: red;
}

.tip-box {
  margin-left: 18px;
  margin-top: 20px;
}

.ftpbtn {
  margin-top: 45px;
}

.ftpbtn .el-form-item--medium .el-form-item__content {
  margin-left: 0px !important;
}

.ftpInfo {
  margin-top: 35px;
}

</style>
