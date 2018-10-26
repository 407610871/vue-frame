<template>
  <div class="taskMDialog userSurveyDialog">
    <div class="comTable">
      <el-table stripe :data="tableData" height="250" style="width: 100%">
        <el-table-column width="180" label="+" @click="addTable()">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">454545</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "norelaWild",
  data: function() {
    return {
      dialogVisible: false,
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
    addTable(){
      alert("454545");
    }
  },

  components: {

  },
  mounted() {

  },
  created() {

  },
  computed: {

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
