<template>
  <div class="taskMDialog">
    <el-button @click="dialogVisible = true" class="add-btn">add</el-button>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="50%" :before-close="closeDialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
        <div class="daiInfo proInfo">
          <div class="proInfo-box dataInfo-box clearfix">
            <el-col :span="10">
              <el-form-item label="hdfs主机名:" prop="hdfsname" required>
                <el-input v-model="ruleForm.hdfsname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="端口号:" prop="hdfsport">
                <el-input v-model="ruleForm.hdfsport"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="根目录:" prop="rootdire">
                <el-input v-model="'/'+ruleForm.rootdire"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="连接串:" prop="connetstr">
                <el-input v-model="'hdfs://'+ruleForm.hdfsname + ':' + ruleForm.hdfsport" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item class="collbg" label="impala信息:" prop="iminfo">
                <el-input v-model="ruleForm.iminfo" class="fl"></el-input>
                <el-button type="primary" class="fl increbtn" @click="innerVisible = true">选择</el-button>
                <impala-map :msg='innerVisible' :alincre="this.increArr" @showIncre="showIncrement()" @saveIncre="saveIncrement($event)"></impala-map>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="是否为HA:" prop="isha">
                <el-radio-group v-model="ruleForm.isha">
                  <el-radio label="true"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="备用节点IP:" prop="bakip">
                <el-input v-model="ruleForm.bakip"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="备用节点端口:" prop="bakport">
                <el-input v-model="ruleForm.bakport"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="tcenter mt30">
              <el-button type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
              <el-button @click="closeDialog()" size="small">关闭</el-button>
            </el-col>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import impalaMap from '@/views/mainLay/dialog/impala_map' //impala表
export default {
  name: "taskMDialog",
  data: function() {
    //判断是否必选项为空
    const validateNull = (rule, value, callback) => {
      debugger;
      if (value == "") {
        callback(new Error("不能为空"));
      } else {
        debugger;
        callback();
      }
    };
    return {
      dialogVisible: false,
     innerVisible: false,
      increArr: [],
      ruleForm: {
        hdfsname: '',
        hdfsport: '',
        rootdire: '',
        connetstr: '',
        iminfo: '',
        isha: 'true',
        bakip: '',
        bakport: ''

      },
      formRules: {
        hdfsname: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        hdfsport: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        rootdire: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        bakip: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        bakport: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],

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
    //增量字段弹框的再次打开
    showIncrement() {
      
      this.innerVisible = false;

    },
    saveIncrement(value) {
      this.increArr = value;
      this.ruleForm.iminfo = this.increArr[0].impalaName;
       this.innerVisible = false;
    }
  },
  components: {
impalaMap
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {

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

.collbg {
  .el-input,
  .wildbg .el-select {
    width: 50%;
  }
  .increbtn.el-button--medium {
    padding: 6px 20px;
    margin-top: 2px;
    margin-left: 10px;
  }
}
form{
  padding-top:20px;
  padding-bottom: 20px;
}
.log-box{
  background: #f2f2f3;
}
</style>
