<template>
  <div class="taskMDialog topInver">
    <el-dialog title="数据核验" :visible.sync="innerVisible" width="60%" :before-close="closeDialog" append-to-body>
        <div class="title-gra plr30">
          <div class="grab gra-r">
            <span class="grab gra-l"></span>
          </div>
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
                    <el-radio :label="1" :disabled="!this.queryTargetColumnList.length" v-show="this.$route.params.type!='mongodb'">根据时间范围核验</el-radio>
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
            <el-col :span="6">
              <div class="time" v-show="ruleForm.setVer=='1'">
                <el-date-picker size="small" :picker-options="ruleForm.pickerOptions" v-model="ruleForm.startTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="6" v-show="ruleForm.setVer=='1'">
              <el-form-item>
                <el-select v-model="ruleForm.queryTargetColumn" placeholder="请选择">
                  <el-option v-for="item in queryTargetColumnList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "dataInver",
  data: function() {
    return {
      innerVisible: this.msg,
      result: '0',
      queryTargetColumnList: [],
      ruleForm: {
        setVer: 0, //核验设置
        range: 0, //核验误差范围
        startTime: [],
        queryTargetColumn: '',
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
      if (this.ruleForm.range == undefined) {
        this.$alert("请填写数据核验范围", "核验", {
          confirmButtonText: "确定"
        });
        return false;
      }
      this.$ajax({
        method: "get",
        url: `${this.GLOBAL.api.API_DACM}/ccheckData/tableCheck`,
        params: {
          taskId: this.taskId,
          key: this.ruleForm.setVer,
          range: this.ruleForm.range,
          startTime: this.ruleForm.startTime[0],
          endTime: this.ruleForm.startTime[1],
          queryTargetColumn: this.ruleForm.queryTargetColumn
        }
      }).then(res => {
        if (res.data.data.result == true || res.data.data.result == "true") {
          this.$alert(res.data.data.message, "核验结果", {
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
        url: this.GLOBAL.api.API_DACM + '/ccheckData/tableNum',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
          taskId: this.taskId
        }
      }).then(res => {
        let _self = this;
        if (res.data.success == "true" || res.data.success == true) {
          res.data = res.data.data;
          _self.ruleForm.range = res.data.config_range==undefined?'':res.data.config_range;
          _self.queryTargetColumnList = res.data.listIncrementCon;
          if (_self.queryTargetColumnList.length != 0 && _self.queryTargetColumnList.length != undefined) {
            _self.ruleForm.queryTargetColumn = _self.queryTargetColumnList[0];
          }
          if (res.data.config_key != undefined && res.data.config_key != null) {
            //全量
            if (res.data.config_key == "0") {
              _self.ruleForm.setVer = 0;
              _self.ruleForm.startTime = [];
            } else {
              //时间范围
              _self.ruleForm.setVer = 1;
              _self.ruleForm.startTime = [
                res.data.config_startTime,
                res.data.config_endTime
              ]
            }
            //不知道这个的展示有没有什么限制，所以暂时先不作什么限制

            _self.ruleForm.range = res.data.config_range==undefined?'':res.data.config_range;
            _self.ruleForm.queryTargetColumn = res.data.queryTargetColumn;

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
      if (this.innerVisible) {
        this._checkData();
      }

    }

  },
  props: ['msg', 'taskId']

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

.proInfo-box .el-radio {
  line-height: 30px;
}

</style>
