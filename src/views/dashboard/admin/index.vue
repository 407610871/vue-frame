<template>
  <div class="dashboard-container">
    <div class="filter-container">
      查询条件区域
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          label="日期"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="name"
          width="180">
        </el-table-column>
        <el-table-column
        prop="address"
        label="地址"
        width="250">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="详情" placement="top">
              <el-button
              size="mini"
              icon="el-icon-edit-outline"
              @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="enc-pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000">
        </el-pagination>
      </div>
    </div>
  </div>
    
</template>

<script>


export default {
  name: 'DashboardAdmin',
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  },
  components: {
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
