<template>
  <div class="taskMDialog">
    <el-tooltip class="item" effect="light" content="选择路径" placement="top">
      <span class="icon-title enc-icon-fuwujiankong diabtn tin-btn add-btn" @click="dialogVisible = true"></span>
    </el-tooltip>
    <el-dialog title="选择路径" :visible.sync="dialogVisible" width="73%" :before-close="closeDialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules" v-loading="loading">
        <div class="daiInfo ftpInfo clearfix">
          <el-col :span="24">
            <el-col :span="8">
              <el-form-item label="路径:" prop="ftpurl">
                <el-input v-model="ruleForm.ftpurl" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="1" class="bank"  style="margin-left: 28px;">bank</el-col>
            <el-col :span="8">
              <div class="path-box">
                <el-tree show-checkbox node-key="id" :check-strictly="true" :props="defaultProps"
                 accordion @check-change="handleClick" @check="nodeClick" ref="treeForm" :load="loadNode1"
                  :data="tData" lazy :default-checked-keys="checkData" @node-expand="handleNodeExpand">
                </el-tree>
              </div>
            </el-col>
          </el-col>
          <el-col :span="24" class="tip-box">
            <el-col :span="1" class="bank"  style="margin-left: 28px;">bank</el-col>
            <el-col :span="6">
              <el-checkbox v-model="ruleForm.delete"></el-checkbox>采集后源文件是否需要删除
            </el-col>
            <el-col :span="8">
              <span class="ftp-tip">*暂不支持中文路径采集</span>
            </el-col>
          </el-col>
          <el-col :span="24" class="tip-box">
            <el-col :span="1" class="bank" style="margin-left: 28px;">bank</el-col>
            <el-col :span="6">
              <el-checkbox v-model="ruleForm.subDele" @change="selectChildrenNodes"></el-checkbox>包含子目录
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
      loading: true,
      checkData: [],
      disaData: [],
      againData: {},
      tData: [],
      ruleForm: {
        ftpurl: '',
        delete: false,
        subDele: false,
        ftpId: '',
      },
      formRules: {
        ftpurl: []

      },
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf',
        disabled: 'chkDisabled'
      },
      childrenData:[],
      checkStrictly: true,
      parentId: ""
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.againData = {};
      this.ruleForm.delete = false;
      this.ruleForm.subDele = false;
      this.$refs['ruleForm'].resetFields();
      this.$refs.treeForm.setCheckedNodes([]);
      this.$refs.treeForm.setCheckedKeys([]);
    },
    //实现树的单选
    handleClick(data, checked, node) {
      
    },
    //树的点击
    nodeClick(data, node) {
      this.checkedId = data.id;
      if (this.againData.id) {
        for (let i = 0; i < this.disaData.length; i++) {
          if (this.disaData[i].id == this.againData.id) {
            this.disaData.splice(i, 1);
          }
        }
      }
      this.disaData.push(data)
      this.$refs.treeForm.setCheckedNodes(this.disaData);
      this.ruleForm.ftpurl = data.linkPath;
      this.ruleForm.ftpId = data.id;
      this.againData = data;
      if(this.ruleForm.subDele && data.childNodes){
        this.childrenDataHandel(data, true);
      }
    },
    // 节点展开事件
    handleNodeExpand(data,node) {
      this.childrenData = data;
      data.expanded = node.expanded;
      data.childNodes = node.childNodes;
      this.parentId = data.id;
      this.parentHandel(node);
      console.log(this.againData.id, this.parentId);
      if(this.ruleForm.subDele && data.childNodes && this.parentId===this.againData.id){
        this.childrenDataHandel(data, true);
      }
    },
    parentHandel(node){
      if(node.parent && node.parent.parent !=null){
        if(node.label !== this.againData.label){
          this.parentId = node.parent.data.id;
          return this.parentHandel(node.parent);
        }else{
          this.parentId = node.data.id;
        }
      }
    },
    selectChildrenNodes(val){
      if(this.againData.childNodes){
        this.childrenDataHandel(this.againData, val);
      }
    },
    //树选中结果的处理
    selectDataHandel(data, checked, node){
      if (this.againData.id != undefined) {
        for (let i = 0; i < this.disaData.length; i++) {
          if (this.disaData[i].id == this.againData.id) {
            this.disaData.splice(i, 1);
          }
        }
      }
      if (data.chkDisabled && data.checked) {
        this.disaData.push(data);
      } else {
        if (checked) {
          this.againData = data;
        }
      }
      this.disaData.push(this.againData);
      this.$refs.treeForm.setCheckedNodes(this.disaData);
    },
    //勾选了包含子目录测处理结果 
    childrenDataHandel(data, type){
      data.childNodes.forEach(res =>{
          res.checked = type;
        if(res.childNodes){
          this.childNodesHandel(res, type);
        }
      })  
    },
    childNodesHandel(res, type){
      res.childNodes.forEach( res =>{
        res.checked = type;
        return this.childNodesHandel(res, type);
      })
    },
    save() {
      if (this.ruleForm.ftpurl == '') {
        this.$message({
          message: '请选择文件路径',
          type: 'warning'
        });
      } else {
        this.loading = true;
        var params = {
          filepath: this.ruleForm.ftpurl,
          accessSysId: this.$route.params.sourceId,
          isdelete: this.ruleForm.delete.toString(),
          shecmas: "",
          subdirectory: this.ruleForm.subDele.toString()
        }
        this.$ajax({
          method: "POST",
          url: this.GLOBAL.api.API_DACM + '/ctables/addRecord',
          data: params

        }).then(res => {
          this.loading = false;
          if (res.data.success) {
            this.$alert('保存路径成功', '信息', {
              confirmButtonText: '确定',
              callback: action => {
                this.$emit('refresh');
                this.$refs['ruleForm'].resetFields();
                this.$refs.treeForm.setCheckedNodes([]);
                this.$refs.treeForm.setCheckedKeys([]);
                this.dialogVisible = false;

              }
            });
          } else {
            this.$alert(res.data.message, '信息', {
              confirmButtonText: '确定'
            });
          }
        }, (res) => {
          this.loading = false;
          this.$alert('保存路径失败', '信息', {
            confirmButtonText: '确定'
          });
        })
      }
    },
    //懒加载
    loadNode1(node, resolve) {
      let _self = this;
      if (node.level !== 0){
        var params = {
          accessSysId: this.$route.params.sourceId,
          linkPath: node.data.linkPath
        }
        this.$ajax({
          method: "POST",
          url: this.GLOBAL.api.API_DACM + '/ctables/getStructure',
          data: params

        }).then(res => {
          let myList = [];
          res.data.data.forEach(e => {
            myList.push(e)
          })
          myList.forEach(e => {
            if (e.checked) {
              this.checkData.push(e.id);
              this.disaData.push(e);
            }
          });
          resolve(myList);
          this.handleNodeExpand(this.childrenData, node);
        }).catch(res => {
          resolve([]);
        })
      }
    },
    defaultInit() {
      this.loading = true;
      this.checkData = [];
      var params = {
        accessSysId: this.$route.params.sourceId,
        linkPath: '/'
      }
      this.$ajax({
        method: "POST",
        url: this.GLOBAL.api.API_DACM + '/ctables/getStructure',
        data: params

      }).then(res => {
        this.loading = false;
        this.tData = [];
        res.data.data.forEach(e => {
          this.tData.push(e)
        });
        this.tData.forEach(e => {
          if (e.checked) {
            this.checkData.push(e.id);
            this.disaData.push(e);
          }
        })
      }).catch(res => {
        this.loading = false;
      })
    }
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.defaultInit();
        this.ruleForm.subDele = false;
        this.ruleForm.delete = false;
        this.ruleForm.ftpurl = '';
        this.ruleForm.ftpId = '';
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
  height: 280px;
  overflow: auto;
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
  .el-checkbox {
    margin-right: 10px;
  }
}

.path-box {
  .el-tree>.el-tree-node {
    display: block !important;
  }
}

.upfilelogo {
  width: 33px;
  height: 33px;
  -webkit-mask: url('../../../assets/images/dn.svg');
  mask:url('../../../assets/images/dn.svg');
  background-color:#000;
  display: inline-block;
  cursor: pointer;
  margin-right: 30px;
}
.is-disabled {
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color:#908c8c;
    border-color:#908c8c;
  }
}
</style>
