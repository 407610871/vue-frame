<template>
  <div class="taskMDialog increDia">
    <el-dialog title="增量字段选择" :visible.sync="innerVisible" width="60%" :before-close="closeDialog" append-to-body>
        <div class="title-gra plr30">
          <div class="grab gra-r">
            <span class="grab gra-l"></span>
          </div>
        </div>
      <div class="daiInfo proInfo">
        <div class="proInfo-box clearfix">
          <div class="comTable">
            <el-table :data="tableData" stripe height="250" :span-method="arraySpanMethod">
              <el-table-column label="增量字段选择" width="180">
                <template slot-scope="scope">
                  <el-radio @change.native="getCurrentRow(scope.row)" :label="scope.$index" v-model="radio" class="textRadio" v-if="scope.$index!=flag">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="字段名" width="180">
              </el-table-column>
              <el-table-column label="字段类型">
                <template slot-scope="scope">
                  <span :class="scope.$index!=flag? '':'red'">{{scope.row.datatype}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="diyComments" label="字段描述" width="180">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="mr-btn clearfix">
        <el-button type="primary" @click="closeDialog()">关闭</el-button>
        <el-button type="primary"   @click="save('')">保存</el-button>
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
      flag: '',

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
      console.log(this.radio);
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
        count: 200,
        term: ""
      }
      this.$ajax.post(this.GLOBAL.api.API_DACM + '/objDetail/dataList', map).
      then(res => {
        this.tableData = [];
        if (res.data.success) {
          var first = [];
          var second = [];
          //测试数据
          /*var data = res.data.page.list;*/
          var data = res.data.data.list;
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
            this.flag = first.length;
            this.tableData.push({
              datatype: '以下增量字段类型默认不支持,请谨慎选择',
              name: '',
              comments: '',
              id: ''
            })
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
            if (this.yid != '') {
              for (let h = 0; h < this.tableData.length; h++) {
                if (this.tableData[h].id == this.yid) {
                 /* this.radio = yid;*/
                 this.radio = h;
                  this.cincreArr = [];
                  this.cincreArr = {
                    id: this.tableData[h].id,
                    name: this.tableData[h].name,
                    datatype: this.tableData[h].datatype
                  };
                }
              }
            }
          }

        }
      })
    },
    //合并行
    arraySpanMethod() {

    },
    initMap(){
      this.cincreArr = [];
    }
  },
  components: {

  },
  created() {

  },
  props: ['msg', 'increArr', 'incid', 'yid'],
  watch: {
    msg() {
      this.innerVisible = this.msg;
      this._getIncreType();
      console.log(this.yid + '*******')
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
  /* color: $color-text-title; */
  @include el-color($color-text-title);
}

.el-dialog__body table .cell .red {

  color: red;
  text-align: left;
  position: relative;
  left: -86px;
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
