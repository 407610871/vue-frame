<template>
  <el-container>
  <el-header height="66px" class="enc-header">
    <div class="enc-logo">
      <img :src="logo" alt="">
    </div>
    <nav-menu />
  </el-header>
  <el-container>
    <el-aside width="210px" class="enc-aside">
      <aside-tree></aside-tree>
    </el-aside>
    <el-main class="enc-main">
      <div class="enc-sub-header">
        原始区
      </div>
      <app-main />
    </el-main>
  </el-container>
  </el-container>
</template>
<script>
import { AppMain, AsideTree, NavMenu } from './components'
import logo from '@/assets/images/enc-logo.png'


export default {
  name: 'Layout',
  data() {
    return {
      logo: logo + '?' + +new Date(),
    }
  },
  components: {
    AppMain,
    AsideTree,
    NavMenu
  },
  computed: {
  
  },
  methods: {
   
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .enc-logo {
    display: inline-block;
    width: 210px;
    background: #d7dce0;
    height: 100%;
    line-height: $enc-nav-header-height;
    text-align: center;
    vertical-align: top;
    img {
      width: 159px;
      vertical-align: middle;
    }
  }

  .enc-header {
    padding: 0;
    height: $enc-nav-header-height;
    line-height: $enc-nav-header-height;
    background: #e6eaed;
  }

  .enc-aside {
    width: 210px;
    background: #494f5b;
  }

  .enc-main {
    padding: 0;
  }

  .enc-sub-header {
    padding-left: 30px;
    margin-top: 3px;
    height: $enc-nav-sub-header-height;
    line-height: $enc-nav-sub-header-height;
    color: #465167;
    font-size: 18px;
    background: #eff3f6;
  }

</style>
