<template>
  <el-container>
    <el-header class="enc-header">
      <div class="right-menu">
        <el-popover placement="bottom" width="100" trigger="hover">
          <ul class="user">
            <li>{{ userName }}</li>
            <li v-on:click="changeSkin">主题</li>
            <li v-on:click="loginOut">退出</li>
          </ul>
          <el-button slot="reference">
            <i class="enc-icon-user" style="font-size: 32px; color: #fff;"></i>
          </el-button>
        </el-popover>
        <el-popover placement="bottom" width="100" trigger="hover">
          <ul class="user">
            <li v-on:click="_release">版本信息</li>
          </ul>
          <el-button slot="reference" class="topic">
            <i class="enc-icon-gengduo-caidanlan" style="font-size: 21px; color: #fff;"></i>
          </el-button>
        </el-popover>
      </div>
    </el-header>
    <app-main ref="mainTable" />

    <!--主题-->
    <Themes v-if="themesflag" v-on:closeDia="themesflag=false"></Themes>
    <!--版本信息-->
    <Release v-if="releaseflag" v-on:closeDia="releaseflag=false"></Release>

  </el-container>

</template>
<script>
import { AppMain} from "./components";
import logo from "@/assets/images/enc-logo.png";

import Themes from '@/views/layout/components/themes';
import Release from "@/views/layout/components/release";

export default {
  name: "Layout",
  data() {
    return {
      logo: logo + '?' + +new Date(),
      userName: "",
      roleName: '',
      themesflag: false,
      releaseflag: false
    }
  },
  components: {
    AppMain,
    Themes,
    Release,
  },
  created() {
    this.userName =  this.$keycloak.tokenParsed.name;
  },
  methods: {
    changeSkin() {
      this.themesflag = true;
    },
    _release() {
      this.releaseflag = true;
    },
    loginOut() {
      this.$keycloak.logout();
    }
  }
};

</script>
<style scoped>
  .topic {
    background-color: #009DDF;
  }
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
    cursor: pointer;
  }
  li:hover {
    color: #fff!important;
    background-color: #4a60a2;
}
</style>

