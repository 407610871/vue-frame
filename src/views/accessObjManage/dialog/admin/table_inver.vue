<template>
  <div class="taskMDialog userSurveyDialog">
    <el-button class="diabtn tin-btn add-btn" @click="dialogVisible = true">核验报告</el-button>
    <!--  <i class="el-icon-info" @click="dialogVisible = true">用户调研</i> -->
    <el-dialog title="核验报告" :visible.sync="dialogVisible" width="60%" :before-close="closeDialog">
      <div class="title-gra plr30">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <div class="proInfo-box ">
        <div class="comTable">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="源表">
            </el-table-column>
            <el-table-column prop="name" label="状态">
            </el-table-column>
            <el-table-column prop="address" label="源数据量">
            </el-table-column>
            <el-table-column prop="address" label="目标表">
            </el-table-column>
            <el-table-column prop="address" label="数据量">
            </el-table-column>
            <el-table-column prop="address" label="数据差值">
            </el-table-column>
            <el-table-column prop="address" label="检验结果">
            </el-table-column>
            <el-table-column prop="address" label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="innerVisible = true" class="fl mr10">核验</el-button>
                <data-top :msg='innerVisible' @showIncre="showInver()" @saveIncre="saveInver($event)"></data-top>
                <el-button size="mini" type="primary" class="fl">查看日志</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="proInfo-box log-box clearfix ptb20">
        <textarea name="" id="" disabled="disabled" v-show="textShow">{{loginfo}}</textarea>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dataTop from '@/views/accessObjManage/dialog/admin/data_top_inver'
export default {
  name: "dataInver",
  data: function() {
    return {
      dialogVisible: false,
      innerVisible: false,
      loginfo: '123123',
      textShow: 'true',
      result: '0',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]

    }
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
     
    },
    //核验弹框的再次打开
    showInver() {
      this.innerVisible = false;
    },
    saveInver() {
      this.innerVisible = false;
      //刷新数据
    }
  },
  components: {
    dataTop
  },
  mounted() {

  },
  created() {

  },
  computed: {

  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {

      }
    }

  },
  props: ['pdata']

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

.userSurveyDialog .dataInfo-box {
  border: none
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

.sursavebtn .el-form-item--medium .el-form-item__content {
  margin-left: 0px;
}

.radiow100 {
  .el-radio-group {
    width: 100%;
  }
}
.log-box{
    padding: 20px 30px;
}
.comTable {
  padding: 20px 30px;
  .el-table .cell .el-button--primary {
    color: #fff;
    background-color: #489bd9;
    border-color: #489bd9;
    display: inline-block;
  }
}

.proInfo-box {
  border-bottom: 1px solid $border-color-dai;
}

.vs {
  color: #2f6ac5;
  display: inline-block;
  font-size: 100px;
  max-width: 260px;
  text-align: left;
  margin-top: 30px;
}

.resultIcon .yes {
  background: url("../../../../assets/images/data_ri.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}

.resultIcon .wrong {
  background: url("../../../../assets/images/data_err.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}

textarea {
  width: 80%;
}

.tin-btn {
  float: right;
  margin-left: 10px;
}
textarea{
  margin-left: 30px;
}
.title-gra{

}
</style>
