<template>
  <div class="dashboard-container">
    <div>
      <el-breadcrumb separator="">
        <el-breadcrumb-item>
          数据接入
        </el-breadcrumb-item>
      </el-breadcrumb>
      <form-fliter v-if="queryParamReady" @highMore="moreHeight" @highSeaech="hightrue" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @doSearch="search" @formFilter="changeFormFilter" />
    </div>
    <div class="main main-content">
      <div class="filter-container">
        <div class="count-container">
          <div class="count-title">
            <label>数据源注册总数</label>
            <div class="all-number">{{countTotal}}</div>
          </div>
          <div class="line"></div>
          <dataCount v-bind:dataObj="count1Data" class="countData" />
          <div class="line"></div>
          <dataCount v-bind:dataObj="count2Data" class="countData" />
          <div class="regbtn fr">
            <reg-dialog @refreshTable="loadTable" @storeReady="storeReady" @refreshCount="countTotal++"></reg-dialog>
          </div>
        </div>
      </div>
      <el-table v-loading="loading" :data="mainTableData" :height="tableHeight" stripe border style="width: 100%;" tooltip-effect="light">
        <el-table-column label="接入源名称" width="250" show-overflow-tooltip>
          <template slot-scope="scope">
            <a class="underdone" href="javascript:void(0)" v-on:click="goSubPage(scope.$index,scope.row.dataSourceName)">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="接入源ID" min-width="180">
        </el-table-column>
        <el-table-column prop="dataSourceName" label="接入源类型" min-width="140">
        </el-table-column>
        <el-table-column label="对接平台" min-width="140">
          <template slot-scope="scope">
            {{getPlatfrom(scope.row.platform)}}
          </template>
        </el-table-column>
        <el-table-column label="接入数据来源" min-width="140">
          <template slot-scope="scope">
            {{getNetwork(scope.row.network)}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" min-width="160">
        </el-table-column>
        <el-table-column label="操作" min-width="140">
          <template slot-scope="scope">
            <div class="lofile">
              <edit-dialog :acId="scope.row.id" @refreshTable="loadTable" @storeReady="storeReady"></edit-dialog>
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
    </div>
    <div class="enc-pagination">
      <el-pagination v-if="queryParamReady" style="float:right; margin:10px;" @current-change="goPage" background :page-size.sync="pageSize" :total="mainTableDataTotal" layout="prev, pager, next, jumper" :current-page.sync="currentPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import dataCount from "./../../../components/dataCountNew";
import formFliter from "./../../../components/formFliter";

import regDialog from "./../dialog/admin/reg_dialog";
import editDialog from "./../dialog/admin/edit_dialog";
import {
  dataAccessStatistics,
  sysdialect,
  getListStaticDataOrder,
  query,
  dataSourceCopy,
  deleteId
} from "@/api/commonApi.js";

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
      myDialogRouter: "adminAdd",
      dialogTitle: "新增",
      collapse: true,
      count1Data: {
        name: "批式接入统计",
        total: "",
        list: []
      },
      count2Data: {
        name: "流式接入统计",
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
      /**  return this.collapse ?
         window.innerHeight - 375 :
         (window.innerHeight - 510 - 20 * this.moreData < 400 ? 300 : window.innerHeight - 510 - 20); */
      console.log("window.innerHeight", window.innerHeight)
      if (window.innerHeight > 768) {
        return window.innerHeight - 335;
      }
      return 410;
    }
  },
  components: {
    dataCount,
    formFliter,
    regDialog,
    editDialog
  },
  watch: {
    $route(to, form) {
      if (to.name == "dashboard") {
        this.setCount(this.$store.state.deptId);
        this.loadTable(this.$store.state.deptId);
      }
    },
  },
  created() {
    this.storeReady();
  },
  mounted() {
    this.$root.eventHub.$emit(
      "selTreeNode",
      this.$store.state.queryParams[this.$route.name].deptId
    );
    this.$root.eventHub.$emit("setActiveNav", 1);
    this.storeReady();
    this.setCount(this.$store.state.deptId);
    //从create移过来
    this.$root.eventHub.$on("selDept", ids => {
      this.setStore({
        deptId: ids
      });
      this.setCount(ids);
      this.loadTable(ids);
    });
  },
  methods: {
    moreHeight(data) {
      this.moreData = data;
    },

    hightrue: function(a) {
      this.collapse = a;
    },
    setCount(id) { //此处vuex获取的值，比$root慢
      var ids = [];
      id ? ids = id : ids = this.tableParams.deptId;
      var _self = this;
      _self.loading = true;
      var paramsObj = {
        domain: "0",
        _: new Date().getTime()
      };
      paramsObj.condition = this.tableParams.condition ?
        this.tableParams.condition :
        "";
      paramsObj.network = this.tableParams.network ?
        this.tableParams.network : [];
      paramsObj.dataSourceName = this.tableParams.dataSourceName ?
        this.tableParams.dataSourceName : [];
      paramsObj.platform = this.tableParams.platform ?
        this.tableParams.platform : [];
      paramsObj.deptIds = ids;

      var _self = this;
      this.$ajax
        .post(
          window.ENV.API_DACM + dataAccessStatistics,
          paramsObj
        )
        .then(function(res) {
          if (res.data.success) {

            if (res.data.data.discontinuousPercentage) {
              _self.count1Data.total = res.data.data.dPercentage;
              _self.count1Data.list = res.data.data.discontinuousPercentage;

            } else {
              _self.count1Data.total = "未查询到数据";
              _self.count1Data.list = [];
            }
            if (res.data.data.constantlyPercentage) {
              _self.count2Data.total = res.data.data.cPercentage;
              _self.count2Data.list = res.data.data.constantlyPercentage;
            } else {
              _self.count2Data.total = "未查询到数据";
              _self.count2Data.list = [];
            }
            _self.countReady = true;
          } else {
            _self.$alert("加载统计数据失败", "提示", {
              confirmButtonText: "确定"
            });
          }
        })
        .catch(function(err) {
          _self.$alert("加载统计数据失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    setFliter(data) {

      var queryParams = this.$store.state.queryParams[this.$route.name];

      var dataSourceName = queryParams.dataSourceName ?
        queryParams.dataSourceName : [];
      var network = queryParams.network ? queryParams.network : [];
      var platform = queryParams.platform ? queryParams.platform : [];
      network == true ? [] : network;
      platform == true ? [] : platform;
      dataSourceName == true ? [] : dataSourceName;
      this.formFilterData = [{
          name: "接入源类型：",
          id: "dataSourceName",
          type: "checkbox",
          checkData: this.$store.state.fliterItemList.dataSourceName.data,
          seledData: dataSourceName,
          limit: 4
        },
        {
          name: "接入数据来源：",
          id: "network",
          type: "checkbox",
          checkData: this.$store.state.fliterItemList.network.data,
          seledData: network,
          limit: 4
        },
        {
          name: "对接平台：",
          id: "platform",
          type: "checkbox",
          checkData: this.$store.state.fliterItemList.platform.data,
          seledData: platform,
          limit: 4
        },

      ];
      this.queryParamReady = true;
    },
    collapseExpand: function() {
      this.collapse = !this.collapse;
    },
    updataFliterItemList() {
      var _self = this;
      this.$ajax
        .get(window.ENV.API_DACM + sysdialect, {
          params: {
            type: 0
          }
        })
        .then(function(res) {
          if (res.data.success) {
            _self.$store.commit("setFilterItmeList", {
              name: "dataSourceName",
              data: res.data.data
            });
            _self.formFilterData[0].checkData = list
          }
        })
        .catch(function(err) {
          console.log(err);
        });

      var objNets = JSON.parse(localStorage.getItem("NetWork"));
      console.log(objNets);
      objNets = null;
      if (objNets == null) {
        this.$ajax
          .get(window.ENV.API_DACM + "/commonInter/getListStaticDataOrder", {
            params: {
              dictCode: "NetWork"
            }
          })
          .then(function(res) {
            //  console.log(res)
            if (res.data.success == false) {

            } else {
              var list = [];
              if (res.data != undefined) {
                let objNet = JSON.stringify(res.data);
                window.localStorage.setItem('NetWork', objNet);
                for (var value of res.data) {
                  list.push({
                    id: value.sTATIC_CODE,
                    name: value.sTATIC_NAME
                  });
                }
                _self.$store.commit("setFilterItmeList", {
                  name: "network",
                  data: list
                });
                _self.formFilterData[1].checkData = list
              }
              console.log(list);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
        this.$ajax
          .get(window.ENV.API_DACM + "/commonInter/getListStaticDataOrder", {
            params: {
              dictCode: "ButtPlatForm"
            }
          })
          .then(function(res) {
            //  console.log(res)
            if (res.data.success == false) {

            } else {
              var list = [];
              let objNet = JSON.stringify(res.data);
              window.localStorage.setItem('ButtPlatForm', objNet);
              for (var value of res.data) {
                list.push({
                  id: value.sTATIC_CODE,
                  name: value.sTATIC_NAME
                });
              }
              // console.log(list)

              _self.$store.commit("setFilterItmeList", {
                name: "platform",
                data: list
              });
              _self.formFilterData[2].checkData = list
              console.log(_self.formFilterData);
              console.log(res.data);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      } else {
        console.log(objNets);
        let netList = [];
        for (var value of objNets) {
          netList.push({
            id: value.sTATIC_CODE,
            name: value.sTATIC_NAME
          });
        }
        _self.$store.commit("setFilterItmeList", {
          name: "network",
          data: netList
        });
        _self.formFilterData[1].checkData = netList;
        let objBut = JSON.parse(localStorage.getItem("ButtPlatForm"));
        let butList = [];
        for (var value of objBut) {
          butList.push({
            id: value.sTATIC_CODE,
            name: value.sTATIC_NAME
          });
        }
        _self.$store.commit("setFilterItmeList", {
          name: "platform",
          data: butList
        });
        _self.formFilterData[2].checkData = butList;
      }

    },
    loadTable: function(id) { //此处vuex获取的值，比$root慢
      var ids = [];
      id ? ids = id : ids = this.tableParams.deptId;
      var _self = this;
      _self.loading = true;
      this.pageSize = this.$store.state.pageSize;
      var paramsObj = {
        pageSize: this.$store.state.pageSize,
        pageNum: this.tableParams.pageNum,
        domain: "0",
        _: new Date().getTime()
      };
      paramsObj.condition = this.tableParams.condition ?
        this.tableParams.condition :
        "";
      paramsObj.network = this.tableParams.network ?
        this.tableParams.network : [];
      paramsObj.dataSourceName = this.tableParams.dataSourceName ?
        this.tableParams.dataSourceName : [];
      paramsObj.platform = this.tableParams.platform ?
        this.tableParams.platform : [];
      paramsObj.deptIds = ids;
      _self.updataFliterItemList();
      this.$ajax
        .post(window.ENV.API_DACM + query, paramsObj)
        .then(function(res) {
          _self.loading = false;
          if (res.data.code == "0000") {
            _self.mainTableData = res.data.data.list;
            _self.mainTableDataTotal = res.data.data.total;
            _self.currentPage = _self.tableParams.pageNum;
            _self.countTotal = res.data.data.total;
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
        this.mainTableData[index].dataSourceName == "本地文件" ?
        "file" :
        this.mainTableData[index].dataSourceName;
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
        cancelButtonClass: "el-button--primary",
        type: "warning"
      }).then(() => {
        var _self = this;
        this.$ajax
          .get(window.ENV.API_DACM + dataSourceCopy, {
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
            _self.countTotal++;

          })
          .catch(function(err) {
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
        cancelButtonClass: "el-button--primary",
        type: "warning"
      }).then(() => {
        var _self = this;
        this.$ajax
          .post(window.ENV.API_DACM + deleteId + row.id)
          .then(function(res) {
            if (res.data.code == "0000" && res.data.data.success == true) {
              _self.loadTable();
              _self.countTotal--;
            } else if (res.data.code == "0000") {
              _self.$alert(res.data.data.message, "提示", {
                confirmButtonText: "确定"
              });
            } else {
              _self.$alert("废止失败", "提示", {
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
      this.setCount();
    },
    changeFormFilter: function(fliterParams) {
      this.setStore(fliterParams);
    },
    storeReady: function() {
      var fliterItemList = this.$store.state.fliterItemList;
      if (
        fliterItemList.network.ready &&
        fliterItemList.dataSourceName.ready &&
        fliterItemList.platform.ready &&
        this.$store.state.pageReady
      ) {
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
  display: flex;
  flex-direction: column;
  height: 100%;
  .main {
    flex: 1;
    overflow: hidden;
  }
  .filter-container {
    padding: 0 20px 0 20px;
    margin: 20px auto;

    .count-container {
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
          /* color: #425365; */
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
        width: 2px;
        background-color: #999;
        border-radius: 2px;
      }
      .regbtn {
        margin-top: 25px;
        padding-right: 20px;
      }
    }

    form {
      padding-top: 0; // margin-right: 100px;
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
  i {
    font-size: 21px;
  }
}

.underdone,
.underdone:focus,
.underdone:hover {
  text-decoration: underline;
}

</style>
