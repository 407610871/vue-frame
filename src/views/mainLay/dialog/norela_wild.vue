<template>
  <div class="taskMDialog userSurveyDialog">
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
            <el-select v-model="scope.row.mapdata" placeholder="请选择">
              <el-option v-for="item in TypeData" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
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
      delimiter: '',
      tableData: [],
      TypeData: [],

    }
  },
  methods: {
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
                mapdata:'',
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
          _self.TypeData = res.data[0].datas;
          
          //console.log(_self.TypeData);
        })
        .catch(function(err) {
          console.log(err)
        });

    },
  },

  components: {

  },
  mounted() {

  },
  created() {
     this._getType();
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

.delimiter-box {
  padding: 0px 30px;
  .el-input {
    width: 13%;
    margin-left: 20px;
  }
}

</style>
