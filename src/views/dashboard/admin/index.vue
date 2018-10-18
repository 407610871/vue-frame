<template>
  <div>
    <el-container style="height:100%;">
      <el-header class="filter-container">
        <div class="filter-container">
          查询条件区域<el-button v-on:click="showAdd">add</el-button><el-button v-on:click="showEdit">edit</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="mainTableData"
          stripe
          height="100%"
          border
          style="width: 100%"
          >
          <el-table-column
            label="接入源名称"
            width="180">
            <template slot-scope="scope">
              <!-- <router-link to="/dashboardsub">{{ scope.row.name }}</router-link> -->
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
import add from './add'
import add1 from './../dialog/'


export default {
  name: 'DashboardAdmin',
  data() {
    return {
      mainTableReady:true,
      mainTableData: this.$store.state.mainTableData,
      mainTablePage: 1,
      mainTableDataTotal: 0,
      dialogVisible:false,
      myDialogRouter:'adminAdd',
      dialogTitle:'新增'
    }
  },
  mounted(){
    var _self = this;
    this.$ajax.get('./list?pageNum=1&pageSize=20').then(function(res){
      console.log(res);
      _self.mainTableData = res.data.page.list;
      // Vue.set(_self.$store.state,'mainTableData',res.data);
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
  methods:{
    loadPage:function(val){
      _self.mainTablePage = val;
      this.$ajax.get('./list?pageNum=1&pageSize=20').then(function(res){
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
  },
  components: {
    add,
    add1
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>


.dashboard-container {
  .filter-container {
    padding: 32px;
    height: 150px;
    background: #fff;
  }
  .table-container {
    padding: 32px;
  }
  .enc-pagination {
    float: right;
    margin-top: 33px;
  }
}
</style>
