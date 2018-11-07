<template>
  <div class="taskMDialog typeMapDia">
    <div class="comTable">
      <el-table :data="schemaMappingDTOList" stripe height="250">
        <el-table-column prop="orgColumnName" label="数据源字段名称" width="180">
        </el-table-column>
        <el-table-column prop="orgColumnType" label="数据源字段类型" width="180">
        </el-table-column>
        <el-table-column prop="" label="目标字段名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.newColumnName"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="toType" label="目标字段类型" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.newColumnType" placeholder="请选择">
              <el-option v-for="item in TypeData" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="foreignKey" label="目标描述信息" width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.orgColumnComment"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn tcenter mt30">
      <el-button type="primary" style="margin-top: 12px;" @click="pre()">上一步</el-button>
      <el-button type="primary" style="margin-top: 12px;" @click="next()">下一步</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: "userSurvey",
  data: function() {
    return {
      dialogVisible: false,
      tableData: [],
      TypeData: [],
      cloneData: [],
      mapData: [],
      smapData: [],
      schemaMappingDTOList: [],

    }
  },
  methods: {
     //测试使用mapMutations的用法
    ...mapMutations([
        'setSchemaList'
      ]),
    //得到map的值
    _getMap() {
      var _self = this;
      this.$ajax.get('./getTypeMap').then(function(res) {
          _self.tableData = res.data.page.list;
          for (let j = 0; j < _self.tableData.length; j++) {
            _self.schemaMappingDTOList.push({
              "newColumnName": _self.tableData[j].name,
              "newColumnType": '',
              "orgColumnName": _self.tableData[j].name,
              "orgColumnType": _self.tableData[j].datatype,
              "orgColumnComment": _self.tableData[j].comments
            })
          }
          _self._getAllType();

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
          //console.log(_self.TypeData);
        })
        .catch(function(err) {
          console.log(err)
        });

    },
    _getAllType() {
      var _self = this;
      this.$ajax.get('./getColumnType').then(function(res) {
          _self.mapData = res.data[1];
          for (let i = 0; i < _self.tableData.length; i++) {
            let flag = false;
            let temp;
            for (let j = 0; j < _self.mapData.datas.length; j++) {
              if (_self.tableData[i].datatype.toUpperCase() == _self.mapData.datas[j]) {

                flag = true;
                temp = j;
                /*_self.cloneData.push({
                  'mapping': _self.mapData.datas_mapping[j]
                })*/
              }
            }

            if (flag) {
              _self.cloneData.push(
                _self.mapData.datas_mapping[temp]
              )
            } else {
              _self.cloneData.push(
                _self.mapData.datas_mapping[0]
              )
            }
            console.log(_self.cloneData);
          }
          for (let n = 0; n < _self.cloneData.length; n++) {
            _self.schemaMappingDTOList[n].newColumnType = _self.cloneData[n];
          }
          console.log(_self.schemaMappingDTOList);
        })
        .catch(function(err) {
          console.log(err)
        });

    },
    //上一步
    pre(){
      this.$emit('pre');
    },
    //下一步
    next(){
      this.$emit('nre');
      this.setSchemaList(this.schemaMappingDTOList);
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
    typeTran: {
      set(val) {
        console.log(val)
      },
      get() {
        return "STRING"
      }

    }
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
