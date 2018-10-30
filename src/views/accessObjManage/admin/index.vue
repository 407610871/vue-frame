<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container">
      <el-header class="filter-container" :height="headerHeight">
        <el-button v-on:click="collapseExpand" size="mini" class="right-btn"><i :class="{'el-icon-plus':collapse,'el-icon-minus':!collapse}"></i></el-button>
        <formFliter v-if="queryParamReady" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @formFilter="changeFormFilter" />
      </el-header>
      <el-main class="main-container">
        <div class="table-tools">
            <el-button v-on:click="updataSource" class="right-btn" style="margin-left:10px;">接入源更新</el-button>
            <table-inver></table-inver>
            <set-task></set-task>
        </div>
        <el-table :data="mainTableData" stripe :height="tableHeight" border style="width: 100%">
          <el-table-column type="selection" @selection-change="handleSelectionChange">
          </el-table-column>
          <el-table-column prop="verfication_code" label="资源名称" width="180">
          </el-table-column>
          <el-table-column prop="verfication_code" label="接入对象" width="180">
            <template slot-scope="scope">
              <a href="javascript:void(0)" v-on:click="goAccessObjInfo(scope.row)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="accessSysDialect.name" label="接入对象类型">
          </el-table-column>
          <el-table-column prop="accessSysType.name" label="持有者">
          </el-table-column>
          <el-table-column prop="accessSysType.name" label="源端数据量">
          </el-table-column>
          <el-table-column prop="accessSysType.name" label="描述">
          </el-table-column>
          <el-table-column prop="createTime" label="同步跟新时间">
          </el-table-column>
          <el-table-column prop="accessSysType.name" label="数量范围">
          </el-table-column>
          <el-table-column prop="accessSysType.name" label="状态信息">
          </el-table-column>
          <el-table-column prop="accessSysType.name" label="数据采集方式">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="updataSource(scope.$index, scope.row)">数据量更新</el-button>
              <div class="survey">
                <userSurvey :pdata="scope"></userSurvey>
              </div>
              <div class="survey">
                <single-task :pdata="scope"></single-task>
              </div>
              <div class="survey">
                <data-inver :pdata="scope"></data-inver>
              </div>

              <div class="survey">
                <norela-coll :pdata="scope"></norela-coll>
              </div>
              <div class="survey">
                <path-ftp></path-ftp>
              </div>
              <!--  <div class="survey">
                 <single-task :pdata="scope"></single-task>
                                 </div> -->
              <!--  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">数据采集</el-button> -->
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
    <el-dialog title="提示" :visible.sync="alertVisible" width="30%">
      <span>{{alertContent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="alertVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import add1 from './../dialog/'
import formFliter from './../../../components/formFliter'
import userSurvey from '@/views/accessObjManage/dialog/admin/user_survey'
import setTask from '@/views/accessObjManage/dialog/admin/set_task'
import singleTask from '@/views/accessObjManage/dialog/admin/single_task'
import tableInver from '@/views/accessObjManage/dialog/admin/table_inver'
import dataInver from '@/views/accessObjManage/dialog/admin/data_inver'
import pathFtp from '@/views/mainLay/dialog/path_ftp'
import norelaColl from '@/views/mainLay/dialog/norela_coll'
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      queryParamReady:false,
      collapse:true,
      mainTableReady: true,
      mainTableData: [],
      currentPage: 1,
      mainTableDataTotal: 1,
      dialogVisible: false,
      myDialogRouter: 'adminAdd',
      dialogTitle: '新增',
      alertVisible: false,
      alertContent: '',
      seledRows: [],
      collapse:true,
      formFilterData:[]
    }
  },
  computed:{
    tableParams:function(){
      return this.$store.state.queryParams.accessObjManage;
    },
    tableHeight: function(){
      return this.collapse?window.innerHeight - 280:window.innerHeight - 315;
    },
    headerHeight:function(){
      return this.collapse?'50px':'85px';
    }
  },
  components: {
    add1,
    formFliter,
    userSurvey,
    setTask,
    singleTask,
    tableInver,
    dataInver,
    pathFtp,
    norelaColl
  },
  watch: {
    tableParams(newVal,oldVal){
      this.loadTable();
    },
  },
  mounted() {
    var queryParams = this.$store.state.queryParams.dashboard;
    this.loadTable();
    this.formFilterData = [{
      name:"接入对象类型：",
      id:'accessObjType',
      checkData:[{
        id:'table',
        name:'表'
      },{
        id:'view',
        name:'视图'
      },{
        id:'other',
        name:'其他'
      }],
      seledData:this.tableParams.accessObjType?this.tableParams.accessObjType:[]
    },{
      name:"数据范围：",
      id:'dataArea',
      checkData:[{
        id:'city',
        name:'全市'
      },{
        id:'province',
        name:'全省'
      },{
        id:'country',
        name:'全国'
      },{
        id:'other',
        name:'其他'
      }],
      seledData:this.tableParams.dataArea?this.tableParams.dataArea:[]
    }];
    this.queryParamReady = true;
  },
  created(){
    this.$root.eventHub.$on('search', (keyword)=>{
      this.search(keyword);
    })
  },
  methods: {
    collapseExpand:function(){
      this.collapse = !this.collapse;
    },
    loadTable:function(){
      var _self = this;
      this.$ajax.get('http://localhost:8080/list',{
        params:this.tableParams
      }).then(function(res){
        console.log('tableLoaded:accessObjManage');
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
    goAccessObjInfo: function(row) {
      this.$router.push({ name: "accessObjInfo",params:{
        sourceId:this.$route.params.sourceId,
        sourceName:this.$route.params.sourceName,
        objId:row.id,
        objName:encodeURI(row.name)
      }});
    },
    search:function(keyword){
      this.setStore({
        pageNum:1,
        keyword:keyword
      });
    },
    showAdd: function() {
      this.myDialogRouter = 'adminAdd';
      this.dialogTitle = '新增';
      this.dialogVisible = true;
    },
    showEdit: function() {
      this.myDialogRouter = 'adminEdit';
      this.dialogTitle = '修改';
      this.dialogVisible = true;
    },
    updataSource: function(index, row) {
      var id;
      if (row) {
        id = row.id;
      } else {
        var ids = [];
        for (var value of this.seledRows) {
          ids.push(value.id);
        }
        id = ids.join(',');
      }
      this.$ajax.post('./updataSource', {
        params: {
          ids: id
        }
      }).then(function(res) {
        this.alertContent = '更新成功';
        this.alertVisible = true;
      }).catch(function(err) {
        console.log(err)
      });
    },
    handleSelectionChange: function(val) {
      this.seledRows = val;
    },
    changeFormFilter:function(fliterParams){
      this.setStore(fliterParams);
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  background: #fff;
  .filter-container {
    padding-top: 10px;
    background: #fff;
    form {
      margin-right: 350px;
    }
    .el-form-item {
      margin-bottom: 2px;
    }
    .right-btn {
      float: right;
    }
  }
  .main-container{
    padding-bottom:0;
    padding-top:0;
    .table-tools{
      padding-top:10px;
      height:55px;
      border-top:1px solid #eee;
      .right-btn {
        float: right;
      }
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
