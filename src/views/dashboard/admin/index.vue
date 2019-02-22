<template>
  <div class="dashboard-container">
    <div>
      <el-breadcrumb separator>
        <el-breadcrumb-item>数据接入</el-breadcrumb-item>
      </el-breadcrumb>
      <form-fliter v-if="queryParamReady" @highMore="moreHeight" @highSeaech="hightrue" v-bind:formCollapse="collapse" v-bind:deleteData="deleteData" v-bind:dataObj="formFilterData" v-bind:key_word="key_word" @doSearch="search" @formFilter="changeFormFilter" />
    </div>
    <div
      id="enc-breadcrumb"
      class="el-breadcrumb"
      style="display: flex;justify-content: flex-end; flex-wrap: wrap;"
      v-if="key_word!='' || majorData.length>0"
    >
      <div v-show="key_word!=''">
        <span class="lookstyle">
          {{key_word}}
          <i class="enc-icon-guanbi" @click="deleteKeyWord"></i>
        </span>
      </div>
      <div v-for="(item, index) in majorData" :key="index">
        <span class="lookstyle">
          {{item.name}}
          <i class="enc-icon-guanbi" @click="delSelect(item.index2,item.index1)"></i>
        </span>
      </div>
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
          <dataCount v-bind:dataObj="count2Data" class="countData"/>
          <div class="regbtn">
            <el-tooltip class="item" effect="light" content="注册" placement="top">
              <el-button icon="enc-icon-zhuce icon-title" @click="regDialogVisible" type="primary">注册</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <el-table v-loading="loading" :data="mainTableData" :height="tableHeight" stripe style="width: 100%;" tooltip-effect="light">
        <el-table-column label="接入源名称" width="250" show-overflow-tooltip>
          <template slot-scope="scope">
            <a class="underdone" href="javascript:void(0)" v-on:click="goSubPage(scope.$index,scope.row.dataSourceName)">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="接入源ID" min-width="180"></el-table-column>
        <el-table-column prop="dataSourceName" label="接入源类型" min-width="140"></el-table-column>
        <el-table-column label="对接平台" min-width="140">
          <template slot-scope="scope">{{getPlatfrom(scope.row.platform)}}</template>
        </el-table-column>
        <el-table-column label="接入数据来源" min-width="140">
          <template slot-scope="scope">{{getNetwork(scope.row.network)}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" min-width="160"></el-table-column>
        <el-table-column label="操作" min-width="160">
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
    <!--注册-->
    <reg-dialog v-if="dialogVisible" ref="addOrUpdate" @refreshTable="loadTable"  @storeReady="storeReady"  @refreshCount="countTotal++"></reg-dialog>

    <div class="enc-pagination">
      <el-pagination v-if="queryParamReady" style="float:right; margin:10px;" @current-change="goPage" background :page-size.sync="pageSize" :total="mainTableDataTotal" layout="prev, pager, next, jumper" :current-page.sync="currentPage"></el-pagination>
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
      formFilterData: [{
          name: "接入源类型：",
          id: "dataSourceName",
          type: "checkbox",
          checkData: [],
          seledData: [],
          limit: 4
        },
        {
          name: "接入数据来源：",
          id: "network",
          type: "checkbox",
          checkData: [],
          seledData: [],
          limit: 4
        },
        {
          name: "对接平台：",
          id: "platform",
          type: "checkbox",
          checkData: [],
          seledData: [],
          limit: 4
        }],
      pageSize: 20,
      key_word: "",
      deleteData: {},
      dialogVisible: false,
    };
  },
  computed: {
    tableParams: function() {
      return this.$store.state.queryParams.dashboard;
    },
    tableHeight: function() {
      if (window.innerHeight > 768) {
        return window.innerHeight - 345;
      } 
      return 360;
    },
    majorData() {
      this.key_word = this.$store.state.majorData.keyword;
      let majorSelectData = [];
      this.$store.state.majorData.dataObj.forEach((v1, index1) => {
        let data = this.$store.state.majorData.formSeledShow[v1.id];
        data.forEach((v2, index2) => {
          let map = {
            id: v2.id,
            name: v2.name,
            index1: index1,
            index2: index2
          };
          majorSelectData.push(map);
        });
      });
      return majorSelectData;
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
    }
  },
  created() {
    //this.storeReady();
  },
  mounted() {
    this.$root.eventHub.$emit(
      "selTreeNode",
      this.$store.state.queryParams[this.$route.name].deptId
    );
    this.tableParams.condition = '';
    this.tableParams.dataRange = [];
    this.tableParams.dataSourceName = [];
    this.tableParams.network = [];
    this.tableParams.objectType =[];
    this.tableParams.platform = [];
    this.$root.eventHub.$emit("setActiveNav", 1);
    this.storeReady();
    this.setCount(this.$store.state.deptId);
    //从create移过来
    this.$root.eventHub.$on("selDept", ids => {
      this.setStore({
        deptId: ids
      });
      this.tableParams.pageNum = 1;
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
    setCount(id) {
      //此处vuex获取的值，比$root慢
      var ids = [];
      id ? (ids = id) : (ids = this.tableParams.deptId);
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
        .post(window.ENV.API_DACM + dataAccessStatistics, paramsObj)
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
      console.log("this.$store.state.fliterItemList===",this.$store.state.fliterItemList);
      this.formFilterData[0].checkData = this.$store.state.fliterItemList.dataSourceName.data;
      this.formFilterData[0].seledData = dataSourceName;
      this.formFilterData[1].checkData = this.$store.state.fliterItemList.network.data;
      this.formFilterData[1].seledData = network;
      this.formFilterData[2].checkData = this.$store.state.fliterItemList.platform.data;
      this.formFilterData[2].seledData = platform;
      this.queryParamReady = true;
    },
    collapseExpand: function() {
      this.collapse = !this.collapse;
    },
    //将相关的接口进行并发处理, 表格列表中的数据依赖network 和ButtPlatForm
    getAllRalationApi(paramsObj) {
      let api1 = this.$ajax.get(window.ENV.API_DACM + sysdialect, {
        params: { type: 0 }
      }); //部门
      let api2 = this.$ajax.get(
        window.ENV.API_DACM + "/commonInter/getListStaticDataOrder", { params: { dictCode: "NetWork" } }
      );
      let api3 = this.$ajax.get(
        window.ENV.API_DACM + "/commonInter/getListStaticDataOrder", { params: { dictCode: "ButtPlatForm" } }
      );
      this.$ajax.all([api1, api2, api3]).then(res => {
        res.forEach((val, index) => {
          if (index == 0 && val.data.success) {
            this.$store.commit("setFilterItmeList", {
              name: "dataSourceName",
              data: val.data.data
            });
          } else if (index == 1 && val.data && val.data.length > 0) {
            let list = [];
            for (var value of val.data) {
              list.push({
                id: value.sTATIC_CODE,
                name: value.sTATIC_NAME
              });
            }
            this.$store.commit("setFilterItmeList", {
              name: "network",
              data: list
            });
            this.formFilterData[1].checkData = list;
          } else if (index == 2 && val.data && val.data.length > 0) {
            let list = [];
            for (var value of val.data) {
              list.push({
                id: value.sTATIC_CODE,
                name: value.sTATIC_NAME
              });
            }
            this.$store.commit("setFilterItmeList", {
              name: "platform",
              data: list
            });
            this.formFilterData[2].checkData = list;
          }
        });
        var fliterItemList = this.$store.state.fliterItemList;
        this.setFliter(fliterItemList);
        this.getDataList(paramsObj);
      });
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
            _self.formFilterData[0].checkData = list;
          }
        })
        .catch(function(err) {});

      var objNets = JSON.parse(localStorage.getItem("NetWork"));
      objNets = null;
      if (objNets == null) {
        this.$ajax
          .get(window.ENV.API_DACM + "/commonInter/getListStaticDataOrder", {
            params: {
              dictCode: "NetWork"
            }
          })
          .then(function(res) {
            if (res.data.success) {
              var list = [];
              if (res.data != undefined) {
                let objNet = JSON.stringify(res.data);
                window.localStorage.setItem("NetWork", objNet);
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
                _self.formFilterData[1].checkData = list;
              }
            }
          })
          .catch(function(err) {});
        this.$ajax
          .get(window.ENV.API_DACM + "/commonInter/getListStaticDataOrder", {
            params: {
              dictCode: "ButtPlatForm"
            }
          })
          .then(function(res) {
            if (res.data.success) {
              var list = [];
              let objNet = JSON.stringify(res.data);
              window.localStorage.setItem("ButtPlatForm", objNet);
              for (var value of res.data) {
                list.push({
                  id: value.sTATIC_CODE,
                  name: value.sTATIC_NAME
                });
              }
              _self.$store.commit("setFilterItmeList", {
                name: "platform",
                data: list
              });
              _self.formFilterData[2].checkData = list;
            }
          })
          .catch(function(err) {});
      } else {
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
    loadTable: function(id) {
      //此处vuex获取的值，比$root慢
      var ids = [];
      id ? (ids = id) : (ids = this.tableParams.deptId);
      var _self = this;
      _self.loading = true;
      this.pageSize = Number(this.$store.state.pageSize);
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
      //_self.updataFliterItemList();
      _self.getAllRalationApi(paramsObj);

    },
    // 列表数据接口
    getDataList(paramsObj) {
      var _self = this;
      _self.$ajax
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
            _self.loadTable(_self.$store.state.deptId);
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
      this.loadTable(this.$store.state.deptId);

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
    },
    delSelect(id, index) {
      this.deleteData = {
        id,
        index
      };
    },
    deleteKeyWord() {
      this.key_word = "";
      let map = {
        dataObj: this.$store.state.majorData.dataObj,
        formSeledShow: this.$store.state.majorData.formSeledShow,
        keyword: ""
      };
      this.$store.commit("setMajorData", map);
    },
    regDialogVisible() {
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.$refs.addOrUpdate.openRegVisible();
      })
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
    .count-container {
        display: flex;
        margin-bottom: 20px;
      .count-title {
        display: inline-block;
        width: 20%;
        text-align: center;
        margin-top: 10px;
        label {
          display: inline-block;
          margin-bottom: 10px;
          color: #999;
          font-size: 14px;
        }

        .all-number {
          font-size: 24px;
          font-weight: bold;
        }
      }

      .countData {
        display: inline-block;
        margin: 10px 4%;
        width: 25%;
      }

      .line {
        display: inline-block;
        height: 30px;
        width: 2px;
        background-color: #999;
        border-radius: 2px;
        margin-top: 2%;
      }
      .regbtn {
        width: 10%;
        text-align: center;
        margin-top: 2%;
      }
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
    font-size: 20px;
    margin: 0 5px;
  }

  .cell i {
    cursor: pointer;
  }
}

.lofile {
  width: 80px;
  text-align: left;
  margin: 0 auto;
}

.underdone,
.underdone:focus,
.underdone:hover {
  text-decoration: underline;
}

.lookstyle {
  font-weight: normal;
  padding-right: 20px;
}

</style>
<style>
.lofile i {
  font-size: 20px;
}

</style>
