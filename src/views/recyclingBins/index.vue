<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container">
      <el-header class="filter-container" :height="headerHeight">
        <el-button v-on:click="collapseExpand" size="mini" class="right-btn"><i :class="{'el-icon-plus':collapse,'el-icon-minus':!collapse}"></i></el-button>
        <formFliter v-if="queryParamReady" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @formFilter="changeFormFilter" />
      </el-header>
      <el-main style="padding-bottom:0; padding-top:0;">
        <el-table
          :data="mainTableData"
          stripe
          :height="tableHeight"
          border
          style="width: 100%"
          >
          <el-table-column
            label="接入源名称"
            width="180">
            <template slot-scope="scope">
              <a href="javascript:void(0)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="verfication_code"
            label="接入源ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="accessSysDialect.name"
            label="接入源类型">
          </el-table-column>
          <el-table-column
            prop="accessSysType.name"
            label="对接平台">
          </el-table-column>
          <el-table-column
            prop="accessSysType.name"
            label="接入数据来源">
          </el-table-column>
          <el-table-column
            prop="accessSysType.name"
            label="注册时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">恢复</el-button>
              <el-button
                size="mini"
                @click="handleCopy(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="enc-pagination">
          <el-pagination v-if="queryParamReady" style="float:right; margin:10px;"
            @current-change="goPage"
            background
            :page-size="20"
            :total="mainTableDataTotal"
            layout="prev, pager, next, jumper"
            :current-page.sync="currentPage">
          </el-pagination>
        </div>
      </el-footer>
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
import add1 from './dialog/'
import formFliter from './../../components/formFliter'

export default {
  name: 'DashboardAdmin',
  data() {
    return {
      queryParamReady:false,
      collapse:true,
      mainTableData: [],
      currentPage: 1,
      mainTableDataTotal: 1,
      dialogVisible:false,
      myDialogRouter:'adminAdd',
      dialogTitle:'新增'
    }
  },
  components: {
    add1,
    formFliter
  },
  computed: {
    tableParams:function(){
      return this.$store.state.queryParams.recyclingBins
    },
    tableHeight: function(){
      return this.collapse?window.innerHeight - 226:window.innerHeight - 305;
    },
    headerHeight:function(){
      return this.collapse?'50px':'130px';
    }
  },
  watch: {
    tableParams(newVal,oldVal){
      this.loadTable();
    }
  },
  created(){
    this.$root.eventHub.$on('search', (keyword)=>{
      this.search(keyword);
    })
  },
  mounted(){
    var queryParams = this.$store.state.queryParams.recyclingBins;
    this.loadTable();
    var accessSourceType = queryParams.accessSourceType?queryParams.accessSourceType:[];
    var accessDataSource = queryParams.accessDataSource?queryParams.accessDataSource:[];
    var exchangePlatform = queryParams.exchangePlatform?queryParams.exchangePlatform:[];
    for(var i=0;i<accessSourceType.length;i++){
      accessSourceType[i] = parseInt(accessSourceType[i]);
    }
    this.formFilterData = [{
      name:"接入源类型：",
      id:'accessSourceType',
      checkData:this.$store.state.accessSourceType,
      seledData:accessSourceType
    },{
      name:"接入数据来源：",
      id:'accessDataSource',
      checkData:this.$store.state.accessDataSource,
      seledData:accessDataSource
    },{
      name:"对接平台：",
      id:'exchangePlatform',
      checkData:this.$store.state.exchangePlatform,
      seledData:exchangePlatform
    }];
    this.queryParamReady = true;
  },
  methods:{
    collapseExpand:function(){
      this.collapse = !this.collapse;
    },
    loadTable:function(){
      var _self = this;
      this.$ajax.get('http://localhost:8080/list',{
        params:this.tableParams
      }).then(function(res){
        console.log('tableLoaded:recyclingBins');
        _self.mainTableData = res.data.page.list;
        _self.mainTableDataTotal = res.data.page.total;
        //这里是异步的，存在延迟，所以没问题,如果是同步的话可能存在问题
        _self.currentPage = _self.tableParams.pageNum;
      })
      .catch(function(err){
        _self.currentPage = _self.tableParams.pageNum;
        console.log(err);
      });
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
    setStore:function(obj){
      let storeData = JSON.parse(JSON.stringify(this.$store.state.queryParams[this.$route.name]));
      for(var i in obj){
        storeData[i] = obj[i];
      }
      this.$store.commit('setQueryParams', {
        name:this.$route.name,
        data:storeData
      });
    },
    goPage:function(val){
      this.setStore({
        pageNum:val
      });
    },
    search:function(keyword){
      this.setStore({
        pageNum:1,
        keyword:keyword
      });
    },
    changeFormFilter:function(fliterParams){
      this.setStore(fliterParams);
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  background-color: #fff;
  .filter-container {
    padding-top:10px;
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
    form {
      padding-top:0;
      margin-right: 100px;
    }
    .el-form-item {
      margin-bottom: 2px;
    }
    .right-btn{
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
