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
        <!--  <el-button v-on:click="handleAdd" class="add-btn">add</el-button> -->
        <div class="regbtn fr">
          <reg-dialog></reg-dialog>
        </div>
        <div class="regbtn fr">
          <hdfs-add></hdfs-add>
        </div>
        <el-form :model="formFilter" label-width="150px">
          <el-form-item label="接入源类型：">
            <el-checkbox-group v-model="formFilter.type" @change="search">
              <el-checkbox v-for="item in accessSourceType" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="接入数据来源：">
            <el-checkbox-group v-model="formFilter.source">
              <el-checkbox v-for="item in accessDataSource" :label="item.static_CODE" :key="item.static_CODE">{{item.static_NAME}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="对接平台：">
            <el-checkbox-group v-model="formFilter.platform">
              <el-checkbox v-for="item in accessSourceType" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <!-- <el-button v-on:click="showAdd">add</el-button><el-button v-on:click="showEdit">edit</el-button> -->
      </el-header>
      <el-main style="padding-bottom:0;">
        <el-table :data="mainTableData" stripe :height="tableHeight" border style="width: 100%">
          <el-table-column label="接入源名称" width="180">
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
          <el-pagination v-if="mainTableReady" style="float:right; margin:10px;" @current-change="loadPage" background :page-size="20" :total="mainTableDataTotal" layout="prev, pager, next, jumper" :current-page.sync="mainTablePage">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
    <!-- <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <add1 :dialogRouter="myDialogRouter" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <router-view />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import add1 from './../dialog/'
import dataCount from './../../../components/dataCount'

import regDialog from './../dialog/admin/reg_dialog'
import editDialog from './../dialog/admin/edit_dialog'
import hdfsAdd from '@/views/mainLay/dialog/hdfs_add'
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      tableHeight: window.innerHeight - 400,
      mainTableReady: true,
      mainTableData: this.$store.state.mainTableData,
      mainTablePage: this.$route.query.pageNum ? parseInt(this.$route.query.pageNum) : 1,
      mainTableDataTotal: 0,
      tableFliter: {},
      dialogVisible: false,
      myDialogRouter: 'adminAdd',
      dialogTitle: '新增',
      accessSourceType: [],
      accessDataSource: [],
      exchangePlatform: [],
      formFilter: {
        type: [],
        source: [],
        platform: []
      },
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
      }
    }
  },
  components: {
    add1,
    dataCount,
    regDialog,
    hdfsAdd,
    editDialog
  },
  $route() {
    this.getTableParam();
  },
  created() {
    this.getTableParam();
  },
  mounted() {
    var _self = this;

    // setTimeout(function(){
    //   _self.getTableParam();
    // },2000)
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
    this.$ajax.get('./getAccessSourceType').then(function(res) {
        _self.accessSourceType = res.data;
        _self.$store.commit('setAccessSourceType', {
          data: res.data
        });
      })
      .catch(function(err) {
        console.log(err)
      });
    this.$ajax.get('./getAccessDataSource').then(function(res) {
        _self.accessDataSource = res.data.staticDatas.SJLY;
        _self.$store.commit('setAccessDataSource', {
          data: res.data.staticDatas.SJLY
        });
      })
      .catch(function(err) {
        console.log(err)
      });
    this.$ajax.get('./getExchangePlatform').then(function(res) {
        _self.exchangePlatform = res.data;
        _self.$store.commit('setExchangePlatform', {
          data: res.data
        });
      })
      .catch(function(err) {
        console.log(err)
      });
  },
  methods: {
    loadPage: function(val) {
      var _self = this;
      _self.mainTablePage = val;
      this.$ajax.get('./list?pageNum=1&pageSize=20', this.tableFliter).then(function(res) {
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
    goSubPage: function(index) {
      this.$router.push({ path: 'accessObjManage/' + this.mainTableData[index].id + '/' + encodeURI(this.mainTableData[index].name) });
    },
    handleAdd: function() {
      this.myDialogRouter = 'adminAdd';
      this.dialogTitle = '新增';
      this.dialogVisible = true;
    },
    handleEdit: function(index, row) {
      this.myDialogRouter = 'adminEdit';
      this.dialogTitle = '修改';
      this.dialogVisible = true;
    },
    handleCopy: function(index, row) {
      this.$ajax.post('./copy', {
          params: {
            id: row.id
          }
        }).then(function(res) {
          loadPage(1);
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
          loadPage(this.mainTablePage);
        })
        .catch(function(err) {
          console.log(err)
        });
    },
    search: function() {
      this.tableFliter.keywords = '';
      this.loadPage(1);
    },
    getTableParam: function() {
      console.log(this.mainTablePage);
      this.mainTablePage = this.$route.query.pageNum ? parseInt(this.$route.query.pageNum) : 1;
      console.log(this.mainTablePage);
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  .filter-container {
    padding-top: 10px;
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
      margin-right: 100px;
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
