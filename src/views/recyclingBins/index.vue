<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container">
      <el-header class="filter-container" height="106px">
        <formFilter v-bind:dataObj="formFilterData" @formFilter="formFilter" />
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
import add1 from './dialog/'
import formFilter from './../../components/formFliter'


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
      dialogTitle:'新增'
    }
  },
  components: {
    add1,
    formFilter
  },
  computed: {
    formFilterData:function(){
      var list = [{
        name:"接入源类型：",
        id:'accessSourceType',
        checkData:this.$store.state.accessSourceType,
        seledData:[]
      },{
        name:"接入数据来源：",
        id:'accessDataSource',
        checkData:this.$store.state.accessDataSource,
        seledData:[]
      },{
        name:"对接平台：",
        id:'exchangePlatform',
        checkData:this.$store.state.exchangePlatform,
        seledData:[]
      }];
      return list;
    }
  },
  mounted(){
    var _self = this;
    setTimeout(function(){
      console.log('1231231')
      console.log(_self.$store.state.accessSourceType)
    },3000)
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
    },
    formFilter:function(fliterParams){
      console.log('formFilter:');
      console.log(fliterParams);
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
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
