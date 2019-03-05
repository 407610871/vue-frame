<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">数据接入</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a @click="goToDetail">{{sourceName }}</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{objName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main-content" v-loading="loading">
      <el-container class="dashboard-container">
        <el-main>
          <div class="filter-container">
            <div class="right-tools" v-if="tabPosition == 'metadataManage'">
              <el-tooltip class="item" effect="light" content="导入" placement="top">
                <el-button type="primary" v-on:click="importData" icon="icon-title enc-icon-daoru">导入</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="导出" placement="top" >
                <el-button type="primary" v-on:click="exportData" icon="icon-title enc-icon-daochu">导出</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="刷新" placement="top">
                <el-button type="primary" v-on:click="refresh" icon="icon-title enc-icon-shuaxin">刷新</el-button>
              </el-tooltip>
            </div>
            <input
              type="file"
              id="file"
              name="inputFile"
              ref="inputer"
              v-on:change="importAjax"
              style="display:none"
            >
            <el-radio-group v-model="tabPosition" @change="listAjax">
              <el-radio-button label="metadataManage">元数据管理</el-radio-button>
              <el-radio-button label="dataPreview">数据预览</el-radio-button>
            </el-radio-group>
          </div>
          <el-container class="dashboard-container" v-show="tabPosition == 'metadataManage'">
            <el-main style="padding-bottom:0;">
              <el-table
                :data="mainTableData1"
                stripe
                :height="tableHeight"
                style="width: 100%"
                id="mainTable2"
                tooltip-effect="light"
                :row-class-name="tableRowClassName">
                <el-table-column label="字段中文名" width="180" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip class="item" effect="light" content="修改" placement="top">
                        <i
                          @click="editName(scope.row,scope.$index)"
                          class="el-icon-edit-outline table-action-btn"
                          v-show="!scope.row.showEdit"
                        />
                      </el-tooltip>
                      <span v-show="!scope.row.showEdit">{{ scope.row.diyComments }}</span>
                      <input
                        type="text"
                        v-model="editingRow.diyComments"
                        v-show="scope.row.showEdit"
                        @blur="changeName(scope.$index, scope.row)"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="字段名" width="180"></el-table-column>
                <el-table-column prop="datatype" label="字段类型" min-width="160"></el-table-column>
                <el-table-column prop="length" label="字段长度" min-width="160"></el-table-column>
                <el-table-column prop="isNull" label="是否为空" min-width="160">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isNull!='N'">是</span>
                    <span v-if="scope.row.isNull=='N'">否</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否为主键" min-width="160">
                  <template slot-scope="scope">
                    <span v-if="scope.row.primaryKey">是</span>
                    <span v-if="!scope.row.primaryKey">否</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否为索引" min-width="160">
                  <template slot-scope="scope">
                    <span v-if="scope.row.index">是</span>
                    <span v-if="!scope.row.index">否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="comments" label="描述" show-overflow-tooltip></el-table-column>
                <el-table-column label="是否为增量" min-width="160">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isIncremental == '1'">是</span>
                    <span v-if="scope.row.isIncremental == '0'">否</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer>
              <div class="enc-pagination">
                <el-pagination
                  v-if="mainTableReady"
                  v-show="pageShow"
                  style="float:right; margin:10px;"
                  @current-change="goPage"
                  background
                  :page-size="pageSize"
                  :total="mainTableDataTotal1"
                  layout="prev, pager, next, jumper"
                  :current-page.sync="currentPage1"
                ></el-pagination>
              </div>
            </el-footer>
          </el-container>
          <el-container class="dashboard-container" v-show="tabPosition != 'metadataManage'">
            <el-main style="padding-bottom:0;">
              <search-condition
                :filtercolumnList="filtercolumnList"
                :searchFormItem="item"
                :NOIndex="index"
                :searchForm="searchForm"
                v-for="(item,index) in searchForm"
                :key="index"
                @searchAll="searchAll"
                ref="searchForm"
              ></search-condition>
              <el-row class="btn-area">
                <el-col>
                  <el-button type="primary" size="mini" @click="addCondition">增加搜索条件</el-button>
                </el-col>
              </el-row>
              <el-table
                :data="mainTableData2"
                stripe
                :height="tablePreviewHeight"
                style="width: 100%"
                tooltip-effect="light">
                <el-table-column
                  v-for="(val, key, index) in data2Columns"
                  v-if="index<6"
                  :prop="key"
                  :label="getLabel(key)"
                  width="width"
                  :key="index"
                ></el-table-column>
                <el-table-column label="描述" >
                  <template slot-scope="scope">
                    <el-popover placement="left-start"  trigger="hover">
                      <ul class="popup-menu">
                        <li
                          v-for="(val, key, index) in data2Columns"
                          :key="index"
                        >{{key}}：{{scope.row[key]}}</li>
                      </ul>
                      <span slot="reference" style="cursor: pointer">更多详情
                        <i class="el-icon-caret-bottom" style="display: inline-block;    position: absolute;top: 18px;    margin-left: 1px;"></i>
                      </span>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
      <data-import v-if="importList.ready" :importList="importList" @closeImport="closeImport"></data-import>
    </div>
  </div>
</template>
  <script>
import { mapState } from "vuex";
import dataImport from "./../dialog/admin/data_import";
import searchCondition from "./searchCondition";

import request from "@/utils/request";
export default {
  name: "DashboardAdmin",
  data() {
    return {
      count: "",
      searchForm: [{ filtertype: "4", outrelate: "and" }],
      searchFormCont: { filtertype: "4", outrelate: "and" },
      filtercolumnList: [],
      loading: false,
      queryParamReady: true,
      currentPage1: 1,
      pageSize: 20,
      pageShow: true,
      mainTableReady: true,
      mainTableData1: [],
      mainTableData2: [],
      mainTableTitle: [],
      data2Columns: {},
      width: 180,
      editingRow: {
        index: 0,
        diyComments: ""
      },

      mainTableDataTotal1: 1,
      dialogVisible: false,
      myDialogRouter: "adminAdd",
      dialogTitle: "新增",
      tabPosition: "metadataManage",
      importList: {
        ready: false,
        data: [],
        tableName: "",
        objInfoId: "",
        accessSysDialectId: "",
        filePath: ""
      },
      flagInterval: null
    };
  },
  computed: {
    tableParams: function() {
      return this.$store.state.queryParams.accessObjInfo;
    },
    exportUrl: function() {
      let diybank = "";
      if (this.tableParams.diyComments != undefined) {
        diybank = this.tableParams.diyComments;
      }
      return (
        window.ENV.API_DACM +
        "/objDetail/exportTemplateFile?objInfoId=" +
        this.$route.params.objId +
        "&tableName=" +
        this.$route.params.objName +
        "&diyComments=" +
        diybank +
        "&accessSysDialectId=" +
        this.tableParams.ACCESS_SYS_DIALECT_ID +
        "&browser=" +
        "chrome"
      );
    },
    tableName: function() {
      return this.$route.params.objName;
    },
    accessSysDialectId: function() {
      return this.tableParams.ACCESS_SYS_DIALECT_ID;
    },
    filters() {
      return this.searchForm.filter(item => {
        if (item.filterdata) return item;
      });
    },
    storeCount() {
      return this.$store.state.pageSize;
    },
    tableHeight: function() {
      if (window.innerHeight > 768) {
        return window.innerHeight - 300;
      }
      return 520;
    },
    tablePreviewHeight: function() {
      let counter = this.searchForm.length;
      console.log("this.data2Columns.length===", counter);
      if (window.innerHeight > 768) {
        return window.innerHeight - 300 - 57*counter;
      }
      return 520 - 57*counter;
    },
    sourceName() {
      if(this.$route.params.sourceName!=undefined){
        return decodeURI(this.$route.params.sourceName);
      }
      
    },
    objName() {
     // console.log(this.$route.params.objName);
      if(this.$route.params.objName!=undefined){
        return decodeURI(this.$route.params.objName);
      }
    }
  },
  components: {
    dataImport,
    searchCondition
  },
  watch: {
    tableParams(newVal, oldVal) {
      if (
        newVal.ACCESS_SYS_DIALECT_ID != oldVal.ACCESS_SYS_DIALECT_ID ||
        newVal.accessSysId != oldVal.accessSysId ||
        newVal.diyComments != oldVal.diyComments ||
        newVal.pageNum1 != oldVal.pageNum1 ||
        newVal.keyword != oldVal.keyword ||
        newVal.timeFlag != oldVal.timeFlag
      ) {
        this.loadTable();
      }
      this.tabPosition = newVal.tabPosition;
    },
    tabPosition(newVal, oldVal) {
      this.searchForm = [{ filtertype: "4", outrelate: "and" }];
      this.count = "";
      this.setStore({
        tabPosition: newVal
      });
    }
  },
  mounted() {
    this.$root.eventHub.$emit("selTreeNode", this.$store.state.deptId);
    var tableParams = this.$store.state.queryParams.accessObjInfo;
    this.$root.eventHub.$emit("setActiveNav", 1);
    var _self = this;
    this.flagInterval = setInterval(function() {
      if (_self.$store.state.pageReady) {
        _self.loadTable(true);
        clearInterval(_self.flagInterval);
      }
    }, 200);
  },
  created() {
    this.$root.eventHub.$on("search", keyword => {
      this.search(keyword);
    });
  },
  methods: {
    editName(row, index) {
      console.log(row);
      this.editingRow.index = index;
      this.editingRow.diyComments = row.diyComments;
      row.showEdit = !row.showEdit;
      for (let i = 0; i < this.mainTableData1.length; i++) {
        if (index == i) {
        } else {
          this.mainTableData1[i].showEdit = false;
        }
      }
    },
    searchAll(count) {
      let checkArr = [];
      this.count = count;
      this.$refs.searchForm.forEach(item => {
        checkArr.push(item.checkForm());
      });
      Promise.all(checkArr).then(valid => {
        let flag = true;
        valid.forEach(item => {
          flag = flag && item;
        });
        if (flag) {
          this.dataPreviewContentAjax();
        }
      });
    },
    getFiltercolumnList() {
      this.filtercolumnList = [];
      this.$ajax
        .post(window.ENV.API_DACM + "/objDetail/dataList", {
          count: 500,
          objectInfoId: this.$route.params.objId,
          pagNum: 1,
          trem: ""
        })
        .then(res => {
          res = res.data;
          if (res.success) {
            let list = res.data.list;

            this.filtercolumnList = list.map(item => {
              return { name: item.name, datatype: item.datatype };
            });
          }
        })
        .catch(() => {});
    },
    //增加搜索条件
    addCondition() {
      let len = this.searchForm.length;
      if (len > 4) return;
      this.searchForm.push(Object.assign({}, this.searchFormCont));
    },
    tableRowClassName: function(scope, rowIndex) {
      if (scope.row.isDeleted == 1) {
        //删除
        return "delete-row";
      } else if (scope.row.isHistory == 2) {
        //新增
        return "add-row";
      }
      return "";
    },
    refresh() {
      var _self = this;
      this.loading = true;
      this.$ajax
        .get(window.ENV.API_DACM + "/objDetail/synchronize", {
          params: {
            id: this.$route.params.objId
          }
        })
        .then(function(res) {
          if (res.data.success) {
            _self.loadTable();
          } else {
            _self.$alert("刷新失败", "提示", {
              confirmButtonText: "确定"
            });
          }
          _self.loading = false;
        })
        .catch(function(err) {
          _self.loading = false;
          _self.$alert("刷新失败", "提示", {
            confirmButtonText: "确定"
          });
        });
    },
    importData() {
      document.getElementById("file").click();
    },
    importAjax() {
      this.loading = true;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = inputDOM.files[0];
      if (!this.file) {
        return;
      }
      var formdata = new FormData();
      formdata.append("inputFile", inputDOM.files[0]);
      formdata.append("tableName", this.$route.params.objName);
      formdata.append(
        "accessSysDialectId",
        this.tableParams.ACCESS_SYS_DIALECT_ID
      );
      var _self = this;
      this.$ajax({
        url: window.ENV.API_DACM + "/objDetail/readExcelFile",
        method: "post",
        data: formdata,
        headers: { "Content-Type": false }
      })
        .then(function(res) {
          if (res.data.success) {
            if (res.data.data.success) {
              if (res.data.data.data.length > 0) {
                _self.importList.data = res.data.data.data[0];
                _self.importList.tableName = _self.$route.params.objName;
                _self.importList.objInfoId = _self.$route.params.objId;
                _self.importList.accessSysDialectId =
                  _self.tableParams.ACCESS_SYS_DIALECT_ID;
                // _self.importList.filePath = document.getElementById('file').value;
                _self.importList.filePath = res.data.data.filePath;
                _self.importList.ready = true;
              } else {
                _self.$alert("导入列表为空", "提示", {
                  confirmButtonText: "确定"
                });
              }
            } else {
              _self.$alert("元数据模版不正确，建议先导出元数据模版", {
                confirmButtonText: "确定"
              });
            }
          } else {
            _self.$alert("元数据模版不正确，建议先导出元数据模版", {
              confirmButtonText: "确定"
            });
          }
          _self.loading = false;
        })
        .catch(function(err) {
          _self.$alert("未知错误", {
            confirmButtonText: "确定"
          });
          _self.loading = false;
        });
    },
    closeImport() {
      this.loadTable(); //刷新页面
      this.importList = {
        ready: false,
        data: [],
        tableName: "",
        objInfoId: "",
        accessSysDialectId: "",
        filePath: ""
      };
      document.getElementById("file").value = "";
      // document.getElementById('file').outerHtml = document.getElementById('file').outerHtml
      //this.$refs.inputer.value = ''
      // this.$refs.inputer.files = [];
    },
    exportData() {
      request({
        url: this.exportUrl,
        method: "GET",
        responseType: "blob"
      }).then(res => {
          var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
          var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
          var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
          var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;

          var blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          }); 
        if (isIE || isEdge || isIE11) {
          window.navigator.msSaveOrOpenBlob(
            blob,
            unescape(res.headers.filename.replace(/\\u/g, "%u"))
          );
        } else {
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = unescape(
            res.headers.filename.replace(/\\u/g, "%u")
          ); //下载后文件名，unicode转码
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        }
      });
    },
    listAjax(val) {
      if (val == "dataPreview") {
        this.getFiltercolumnList();
        this.dataPreviewContentAjax();
      } else {
        this.$refs.searchForm[0].clsFiltercolumn();
      }
    },

    metadataManageAjax() {
      var _self = this;
      return new Promise((resolve, reject) => {
        _self.loading = true;
        _self.pageSize = _self.$store.state.pageSize;
        var paramsObj = {
          pagNum: _self.tableParams.pageNum1,
          count: _self.pageSize,
          objectInfoId: _self.$route.params.objId,
          ACCESS_SYS_DIALECT_ID: _self.tableParams.ACCESS_SYS_DIALECT_ID,
          accessSysId: _self.tableParams.accessSysId
        };
        _self.$ajax
          .post(window.ENV.API_DACM + "/objDetail/dataList", paramsObj)
          .then(function(res) {
            if (res.data.success) {
              var data = res.data.data.list;
              for (var value of data) {
                value.showEdit = false;
              }
              _self.mainTableData1 = data;
              _self.mainTableDataTotal1 = res.data.data.total;
              //这里是异步的，存在延迟，所以没问题,如果是同步的话可能存在问题
              _self.currentPage1 = _self.tableParams.pageNum1;
              _self.pageShow = true;
              resolve(res);
            } else {
              _self.mainTableData1 = [];
              _self.pageShow = false;
              reject(res);
              _self.$alert("获取表信息失败", "提示", {
                confirmButtonText: "确定"
              });
            }
            _self.loading = false;
          })
          .catch(function(err) {
            _self.mainTableData1 = [];
            _self.pageShow = false;
            _self.loading = false;
            reject(err);
            _self.$alert("获取表信息失败", "提示", {
              confirmButtonText: "确定"
            });
          });
      });
    },
    dataPreviewAjax() {
      var _self = this;
      _self.loading = true;
      return new Promise((resolve, reject) => {
        let count = 0;
        if (!_self.count) {
          count = _self.storeCount;
        } else {
          count = _self.count;
        }

        var paramsObj = {
          count: count,
          objInfoId: _self.$route.params.objId,
          ACCESS_SYS_DIALECT_ID: _self.tableParams.ACCESS_SYS_DIALECT_ID,
          accessSysId: _self.tableParams.accessSysId,
          filter: _self.filters
        };

        // _self.$ajax.post('http://10.19.160.171:8080/DACM/objDetail/previewData', paramsObj).then(function(res) {
        _self.$ajax
          .post(window.ENV.API_DACM + "/objDetail/previewData", paramsObj)
          .then(function(res) {
            _self.loading = false;
            if (res.data.success) {
              resolve(res);
            } else {
              _self.mainTableData2 = [];
              reject(res);
              _self.$alert("获取预览信息失败", "提示", {
                confirmButtonText: "确定"
              });
            }
            _self.loading = false;
          })
          .catch(function(err) {
            _self.mainTableData2 = [];
            reject(err);
            _self.$alert("获取预览信息失败", "提示", {
              confirmButtonText: "确定"
            });
            _self.loading = false;
          });
      });
    },
    dataPreviewContentAjax() {
      this.dataPreviewAjax().then(resultList => {
        if (resultList.data.datas.length > 0) {
          this.data2Columns = resultList.data.datas[0];
          this.mainTableTitle = resultList.data.titles;
          var len = 0;
          for (var i in this.data2Columns) {
            len++;
            if (len == 6) {
              break;
            }
          }
          var tableW = document.getElementById("mainTable2").offsetWidth;
          this.width = len == 6 ? tableW / (len + 1) + "%" : tableW / len + "%";
        }
        this.mainTableData2 = resultList.data.datas;
      });
    },
    loadTable: function(flag) {
      this.metadataManageAjax();
    },
    getLabel(key) {
      for (var value of this.mainTableTitle) {
        if (key == value.key) {
          return value.name;
        }
      }
      return "未知标题";
    },
    goPage: function(val) {
      var obj = {};
      var paramName =
        this.tabPosition == "metadataManage" ? "pageNum1" : "pageNum2";
      obj[paramName] = val;
      this.setStore(obj);
    },
    search: function(keyword) {
      this.setStore({
        pageNum: 1,
        keyword: keyword
      });
    },
    changeName: function(index, row) {
      var _self = this;
      this.loading = true;
      this.$ajax
        .get(window.ENV.API_DACM + "/objDetail/diyComment", {
          params: {
            id: row.id,
            value: this.editingRow.diyComments
          }
        })
        .then(function(res) {
          if (res.data.success) {
            row.diyComments = _self.editingRow.diyComments;
            row.showEdit = false;
          } else {
            _self.$alert("字段中文名称修改失败", "提示", {
              confirmButtonText: "确定"
            });
          }
          _self.loading = false;
        })
        .catch(function(err) {
          _self.loading = false;
          _self.$alert("字段中文名称修改失败", "提示", {
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
    goToDetail() {
      let params = {
        sourceId: this.$route.params.sourceId,
        sourceName: this.$route.params.sourceName,
        type: this.$route.params.type,
        backType: true,
      };
      this.$router.push({
        name: "accessObjManage",
        params: params
      });
    }
  }
};
</script>
  <style lang="scss">
.el-table .delete-row {
  color: red;
}

.el-table .add-row {
  color: red;
}
.filterdata-form-item {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.right-tools .el-button--primary span , .right-tools .el-button--medium span {
  float:right;
}
</style>
  <style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  .el-main {
    padding: 0px;
  }
  .filter-container {
    margin-bottom: 20px;
    .right-tools {
      float: right;
    }
    form {
      margin-right: 100px;
    }
    .el-form-item {
      margin-bottom: 2px;
    }
    .add-btn {
      float: right;
    }
  }
  .table-container {
    padding: 32px;
  }
  .enc-pagination {
    float: right;
  }
  .cell i {
    cursor: pointer;
  }
}

.popup-menu {
  margin: 0;
  padding: 0;
}

.popup-menu li {
  margin: 0;
  padding: 0;
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}
.btn-area {
  margin-bottom: 20px;
}
</style>
