<template>
  <el-dialog title="数据核验" :visible.sync="innerVisible" width="60%" :before-close="closeDialog" append-to-body>
    <div class="title-gra">
      <span class="grab gra-l"></span>
      <span class="grab gra-r"></span>
    </div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <div class="proInfo-box clearfix">
        <el-col :span="24">
          <el-form-item label="核验设置:" class="radiow100">
            <el-radio-group v-model="ruleForm.setVer">
              <el-col :span="24">
                <el-col :span="6">
                  <el-radio :label="0">全量核验</el-radio>
                </el-col>
                <el-col :span="4" class="bank">bank</el-col>
                <el-col :span="6">
                  <el-radio :label="1">根据时间范围核验</el-radio>
                </el-col>
                <el-col :span="10">
                  <el-button type="primary" size="small" @click="inverCheck()">开始核验</el-button>
                </el-col>
              </el-col>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="8">
            <el-form-item label="核验误差范围:">
              <el-input-number v-model="ruleForm.range" controls-position="right" size="small" :min="0" :max="100" :step="1"></el-input-number>%
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="time" v-show="ruleForm.setVer=='1'">
              <el-date-picker size="small" :picker-options="ruleForm.pickerOptions" v-model="ruleForm.startTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </el-col>
        </el-col>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "dataInver",
  data: function() {
    return {
      innerVisible: this.msg,
      result: '0',
      ruleForm: {
        setVer: 0, //核验设置
        range: 0, //核验误差范围
        startTime: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        }
      }
    }
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.$emit('showIncre');
      this.innerVisible = false;

    },
    inverCheck() {
      if (this.ruleForm.setVer == "0") {
        this.startTime = ["", ""];
        // debugger;
      } else if (this.ruleForm.setVer == "1" && this.ruleForm.startTime == null) {
        this.$alert("请填写开始与结束时间", "核验", {
          confirmButtonText: "确定"
        });
        return;
      } else if (this.ruleForm.setVer == "1" && this.ruleForm.startTime.length == 0) {
        this.$alert("请填写开始与结束时间", "核验", {
          confirmButtonText: "确定"
        });
        return;
      }
      this.$ajax({
        method: "get",
        url: `${this.GLOBAL.api.API_DACM}/ccheckData/tableCheck`,
        params: {
          taskId: this.taskId,
          key: this.ruleForm.setVer,
          range: this.ruleForm.range,
          startTime: this.ruleForm.startTime[0],
          endTime: this.ruleForm.startTime[1]
        }
      }).then(res => {
        if (res.data.data.result == true || res.data.data.result == "true") {
          this.$alert(res.data.message, "核验结果", {
            confirmButtonText: "确定",
            callback: action => {
              this.$emit('saveIncre');
              this.innerVisible = false;
            }
          });
        } else {
          this.$alert("核验请求失败！", "核验结果", {
            confirmButtonText: "确定"
          });
        }
      });
    },
    //查询表数据
    _checkData() {
      this.$ajax({
        method: "GET",
        url: this.GLOBAL.api.API_DACM +'/ccheckData/tableNum',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
          taskId: this.taskId
        }
      }).then(res => {
        if (res.data.result == "true" || res.data.result == true) {
          if (res.data.config_key != undefined && res.data.config_key != null) {
            //全量
            if (res.data.config_key == "0") {
              this.ruleForm.setVer = 0;
              this.ruleForm.startTime = [];
            } else {
              //时间范围
              this.ruleForm.setVer = 1;
              this.ruleForm.startTime = [
                res.data.config_startTime,
                res.data.config_endTime
              ]
            }
            this.ruleForm.range = res.data.config_range;

          }
        }
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
    msg() {
      this.innerVisible = this.msg;
      this._checkData();
    }

  },
  props: ['msg','taskId']

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.userSurveyDialog .el-dialog__body {
  padding-left: 0px;
  padding-right: 0px;
}

.dtin-btn {
  line-height: 10px !important;
  margin-right: 10px !important;
}

</style>
