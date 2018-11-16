<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container" v-loading="loading">
      <el-header class="filter-container" height="86px">
        <div class="right-tools" v-if="tabPosition == 'metadataManage'">
          <el-tooltip class="item" effect="light" content="导入" placement="top">
            <a href="javascript:void(0)" v-on:click="importData"><i class="enc-icon-daochu"></i></a>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="导出" placement="top">
            <a href="javascript:void(0)" v-on:click="exportData"><i class="enc-icon-daoru"></i></a>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="刷新" placement="top">
            <a href="javascript:void(0)" v-on:click="refresh"><i class="enc-icon-shuaxin"></i></a>
          </el-tooltip>
        </div>
        <input type="file" id="file" name="inputFile" ref="inputer" v-on:change="importAjax" style="display:none" />
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
          <el-radio-button label="metadataManage">元数据管理</el-radio-button>
          <el-radio-button label="dataPreview">数据预览</el-radio-button>
        </el-radio-group>
      </el-header>
      <el-main style="padding:0;">
        <el-container style="height:100%;" class="dashboard-container" v-show="tabPosition == 'metadataManage'">
          <el-main style="padding-bottom:0;">
            <el-table :data="mainTableData1" stripe :height="tableHeight" border style="width: 100%" id="mainTable2" tooltip-effect="light">
              <el-table-column label="字段中文名" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <el-tooltip class="item" effect="light" content="修改" placement="top">
                      <i @click="editingRow.index = scope.$index; editingRow.diyComments = scope.row.diyComments;scope.row.showEdit = !scope.row.showEdit" class="el-icon-edit-outline table-action-btn" v-show="!scope.row.showEdit" />
                    </el-tooltip>
                    <span v-show="!scope.row.showEdit">{{ scope.row.diyComments }}</span>
                    <input type="text" v-model="editingRow.diyComments" v-show="scope.row.showEdit" @blur="changeName(scope.$index, scope.row)" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="字段名" width="180">
              </el-table-column>
              <el-table-column prop="datatype" label="字段类型">
              </el-table-column>
              <el-table-column prop="length" label="字段长度">
              </el-table-column>
              <el-table-column prop="isNull" label="是否为空">
                <template slot-scope="scope">
                  <span v-if="scope.row.isNull!='NO'">是</span>
                  <span v-if="scope.row.isNull=='NO'">否</span>
                </template>
              </el-table-column>
              <el-table-column label="是否为主键">
                <template slot-scope="scope">
                  <span v-if="scope.row.primaryKey">是</span>
                  <span v-if="!scope.row.primaryKey">否</span>
                </template>
              </el-table-column>
              <el-table-column label="是否为索引">
                <template slot-scope="scope">
                  <span v-if="scope.row.index">是</span>
                  <span v-if="!scope.row.index">否</span>
                </template>
              </el-table-column>
              <el-table-column prop="comments" label="描述">
              </el-table-column>
              <el-table-column label="是否为增量">
                <template slot-scope="scope">
                  <span v-if="scope.row.isIncremental == '1'">是</span>
                  <span v-if="scope.row.isIncremental == '0'">否</span>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <div class="enc-pagination">
              <el-pagination v-if="mainTableReady" v-show="pageShow" style="float:right; margin:10px;" @current-change="goPage" background :page-size="pageSize" :total="mainTableDataTotal1" layout="prev, pager, next, jumper" :current-page.sync="currentPage1">
              </el-pagination>
            </div>
          </el-footer>
        </el-container>
        <el-container style="height:100%;" class="dashboard-container" v-show="tabPosition != 'metadataManage'">
          <el-main style="padding-bottom:0;">
            <el-table :data="mainTableData2" stripe :height="tableHeight" border style="width: 100%" tooltip-effect="light">
              <el-table-column v-for="(val, key, index) in data2Columns" v-if="index<6" :prop="key" :label="getLabel(key)" width="width">
              </el-table-column>
              
							<el-table-column label="描述">
								<template slot-scope="scope">
									<el-popover placement="left-start" width="400" trigger="hover">
										<ul class="popup-menu">
											<li v-for="(val, key, index) in data2Columns">{{key}}：{{scope.row[key]}}</li>
										</ul>
										<a slot="reference" href="javascript:void(0)">更多详情<i class="el-icon-caret-bottom"></i></a> 
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
  </template>
  <script>
  import { mapState } from 'vuex'
  import dataImport from './../dialog/admin/data_import'


  export default {
    name: 'DashboardAdmin',
    data() {
      return {
        loading: false,
        queryParamReady: true,
        currentPage1: 1,
				pageSize:20,
        pageShow: true,
        tableHeight: window.innerHeight - 280,
        mainTableReady: true,
        mainTableData1: [],
        mainTableData2: [],
				mainTableTitle:[],
        data2Columns: {},
        width: 180,
        editingRow: {
          index: 0,
          diyComments: ''
        },
      
        mainTableDataTotal1: 1,
        dialogVisible: false,
        myDialogRouter: 'adminAdd',
        dialogTitle: '新增',
        tabPosition: 'metadataManage',
        importList: {
          ready: false,
          data: [],
          tableName: '',
          objInfoId: '',
          accessSysDialectId: '',
          filePath: ''
        },
        flagInterval: null
      }
    },
    computed: {
      tableParams: function() {
        return this.$store.state.queryParams.accessObjInfo;
      },
      exportUrl: function() {
        /*return window.ENV.API_DACM + '/objDetail/exportTemplateFile?objInfoId=' + this.$route.params.objId + '&tableName=' + this.$route.params.objName + '&diyComments=' + this.tableParams.diyComments + '&accessSysDialectId=' + this.tableParams.ACCESS_SYS_DIALECT_ID + '&browser=' + 'chrome';*/
        /*return 'http://10.19.160.171:8080/DACM/objDetail/exportTemplateFile?objInfoId=' + this.$route.params.objId + '&tableName=' + this.$route.params.objName + '&diyComments=' + this.tableParams.diyComments + '&accessSysDialectId=' + this.tableParams.ACCESS_SYS_DIALECT_ID + '&browser=' + 'chrome';*/
        return 'http://10.19.160.171:8080/DACM/objDetail/exportTemplateFile?objInfoId=10053886&tableName=aaaa&diyComments=VIEW&accessSysDialectId=10001&browser=chrome';
      },
      tableName: function() {
        return this.$route.params.objName;
      },
      accessSysDialectId: function() {
        return this.tableParams.ACCESS_SYS_DIALECT_ID;
      }
    },
    components: {
      dataImport
    },
    watch: {
      tableParams(newVal, oldVal) {
        if ((newVal.ACCESS_SYS_DIALECT_ID != oldVal.ACCESS_SYS_DIALECT_ID || newVal.accessSysId != oldVal.accessSysId || newVal.diyComments != oldVal.diyComments || newVal.pageNum1 != oldVal.pageNum1 || newVal.keyword != oldVal.keyword || newVal.timeFlag != oldVal.timeFlag)) {
          this.loadTable();
        }
        this.tabPosition = newVal.tabPosition;
      },
      tabPosition(newVal, oldVal) {
        this.setStore({
          tabPosition: newVal
        });
      }
    },
    mounted() {
      var tableParams = this.$store.state.queryParams.accessObjInfo;
      this.$root.eventHub.$emit('setActiveNav', 1);
      var _self = this;
      this.flagInterval = setInterval(function() {
        if (_self.$store.state.pageReady) {
          _self.loadTable(true);
          clearInterval(_self.flagInterval);
        }
      }, 200);
    },
    created() {
      this.$root.eventHub.$on('search', (keyword) => {
        this.search(keyword);
      })
    },
    methods: {
      refresh() {
        var _self = this;
        this.loading = true;
        this.$ajax.get(window.ENV.API_DACM + '/objDetail/synchronize', {
            params: {
              id: this.$route.params.objId
            }
          }).then(function(res) {
            console.log(res.data.success);
            if (res.data.success) {
              _self.loadTable();
            } else {
              console.log(res.data.code);
              _self.$alert('刷新失败', '提示', {
                confirmButtonText: '确定'
              });
            }
            _self.loading = false;
          })
          .catch(function(err) {
            console.log(err)
            _self.loading = false;
            _self.$alert('刷新失败', '提示', {
              confirmButtonText: '确定'
            });
          });
      },
      importData() {
        document.getElementById('file').click();
      },
      importAjax() {
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        this.file = inputDOM.files[0];
        if (!this.file) {
          return;
        }
        var formdata = new FormData();
        formdata.append('inputFile', inputDOM.files[0]);
        formdata.append('tableName', this.$route.params.objName);
        formdata.append('accessSysDialectId', this.tableParams.ACCESS_SYS_DIALECT_ID);
        var _self = this;
        this.$ajax({
            url: window.ENV.API_DACM + '/objDetail/readExcelFile',
            method: 'post',
            data: formdata,
            headers: { 'Content-Type': false }
          }).then(function(res) {
            if (res.data.success) {
              if (res.data.data.success) {
                if (res.data.data.data.length > 0) {
                  _self.importList.data = res.data.data.data[0];
                  _self.importList.tableName = _self.$route.params.objName;
                  _self.importList.objInfoId = _self.$route.params.objId;
                  _self.importList.accessSysDialectId = _self.tableParams.ACCESS_SYS_DIALECT_ID;
                  _self.importList.filePath = document.getElementById('file').value;
                  _self.importList.ready = true;
                } else {
                  _self.$alert('导入列表为空', '提示', {
                    confirmButtonText: '确定'
                  });
                }
              } else {
                _self.$alert('上传错误', {
                  confirmButtonText: '确定'
                });
              }
            } else {
              _self.$alert('上传错误', {
                confirmButtonText: '确定'
              });
              console.log(res);
            }
          })
          .catch(function(err) {
            _self.$alert('未知错误', {
              confirmButtonText: '确定'
            });
            console.log(err);
          })
      },
      closeImport() {
        this.importList = [];
        document.getElementById('file').value = "";
        document.getElementById('file').outerHtml = document.getElementById('file').outerHtml
        this.$refs.inputer.value = ''
        this.$refs.inputer.files = [];
      },
      exportData() {
        this.$ajax({
          url: this.exportUrl,
          method: "GET",
          responseType: "blob"
        }).then(res => {
          console.log(res);　
          var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
          　　
          var downloadElement = document.createElement('a');　　
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          　　
          downloadElement.href = href;　　
          downloadElement.download = res.headers.filename; //下载后文件名
          　　
          document.body.appendChild(downloadElement);　　
          downloadElement.click(); //点击下载
          　　
          document.body.removeChild(downloadElement); //下载完成移除元素
          　　
          window.URL.revokeObjectURL(href); //释放掉blob对象 
        })
        /*window.open(this.exportUrl);*/
      },
      loadTable: function(flag) {
        var _self = this;
        this.loading = true;
				_self.pageSize = this.$store.state.pageSize;
        var paramsObj = {
          pagNum: this.tableParams.pageNum1,
          count: _self.pageSize,
          objectInfoId: this.$route.params.objId,
          ACCESS_SYS_DIALECT_ID: this.tableParams.ACCESS_SYS_DIALECT_ID,
          accessSysId: this.tableParams.accessSysId
        }
        const promist0 = new Promise((resolve, reject) => {
          this.$ajax.post(window.ENV.API_DACM + '/objDetail/dataList', paramsObj).then(function(res) {
              console.log('tableLoaded:metadataManage');
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
                console.log(res.data.code);
                _self.mainTableData1 = [];
                _self.pageShow = false;
                reject(res);
                _self.$alert('获取表信息失败', '提示', {
                  confirmButtonText: '确定'
                });
              }
              if (_self.tabPosition == 'metadataManage') {
                _self.loading = false;
              }
            })
            .catch(function(err) {
              _self.mainTableData1 = [];
              _self.pageShow = false;
              console.log(err)
              if (_self.tabPosition == 'metadataManage') {
                _self.loading = false;
              }
              reject(err);
              _self.$alert('获取表信息失败', '提示', {
                confirmButtonText: '确定'
              });
            });
        });
        const promist1 = new Promise((resolve, reject) => {
          var paramsObj = {
            count: this.$store.state.pageSize,
            objInfoId: this.$route.params.objId,
            ACCESS_SYS_DIALECT_ID: this.tableParams.ACCESS_SYS_DIALECT_ID,
            accessSysId: this.tableParams.accessSysId,
            filter: null
          }
          this.$ajax.post(window.ENV.API_DACM + '/objDetail/previewData', paramsObj).then(function(res) {
         /* this.$ajax.post('http://10.19.160.171:8080/DACM/objDetail/previewData', paramsObj).then(function(res) {*/
              console.log('tableLoaded:dataPreview');
              if (res.data.success) {
                resolve(res);
              } else {
                _self.mainTableData2 = [];
                console.log(res.data.code);
                reject(res);
                _self.$alert('获取预览信息失败', '提示', {
                  confirmButtonText: '确定'
                });
              }
              if (_self.tabPosition != 'metadataManage') {
                _self.loading = false;
              }
            })
            .catch(function(err) {
              console.log(err)
              _self.mainTableData2 = [];
              reject(err);
              _self.$alert('获取预览信息失败', '提示', {
                confirmButtonText: '确定'
              });
              if (_self.tabPosition != 'metadataManage') {
                _self.loading = false;
              }
            });
        });

        Promise.all([promist0, promist1]).then((resultList) => {
          if (resultList[1].data.datas.length > 0) {
            _self.data2Columns = resultList[1].data.datas[0];
						_self.mainTableTitle = resultList[1].data.titles;
            var len = 0;
            for (var i in _self.data2Columns) {
              len++;
              if (len == 6) {
                break;
              }
            }
            var tableW = document.getElementById("mainTable2").offsetWidth;
            _self.width = len == 6 ? tableW / (len + 1) + '%' : tableW / len + '%'
          }
          _self.mainTableData2 = resultList[1].data.datas;
        });

      },
			getLabel(key){
				console.log(key);
				for(var value of this.mainTableTitle){
					if(key == value.key){
						return value.name;
					}
				}
				return '未知标题';
			},
      goPage: function(val) {
        var obj = {};
        var paramName = this.tabPosition == 'metadataManage' ? 'pageNum1' : 'pageNum2';
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
        this.$ajax.get(window.ENV.API_DACM + '/objDetail/diyComment', {
            params: {
              id: row.id,
              value: this.editingRow.diyComments
            }
          }).then(function(res) {
            if (res.data.success) {
              row.diyComments = _self.editingRow.diyComments;
              row.showEdit = false;
            } else {
              console.log(res.data.code);
              _self.$alert('字段中文名称修改失败', '提示', {
                confirmButtonText: '确定'
              });
            }
            _self.loading = false;
          })
          .catch(function(err) {
            console.log(err)
            _self.loading = false;
            _self.$alert('字段中文名称修改失败', '提示', {
              confirmButtonText: '确定'
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
      }
    }
  }

  </script>
  <style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-container {
    background: #fff;
    .filter-container {
      padding-top: 40px;
      .right-tools {
        float: right;
        margin-right: 10px;
        a {
          font-size: 26px;
          color: #479ad8;
           :hover,
           :active {
            color: #f93;
          }
          i {
            font-size: 32px;
          }
        }
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

  </style>
