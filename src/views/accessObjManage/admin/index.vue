<template>
  <div>
    <el-container style="height:100%;" class="dashboard-container">
      <el-header class="filter-container" height="90px">
        <el-button v-on:click="updataSource" class="add-btn" style="margin-left:10px;">接入源更新</el-button>
        <!--  <el-button v-on:click="showAdd" class="add-btn">验核报告</el-button> -->
          <table-inver></table-inver>
          <set-task></set-task>
       <!--  <el-button v-on:click="showAdd" class="add-btn">批量采集</el-button> -->
        <el-form :model="formFilter" label-width="150px">
          <el-form-item label="接入对象类型">
            <el-checkbox-group v-model="formFilter.type">
              <el-checkbox label="table" value="table">表</el-checkbox>
              <el-checkbox label="view" value="view">视图</el-checkbox>
              <el-checkbox label="other" value="other">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="数据范围：">
            <el-checkbox-group v-model="formFilter.source">
              <el-checkbox label="city" value="city">全市</el-checkbox>
              <el-checkbox label="province" value="province">全省</el-checkbox>
              <el-checkbox label="country" value="country">全国</el-checkbox>
              <el-checkbox label="other" value="other">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main style="padding-bottom:0;">
        <el-table :data="mainTableData" stripe :height="tableHeight" border style="width: 100%">
          <el-table-column type="selection" @selection-change="handleSelectionChange">
          </el-table-column>
          <el-table-column prop="verfication_code" label="资源名称" width="180">
          </el-table-column>
          <el-table-column prop="verfication_code" label="接入对象" width="180">
            <template slot-scope="scope">
              <router-link :to="{ name: 'accessObjInfo', params: {objId:scope.row.id,objName:encodeURI(scope.row.name)} }">{{ scope.row.name }}</router-link>
              <!-- <a href="javascript:void(0)" v-on:click="goAccessObjInfo(scope.$index)">{{ scope.row.name }}</a> -->
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
              <!-- <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">用户调研</el-button> -->
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
          <el-pagination v-if="mainTableReady" style="float:right; margin:10px;" @current-change="loadPage" background :page-size="20" :total="mainTableDataTotal" layout="prev, pager, next, jumper" :current-page.sync="mainTablePage">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
    <!-- <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <add1 :dialogRouter="myDialogRouter" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
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
      tableHeight: window.innerHeight - 290,
      mainTableReady: true,
      mainTableData: this.$store.state.mainTableData,
      mainTablePage: 1,
      mainTableDataTotal: 0,
      dialogVisible: false,
      myDialogRouter: 'adminAdd',
      dialogTitle: '新增',
      alertVisible: false,
      alertContent: '',
      seledRows: [],
      formFilter: {
        type: [],
        source: []
      }
    }
  },
  components: {
    add1,
    userSurvey,
    setTask,
    singleTask,
    tableInver,
    dataInver,
    pathFtp,
    norelaColl

  },
  mounted() {
    var _self = this;
    this.$ajax.get('./list?pageNum=1&pageSize=20').then(function(res) {
        _self.mainTableData = res.data.page.list;
        _self.$store.commit('setMainTableData', {
          data: res.data.page.list
        });
        _self.mainTableDataTotal = res.data.page.total;
        _self.mainTableReady = true;
      })
      .catch(function(err) {
        console.log(err)
      });
  },
  created() {

  },
  methods: {
    loadPage: function(val, extraParam) {
      var _self = this;
      _self.mainTablePage = val;
      var param = extraParam ? extraParam : {};
      this.$ajax.get('./list?pageNum=1&pageSize=20', param).then(function(res) {
          _self.mainTableData = res.data.page.list;
          // Vue.set(_self.$store.state,'mainTableData',res.data);
          _self.$store.commit('setMainTableData', {
            data: res.data.page.list
          });
          _self.mainTableDataTotal = res.data.page.total;
        })
        .catch(function(err) {
          console.log(err)
        });
    },
    goAccessObjInfo: function(index) {
      // console.log(this.$route.path);
      this.$router.go({ path: "accessObjInfo/" + this.mainTableData[index].id + "/" + encodeURI(this.mainTableData[index].name) });
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
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  .filter-container {
    padding-top: 10px;
    background: #fff;
    form {
      margin-right: 350px;
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
}

</style>
