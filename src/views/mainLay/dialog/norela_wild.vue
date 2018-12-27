<template>
  <div class="taskMDialog userSurveyDialog noreDialog">
    <div class="delimiter-box" v-if="this.$route.params.type!='mongodb'"><span>分隔符:</span>
      <el-input v-model="delimiter"></el-input>
    </div>
    <div class="comTable">
      <el-table stripe :data="tableData" height="250" style="width: 100%" v-loading="loading">
        <el-table-column width="180" label="" :render-header="renderHeader">
          <template slot-scope="scope">
            <i class="el-icon-remove" @click="handleDelete(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column label="字段名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" :disabled="isDisabled(scope.row)||isForbidEdit"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="datatype" label="字段类型">
          <template slot-scope="scope">
          
            <el-select v-model="scope.row.datatype" placeholder="请选择" :disabled="isDisabled(scope.row)||isForbidEdit">
              <el-option v-for="(item, index) in TypeData" :key="index" :label="item" :value="item">
              </el-option>
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
      tableData: [],
      TypeData: [],
      schemas:[],
      i:0,
      tableDataCont:{
        name:"_id",
        datatype:"ObjectId",
        comments: ''
      },
      isForbidEdit:false,
      loading: true,
    }
  },
  props: ['rowList'],
  methods: {
    ...mapMutations([
      'setNoreData', 'setDelimiter','setSchemaList'
    ]),
    // 在渲染表头的时候,会调用此方法, h为createElement的缩写版, 也可以添加事件click、change等
    renderHeader(h, { column, $index }) {
      return h('span', [
        h('span', column.label),
        h('span', {
          class: 'el-icon-circle-plus',
          on: {
            click: () => {
              if(this.isForbidEdit) return;
              this.tableData.push({
                name: '',
                datatype: this.TypeData[0],
                id: this.i,
                comments: ''
              })
              this.i++;
            }
          }
        })
      ])
    },
    handleDelete(index, row) {
      if(this.isDisabled(row)||this.isForbidEdit) return;
       this.schemas = this.$store.state.schemaList;
      for(let i=0; i<this.schemas.length;i++){
        if(this.schemas[i].length==this.tableData[index].id){
           this.schemas.splice(i,1);
        }
      }
       this.tableData.splice(index, 1);
    },
    //得到字段类型
    _getType() {
      var _self = this;
      if (_self.$store.state.isParquet) {
        for (let m = 0; m < columnJson.length; m++) {
          if (_self.$route.params.type == columnJson[m].type) {
            _self.TypeData = columnJson[m].datas;
          }
        }
      } else {
        for (let m = 0; m < jsonType.length; m++) {
          if (_self.$route.params.type == jsonType[m].type) {
            _self.TypeData = jsonType[m].datas;
          }
        }
      }
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
        if(this.tableData[i].name == '_id'&& i == 0){

        }else{
          if (vex.test(this.tableData[i].name)==false) {
            this.$message.warning('字段名请以字符开头,仅支持字母,数字,下划线');
            return false;
          }
        }
      }
      if(this.$route.params.type="mongodb"){
        this.delimiter = "\t";
      }
      if(this.schemas.length!=0){
        this.setSchemaList(this.schemas);
      }
      for(let i =0; i<this.tableData.length;i++){
        for(let j =0 ;j<this.$store.state.schemaList.length;j++){
          if(this.tableData[i].id==this.$store.state.schemaList[j].length){
            if(this.tableData[i].name!=this.$store.state.schemaList[j].orgColumnName){
               this.$set(this.$store.state.schemaList[j],'newColumnName',this.tableData[i].name);
               this.$set(this.$store.state.schemaList[j],'orgColumnName',this.tableData[i].name);
            }
            if(this.tableData[i].datatype!=this.$store.state.schemaList[j].orgColumnType){
              this.$set(this.$store.state.schemaList[j],'newColumnType','');
            }
          }
        }
      }
      this.setSchemaList(this.$store.state.schemaList);
      this.setNoreData(this.tableData);
      this.setDelimiter(this.delimiter);
      this.$emit('pre');
    },
    next() {
      this.$emit('clo');
    },
    isDisabled(row){
      if(row.name == "_id"&&row.id == 0&&this.ismongodb){
        return true;
      }else{
        return false;
      }
    },
    getTableData(){
      this.loading = true;
      this.$ajax({
        method: "get",
        url: this.GLOBAL.api.API_DACM + `/task/getSchemaMappingList?accessSysObjInfoId=${this.rowList.id}`,
      }).then(res=>{
        if(res.data.success){
          if(res.data.data.length == 0){
            this.isForbidEdit = false;
            let params = {
              objectInfoId: this.rowList.id,
              pagNum: 1,
              count: 200,
              term: ""
            }
            this.$ajax.post(this.GLOBAL.api.API_DACM + '/objDetail/dataList', params).then(res=>{
              if(res.data.success){
                this.loading = false;
                res.data.data.list.forEach(res=>{
                    if(res.name != "_id"){
                      let map = {
                        'comments': "",
                        'datatype': res.datatype,
                        'id': res.id,
                        'name': res.name,
                      }
                      this.tableData.push(map);
                    }
                })
              }
            })
          }else{
            this.isForbidEdit = true;
            this.loading = false;
            this.opData(res.data.data);
          }
        }
        this.$root.eventHub.$emit('setForbidEdit', this.isForbidEdit);
      });
    },
    opData(data){
      data.forEach(item => {
        let _data = {};
        _data = {
          'comments':item.orgColumnComment,
          'datatype':item.orgColumnType,
          'id':this.i,
          'name':item.orgColumnName,
        };
        if(item.orgColumnName != "_id"){
          this.tableData.push(_data);
          this.i++;
        }
      });
    },
  },

  components: {

  },
  mounted() {
    this._getType();

  },
  created() {
    if(this.ismongodb){
      this.tableDataCont.id = this.i;
      this.i++;
      this.tableData.push(this.tableDataCont);
      this.getTableData();
    }
  },
  computed: {
    ismongodb(){
      return this.$route.params.type == 'mongodb';
    },
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

</style>
