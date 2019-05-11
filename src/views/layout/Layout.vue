<template>
  <el-container>
    <el-header class="enc-header">
      <div class="enc-logo" style="font-size:24px;">
        <img :src="logo" alt>用户管理
      </div>
      <nav-menu />
      <div class="right-menu">

        <el-popover placement="bottom" trigger="hover" width="100">
          <ul class="warn-popover">
            <li class="even-li">监控告警中心</li>
          </ul>
          <el-button slot="reference" class="document">
            <i class="enc-icon-jiankonggaojingLOGO"></i>
          </el-button>
        </el-popover>

        <el-popover placement="bottom" trigger="hover">
          <ul class="user">
            <li>{{ userName }}</li>
            <li>管理员</li>
            <li class="point" v-on:click="goHome">返回主页</li>
            <li class="point" v-on:click="loginOut">退出</li>
          </ul>
          <el-button slot="reference" class="user">
            <i class="enc-icon-user"></i>
          </el-button>
        </el-popover>
        <el-popover placement="bottom" trigger="hover">
          <ul class="user">
            <li v-on:click="_release">版本信息</li>
          </ul>
          <el-button slot="reference" class="setting">
            <i class="caidanlan enc-icon-gengduo-caidanlan"></i>
          </el-button>
        </el-popover>
      </div>
    </el-header>
    <app-main ref="mainTable" />

    <!--版本信息-->
    <Release v-if="releaseflag" v-on:closeDia="releaseflag=false"></Release>

  </el-container>

</template>
<script>
import { AppMain, NavMenu} from "./components";
import logo from "@/assets/images/logo-header.png";

import Release from "@/views/layout/components/release";

export default {
  name: "Layout",
  data() {
    return {
      logo: logo,
      userName: "",
      roleName: '',
      themesflag: false,
      releaseflag: false
    }
  },
  components: {
    AppMain,
    NavMenu,
    Release,
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.userName =  this.$keycloak.tokenParsed.name;
  },
  mounted() {
    
  },
  methods: {
    goHome(){
      window.open(`${window.ENV.API_SJSN}`,"_self");
    },
    _release() {
      this.releaseflag = true;
    },
    loginOut() {
      let options = {};
      if(window.ENV.API_SJSN){
        options.redirectUri = `${window.ENV.API_SJSN}`;
      }
      this.$keycloak.logout(options);  
    }
  }
};

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
@import "src/styles/mixin.scss";
  ul, li {
    margin: 0px;
    padding: 0px;  
    list-style:none;
  }
  li {
    background-color: #fff;
    float: none;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    text-align: center;
    margin: 12px 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  li:hover {
    color: #fff !important;
    @include el-bgcolor($el-page-theme);
  }
  .point {
    cursor: pointer;
  }
</style>

