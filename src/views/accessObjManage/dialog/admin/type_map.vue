<template>
  <div class="taskMDialog typeMapDia">
    <div class="comTable">
      <el-table :data="schemaMappingDTOList" stripe height="250" v-loading="loading">
        <el-table-column prop="orgColumnName" label="数据源字段名称">
        </el-table-column>
        <el-table-column prop="orgColumnType" label="数据源字段类型">
        </el-table-column>
        <el-table-column prop="" label="目标字段名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.newColumnName"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="toType" label="目标字段类型">
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
import columnJson from '@/static/json/columnType'
import jsonType from '@/static/json/jsonType'

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
      mapflag: true,
      loading: false,
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
      var map = {
        objectInfoId: this.tableId,
        pagNum: 1,
        count: 20,
        term: ""
      }
      _self.loading = true;
      this.$ajax.post(this.GLOBAL.api.API_DACM + '/objDetail/dataList', map).then(function(res) {
        _self.loading = false;
        if (res.data.success) {
          _self.tableData = res.data.data.list;
          for (let j = 0; j < _self.tableData.length; j++) {
            _self.schemaMappingDTOList.push({
              "newColumnName": _self.tableData[j].name,
              "newColumnType": '',
              "orgColumnName": _self.tableData[j].name,
              "orgColumnType": _self.tableData[j].datatype,
              "orgColumnComment": _self.tableData[j].comments,
              "length": _self.tableData[j].length
            })
          }
          _self._getAllType();
        } else {
          _self.$alert(res.data.message, '信息', {
            confirmButtonText: '确定',
            callback: action => {
              _self.mapflag = false;
              return false;
            }
          });
        }
      }).catch(function(err) {
        _self.loading = false;
      })
      /*this.$ajax.get('./getTypeMap').then(function(res) {
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
        });*/
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
      _self.TypeData = [];
      /*_self.TypeData = res.data[0].datas_mapping;*/
      let reData = [];
      if (_self.$store.state.isParquet) {
        for (let m = 0; m < columnJson.length; m++) {
          if (_self.maptype == columnJson[m].type) {
            reData = columnJson[m].datas_mapping;
          }
        }
      } else {
        for (let m = 0; m < jsonType.length; m++) {
          if (_self.maptype == jsonType[m].type) {
            reData = jsonType[m].datas_mapping;
          }
        }
      }
      for (let i = 0; i < reData.length; i++) {
        for (let j = i + 1; j < reData.length; j++) {
          if (reData[i] == reData[j]) {
            j = ++i;
          }
        }
        _self.TypeData.push(reData[i]);
      }
      console.log(_self.TypeData);



    },
    _getAllType() {
      var _self = this;
      if (_self.$store.state.isParquet) {
        for (let m = 0; m < columnJson.length; m++) {
          if (_self.maptype == columnJson[m].type) {
            _self.mapData = columnJson[m];
          }
        }
      } else {
        for (let m = 0; m < jsonType.length; m++) {
          if (_self.maptype == jsonType[m].type) {
            _self.mapData = jsonType[m];
          }
        }
      }
      /**/
      for (let i = 0; i < _self.tableData.length; i++) {
        let flag = false;
        let temp;
        let numflag = false;
        for (let j = 0; j < _self.mapData.datas.length; j++) {
          if (_self.tableData[i].datatype.toUpperCase() == _self.mapData.datas[j]) {

            flag = true;
            temp = j;

            break;
            /*_self.cloneData.push({
              'mapping': _self.mapData.datas_mapping[j]
            })*/
          } else {
            if (_self.tableData[i].datatype.toUpperCase().indexOf(_self.mapData.datas[j]) > -1) {
              flag = true;
              temp = j;
            }
          }
        }

        if (flag) {
          //let datalength = _self.tableData[i].length;
          //datalength = datalength.split(',')[1];
          if (_self.$store.state.isParquet) {
            if (_self.tableData[i].datatype.toUpperCase() == 'NUMBER') {
              let datalength = _self.tableData[i].length;
              if (datalength.indexOf(',') != '-1') {
                let fdata = datalength.split(',')[0];
                let sdata = datalength.split(',')[1];
                if (sdata != '0') {
                  _self.cloneData.push(
                    _self.mapData.datas_mapping[temp]
                  )
                } else {
                  if (fdata == '0') {
                    _self.cloneData.push(
                      _self.mapData.datas_mapping[temp]
                    )
                  } else {
                    _self.cloneData.push(
                      'BIGINT'
                    )
                  }
                }

              } else {
                _self.cloneData.push(
                  _self.mapData.datas_mapping[temp]
                )
              }

            } else {
              _self.cloneData.push(
                _self.mapData.datas_mapping[temp]
              )
            }
          } else {
            _self.cloneData.push(
              _self.mapData.datas_mapping[temp]
            )
          }


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



    },
    //上一步
    pre() {
      this.$emit('pre');
    },
    //下一步
    next() {
      if (this.mapflag) {
        this.$emit('nre');
        this.setSchemaList(this.schemaMappingDTOList);
      }

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
  props: ['tableId', 'maptype']

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

.typeMapDia {
  width: 100%;
}

</style>
