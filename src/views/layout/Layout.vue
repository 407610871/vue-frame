<template>
  <el-container>
    <el-header class="enc-header">
      <div style="margin-left: 20px;">
        <img :src="logo" alt="" style="vertical-align: middle;"> 数据枢纽平台
      </div>
      <div class="right-menu">
        <el-popover placement="bottom" trigger="hover">
          <ul class="user">
            <li>{{ userName }}</li>
            <li v-on:click="changeSkin">主题</li>
            <li v-on:click="loginOut">退出</li>
          </ul>
          <el-button slot="reference">
            <i class="enc-icon-user" style="font-size: 18px; color: #fff;"></i>
          </el-button>
        </el-popover>
        <el-popover placement="bottom" trigger="hover">
          <ul class="user">
            <li v-on:click="_release">版本信息</li>
          </ul>
          <el-button slot="reference" class="topic" style="margin:0 20px 0 20px">
            <i class="enc-icon-gengduo-caidanlan" style="font-size: 18px; color: #fff;"></i>
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
import logo from "@/assets/images/logo-header.png";

import Themes from '@/views/layout/components/themes';
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
    Themes,
    Release,
  },
  computed: {
    getUserThemes() {
      return this.$store.state.userThemes;
    },
  },
  watch: {
    getUserThemes() {
      this.getSkin();
    }
  },
  created() {
    this.userName =  this.$keycloak.tokenParsed.name;
  },
  mounted() {
    console.log("111111",this.$route);
    this.$nextTick(res=>{
      this.getSkin();
    })
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
    },
    //换肤
    getSkin() {
      this.$ajax({
          method: "POST",
          url: `${window.ENV.API_SKIN}/BCM/skin/query`,
          data: {
            userId: this.$keycloak.tokenParsed.sub,
            appId: this.$keycloak.tokenParsed.aud
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            let values = 'theme';
            if (res.data.data.color == 'PURPLE') {
              values = 'theme1';
            }
            else if (res.data.data.color == 'GREEN') {
              values = 'theme3';
            }
            else if (res.data.data.color == 'BLUE') {
              values = 'theme2';
            }
            else if (res.data.data.color == 'GOLDEN') {
              values = 'theme4';
            }
            this.$store.commit('setThemes', res.data.data.color);
            window.localStorage.setItem('data-theme', values);
            window.document.documentElement.setAttribute('data-theme', values);
          } else {
            this.$store.commit('setThemes', "DEFAULT");
            window.localStorage.setItem('data-theme', "theme");
            window.document.documentElement.setAttribute('data-theme', "theme");
          }
        }).catch(err=>{
          this.$store.commit('setThemes', "DEFAULT");
          window.localStorage.setItem('data-theme', "theme");
          window.document.documentElement.setAttribute('data-theme', "theme");
        })
    },
  }
};

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
@import "src/styles/mixin.scss";

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
    color: #fff !important;
    @include el-bgcolor($el-page-theme);
}
</style>

