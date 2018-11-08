<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container" v-loading="loading">
      <el-header class="filter-container" height="86px">
        <div class="right-tools" v-if="tabPosition == 'metadataManage'">
          <a href="javascript:void(0)" v-on:click="importData"><i class="enc-icon-daochu"></i></a>
          <a href="javascript:void(0)" v-on:click="exportData"><i class="enc-icon-daoru"></i></a>
          <a href="javascript:void(0)" v-on:click="refresh"><i class="enc-icon-shuaxin"></i></a>
        </div>
				<form action="http://10.19.160.171:8081/DEMO/objDetail/readExcelFile1" id="importForm" style="display:none;">
					<input type="file" id="file" name="inputFile" v-on:change="importAjax" />
					<input type="text" id="tableName" name="tableName" v-model="tableName" />
					<input type="text" id="accessSysDialectId" name="accessSysDialectId" v-model="accessSysDialectId" />
				</form>
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
          <el-radio-button label="metadataManage">元数据管理</el-radio-button>
          <el-radio-button label="dataPreview">数据预览</el-radio-button>
        </el-radio-group>
      </el-header>
      <el-main style="padding:0;">
        <el-container style="height:100%;" class="dashboard-container" v-show="tabPosition == 'metadataManage'">
          <el-main style="padding-bottom:0;">
            <el-table
              :data="mainTableData1"
              stripe
              :height="tableHeight"
              border
              style="width: 100%"
              tooltip-effect="light"
              >
              <el-table-column
                label="字段中文名"
                width="180" show-overflow-tooltip>
                <template slot-scope="scope">
									<div>
										<a v-show="!scope.row.showEdit" href="javascript:void(0)">{{ scope.row.diyComments }}</a>
										<input type="text" v-model="editingRow.diyComments" v-show="scope.row.showEdit" @blur="changeName(scope.$index, scope.row)" />
										<i @click="editingRow.index = scope.$index; editingRow.diyComments = scope.row.diyComments;scope.row.showEdit = !scope.row.showEdit" class="el-icon-edit-outline table-action-btn" v-show="!scope.row.showEdit" />
									</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="字段名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="datatype"
                label="字段类型">
              </el-table-column>
              <el-table-column
                prop="length"
                label="字段长度">
              </el-table-column>
              <el-table-column
                prop="isNull"
                label="是否为空">
								<template slot-scope="scope">
									<span v-if="scope.row.isNull!='NO'">是</span>
									<span v-if="scope.row.isNull=='NO'">否</span>
								</template>
              </el-table-column>
              <el-table-column
                label="是否为主键">
								<template slot-scope="scope">
									<span v-if="scope.row.primaryKey">是</span>
									<span v-if="!scope.row.primaryKey">否</span>
								</template>
              </el-table-column>
              <el-table-column
                label="是否为索引">
								<template slot-scope="scope">
									<span v-if="scope.row.index">是</span>
									<span v-if="!scope.row.index">否</span>
								</template>
              </el-table-column>
              <el-table-column
                prop="comments"
                label="描述">
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <div class="enc-pagination">
              <el-pagination v-if="mainTableReady" style="float:right; margin:10px;"
                @current-change="goPage"
                background
                :page-size="20"
                :total="mainTableDataTotal1"
                layout="prev, pager, next, jumper"
                :current-page.sync="currentPage1">
              </el-pagination>
            </div>
          </el-footer>
        </el-container>

        <el-container style="height:100%;" class="dashboard-container" v-show="tabPosition != 'metadataManage'">
          <el-main style="padding-bottom:0;">
            <el-table
              :data="mainTableData2"
              stripe
              :height="tableHeight"
              border
              style="width: 100%"
              tooltip-effect="light"
              >
              <el-table-column
								v-for="(val, key, index) in data2Columns"
                :prop="key"
                :label="key"
                width="180">
              </el-table-column>
              <el-table-column
                label="描述">
                <template slot-scope="scope">
                  <el-popover
                    placement="bottom-start"
                    width="200"
                    trigger="hover"
                    >
                      <ul class="popup-menu">
                        <li>姓名：XXX</li>
                        <li>身份证号：XXX</li>
                        <li>年龄：XXX</li>
                        <li>地址：XXX</li>
                      </ul>
                      <a slot="reference" href="javascript:void(0)">{{ scope.row.name }}<i class="el-icon-caret-bottom"></i></a>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <add1 :dialogRouter="myDialogRouter" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState} from 'vuex'


export default {
  name: 'DashboardAdmin',
  data() {
    return {
			loading:false,
      queryParamReady:true,
      currentPage1:1,
      tableHeight: window.innerHeight - 280,
      mainTableReady:true,
      mainTableData1: [],
      mainTableData2: [],
			data2Columns:{},
			editingRow:{
				index:0,
				diyComments:''
			},
      mainTableDataTotal1: 1,
      dialogVisible:false,
      myDialogRouter:'adminAdd',
      dialogTitle:'新增',
      tabPosition:'metadataManage'
    }
  },
  computed:{
    tableParams:function(){
      return this.$store.state.queryParams.accessObjInfo;
    },
		exportUrl:function(){
			return 'http://10.19.160.171:8081/DEMO/objDetail/exportTemplateFile?objInfoId='+this.$route.params.objId+'&tableName='+this.$route.params.objName+'&diyComments='+this.tableParams.diyComments+'&accessSysDialectId='+this.tableParams.ACCESS_SYS_DIALECT_ID+'&browser='+'chrome';
		},
		tableName:function(){
			return this.$route.params.objName;
		},
		accessSysDialectId:function(){
			return this.tableParams.ACCESS_SYS_DIALECT_ID;
		}
  },
  components: {
  },
  watch: {
    tableParams(newVal,oldVal){
      if((newVal.pageNum1 != oldVal.pageNum1 || newVal.pageNum2 != oldVal.pageNum2)){
        this.loadTable();
      }
      this.tabPosition = newVal.tabPosition;
    },
    tabPosition(newVal,oldVal){
      this.setStore({
        tabPosition:newVal
      });
    }
  },
  mounted(){
    var tableParams = this.$store.state.queryParams.accessObjInfo;
    this.loadTable(true);
  },
  created(){
    this.$root.eventHub.$on('search', (keyword)=>{
      this.search(keyword);
    })
  },
  methods:{
		refresh(){
			var _self = this;
			this.loading = true;
			this.$ajax.get('http://10.19.160.171:8081/DEMO/objDetail/synchronize',{
				params:{
					id:this.$route.params.objId
				}
			}).then(function(res){
				console.log(res);
				if(res.data.success){
					_seft.loadtable();
				}else{
					console.log(res.data.code);
				}
				_self.loading = false;
			})
			.catch(function(err){
				console.log(err)
				_self.loading = false;
			});
		},
		importData(){
			document.getElementById('file').click();
		},
		importAjax(){
			alert('ajax');
		},
		exportData(){
			window.open(this.exportUrl);
		},
    loadTable:function(flag){
      var _self = this;
			this.loading = true;
      if(this.tabPosition == 'metadataManage' || flag){
				var paramsObj = {
					pagNum:this.tableParams.pageNum1,
					count:this.$store.state.pageSize,
					objectInfoId:this.$route.params.objId,
					ACCESS_SYS_DIALECT_ID:this.tableParams.ACCESS_SYS_DIALECT_ID,
					accessSysId:this.tableParams.accessSysId
				}
        this.$ajax.post('http://10.19.160.171:8081/DEMO/objDetail/dataList',paramsObj).then(function(res){
          console.log('tableLoaded:metadataManage');
					if(res.data.success){
						var data = res.data.data.list;
						for(var value of data){
							value.showEdit = false;
						}
						_self.mainTableData1 = data;
						_self.mainTableDataTotal1 = res.data.data.total;
						//这里是异步的，存在延迟，所以没问题,如果是同步的话可能存在问题
						_self.currentPage1 = _self.tableParams.pageNum1;
					}else{
						console.log(res.data.code);
					}
					_self.loading = false;
        })
        .catch(function(err){
          _self.currentPage1 = _self.tableParams.pageNum1;
          console.log(err)
					_self.loading = false;
        });
      }
      if(flag){
				var paramsObj = {
					count:this.$store.state.pageSize,
					objInfoId:this.$route.params.objId,
					ACCESS_SYS_DIALECT_ID:this.tableParams.ACCESS_SYS_DIALECT_ID,
					accessSysId:this.tableParams.accessSysId,
					filter:null
				}
        this.$ajax.post('http://10.19.160.171:8081/DEMO/objDetail/previewData',paramsObj).then(function(res){
          console.log('tableLoaded:dataPreview');
					if(res.data.success){
						if(res.data.datas.length>0){
							_self.data2Columns = res.data.datas[0];
						}
						_self.mainTableData2 = res.data.datas;
					}else{
						console.log(res.data.code);
					}
        })
        .catch(function(err){
          console.log(err)
        });
      }
    },
    goPage:function(val){
      var obj = {};
      var paramName = this.tabPosition == 'metadataManage'?'pageNum1':'pageNum2';
      obj[paramName] = val;
      this.setStore(obj);
    },
    search:function(keyword){
      this.setStore({
        pageNum:1,
        keyword:keyword
      });
    },
    changeName:function(index,row){
			var _self = this;
			this.loading = true;
			this.$ajax.get('http://10.19.160.171:8081/DEMO/objDetail/diyComment',{
				params:{
					id:row.id,
					value:this.editingRow.diyComments
				}
			}).then(function(res){
				if(res.data.success){
					row.diyComments = _self.editingRow.diyComments;
					row.showEdit = false;
				}else{
					console.log(res.data.code);
				}
				_self.loading = false;
			})
			.catch(function(err){
				console.log(err)
				_self.loading = false;
			});
    },
    setStore:function(obj){
      let storeData = JSON.parse(JSON.stringify(this.$store.state.queryParams[this.$route.name]));
      for(var i in obj){
        storeData[i] = obj[i];
      }
      this.$store.commit('setQueryParams', {
        name:this.$route.name,
        data:storeData
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  background: #fff;
  .filter-container {
    padding-top:40px;
    .right-tools{
      float:right;
      margin-right:10px;
      a{
        font-size:26px;
        color:#479ad8;
        :hover,
        :active{
          color:#f93;
        }
        i{
          font-size: 32px;
        }
      }
    }
    form{
      margin-right:100px;
    }
    .el-form-item{
      margin-bottom:2px;
    }
    .add-btn{
      float:right;
    }
  }
  .table-container {
    padding: 32px;
  }
  .enc-pagination {
    float: right;
  }
}
</style>
