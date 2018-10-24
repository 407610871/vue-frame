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
      <el-main style="padding-bottom:0;">
        <el-container style="height:100%;" class="dashboard-container" v-show="tabPosition == 'metadataManage'">
          <el-main style="padding-bottom:0;">
            <el-table
              :data="mainTableData"
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
                @current-change="loadPage"
                background
                :page-size="20"
                :total="mainTableDataTotal"
                layout="prev, pager, next, jumper"
                :current-page.sync="mainTablePage">
              </el-pagination>
            </div>
          </el-footer>
        </el-container>

        <el-container style="height:100%;" class="dashboard-container" v-show="tabPosition != 'metadataManage'">
          <el-main style="padding-bottom:0;">
            <el-table
              :data="mainTableData"
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
                  <span>{{ scope.row.name }}</span>
                  <el-tooltip placement="bottom">
                    <div slot="content">多行信息<br/>第二行信息</div>
                    <el-button><i class="el-icon-caret-bottom"></i></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <div class="enc-pagination">
              <el-pagination v-if="mainTableReady" style="float:right; margin:10px;"
                @current-change="loadPage"
                background
                :page-size="20"
                :total="mainTableDataTotal"
                layout="prev, pager, next, jumper"
                :current-page.sync="mainTablePage">
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
      tableHeight: window.innerHeight - 300,
      mainTableReady:true,
      mainTableData: this.$store.state.mainTableData,
      mainTablePage: 1,
      mainTableDataTotal: 0,
      dialogVisible:false,
      myDialogRouter:'adminAdd',
      dialogTitle:'新增',
      tabPosition:'metadataManage'
    }
  },
  components: {
    add1
  },
  mounted(){
    var _self = this;
    this.$ajax.get('./list?pageNum=1&pageSize=20').then(function(res){
      _self.mainTableData = res.data.page.list;
      _self.$store.commit('setMainTableData', {
        data:res.data.page.list
      });
      _self.mainTableDataTotal = res.data.page.total;
      _self.mainTableReady = true;
    })
    .catch(function(err){
      console.log(err)
    });
  },
  created(){

  },
  methods:{
    loadPage:function(val,extraParam){
      var _self = this;
      _self.mainTablePage = val;
      var param = extraParam?extraParam:{};
      this.$ajax.get('./list?pageNum=1&pageSize=20',param).then(function(res){
        _self.mainTableData = res.data.page.list;
        // Vue.set(_self.$store.state,'mainTableData',res.data);
        _self.$store.commit('setMainTableData', {
          data:res.data.page.list
        });
        _self.mainTableDataTotal = res.data.page.total;
      })
      .catch(function(err){
        console.log(err)
      });
      this.breadListLast();
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  .filter-container {
    padding-top:40px;
    background: #fff;
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
