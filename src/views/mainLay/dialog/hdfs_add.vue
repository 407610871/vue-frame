<template>
  <div>
    <div class="mr-btn clearfix">
      <el-button type="primary"  @click="dialogVisible = true">新增</el-button>
    </div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="60%" :before-close="closeDialog">
        <div class="title-gra plr30">
          <div class="grab gra-r">
            <span class="grab gra-l"></span>
          </div>
        </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules" v-loading="loading">
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
                <el-input v-model="ruleForm.rootdire"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="连接串:" prop="connetstr">
                <el-input v-model="defaultUrl" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item class="collbg" label="impala信息:" prop="iminfo">
                <el-input v-model="ruleForm.iminfo" style="width:50%"></el-input>
                <el-button type="primary" @click="innerVisible = true">选择</el-button>
                <impala-map :msg='innerVisible' :alincre="this.increArr" @showIncre="showIncrement()" @saveIncre="saveIncrement($event)"></impala-map>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank">bank</el-col>
            <el-col :span="10">
              <el-form-item label="是否为HA:">
                <el-checkbox v-model="ruleForm.isha"></el-checkbox>
              </el-form-item>
            </el-col>
            <div class="clearfix">
            <el-col :span="10" v-if="ruleForm.isha==true">
              <el-form-item label="备用节点IP:" prop="bakip">
                <el-input v-model="ruleForm.bakip"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="bank" v-if="ruleForm.isha==true">bank</el-col>
            <el-col :span="10" v-if="ruleForm.isha==true">
              <el-form-item label="备用节点端口:" prop="bakport">
                <el-input v-model="ruleForm.bakport"></el-input>
              </el-form-item>
            </el-col>
            </div>
      </el-form>
      <div  class="clearfix mr-btn">
        <el-button type="primary" @click="closeDialog()">关闭</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
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
      if (value == "") {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    const rootRule = (rule, value, callback) => {
      if (value == '' || value == '/') {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    }
    return {
      dialogVisible: false,
      innerVisible: false,
      loading:false,
      increArr: [],
      sys_impala_id:'',
      ruleForm: {
        hdfsname: '',
        hdfsport: '',
        rootdire: '/',
        connetstr: '',
        iminfo: '',
        isha: true,
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
          { required: true, validator: rootRule, trigger: "blur" }
        ],
        bakip: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],
        bakport: [
          { required: true, validator: validateNull, trigger: "blur" }
        ],

      },
      defaultUrl: "",
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.$emit("closeDiaChk");
      this.$refs['ruleForm'].resetFields();
    },
    //增量字段弹框的再次打开
    showIncrement() {
      this.innerVisible = false;
    },
    saveIncrement(value) {
      this.increArr = value;
      this.ruleForm.iminfo = this.increArr[0].impalaName;
      this.sys_impala_id = this.increArr[0].impalaId;
      this.innerVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var config = {};
          config["connector.class"] = "cn.enn.com.hdfs.sink.HdfsSinkConnector";
          config["partition.duration.ms"] = 300000;
          config["flush.size"] = 3;
          config["schema.compatibility"] = "FULL";
          config["tasks.max"] = "1";
          config["topics"] = "TOPICS";
          config["timezone"] = "UTC";
          config["hive.database"] = "test_hive_json";
          config["hive.metastore.uris"] = "thrift://10.19.138.127:9083";
          config["locale"] = "en";
          config["hive.integration"] = "false";
          config["format.class"] = "cn.enn.com.hdfs.sink.json.JsonFormat";
          config["partitioner.class"] = "io.confluent.connect.storage.partitioner.TimeBasedPartitioner";
          config["path.format"] = "'year'=YYYY/'month'=MM/'day'=dd/'";
          config["hdfs.url"] = 'hdfs://' + this.ruleForm.hdfsname + ':' + this.ruleForm.hdfsport;
          config["hdfs.bakip"] = this.ruleForm.bakip;
          config["hdfs.bakport"] = this.ruleForm.bakport;
          config["hdfs.ha"] = this.ruleForm.isha;
          config['port'] = this.ruleForm.hdfsport;
          config['dir'] = this.ruleForm.rootdire;
          var params = {
            mode: "helium",
            pid: "2",
            sys_impala_id: this.sys_impala_id.toString(),
            type: "hdfs",
            config: config
          }
          this.$ajax({
            method: "POST",
            url: this.GLOBAL.api.API_DACM+'/caccesssysRelationWorkInfo/add',
            data: params

          }).then(res => {
            if (res.data.result=="succeed") {
              this.$alert('新增hdfs成功', '信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$refs['ruleForm'].resetFields();
                  this.$emit("closeDiaChk");
                  this.$emit('refresh');
                  this.dialogVisible = false;
                }
              });
            } else {
              this.$alert('新增hdfs失败', '信息', {
                confirmButtonText: '确定'
              });
            }
          })
        } else {

        }
      });
    },
    //获取预设接口
    _getProData() {
      this.loading = true;
      this.$ajax({
        method: "get",
        url: `${this.GLOBAL.api.API_DACM}/caccesssysRelationWorkInfo/presetData`,
      }).then(res => {
        this.loading = false;
        if (res.data.result) {
          this.ruleForm.hdfsname = res.data.ip;
          this.ruleForm.hdfsport = res.data.port;
          this.defaultUrl = 'hdfs://'+ this.ruleForm.hdfsname + ':' + this.ruleForm.hdfsport
        }
      }).catch( err=>{
        this.loading = false;
      })
    }
  },
  components: {
    impalaMap
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this._getProData();
      }
    }

  }

};

</script>