<template>
  <div class="dashboard-container">
    <div class="filter-container">
      查询条件区域
    </div>
    <div class="table-container">
      表格2
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
