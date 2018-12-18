<template>
  <div class="taskMDialog">
    <!--  <el-button  class="add-btn fr ml10" @click="dialogVisible = true">文件上传</el-button> -->
    <el-tooltip class="item" effect="light" content="文件上传" placement="top">
      <span class="upfilelogo diabtn tin-btn add-btn" @click="dialogVisible = true"></span>
    </el-tooltip>
    <el-dialog title="上传文件" :visible.sync="dialogVisible" width="73%" :before-close="closeDialog">
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
            <el-col :span="2" class="bank">bank</el-col>
            <el-col :span="8">
              <div class="path-box">
                <el-tree show-checkbox node-key="id" :check-strictly="true" :props="defaultProps" accordion @check-change="handleClick" @check="nodeClick" ref="treeForm" :load="loadNode1" :data="tData" lazy :default-checked-keys="checkData">
                </el-tree>
              </div>
            </el-col>
          </el-col>
          <el-col :span="24" class="tip-box">
            <el-col :span="2" class="bank">bank</el-col>
            <el-col :span="6">
              <el-checkbox v-model="ruleForm.delete">备选项</el-checkbox>采集后源文件是否需要删除
            </el-col>
            <el-col :span="8">
              <span class="ftp-tip">*暂不支持中文路径采集</span>
            </el-col>
          </el-col>
          <el-col :span="24" class="tip-box">
            <el-col :span="2" class="bank">bank</el-col>
            <el-col :span="6">
              <el-checkbox v-model="ruleForm.subDele">备选项</el-checkbox>包含子目录
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
      tData:[],
      ruleForm: {
        ftpurl: '',
        delete: false,
        subDele: false,
        ftpId: '',
      },
      formRules: {
        ftpurl: [
          { /* required: true, validator: validateNull, trigger: "blur"*/ }
        ]

      },
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf',
        disabled: 'chkDisabled'
      },

      // msgId:this.dialogMsg?this.dialogMsg[1]:''
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.ruleForm.subDele = false;
      this.ruleForm.delete = false;
      this.$refs['ruleForm'].resetFields();
      this.$refs.treeForm.setCheckedNodes([]);
      this.$refs.treeForm.setCheckedKeys([]);
    },
    //实现树的单选
    handleClick(data, checked, node) {
      if (this.againData.id != undefined) {
        for (let i = 0; i < this.disaData.length; i++) {
          if (this.disaData[i].id == this.againData.id) {
            this.disaData.splice(i, 1);
          }
        }
      }
      if (data.chkDisabled == true && data.checked) {
        this.disaData.push(data);
      } else {
        if (checked) {
          this.againData = {};
          this.againData = data;
          //console.log(this.againData);

        }

      }
      this.disaData.push(this.againData);

      this.$refs.treeForm.setCheckedNodes(this.disaData);
    },
    //树的点击
    nodeClick(data, checked, node) {
      this.checkedId = data.id
      this.$refs.treeForm.setCheckedNodes([data]);
      // console.log(this.$refs.treeForm.getCheckedNodes());
      this.ruleForm.ftpurl = data.linkPath;
      this.ruleForm.ftpId = data.id;
    },
    //关闭
    closeForm() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
      this.$refs.treeForm.setCheckedNodes([]);
      this.$refs.treeForm.setCheckedKeys([]);
    },
    save() {
      if (this.ruleForm.ftpurl == '') {
        this.$message({
          message: '请选择文件路径',
          type: 'warning'
        });
      } else {
        this.loading = true;
        /*this.dialogVisible = false;
        this.$refs['ruleForm'].resetFields();*/

        // console.log(this.ruleForm.ftpurl);
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
          /* url:'http://10.19.160.25:8080/DACM/ctables/addRecord',*/
          // headers:{
          //   'Content-Type':'application/json;charset=utf-8',
          // },
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
          //console.log(res);
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
      console.log(node);
      if (node.level == 0) {
        var params = {
          accessSysId: this.$route.params.sourceId,
          linkPath: '/'
        }
        this.$ajax({
          method: "POST",
          url: this.GLOBAL.api.API_DACM + '/ctables/getStructure',
          // headers:{
          //   'Content-Type':'application/json;charset=utf-8',
          // },
          data: params

        }).then(res => {
          this.loading = false;
          //console.log(res.data.data);
          let treeData = [];
          res.data.data.forEach(e => {
            treeData.push(e)
          });
          treeData.forEach(e => {
            if (e.checked) {
              this.checkData.push(e.id);
            }

          })
          resolve(treeData)
        }).catch(res => {
          this.loading = false;
          resolve([]);
        })
      } else {

        var params = {
          accessSysId: this.$route.params.sourceId,
          linkPath: node.data.linkPath
          /* accessSysId :'58714',
           linkPath: '/boot/'*/
        }
        this.$ajax({
          method: "POST",
          url: this.GLOBAL.api.API_DACM + '/ctables/getStructure',
          // headers:{
          //   'Content-Type':'application/json;charset=utf-8',
          // },
          data: params

        }).then(res => {

          //console.log(res.data.data);
          let myList = [];
          res.data.data.forEach(e => {
            myList.push(e)
          })
          myList.forEach(e => {
            if (e.checked) {
              this.checkData.push(e.id);
            }

          })
          resolve(myList)
        }).catch(res => {
          resolve([]);
        })
      }
    },
    init() {
      this.loading = true;
      var params = {
        accessSysId: this.$route.params.sourceId,
        linkPath: '/'
      }
      this.$ajax({
        method: "POST",
        url: this.GLOBAL.api.API_DACM + '/ctables/getStructure',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        data: params

      }).then(res => {
        this.loading = false;
        //console.log(res.data.data);
        this.tData =[];
        res.data.data.forEach(e => {
          this.tData.push(e)
        });
        this.tData.forEach(e => {
          if (e.checked) {
            this.checkData.push(e.id);
          }

        })
       
      }).catch(res => {
        this.loading = false;
       
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
        //this.$refs.treeForm.setCheckedNodes([]);
        // this.$refs.treeForm.setCheckedKeys([]);
        this.ruleForm.subDele = false;
        this.ruleForm.delete = false;
        this.init();

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
}

.path-box {
  .el-tree>.el-tree-node {
    display: block !important;
  }
}

.upfilelogo {
  width: 40px;
  height: 33px;
  background: url('../../../assets/images/upfile.svg');
  display: inline-block;
  cursor: pointer;
  margin-right: 30px;
}

</style>
