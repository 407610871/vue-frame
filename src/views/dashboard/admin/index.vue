<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container">
      <el-header class="filter-container" height="200px">
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
        <el-button v-on:click="showAdd" class="add-btn">add</el-button>
        <el-form :model="formFilter" label-width="150px">
          <el-form-item label="接入源类型：">
            <el-checkbox-group v-model="formFilter.type">
              <el-checkbox label="mysql" name="type"></el-checkbox>
              <el-checkbox label="oracle" name="type"></el-checkbox>
              <el-checkbox label="sqlserver" name="type"></el-checkbox>
              <el-checkbox label="postgresql" name="type"></el-checkbox>
              <el-checkbox label="ftp" name="type"></el-checkbox>
              <el-checkbox label="rabbitmq" name="type"></el-checkbox>
              <el-checkbox label="activemq" name="type"></el-checkbox>
              <el-checkbox label="mongodb" name="type"></el-checkbox>
              <el-checkbox label="本地文件" name="type"></el-checkbox>
              <el-checkbox label="其他" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="接入数据来源：">
            <el-checkbox-group v-model="formFilter.source">
              <el-checkbox label="公安网" name="source"></el-checkbox>
              <el-checkbox label="私网" name="source"></el-checkbox>
              <el-checkbox label="委办网" name="source"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="对接平台：">
            <el-checkbox-group v-model="formFilter.platform">
              <el-checkbox label="治安电动车" name="platform"></el-checkbox>
              <el-checkbox label="刑侦电围" name="platform"></el-checkbox>
              <el-checkbox label="WIFI平台" name="platform"></el-checkbox>
              <el-checkbox label="移动警务" name="platform"></el-checkbox>
              <el-checkbox label="廊坊资源平台" name="platform"></el-checkbox>
              <el-checkbox label="可视化警务平台" name="platform"></el-checkbox>
              <el-checkbox label="海燕车辆二次识别" name="platform"></el-checkbox>
              <el-checkbox label="卡口过车数据" name="platform"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <!-- <el-button v-on:click="showAdd">add</el-button><el-button v-on:click="showEdit">edit</el-button> -->
      </el-header>
      <el-main style="padding-bottom:0;">
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
              <a href="javascript:void(0)" v-on:click="goSubPage(scope.$index)">{{ scope.row.name }}</a>
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
            prop="createTime"
            label="注册时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
import dataCount from './../../../components/dataCount'


export default {
  name: 'DashboardAdmin',
  data() {
    return {
      tableHeight: window.innerHeight - 400,
      mainTableReady:true,
      mainTableData: this.$store.state.mainTableData,
      mainTablePage: 1,
      mainTableDataTotal: 0,
      dialogVisible:false,
      myDialogRouter:'adminAdd',
      dialogTitle:'新增',
      formFilter:{
        type: '',
        source: '',
        platform:''
      },
      count1Data:{
        name:'批式接入统计',
        list:[{
          name:'mysql',
          number:111,
          color:'#f90'
        },{
          name:'oracle',
          number:163,
          color:'#069'
        }]
      },
      count2Data:{
        name:'实时统计',
        list:[{
          name:'mysql',
          number:41,
          color:'#f90'
        },{
          name:'oracle',
          number:22,
          color:'#069'
        },{
          name:'kafka',
          number:37,
          color:'#990'
        }]
      }
    }
  },
  components: {
    add1,
    dataCount
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
    this.$root.eventHub.$on('search',(keyword)=>{
      this.loadPage(1,keyword);
    });
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
    },
    goSubPage:function(index){
      this.$router.push({path:'/dashboardsub'});
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
    padding-top:10px;
    background: #fff;
    .count-container{
      border-bottom: 1px solid #d9d9d9;
      margin:0 20px 10px 20px;
      .count-title{
        display:inline-block;
        margin:10px 5% 10px 40px;
        width:8%;
        text-align: center;
        label{
          display: inline-block;
          margin-bottom: 10px;
          color:#999;
          font-size:14px;
        }
        .all-number{
          color:#425365;
          font-size: 24px;
          font-weight: bold;
        }
      }
      .countData{
        display:inline-block;
        margin:10px 5%;
        width:25%;
      }
      .line{
        display:inline-block;
        margin:32px 0 12px 0;
        height:30px;
        width:3px;
        background-color: #999;
        border-radius: 2px;
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
