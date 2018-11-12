<template>
  <div class="taskMDialog increDia">
    <!-- <i class="el-icon-info" @click="innerVisible = true">选择</i> -->
    <el-dialog title="impala服务器信息" :visible.sync="innerVisible" width="60%" :before-close="closeDialog" append-to-body>
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <div class="daiInfo proInfo mt30" v-loading="loading">
        <div class="proInfo-box clearfix dataInfo-box">
          <div class="comTable">
            <el-table :data="this.impalaTable" stripe height="250">
              <el-table-column label="impala选择" width="180">
                <template slot-scope="scope">
                  <el-radio @change.native="getCurrentRow(scope.row)" :label="scope.row.id" v-model="radio" class="textRadio">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="impala库区" width="180">
                <template scope="scope">
                  <p>{{getType(scope.row.dataCenterType)}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="serviceName" label="impala服务器名">
              </el-table-column>
              <el-table-column prop="serviceIp" label="impala服务器地址" width="180">
              </el-table-column>
              <el-table-column prop="serviceDatabase" label="impala数据库" width="180">
              </el-table-column>
            </el-table>
          </div>
          <el-form-item>
            <el-col :span="24" class="tcenter mt30">
              <el-button type="primary" size="small" @click="save('')">保存</el-button>
              <el-button @click="closeDialog()" size="small">关闭</el-button>
            </el-col>
          </el-form-item>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "taskMDialog",
  data: function() {
    return {
      radio: '',
      loading: true,
      innerVisible: this.msg,
      cincreArr: [],
      impalaTable: [],

    }
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.$emit('showIncre');
      this.innerVisible = false;

    },
    getCurrentRow(value) {

      this.cincreArr = [];
      this.cincreArr.push({
        'impalaId': value.id,
        'impalaName': value.serviceName
      })

    },
    save() {
      if (this.cincreArr.length == 0) {
        this.$message({
          message: '还未选择impala信息',
          type: 'warning'
        });
        return false;
      }
      console.log(this.cincreArr + "*****");
      this.$emit('saveIncre', this.cincreArr);
      this.innerVisible = false;
    },
    _getImpalaTable(value) {
      var _self = this;
      this.$ajax({
        method: "post",
        url: this.GLOBAL.api +'caccesssysRelationWorkInfo/getDataCenterInfo?id=2',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },

      }).then(res => {
        this.loading = false;
        console.log(res);
        this.impalaTable = res.data;
        if (value != '') {
          for (let i = 0; i < this.impalaTable.length; i++) {
            if (value == this.impalaTable[i].id) {
              this.radio = value;
              this.cincreArr = [];
              this.cincreArr.push({
                'impalaId': value,
                'impalaName': this.impalaTable[i].serviceName
              })
            }
          }
        }
      })
    },
    getType(value) {
      if (value == "ORIGINAL") {
        return '原始库';
      }
      if (value == "STANDAR") {
        return '标准库';
      }
      if (value == "SUBJECT") {
        return '专题库';
      }
    }
  },
  components: {

  },
  created() {

  },
  props: ['msg', 'increArr', 'uid'],
  watch: {
    msg() {
      this.innerVisible = this.msg;
      let fva = '';
      if (this.uid != undefined && this.uid != null) {
        fva = this.uid;
        this._getImpalaTable(fva);
      } else {
        this._getImpalaTable(fva);
      }
    },
    increArr() {
      this.cincreArr = this.increArr;
    }
  }

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.otherInfo .el-radio {
  margin-bottom: 12px;
  margin-top: 8px;
  margin-left: 30px;
}

.el-dialog__header {
  margin: 0 20px;
  padding: 20px 10px 0px;

  .el-dialog__title {
    font-size: $font-size-medium;
    color: $color-text-title;
  }
}

.el-dialog__title {
  font-size: $font-size-medium;
  color: $color-text-title;
}

.title-gra {
  margin-bottom: 20px;
  .grab {
    height: 4px;
    display: inline-block;
  }
  .gra-l {
    width: 30%;
    background: $color-background-lp;
  }
  .gra-r {
    width: 70%;
    background: $color-background-rp;
  }
}

.el-dialog__body {
  padding-top: 0px;
  padding-left: 30px;
  padding-right: 30px;
  .daiInfo-title {
    border-bottom: 1px solid $border-color-dai;
    margin-bottom: 20px;
  }
  h2 {
    font-size: $font-size-medium;
    color: $color-text-stitle;
    padding: 0;
    margin: 0;
    line-height: 40px;
  }
  .daiInfo-box {
    padding: 0 20px;
  }
}

</style>
