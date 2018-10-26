<template>
  <div class="taskMDialog typeMapDia">
    <div class="comTable">
      <el-table :data="tableData" stripe height="250">
        <el-table-column prop="name" label="数据源字段名称" width="180">
        </el-table-column>
        <el-table-column prop="datatype" label="数据源字段类型" width="180">
        </el-table-column>
        <el-table-column prop="commentsFrom" label="目标字段名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.commentsFrom"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="toType" label="目标字段类型" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.Typevalue" placeholder="请选择">
              <el-option v-for="item in TypeData" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="foreignKey" label="目标描述信息" width="180">
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
      tableData: [],
      TypeData: [],
    }
  },
  methods: {
    //得到map的值
    _getMap() {
      var _self = this;
      this.$ajax.get('./getTypeMap').then(function(res) {
          _self.tableData = res.data.page.list;
        })
        .catch(function(err) {
          console.log(err)
        });
      /*this.$ajax({
        methods: 'get',
        url: '/api/ctablesDetail/datas',
        params: {
          id:'10203122'
        }
      }).then(res => {
          console.log(res);
      })*/
    },
    _getType() {
      var _self = this;
      this.$ajax.get('./getColumnType').then(function(res) {
          _self.TypeData = res.data[0].datas_mapping;
          console.log(_self.TypeData);
        })
        .catch(function(err) {
          console.log(err)
        });
      /*this.$ajax({
        methods: 'get',
        url: '/api/ctablesDetail/datas',
        params: {
          id:'10203122'
        }
      }).then(res => {
          console.log(res);
      })*/
    }
  },
  components: {

  },
  mounted() {
    this._getMap()
    this._getType()
  },
  created() {

  },
  computed: {

  },
  props: ['tableId']

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
