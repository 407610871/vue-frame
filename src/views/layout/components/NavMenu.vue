<template>
  <div class="nav-menu">
    <el-menu
      :default-active="activeIndex"
      class="enc-nav-menu"
      mode="horizontal"
      @select="handleSelect"
      text-color="#425365"
      active-text-color="#499bd7">
      <el-menu-item index="1">数据接入</el-menu-item>
      <el-menu-item index="2">数据处理</el-menu-item>
      <el-menu-item index="3">任务中心</el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.$router.push({path:'/dashboardsub'});
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .nav-menu {
    display: inline-block;
    padding-left: 88px;

    .enc-nav-menu {
      background: transparent;

      .el-menu-item {
        height: $enc-nav-header-height;
        line-height: $enc-nav-header-height;
      }

      .el-submenu {
        height: $enc-nav-header-height;
        line-height: $enc-nav-header-height;
      }
    }
  }
</style>
