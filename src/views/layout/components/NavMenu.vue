<template>
  <div class="nav-menu">
    <el-menu
      :default-active="activeIndex"
      class="enc-nav-menu"
      mode="horizontal"
      @select="handleSelect"
      text-color="#425365"
      active-text-color="#499bd7">
      <el-menu-item index="1"><router-link to="/dashboard">首页</router-link></el-menu-item>
      <el-menu-item index="3"><router-link to="/form">表单</router-link></el-menu-item>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">饿了么</a></el-menu-item>
      <el-submenu class="enc-submenu" index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
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