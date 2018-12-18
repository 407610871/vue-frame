<template>
<div>
    <el-container style="height:100%" class="dashboard-container" v-loading="loading">
        <div class="filter-container">
            <formFliter style="padding-top: 20px" v-if="queryParamReady"    @highMore="moreHeight"    @highSeaech="hightrue" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @doSearch="search" @formFilter="changeFormFilter" />
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
                    <reg-dialog @refreshTable="loadTable"   @storeReady="storeReady"  @refreshCount="countTotal++"></reg-dialog>
                </div>
            </div>
        </div>
        <el-main style="padding-bottom:0;">
            <router-view />
            <el-table :data="mainTableData" stripe :height="tableHeight" border style="width: 100%;min-height:300px;" tooltip-effect="light">
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
                            <edit-dialog :acId="scope.row.id" @refreshTable="loadTable"  @storeReady="storeReady"></edit-dialog>

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
      return this.collapse
        ? window.innerHeight - 440
        : (window.innerHeight - 540 - 40 * this.moreData<400?300:window.innerHeight - 540 - 40);
      console.log(window.innerHeight - 540 - 40 * this.moreData)
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
    },
    $route(to,form){
        if(to.name == "dashboard"){
          console.log("route");
          this.setCount(this.$store.state.deptId);
          this.loadTable(this.$store.state.deptId);
        }
    },
  },
  created() {
    // this.$root.eventHub.$on("search", keyword => {
    //   this.search(keyword);
    // });
    this.storeReady();
    // this.$root.eventHub.$on("selDept", ids => {
    //   this.setStore({
    //     deptId: ids
    //   });
    //   this.setCount();
    //   this.loadTable();
    // });
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
      console.log("555");
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
      // console.log(a);
    },
    setCount(id) {//此处vuex获取的值，比$root慢
      console.log("setCount");
      console.log(id);
      var ids=[];
      //debugger;
     id?ids=id:ids=this.tableParams.deptId;
      var _self = this;
      _self.loading = true;
      // this.pageSize = this.$store.state.pageSize;
      var paramsObj = {
        // pageSize: this.$store.state.pageSize,
        // pageNum: this.tableParams.pageNum,
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
           paramsObj.deptIds =ids;

      var _self = this;
      // this.$ajax.post('http://10.19.160.29:8080/DACM/caccess/dataAccessStatistics',this.tableParams.deptId
      this.$ajax
        .post(
          window.ENV.API_DACM + "/caccess/dataAccessStatistics",
          // "http://10.19.160.67:8083/DACM/caccess/dataAccessStatistics",
         paramsObj
        )
        .then(function(res) {
        //  console.log(res);
          if (res.data.success) {
            
            if (res.data.data.discontinuousPercentage) {
              _self.count1Data.total = res.data.data.dPercentage;
              _self.count1Data.list = res.data.data.discontinuousPercentage;
              
            }else{
              _self.count1Data.total = "未查询到数据";
              _self.count1Data.list = [];
            }
            if(res.data.data.constantlyPercentage){
              _self.count2Data.total = res.data.data.cPercentage;
              _self.count2Data.list = res.data.data.constantlyPercentage;
            } else {
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
        }
      ];
      this.queryParamReady = true;
      console.log(this.formFilterData);
    },
    collapseExpand: function() {
      this.collapse = !this.collapse;
    },
     updataFliterItemList() {
      var _self = this;
      this.$ajax
        .get(window.ENV.API_DACM + "/caccess/sysdialect", {
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
             _self.formFilterData[0].checkData=list
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      this.$ajax
        .get(window.ENV.API_DACM + "/commonInter/getListStaticDataOrder.do", {
          params: {
            dictCode: "NetWork"
          }
        })
        .then(function(res) {
          //  console.log(res)
          var list = [];
          if (res.data != undefined) {
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
             _self.formFilterData[1].checkData=list
          }
          console.log(list);
        })
        .catch(function(err) {
          console.log(err);
        });
      this.$ajax
        .get(window.ENV.API_DACM + "/commonInter/getListStaticDataOrder.do", {
          params: {
            dictCode: "ButtPlatForm"
          }
        })
        .then(function(res) {
          //  console.log(res)

          var list = [];
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
 _self.formFilterData[2].checkData=list
 console.log(_self.formFilterData);
  console.log(res.data);


        })
        .catch(function(err) {
          console.log(err);
        });
    },
    loadTable: function(id) {//此处vuex获取的值，比$root慢
     var ids=[];
     id?ids=id:ids=this.tableParams.deptId;
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
           paramsObj.deptIds =ids;


_self.updataFliterItemList();
//  this.$root.eventHub.$emit('updataFliterItemList');



      this.$ajax
        .post(window.ENV.API_DACM + "/caccess/query", paramsObj)
        .then(function(res) {
          console.log("tableLoaded:dashboard");
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
                        _self.countTotal++;

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
            if(res.data.code=="0000"&&res.data.data.success == true) {
              _self.loadTable();
               _self.countTotal--;
            } else if(res.data.code=="0000") {
              _self.$alert(res.data.data.message, "提示", {
                confirmButtonText: "确定"
              });
            }else{
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
      // console.log(fliterParams)
      this.setStore(fliterParams);
    },
    storeReady: function() {
      console.log("111");
      console.log(this.$store.state.deptId);
      var fliterItemList = this.$store.state.fliterItemList;
      if (
        fliterItemList.network.ready &&
        fliterItemList.dataSourceName.ready &&
        fliterItemList.platform.ready &&
        this.$store.state.pageReady
      ) {
         console.log(fliterItemList);
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
      .regbtn{
        margin-top:25px;
        padding-right:20px;
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
.underdone, .underdone:focus, .underdone:hover{
  text-decoration: underline;
}
</style>
