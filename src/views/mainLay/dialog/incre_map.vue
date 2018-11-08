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
              <h2>增量字段选择</h2>
            </el-col>
            <el-col :span="13" class="bank">bank</el-col>
            <el-col :span="4">
              <el-form-item class="clearfix">
               <!--  <el-input placeholder="请输入内容"></el-input> -->
              </el-form-item>
              <!--  <el-input v-model=""></el-input> -->
            </el-col>
          </el-col>
        </div>
        <div class="proInfo-box clearfix">
          <div class="comTable">
            <el-table :data="tableData" stripe height="250" :span-method="arraySpanMethod">
              <el-table-column label="增量字段选择" width="180">
                <template slot-scope="scope">
                  <!-- class="textRadio" -->
                  <el-radio @change.native="getCurrentRow(scope.row)" :label="scope.$index" v-model="radio" class="textRadio">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="字段名" width="180">
              </el-table-column>
              <el-table-column prop="datatype" label="字段类型">
              </el-table-column>
              <el-table-column prop="diyComments" label="字段描述" width="180">
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
      appId: '',
      cincreArr: [],
      tableData: [],

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
      this.cincreArr = {
        id: value.id,
        name: value.name,
        datatype: value.datatype
      };
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
    },
    _getIncreType() {
      var map = {
        objectInfoId: this.incid,
        pagNum: 1,
        count: 20,
        term: ""
      }
      this.$ajax.post('http://10.19.248.200:32661/DACM/objDetail/dataList', map).
      then(res => {
        this.tableData = [];
        if (res.data.success) {
          var first = [];
          var second = [];
          var data = res.data.data.list;
          debugger;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].isNull == "N" || data[i].isNull == "NO") {
                if (data[i].datatype.toLowerCase().indexOf('int') != -1 || data[i].datatype.toLowerCase() == "bigint" || data[i].datatype.toLowerCase() == "long" || data[i].datatype.toLowerCase().indexOf('time') != -1 || data[i].datatype.toLowerCase().indexOf('date') != -1 || data[i].datatype.toLowerCase() == "number") {
                  first.push({
                    datatype: data[i].datatype,
                    name: data[i].name,
                    comments: data[i].comments,
                    id: data[i].id
                  })
                } else {
                  second.push({
                    datatype: data[i].datatype,
                    name: data[i].name,
                    comments: data[i].comments,
                    id: data[i].id
                  })
                }
              } else {
                second.push({
                  datatype: data[i].datatype,
                  name: data[i].name,
                  comments: data[i].comments,
                  id: data[i].id
                })
              }

            }
            for (let m = 0; m < first.length; m++) {
              this.tableData.push({
                datatype: first[m].datatype,
                name: first[m].name,
                comments: first[m].comments,
                id: first[m].id
              })
            }
            console.log(first);
            console.log(second);

            for (let m = 0; m < second.length; m++) {
              this.tableData.push({
                datatype: second[m].datatype,
                name: second[m].name,
                comments: second[m].comments,
                id: second[m].id
              })
            }
          }

        }
      })
    },
    //合并行
    arraySpanMethod() {

    }
  },
  components: {

  },
  created() {

  },
  props: ['msg', 'increArr', 'incid'],
  watch: {
    msg() {
      this.innerVisible = this.msg;
      this._getIncreType();
      console.log(this.incid + '*******')
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
