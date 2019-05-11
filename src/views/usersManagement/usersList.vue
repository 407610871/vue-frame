<template>
  <div>
    <el-breadcrumb separator>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main main-content">
      <div class="mr-btn">
        <el-button type="primary">增加用户</el-button>
        <el-button type="primary">删除</el-button>
      </div>
      <el-table
        :data="userList"
        class="mt-20"
        stripe
        style="width: 100%;">
        <el-table-column
          prop="id"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="IDCard"
          label="身份证号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="policeId"
          label="警员号">
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>

  export default {
    data(){
      return {
        userList: []
      }
    },
    created() {

    },
    methods: {
      goToRoute(key) {
        
      },

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
@import "src/styles/mixin.scss";
 
</style>
