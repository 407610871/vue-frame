<template>
  <div class="nav-menu">
    <el-menu
      :default-active="activeIndex"
      class="enc-nav-menu"
      mode="horizontal"
      @select="handleSelect"
      text-color="#425365"
      active-text-color="#499bd7">
      <el-menu-item index="1"><i class="enc-icon-shujujieru"></i>数据接入</el-menu-item>
      <el-menu-item index="2"><i class="enc-icon-shujuchuli"></i>数据处理</el-menu-item>
      <el-menu-item index="3">  <i class="enc-icon-renwuzhongxin"></i>任务中心    </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '3'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // this.$router.push({path:'/dashboard'});
      switch (key){
        case '3':
      this.$router.push({path:'/task'});
      break;
      case '1':
      this.$router.push({path:'/dashboard'});
      break;



      }
      
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
        i{
          margin-right:10px;
          font-size:36px;
          color:#4f4f4f;
        }
      }
      .is-active{
        i{
          color:#409EFE;
        }
      }
      .el-menu-item:hover,
      .el-menu-item:focus{
        i{
          color:#fff;
        }
      }

      .el-submenu {
        height: $enc-nav-header-height;
        line-height: $enc-nav-header-height;
      }
    }
  }
</style>
