<template>
<div>
    <el-container style="height:100%;" class="dashboard-container" v-loading="loading">
        <div class="filter-container">

            <div class="regbtn fr">
                <reg-dialog @refreshTable="loadTable"></reg-dialog>
            </div>
            <!-- <el-tooltip class="item" effect="light" content="收起/展开" placement="top">		<a v-on:click="collapseExpand" class="right-btn collapse-btn">		<i :class="{'el-icon-circle-plus':collapse,'el-icon-remove':!collapse}"></i>		</a>		</el-tooltip> -->
            <formFliter v-if="queryParamReady"    @highMore="moreHeight"    @highSeaech="hightrue" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @doSearch="search" @formFilter="changeFormFilter" />

            <div class="count-container">
                <div class="count-title">
                    <label>数据元注册总数</label>
                    <div class="all-number">{{countTotal}}</div>
                </div>
                <div class="line"></div>
                <dataCount v-bind:dataObj="count1Data" class="countData" />
                <div class="line"></div>
                <dataCount v-bind:dataObj="count2Data" class="countData" />
            </div>
        </div>
        <el-main style="padding-bottom:0;">
            <router-view />
            <el-table :data="mainTableData" stripe :height="tableHeight" border style="width: 100%" tooltip-effect="light">
                <el-table-column label="接入源名称" width="250" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" v-on:click="goSubPage(scope.$index,scope.row.dataSourceName)">{{ scope.row.name }}</a>
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
                        <div class="lofile">
                            <edit-dialog :acId="scope.row.id" @refreshTable="loadTable"></edit-dialog>

                            <el-tooltip class="item" effect="light" content="复制" placement="top" v-if="scope.row.dataSourceName!='本地文件'">
                                <i @click="handleCopy(scope.$index, scope.row)" class="enc-icon-fuzhi table-action-btn"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="light" content="废止" placement="top">
                                <i @click="handleDelete(scope.$index, scope.row)" class="enc-icon-feizhi table-action-btn"></i>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <div class="enc-pagination">
                <el-pagination v-if="queryParamReady" style="float:right; margin:10px;" @current-change="goPage" background :page-size.sync="pageSize" :total="mainTableDataTotal" layout="prev, pager, next, jumper" :current-page.sync="currentPage">
                </el-pagination>
            </div>
        </el-footer>
    </el-container>
    <router-view />
</div>
</template>

<script>
import { mapState } from "vuex";
import dataCount from "./../../../components/dataCountNew";
import formFliter from "./../../../components/formFliter";

import regDialog from "./../dialog/admin/reg_dialog";
import editDialog from "./../dialog/admin/edit_dialog";

export default {
  name: "DashboardAdmin",
  data() {
    return {
      loading: false,
      queryParamReady: true,
      currentPage: 1,
      mainTableData: [],
      mainTableDataTotal: 1,
      countTotal: "",
      keyword: "",
      moreData: 0,
      // highSeaech:true,
      myDialogRouter: "adminAdd",
      dialogTitle: "新增",
      collapse: true,
      count1Data: {
        name: "批式接入统计",
        total: "",
        list: []
      },
      count2Data: {
        name: "实时统计",
        total: "",
        list: []
      },
      formFilterData: [],
      pageSize: "20"
    };
  },
  computed: {
    tableParams: function() {
      return this.$store.state.queryParams.dashboard;
    },

    tableHeight: function() {
      return this.collapse
        ? window.innerHeight - 430
        : window.innerHeight - 540 - 40 * this.moreData;
      // console.log(this.collapse)
    },
    headerHeight: function() {
      // return this.collapse ? "160px" : "230px";
    }
  },
  components: {
    dataCount,
    formFliter,
    regDialog,
    editDialog
  },
  watch: {
    tableParams(newVal, oldVal) {
      if (
        this.queryParamReady &&
        JSON.stringify(newVal) != JSON.stringify(oldVal) &&
        newVal.timeFlag != 0
      ) {
        // this.loadTable();
      }
    }
  },
  created() {
    // this.$root.eventHub.$on("search", keyword => {
    //   this.search(keyword);
    // });
    this.storeReady();
    this.$root.eventHub.$on("selDept", ids => {
      this.setStore({
        deptId: ids
      });
      this.setCount();
      this.loadTable();
    });
  },
  mounted() {
    this.$root.eventHub.$emit(
      "selTreeNode",
      this.$store.state.queryParams[this.$route.name].deptId
    );
    this.$root.eventHub.$emit("setActiveNav", 1);
    this.storeReady();
    this.setCount();
  },
  methods: {
    moreHeight(data) {
      this.moreData = data;
    },

    hightrue: function(a) {
      this.collapse = a;
      // console.log(a);
    },
    setCount() {
      var _self = this;
      // this.$ajax.post('http://10.19.160.29:8080/DACM/caccess/dataAccessStatistics',this.tableParams.deptId
      this.$ajax
        .post(
          window.ENV.API_DACM + "/caccess/dataAccessStatistics",
          this.tableParams.deptId
        )
        .then(function(res) {
          if (res.data.success) {
            if (!res.data.data.data) {
              _self.countTotal = res.data.data.total;
              _self.count1Data.total = res.data.data.dPercentage;
              _self.count1Data.list = res.data.data.discontinuousPercentage;
              _self.count2Data.total = res.data.data.cPercentage;
              _self.count2Data.list = res.data.data.constantlyPercentage;
            } else {
              _self.countTotal = 0;
              _self.count1Data.total = "未查询到数据";
              _self.count1Data.list = [];
              _self.count2Data.total = "未查询到数据";
              _self.count2Data.list = [];
            }
            _self.countReady = true;
          } else {
            // console.log(res.data.code);
            _self.$alert("加载统计数据失败", "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(function(err) {
          console.log(err);
          _self.$alert("加载统计数据失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    setFliter(data) {
                // debugger;

      var queryParams = this.$store.state.queryParams[this.$route.name];

      var dataSourceName = queryParams.dataSourceName
        ? queryParams.dataSourceName
        : [];
      var network = queryParams.network ? queryParams.network : [];
      var platform = queryParams.platform ? queryParams.platform : [];
      network == true ? [] : network;
      platform == true ? [] : platform;
      dataSourceName == true ? [] : dataSourceName;
// console.log(network)
// console.log(platform)
// console.log(dataSourceName)

      //   let radioData = data.network.data;
      //             if(data.network.data[data.network.data.length-1].name!="取消"){
      // radioData[data.network.data.length] = {
      //                 id: "",
      //                 name: "取消"
      //             };
      //             }

      this.formFilterData = [
        {
          name: "接入源类型：",
          id: "dataSourceName",
          type: "checkbox",
          checkData: data.dataSourceName.data,
          seledData: dataSourceName,
          limit: 4
        },
        {
          name: "接入数据来源：",
          id: "network",
          type: "checkbox",
          checkData: data.network.data,
          seledData: network,
          limit: 4
        },
        {
          name: "对接平台：",
          id: "platform",
          type: "checkbox",
          checkData: data.platform.data,
          seledData: platform,
          limit: 4
        }
      ];
      this.queryParamReady = true;
      console.log(this.formFilterData);
    },
    collapseExpand: function() {
      this.collapse = !this.collapse;
    },
    loadTable: function() {
      var _self = this;
      _self.loading = true;
      this.pageSize = this.$store.state.pageSize;
      var paramsObj = {
        pageSize: this.$store.state.pageSize,
        pageNum: this.tableParams.pageNum,
        domain: "0",
        _: new Date().getTime()
      };
      paramsObj.condition = this.tableParams.condition
        ? this.tableParams.condition
        : "";
      paramsObj.network = this.tableParams.network
        ? this.tableParams.network
        : [];
      paramsObj.dataSourceName = this.tableParams.dataSourceName
        ? this.tableParams.dataSourceName
        : [];
      paramsObj.platform = this.tableParams.platform
        ? this.tableParams.platform
        : [];
      paramsObj.deptIds = this.tableParams.deptId;

      this.$ajax
        .post(window.ENV.API_DACM + "/caccess/query", paramsObj)
        .then(function(res) {
          console.log("tableLoaded:dashboard");
          if (res.data.code == "0000") {
            _self.mainTableData = res.data.data.list;
            _self.mainTableDataTotal = res.data.data.total;
            _self.currentPage = _self.tableParams.pageNum;
          } else if (res.data.code == "5000") {
            _self.mainTableData = [];
            _self.mainTableDataTotal = 1;
            _self.currentPage = 1;
          } else {
            _self.$alert("加载数据源数据失败", "提示", {
              confirmButtonText: "确定"
            });
          }
          _self.loading = false;
        })
        .catch(function(err) {
          _self.currentPage = _self.tableParams.pageNum;
          _self.loading = false;
          console.log(err);
          _self.$alert("加载数据源数据失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    setStore: function(obj) {
      let storeData = JSON.parse(
        JSON.stringify(this.$store.state.queryParams[this.$route.name])
      );
      for (var i in obj) {
        storeData[i] = obj[i];
      }
      this.$store.commit("setQueryParams", {
        name: this.$route.name,
        data: storeData
      });
    },
    goPage: function(val) {
      this.setStore({
        pageNum: val
      });
      this.loadTable();
    },
    goSubPage: function(index, type) {
      this.$store.commit("setJrtype", type);
      this.$store.commit("resetQueryParam", {
        resetData: "accessObjManage"
      });
      var dataSourceName =
        this.mainTableData[index].dataSourceName == "本地文件"
          ? "file"
          : this.mainTableData[index].dataSourceName;
      this.$router.push({
        name: "accessObjManage",
        params: {
          sourceId: this.mainTableData[index].id,
          sourceName: encodeURI(this.mainTableData[index].name),
          type: dataSourceName
        }
      });
    },
    handleCopy: function(index, row) {
      this.$confirm("确认要复制" + row.name + "吗?", "提示", {
        confirmButtonText: "复制",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var _self = this;
        this.$ajax
          .get(window.ENV.API_DACM + "/update/dataSourceCopy", {
            params: {
              id: row.id
            }
          })
          .then(function(res) {
            _self.setStore({
              pageNum: 1,
              timeFlag: new Date().getTime()
            });
            _self.loadTable();
          })
          .catch(function(err) {
            console.log(err);
            _self.$alert("复制失败", "提示", {
              confirmButtonText: "确定"
            });
          });
      });
    },
    handleDelete: function(index, row) {
      this.$confirm("确认要废止" + row.name + "吗?", "提示", {
        confirmButtonText: "废止",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var _self = this;
        this.$ajax
          .post(window.ENV.API_DACM + "/caccess/delete?ids=" + row.id)
          .then(function(res) {
            if (res.data.success == true) {
              _self.loadTable();
            } else {
              _self.$alert("有采集任务正在执行，不可废止", "提示", {
                confirmButtonText: "确定"
              });
            }
          })
          .catch(function(err) {
            console.log(err);
            _self.$alert("废止失败", "提示", {
              confirmButtonText: "确定"
            });
          });
      });
    },
    search: function(keyword) {
      this.setStore({
        pageNum: 1,
        condition: keyword,
        timeFlag: new Date().getTime()
      });
      this.loadTable();
    },
    changeFormFilter: function(fliterParams) {
      // console.log(fliterParams)
      this.setStore(fliterParams);
    },
    storeReady: function() {
        // debugger;
      var fliterItemList = this.$store.state.fliterItemList;
      if (
        fliterItemList.network.ready &&
        fliterItemList.dataSourceName.ready &&
        fliterItemList.platform.ready &&
        this.$store.state.pageReady
      ) {
        // console.log(fliterItemList);
        this.setFliter(fliterItemList);
        this.loadTable();
      } else {
        var _self = this;
        setTimeout(function() {
          _self.storeReady();
        }, 200);
      }
    },
    getPlatfrom(id) {
      if (!id) {
        return "无";
      }
      var list = this.$store.state.fliterItemList.platform.data;
      for (var value of list) {
        if (parseInt(id) == parseInt(value.id)) {
          return value.name;
        }
      }
      return "未知平台";
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
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  .filter-container {
    padding-top: 5px;
    background: #fff;

    .count-container {
      border-bottom: 1px solid #d9d9d9;
      margin: 0 20px 10px 20px;

      .count-title {
        display: inline-block;
        margin: 10px 5% 10px 40px;
        width: 8%;
        text-align: center;

        label {
          display: inline-block;
          margin-bottom: 10px;
          color: #999;
          font-size: 14px;
        }

        .all-number {
          color: #425365;
          font-size: 24px;
          font-weight: bold;
        }
      }

      .countData {
        display: inline-block;
        margin: 10px 5%;
        width: 25%;
      }

      .line {
        display: inline-block;
        margin: 32px 0 12px 0;
        height: 30px;
        width: 3px;
        background-color: #999;
        border-radius: 2px;
      }
    }

    form {
      padding-top: 0;
      // margin-right: 100px;
    }

    .el-form-item {
      margin-bottom: 2px;
    }

    .right-btn {
      float: right;
    }

    .collapse-btn {
      margin: 5px 20px 0 0;
      color: #069;
      font-size: 22px;
    }
  }

  .table-container {
    padding: 32px;
  }

  .enc-pagination {
    float: right;
  }

  .table-action-btn {
    display: inline-block;
    font-size: 16px;
    margin: 0 5px;
  }

  .cell i {
    cursor: pointer;
  }
}

.lofile {
  width: 70px;
  text-align: left;
  margin: 0 auto;
}
</style>
