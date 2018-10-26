<template>
  <div class="taskMDialog increDia">
    <!-- <i class="el-icon-info" @click="innerVisible = true">选择</i> -->
    <el-dialog title="增量字段选择" :visible.sync="innerVisible" width="60%" :before-close="closeDialog" append-to-body>
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <div class="daiInfo proInfo">
        <div class="daiInfo-title proInfo-title clearfix">
          <el-col :span="24">
            <el-col :span="6">
              <h2>增量字段选择{{msg}}</h2>
            </el-col>
            <el-col :span="13" class="bank">bank</el-col>
            <el-col :span="4">
              <el-form-item class="clearfix">
                <el-input placeholder="请输入内容"></el-input>
              </el-form-item>
              <!--  <el-input v-model=""></el-input> -->
            </el-col>
          </el-col>
        </div>
        <div class="proInfo-box clearfix">
          <div class="comTable">
            <el-table :data="tableData" stripe height="250">
              <el-table-column label="增量字段选择" width="180">
                <template slot-scope="scope">
                  <!-- class="textRadio" -->
                  <el-radio @change.native="getCurrentRow(scope.$index)" :label="scope.$index" v-model="radio" class="textRadio">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="fromType" label="字段名" width="180">
              </el-table-column>
              <el-table-column prop="toName" label="字段类型">
              </el-table-column>
              <el-table-column prop="toDes" label="字段描述" width="180">
              </el-table-column>
            </el-table>
          </div>
          <el-form-item>
            <el-col :span="24" class="tcenter">
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
      innerVisible: this.msg,
      cincreArr: [],
      tableData: [{
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
        Typevalue: '',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
        Typevalue: '',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
        Typevalue: '',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
        Typevalue: '',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
        Typevalue: '',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
        Typevalue: '',
      }, {
        fromName: '2016-05-03',
        fromType: '王小虎',
        toName: '上海市普陀区金沙江路 1518 弄',
        toType: ['string', 'int'],
        toDes: '45654',
        Typevalue: '',
      }]
    }
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.$emit('showIncre');
      this.innerVisible = false;

    },
    getCurrentRow(value) {
      console.log(value);
      this.cincreArr = [];
      this.cincreArr.push({
        tid: '0',
        name: '1',
        type: '3',
        text: '2'
      })
    },
    save() {
      if (this.cincreArr.length == 0) {
        this.$message({
          message: '还未选择增量字段',
          type: 'warning'
        });
      }
      console.log(this.cincreArr + "*****");
      this.$emit('saveIncre', this.cincreArr);
      this.innerVisible = false;
    }
  },
  components: {

  },
  created() {

  },
  props: ['msg','increArr'],
  watch: {
    msg() {
      this.innerVisible = this.msg;
    },
   increArr(){
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
