<template>
  <div class="taskMDialog typeMapDia">
    <div class="comTable">
      <el-table :data="tableData" stripe height="250">
        <el-table-column prop="fromName" label="数据源字段名称" width="180">
        </el-table-column>
        <el-table-column prop="fromType" label="数据源字段类型" width="180">
        </el-table-column>
        <el-table-column prop="toName" label="目标字段名称">
        </el-table-column>
        <el-table-column prop="toType" label="目标字段类型" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.Typevalue" placeholder="请选择">
              <el-option v-for="item in scope.row.toType" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="toDes" label="目标描述信息" width="180">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "userSurvey",
  data: function() {
    return {
      dialogVisible: false,
      tableData: [{
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
        Typevalue:'',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
         Typevalue:'',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
         Typevalue:'',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
         Typevalue:'',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
         Typevalue:'',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
         Typevalue:'',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
         Typevalue:'',
      }]
    }
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;

    },

    //关闭
    closeForm() {
      this.dialogVisible = false;

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



.plr30 {
  padding-left: 30px;
  padding-right: 30px;
}

</style>
