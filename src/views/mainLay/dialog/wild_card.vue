<template>
  <div class="taskMDialog userSurveyDialog">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="formRules">
      <div class="daiInfo proInfo">
        <div class="proInfo-box clearfix">
          <el-col :span="24">
            <el-form-item label="选择匹配类型:" prop="matchType">
              <el-radio-group v-model="ruleForm.matchType">
                <el-radio label="0" v-if="jrtype=='mysql'|| jrtype=='oracle'|| jrtype=='postgresql' || jrtype=='sqlserver'">表</el-radio>
                <el-radio label="1" v-if="jrtype!='mysql' && jrtype!='oracle'&& jrtype!='postgresql' && jrtype!='sqlserver'">文件</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mtsItem" v-show="ruleForm.matchType=='0'">
            <el-form-item class="mtsItem">
              <el-radio-group v-model="ruleForm.typeKind" class="wid100">
                <el-col :span="24">
                  <el-col :span="2">
                    <el-radio label="0">基础匹配
                    </el-radio>
                  </el-col>
                  <el-col :span="22">
                    <el-col :span="24" class="surveybg wildbg plr10">
                      <el-col :span="24" class="ml0 tcenter mt10">
                        <el-form-item class="clearfix">
                          <span class="fl mr10">表以</span>
                          <el-input class="fl" v-model="ruleForm.baseStart"></el-input>
                          <span class="fl ml10 mr10">开头,以</span>
                          <el-select class="fl" v-model="ruleForm.baseEnd" placeholder="请选择">
                            <el-option v-for="item in regxData" :label="item.dateFormat" :value="item.dateRegex"></el-option>
                          </el-select>
                          <span class="fl ml10">结尾</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4" class="ml0  mt10">
                        <el-form-item>
                          <span>匹配示例:xxxxxxxxxxx</span>
                        </el-form-item>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col :span="24" class="mt25 wildbg">
                  <el-col :span="2">
                    <el-radio label="1">高级匹配
                    </el-radio>
                  </el-col>
                  <el-col :span="22">
                    <el-form-item>
                      <el-input v-model="ruleForm.highMatch"></el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mtsItem" v-show="ruleForm.matchType == '1'">
            <div class="delimiter-box"><span>分隔符:</span>
              <el-input v-model="delimiter"></el-input>
            </div>
            <div class="comTable">
              <el-table stripe :data="tableData" height="250" style="width: 100%">
                <el-table-column width="180" label="" :render-header="renderHeader">
                  <template slot-scope="scope">
                    <i class="el-icon-remove" @click="handleDelete(scope.$index, scope.row)"></i>
                  </template>
                </el-table-column>
                <el-table-column label="字段名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="datatype" label="字段类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.datatype" placeholder="请选择">
                      <el-option v-for="item in TypeData" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </div>
      </div>
    </el-form>
    <div class="btn tcenter">
      <el-button type="primary" style="margin-top: 12px;" @click="pres()">上一步</el-button>
      <el-button type="primary" style="margin-top: 12px;" @click="nre()">下一步</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import norelaWild from '@/views/mainLay/dialog/norela_wild'
export default {
  name: "userSurvey",
  data: function() {
    return {
      dialogVisible: false,
      regxData: [],
      wildData: [],
      tableData: [],
      delimiter: '',
      TypeData: [],
      ruleForm: {
        matchType: '0', //匹配类型
        typeKind: '0',
        baseStart: '', //表开头
        baseEnd: '', //表结尾
        highMatch: '', //高级匹配
      },
      formRules: {},
    };
  },
  methods: {
    ...mapMutations([
      'setRegInfo', 'setMatchType'
    ]),
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    //关闭
    closeForm() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    pres() {
      this.$emit('pre');
    },
    nre() {
      if (this.ruleForm.matchType == '0') {
        let reflag = true;
        let varegex;
        if (this.ruleForm.typeKind == '0') {
          let start = this.ruleForm.baseStart;
          let end = this.ruleForm.baseEnd;
          varegex = new RegExp('^' + start + '.*' + end + '$');

        } else {
          varegex = new RegExp(this.ruleForm.highMatch);
        }
        for (let i = 0; i < this.rowList.length; i++) {
          if (varegex.test(this.rowList[i].name)) {

          } else {
            reflag = false;
          }
        }
        if (reflag == false) {
          this.$message.warning('表中有不匹配的表名');
          return false;
        } else {
          if (this.ruleForm.typeKind == '0') {
            if (this.ruleForm.baseEnd.indexOf('-') != -1) {
              var RegInfo = {
                baseStart: this.ruleForm.baseStart,
                baseEnd: `\/\/d{4}(-)\/\/d{1,2}\/\/1\/\/d{1,2}`,
                baseflag: false
              }
            }
            if (this.ruleForm.baseEnd.indexOf('/') != -1) {
              var RegInfo = {
                baseStart: this.ruleForm.baseStart,
                baseEnd: `\/\/d{4}(/)\/\/d{1,2}\/\/1\/\/d{1,2}`,
                baseflag: false
              }
            }
            if (this.ruleForm.baseEnd.indexOf(':') != -1) {
              var RegInfo = {
                baseStart: this.ruleForm.baseStart,
                baseEnd: `\/\/d{4}(:)\/\/d{1,2}\/\/1\/\/d{1,2}`,
                baseflag: false
              }
            }
            this.setRegInfo(RegInfo);
          } else {
            var RegInfo = {
              baseStart: "",
              baseEnd: this.ruleForm.highMatch,
              baseflag: true
            }
            this.setRegInfo(RegInfo);
          }
          this.$emit('nre');
        }
      }
      if (this.ruleForm.matchType == '1') {

        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].name == '' || this.tableData[i].datatype == '') {
            this.$message.warning('不能为空');
            return false;
          }
        }
        this.setMatchType(this.tableData);
        console.log(this.tableData);
        this.$emit('nre');
      }

    },
    _getRegexList() {
      this.$ajax({
        method: "get",
        url: 'http://10.19.160.168:8080/DACM/task/getRegexList',
        params: {

        }
      }).then(res => {
        if (res.data.success) {
          this.regxData = res.data.data;
        }
      })
    },
    // 在渲染表头的时候,会调用此方法, h为createElement的缩写版, 也可以添加事件click、change等
    renderHeader(h, { column, $index }) {
      return h('span', [
        h('span', column.label),
        h('span', {
          class: 'el-icon-circle-plus',
          on: {
            click: () => {
              /*console.log(`${column.label}   ${$index}`)*/
              this.tableData.push({
                name: '',
                datatype: '',
                mapdata: '',
                comments: ''
              })
            }
          }
        })
      ])
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
    },
    //得到字段类型
    _getType() {
      var _self = this;
      this.$ajax.get('./getColumnType').then(function(res) {
          debugger;
          for (let m = 0; m < res.data.length; m++) {
            if (_self.rowList[0].accessSys.accessSysDialect.name == res.data[m].type) {
              _self.TypeData = res.data[m].datas;
            }
          }
          //console.log(_self.TypeData);
        })
        .catch(function(err) {
          console.log(err)
        });

    },
  },
  components: {
    norelaWild
  },
  mounted() {

  },
  created() {

  },
  computed: {

  },
  props: ['rowList', 'msg', 'jrtype'],
  watch: {
    msg() {
      if (this.msg == "second") {
        this._getRegexList();
        this._getType();
      }
    }
  }

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.userSurveyDialog .el-dialog__body {
  padding-left: 0px;
  padding-right: 0px;
}

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

.surveybg {
  background: #f0f3f6;
  padding-top: 20px;
}

.plr30 {
  padding-left: 30px;
  padding-right: 30px;
}

.mtsItem {
  .el-form-item--medium .el-form-item__content {
    margin-left: 10px !important;
  }
}

.mtsItem .wildbg {
  .el-form-item--medium .el-form-item__content {
    margin-left: 0px !important;
  }
}

.wildbg .el-input,
.wildbg .el-select {
  width: 30%;
}

.wildbg .el-select .el-input {
  width: 100%;
}

.el-radio-group.wid100 {
  width: 100%;
}

.wildbg {
  margin-left: 10px;

  padding-top: 10px;
  padding-bottom: 15px;
  .el-radio__label {
    line-height: 30px;
  }
}

</style>
