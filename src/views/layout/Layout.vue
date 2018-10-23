<template>
  <el-container>
  <el-header height="66px" class="enc-header">
    <div class="enc-logo">
      <img :src="logo" alt="">
    </div>
    <nav-menu />
    <div class="right-menu">
      <el-button class="user" type="primary" icon="enc-icon-user"></el-button>
      <el-button class="setting" type="primary" icon="enc-icon-setting"></el-button>
      <el-button class="document" type="primary" icon="enc-icon-documents"></el-button>
    </div>
  </el-header>
  <el-container>
    <el-aside width="210px" class="enc-aside">
      <!--<aside-tree></aside-tree>-->
      <new-aside-tree></new-aside-tree>
    </el-aside>
    <el-main class="enc-main">
      <div class="enc-sub-header">
        <el-breadcrumb class="breadcrumb-container" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in levelList":key="item.path" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <app-main />
    </el-main>
  </el-container>
  </el-container>
</template>
<script>
import { AppMain, AsideTree, NavMenu,  NewAsideTree} from './components'

import logo from '@/assets/images/enc-logo.png'


export default {
  name: 'Layout',
  data() {
    return {
      logo: logo + '?' + +new Date(),
      levelList: []
    }
  },
  watch: {
    $route() {
        this.getBreadcrumb()
    }
  },
  created(){
    this.getBreadcrumb()
  },
  components: {
    AppMain,
    AsideTree,
    NavMenu,
    NewAsideTree,
  },
  computed: {

  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0];
      if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
        matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
      }
      this.levelList = matched
    }
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

    .right-menu {
      float: right;
      height: 100%;

      .el-button {
        width: 88px;
        height: 100%;
        margin: 0;
        border-radius: 0;
        border: 0;
        padding: 0;

        &.user {
          background: #cacfd5;
        }
        &.setting {
          background: #50609c;
          i {
            color: #fff;
          }
        }
        &.document {
          background: #479bd9;
          i {
            color: #fff;
          }
        }
      }
    }
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

    .el-breadcrumb {
      line-height: $enc-nav-sub-header-height;
    }
  }

</style>
<style rel="stylesheet/scss" lang="scss">



.enc-header {
    .right-menu {
      .el-button {
        &.user {
          i {
            font-size: 32px;
            color: #425365;
          }
        }
        &.setting {
          i {
            font-size: 32px;
            color: #fff;
          }
        }
        &.document {
          i {
            font-size: 32px;
            color: #fff;
          }
        }
      }
    }
  }
</style>
