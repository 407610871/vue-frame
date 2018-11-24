<template>
  <div class="taskMDialog userSurveyDialog noreDialog unnore">
    <div class="comTable">
      <el-table stripe :data="tableData" height="250" style="width: 100%">
        <el-table-column label="字段名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="datatype" label="字段类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.datatype" placeholder="请选择" disabled>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn tcenter">
      <el-button type="primary" style="margin-top: 12px;" @click="pre()">下一步</el-button>
      <el-button style="margin-top: 12px;" @click="next()">取消</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import columnJson from '@/static/json/columnType'
import jsonType from '@/static/json/jsonType'
export default {
  name: "norelaWild",
  data: function() {
    return {
      dialogVisible: false,
      delimiter: '',
      tableData: [{
          name: 'line',
          datatype: 'STRING',
          mapdata: '',
          comments: ''
        },
        {
          name: 'value',
          datatype: 'BIGINT',
          mapdata: '',
          comments: ''
        }
      ],
    }
  },
  methods: {
    ...mapMutations([
      'setNoreData', 'setDelimiter'
    ]),
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
    },
    pre() {
      let vex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      if (this.tableData.length == 0) {
        this.$message.warning('不能为空');
        return false;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].name == '' || this.tableData[i].datatype == '') {
          this.$message.warning('不能为空');
          return false;
        }
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (vex.test(this.tableData[i].name) == false) {
          this.$message.warning('表名请以字符开头,仅支持字母,数字,下划线');
          return false;
        }
      }
      this.setNoreData(this.tableData);
      this.setDelimiter(this.delimiter);
      console.log(this.$store.state.noreData);
      console.log(this.$store.state.delimiter);
      this.$emit('pre');
    },
    next() {
      this.$emit('clo');
    }
  },

  components: {

  },
  mounted() {
    //this._getType();

  },
  created() {

  },
  computed: {

  },
  watch: {

  },

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

.noreDialog {
  width: 100%;
}

.unnore .el-input.is-disabled .el-input__inner {
  background-color: #f0f3f6;
  color: #4f609d;
  border-radius: 0;
  border: 1px solid #c9cdd0;
}

</style>
