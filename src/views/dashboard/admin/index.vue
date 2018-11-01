<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container">
      <el-header class="filter-container" :height="headerHeight" >
        <div class="count-container">
          <div class="count-title">
            <label>数据元注册总数</label>
            <div class="all-number">{{mainTableDataTotal}}</div>
          </div>
          <div class="line"></div>
          <dataCount v-bind:dataObj="count1Data" class="countData" />
          <div class="line"></div>
          <dataCount v-bind:dataObj="count2Data" class="countData" />
        </div>
        <!-- <el-button v-on:click="handleAdd" class="right-btn">add</el-button> -->
        <div class="regbtn fr">
          <reg-dialog @refreshTable="loadTable"></reg-dialog>
        </div>
        <div class="regbtn fr">
          <hdfs-add></hdfs-add>
        </div>
        <el-button v-on:click="collapseExpand" size="mini" class="right-btn"><i :class="{'el-icon-plus':collapse,'el-icon-minus':!collapse}"></i></el-button>
        <formFliter v-if="queryParamReady" v-bind:formCollapse="collapse" v-bind:dataObj="formFilterData" @formFilter="changeFormFilter" />
      </el-header>
      <el-main style="padding-bottom:0;">
        <router-view />
        <el-table :data="mainTableData" stripe :height="tableHeight" border style="width: 100%" tooltip-effect="light">
          <el-table-column label="接入源名称" width="250" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href="javascript:void(0)" v-on:click="goSubPage(scope.$index)">{{ scope.row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="verfication_code" label="接入源ID" width="180">
          </el-table-column>
          <el-table-column prop="accessSysDialect.name" label="接入源类型">
          </el-table-column>
          <el-table-column prop="accessSysType.name" label="对接平台">
          </el-table-column>
          <el-table-column prop="accessSysType.name" label="接入数据来源">
          </el-table-column>
          <el-table-column prop="createTime" label="注册时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
              <edit-dialog></edit-dialog>
              <el-button size="mini" @click="handleCopy(scope.$index, scope.row)">复制</el-button>
              <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">废止</el-button>
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
    <router-view />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import add1 from './../dialog/'
import dataCount from './../../../components/dataCount'
import formFliter from './../../../components/formFliter'

import regDialog from './../dialog/admin/reg_dialog'
import editDialog from './../dialog/admin/edit_dialog'
import hdfsAdd from '@/views/mainLay/dialog/hdfs_add'
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      queryParamReady:false,
      currentPage:1,
      mainTableData: [],
      mainTableDataTotal: 1,
      dialogVisible:false,
      myDialogRouter:'adminAdd',
      dialogTitle:'新增',
      collapse:true,
      count1Data: {
        name: '批式接入统计',
        list: [{
          name: 'mysql',
          number: 111,
          color: '#f90'
        }, {
          name: 'oracle',
          number: 163,
          color: '#069'
        }]
      },
      count2Data: {
        name: '实时统计',
        list: [{
          name: 'mysql',
          number: 41,
          color: '#f90'
        }, {
          name: 'oracle',
          number: 22,
          color: '#069'
        }, {
          name: 'kafka',
          number: 37,
          color: '#990'
        }]
      },
      formFilterData:[]
    }
  },
  computed:{
    tableParams:function(){
      return this.$store.state.queryParams.dashboard
    },
    tableHeight: function(){
      return this.collapse?window.innerHeight - 360:window.innerHeight - 430;
    },
    headerHeight:function(){
      return this.collapse?'160px':'230px';
    }
  },
  components: {
    add1,
    dataCount,
    formFliter,
    regDialog,
    hdfsAdd,
    editDialog
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
    console.log(this.$store.state);
    var queryParams = this.$store.state.queryParams.dashboard;
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
      console.log("refresh");
      var _self = this;
      this.$ajax.get('http://localhost:8080/list',{
        params:this.tableParams
      }).then(function(res){
        console.log('tableLoaded:dashboard');
        _self.mainTableData = res.data.page.list;
        _self.mainTableDataTotal = res.data.page.total;
        _self.currentPage = _self.tableParams.pageNum;
        // setTimeout(function(){
        //这里是异步的，存在延迟，所以没问题,如果是同步的话可能存在问题
        // },100)
      })
      .catch(function(err){
        _self.currentPage = _self.tableParams.pageNum;
        console.log(err)
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
    goSubPage:function(index){
      this.$router.push({name:'accessObjManage',params:{sourceId:this.mainTableData[index].id,sourceName:encodeURI(this.mainTableData[index].name)}});
    },
    handleAdd: function() {
      //新增
    },
    handleEdit: function(index, row) {
      //修改
    },
    handleCopy: function(index, row) {
      this.$ajax.post('./copy', {
        params: {
          id: row.id
        }
      }).then(function(res) {
        this.loadTable(1);
      })
      .catch(function(err) {
        console.log(err)
      });
    },
    handleDelete: function(index, row) {
      this.$ajax.post('./delete', {
        params: {
          id: row.id
        }
      }).then(function(res) {
        this.loadTable(this.mainTablePage);
      })
      .catch(function(err) {
        console.log(err)
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
