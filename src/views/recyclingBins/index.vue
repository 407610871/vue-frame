<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">
              回收箱
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="dashboard-container main-content" v-loading="loading">
      <div class="filter-container" :height="headerHeight">
        <a v-on:click="collapseExpand" class="right-btn collapse-btn"><i :class="{'enc-icon-zhankai':collapse,'enc-icon-shousuo':!collapse}"></i></a>
        <formFliter v-if="queryParamReady" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @formFilter="changeFormFilter" />
      </div>
        <el-table :data="mainTableData" stripe :height="tableHeight" border style="width: 100%; margin-top:20px;" tooltip-effect="light">
          <el-table-column label="接入源名称" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href="javascript:void(0)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="接入源ID" width="180">
          </el-table-column>
          <el-table-column prop="dataSourceName" label="接入源类型">
          </el-table-column>
          <el-table-column label="对接平台">
            <template slot-scope="scope">
              {{getPlatfrom(scope.row.platform)}}
            </template>
          </el-table-column>
          <el-table-column label="接入数据来源">
            <template slot-scope="scope">
              {{getNetwork(scope.row.network)}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="注册时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <el-tooltip class="item" effect="light" content="恢复" placement="top">
                  <i @click="recordRecover(scope.$index, scope.row)" class="enc-icon-huifu table-action-btn"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="top">
                  <i @click="recordDelete(scope.$index, scope.row)" class="enc-icon-shanchu"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      <el-footer>
        <div class="enc-pagination">
          <el-pagination v-if="queryParamReady" v-show="pageShow" style="float:right; margin:10px;" @current-change="goPage" background :page-size="pageSize" :total="mainTableDataTotal" layout="prev, pager, next, jumper" :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import formFliter from './../../components/formFliter2'

export default {
  name: 'DashboardAdmin',
  data() {
    return {
      loading: false,
      queryParamReady: false,
      collapse: true,
      mainTableData: [],
      currentPage: 1,
      mainTableDataTotal: 1,
      pageSize: 20,
      pageShow: true,
      formFilterData: []
    }
  },
  components: {
    formFliter
  },
  computed: {
    tableParams: function() {
      return this.$store.state.queryParams.recyclingBins
    },
    tableHeight: function() {
      return this.collapse ? window.innerHeight - 226-63 : window.innerHeight - 305-63;
    },
    headerHeight: function() {
    }
  },
  watch: {
    tableParams(newVal, oldVal) {
      if (this.queryParamReady) {
         this.loadTable(this.$store.state.deptId);
      }
    }
  },
  created() {
    this.$root.eventHub.$on('search', (keyword) => {
      this.search(keyword);
    });
  },
  mounted() {
    this.$root.eventHub.$emit(
      "selTreeNode",
      this.$store.state.queryParams[this.$route.name].deptId
    );
    this.$root.eventHub.$emit("setActiveNav", 1);
    
    //this.setCount();
    //从create移过来
    this.$root.eventHub.$on("selDept", ids => {
      this.setStore({
        deptId: ids
      });
    });
    this.storeReady();
  },
  methods: {
    setFliter(data) {
      var queryParams = this.$store.state.queryParams[this.$route.name];
      var network = queryParams.network ? queryParams.network : [];
      var dataSourceName = queryParams.dataSourceName ? queryParams.dataSourceName : [];
      var platform = queryParams.platform ? queryParams.platform : [];
      this.formFilterData = [{
        name: "接入源类型：",
        id: 'dataSourceName',
        type: 'checkbox',
        checkData: data.dataSourceName.data,
        seledData: dataSourceName
      }, {
        name: "接入数据来源：",
        id: 'network',
        type: 'checkbox',
        checkData: data.network.data,
        seledData: network
      }, {
        name: "对接平台：",
        id: 'platform',
        type: 'checkbox',
        checkData: data.platform.data,
        seledData: platform
      }];
      this.queryParamReady = true;
    },
    collapseExpand: function() {
      this.collapse = !this.collapse;
    },
    loadTable: function(id) {
      var ids=[];
     id?ids=id:ids=this.tableParams.deptId;
      var _self = this;
      _self.loading = true;
      _self.pageSize = this.$store.state.pageSize;
      var paramsObj = {
        pageSize: _self.pageSize,
        pageNum: this.tableParams.pageNum,
        domain: 1
      };
      paramsObj.condition = this.tableParams.condition ? this.tableParams.condition : "";
      paramsObj.network = this.tableParams.network;
      paramsObj.dataSourceName = this.tableParams.dataSourceName;
      paramsObj.platform = this.tableParams.platform;
      paramsObj.deptIds = ids;
      this.$ajax.post(window.ENV.API_DACM + '/caccess/query', paramsObj).then(function(res) {
          if (res.data.success) {
            _self.mainTableData = res.data.data.list;
            _self.mainTableDataTotal = res.data.data.total;
            _self.currentPage = _self.tableParams.pageNum;
            _self.pageShow = true;
          } else {
            _self.mainTableData = [];
            _self.pageShow = false;
            _self.$alert('字段废止数据源列表失败', '提示', {
              confirmButtonText: '确定'
            });
          }
          _self.loading = false;
        })
        .catch(function(err) {
          _self.mainTableData = [];
          _self.pageShow = false;
          _self.loading = false;
          _self.$alert('字段废止数据源列表失败', '提示', {
            confirmButtonText: '确定'
          });
        });
    },
    recordRecover: function(index, row) {
      this.$confirm('确认要恢复' + row.name + '吗?', '提示', {
        confirmButtonText: '恢复',
        cancelButtonText: '取消',
        cancelButtonClass: "el-button--primary",
        type: 'warning'
      }).then(() => {
        var _self = this;
        _self.loading = true;
        this.$ajax.get(window.ENV.API_DACM + '/caccess/restore', {
            params: {
              id: row.id
            }
          }).then(function(res) {
            if (res.data.success) {
              _self.loadTable(_self.$store.state.deptId);
            } else {
              _self.$alert('恢复失败', '提示', {
                confirmButtonText: '确定'
              });
            }
            _self.loading = false;
          })
          .catch(function(err) {
            _self.currentPage = _self.tableParams.pageNum;
            _self.loading = false;
            _self.$alert('恢复失败', '提示', {
              confirmButtonText: '确定'
            });
          });
      });
    },
    recordDelete: function(index, row) {
      this.$confirm('确认要删除' + row.name + '吗?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        cancelButtonClass: "el-button--primary",
        type: 'warning'
      }).then(() => {
        var _self = this;
        _self.loading = true;
        this.$ajax.get(window.ENV.API_DACM + '/caccess/remove', {
            params: {
              id: row.id
            }
          }).then(function(res) {
            if (res.data.success) {
              _self.loadTable(_self.$store.state.deptId);
            } else {
              _self.$alert('删除失败', '提示', {
                confirmButtonText: '确定'
              });
            }
            _self.loading = false;
          })
          .catch(function(err) {
            _self.currentPage = _self.tableParams.pageNum;
            _self.loading = false;
            _self.$alert('删除失败', '提示', {
              confirmButtonText: '确定'
            });
          });
      });
    },
    setStore: function(obj) {
      let storeData = JSON.parse(JSON.stringify(this.$store.state.queryParams[this.$route.name]));
      for (var i in obj) {
        storeData[i] = obj[i];
      }
      this.$store.commit('setQueryParams', {
        name: this.$route.name,
        data: storeData
      });
    },
    goPage: function(val) {
      this.setStore({
        pageNum: val
      });
    },
    search: function(keyword) {
      this.setStore({
        pageNum: 1,
        keyword: keyword
      });
    },
    changeFormFilter: function(fliterParams) {
      fliterParams.pageNum = 1;
      this.setStore(fliterParams);
    },
    storeReady: function() {
      var fliterItemList = this.$store.state.fliterItemList
      if (fliterItemList.network.ready && fliterItemList.dataSourceName.ready && fliterItemList.platform.ready && this.$store.state.pageReady) {
        this.setFliter(fliterItemList);
        this.loadTable(this.$store.state.deptId);
      } else {
        var _self = this;
        setTimeout(function() {
          _self.storeReady();
        }, 200);
      }
    },
    getPlatfrom(id) {
      if (!id) {
        return '无';
      }
      var list = this.$store.state.fliterItemList.platform.data;
      for (var value of list) {
        if (parseInt(id) == value.id) {
          return value.name
        }
      }
      return '未找到相应对接平台'
    },
    getNetwork(id) {
      if (!id) {
        return "无";
      }
      var list = this.$store.state.fliterItemList.network.data;
      for (var value of list) {
        if (parseInt(id) == parseInt(value.id)) {
          return value.name;
        }
      }
      return "未知类型";
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  background-color: #fff;
  .filter-container {
    .right-btn {
      float: right;
    }
    .collapse-btn {
      font-size: 30px;
      i {
        font-size: 26px;
      }
    }
  }
  .enc-pagination {
    float: right;
  }
  .cell i {
    cursor: pointer;
    font-size: 18px;
  }
}
.table-action-btn {
  margin-right:10px;
}

</style>
