<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container">
      <el-header class="filter-container" height="86px">
        <div class="right-tools" v-if="tabPosition == 'metadataManage'">
          <a href="javascript:void(0)"><i class="el-icon-upload2"></i></a>
          <a href="javascript:void(0)"><i class="el-icon-download"></i></a>
          <a href="javascript:void(0)"><i class="el-icon-refresh"></i></a>
        </div>
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
              >
              <el-table-column
                label="字段中文名"
                width="180">
                <template slot-scope="scope">
                  <a href="javascript:void(0)">{{ scope.row.name }}</a>
                </template>
              </el-table-column>
              <el-table-column
                prop="verfication_code"
                label="字段名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="accessSysDialect.name"
                label="字段类型">
              </el-table-column>
              <el-table-column
                prop="accessSysType.name"
                label="字段长度">
              </el-table-column>
              <el-table-column
                prop="accessSysType.name"
                label="是否为空">
              </el-table-column>
              <el-table-column
                prop="accessSysType.name"
                label="是否为主键">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="是否为索引">
              </el-table-column>
              <el-table-column
                prop="accessSysType.name"
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
              >
              <el-table-column
                prop="name"
                label="字段中文名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="verfication_code"
                label="字段名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="accessSysDialect.name"
                label="字段类型">
              </el-table-column>
              <el-table-column
                prop="accessSysType.name"
                label="字段长度">
              </el-table-column>
              <el-table-column
                prop="accessSysType.name"
                label="是否为空">
              </el-table-column>
              <el-table-column
                prop="accessSysType.name"
                label="是否为主键">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="是否为索引">
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
          <el-footer>
            <div class="enc-pagination">
              <el-pagination v-if="mainTableReady" style="float:right; margin:10px;"
                @current-change="goPreviewPage"
                background
                :page-size="20"
                :total="mainTableDataTotal2"
                layout="prev, pager, next, jumper"
                :current-page.sync="currentPage2">
              </el-pagination>
            </div>
          </el-footer>
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
import add1 from './../dialog/'


export default {
  name: 'DashboardAdmin',
  data() {
    return {
      queryParamReady:true,
      currentPage1:1,
      currentPage2:1,
      tableHeight: window.innerHeight - 280,
      mainTableReady:true,
      mainTableData1: [],
      mainTableData2: [],
      mainTableDataTotal1: 0,
      mainTableDataTotal2: 0,
      dialogVisible:false,
      myDialogRouter:'adminAdd',
      dialogTitle:'新增',
      tabPosition:'metadataManage',
      tableParams:{
        pageNum1:1,
        pageNum2:1
      }
    }
  },
  components: {
    add1
  },
  activated(){
    this.getTableParam();
  },
  // mounted(){
  // },
  // created(){
  // },
  methods:{
    loadTable:function(){
      var _self = this;
      this.$ajax.get('./list',{
        params:this.tableParams
      }).then(function(res){
        _self.mainTableData1 = res.data.page.list;
        _self.mainTableDataTotal1 = res.data.page.total;
        //这里是异步的，存在延迟，所以没问题,如果是同步的话可能存在问题
        _self.currentPage1 = _self.tableParams.pageNum1;
      })
      .catch(function(err){
        _self.currentPage1 = _self.tableParams.pageNum1;
        console.log(err)
      });
      this.$ajax.get('./list',{
        params:this.tableParams
      }).then(function(res){
        _self.mainTableData2 = res.data.page.list;
        _self.mainTableDataTotal2 = res.data.page.total;
        //这里是异步的，存在延迟，所以没问题,如果是同步的话可能存在问题
        _self.currentPage2 = _self.tableParams.pageNum2;
      })
      .catch(function(err){
        _self.currentPage2 = _self.tableParams.pageNum2;
        console.log(err)
      });
    },
    goPage:function(val){
      var paramsObj = {
        pageNum1:val,
        pageNum2:this.tableParams.pageNum2,
        tabPosition:this.tabPosition
      };
      this.$router.push({name:this.$route.name,query:paramsObj});
    },
    goPreviewPage:function(val){
      var paramsObj = {
        pageNum1:this.tableParams.pageNum1,
        pageNum2:val,
        tabPosition:this.tabPosition
      };
      this.$router.push({name:this.$route.name,query:paramsObj});
    },
    showAdd:function(){
      this.myDialogRouter = 'adminAdd';
      this.dialogTitle = '新增';
      this.dialogVisible = true;
    },
    showEdit:function(){
      this.myDialogRouter = 'adminEdit';
      this.dialogTitle = '修改';
      this.dialogVisible = true;
    },
    getTableParam:function(){
      this.tableParams.pageNum1 = this.$route.query.pageNum1?parseInt(this.$route.query.pageNum1):1;
      this.tableParams.pageNum2 = this.$route.query.pageNum2?parseInt(this.$route.query.pageNum2):1;
      this.tabPosition = this.$route.query.tabPosition == 'metadataManage' || this.$route.query.tabPosition == 'dataPreview'?this.$route.query.tabPosition:'metadataManage';
      this.loadTable();
      this.queryParamReady = true;
      // this.$store.commit('setQueryParams', {
      //   name:this.$route.name,
      //   data:this.$route.query
      // });
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
