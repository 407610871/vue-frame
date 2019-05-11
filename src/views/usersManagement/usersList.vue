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
    </div>

  </div>
</template>

<script>

  export default {
    data(){
      return {
        
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
