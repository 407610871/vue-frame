<template>
  <el-container>
    <el-header class="enc-header">
      <div class="enc-logo">
        <img :src="logo" alt>
      </div>
      <nav-menu />
      <div class="right-menu">
        <el-popover placement="bottom" width="200" trigger="hover">
          <ul class="popup-menu warn-menu warn-popover">
            <li class="even-li" v-on:click="_goWarn()">告警中心</li>
          </ul>
          <el-button slot="reference" class="moreSys" >
            <span>
              <img :src="warnicon">
            </span>
          </el-button>
        </el-popover>
        <el-popover placement="bottom" width="200" trigger="hover">
          <ul class="popup-menu warn-menu warn-popover">
            <li class="even-li">{{ userName }}</li>
            <li class="odd-li">{{ roleName }}</li>
            <li class="even-li" v-on:click="_changeSkin()">主题</li>
            <li class="theme-li"></li>
            <li class="even-li" v-on:click="loginOut()">退出</li>
          </ul>
          <el-button slot="reference" class="moreSys">
            <i class="enc-icon-user" style="font-size: 32px; color: #fff;"></i>
          </el-button>
        </el-popover>
        <el-popover placement="bottom" width="200" trigger="hover">
          <ul class="popup-menu warn-menu warn-popover">
            <li class="even-li"><a href="javascript:void(0)" v-on:click="goRoute('setting')">系统参数</a></li>
            <li class="even-li"><a href="javascript:void(0)" v-on:click="goRoute('recyclingBins')">回收箱</a></li>
            <li class="even-li"><a href="javascript:void(0)" @click="_release()">版本信息</a></li>
          </ul>
          <el-button slot="reference" class="moreSys">
            <span>
              <img :src="moreicon">
            </span>
          </el-button>
        </el-popover>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="sideBarWidth+'px'" class="enc-aside">
        <new-aside-tree></new-aside-tree>
        <div class="sidebar-control-btn" v-bind:style="{'left':sideBarWidth+'px'}" v-on:click="changeSideBar">
          <i class="el-icon-caret-left" v-if="sideBarWidth==210"></i>
          <i class="el-icon-caret-right" v-if="sideBarWidth==0"></i>
        </div>
      </el-aside>
      <el-main class="enc-main">
        <app-main ref="mainTable" />
      </el-main>
    </el-container>
    <release v-if="releaseflag" v-on:closeDia="releaseflag=false"></release>
    <Themes v-if="themesflag" v-on:closeDia="themesflag=false"></Themes>
  </el-container>
</template>
<script>
import { AppMain, AsideTree, NavMenu, NewAsideTree } from "./components";
import logo from "@/assets/images/enc-logo.png";
import userd from "@/assets/images/user.png";
import mored from "@/assets/images/moreicon.png";
import warnd from "@/assets/images/warnicon.png";
import userp from "@/assets/images/userp.png";
import morep from "@/assets/images/morep.png";
import warnp from "@/assets/images/warnp.png";
import userg from "@/assets/images/userg.png";
import moreg from "@/assets/images/moreg.png";
import warng from "@/assets/images/warng.png";
import userb from "@/assets/images/userb.png";
import moreb from "@/assets/images/moreb.png";
import warnb from "@/assets/images/warnb.png";
import usery from "@/assets/images/usery.png";
import morey from "@/assets/images/morey.png";
import warny from "@/assets/images/warny.png";
import release from "@/views/mainLay/dialog/release";
import Themes from '@/views/layout/components/themes'
export default {
  name: "Layout",
  data() {
    return {
      logo: logo + '?' + +new Date(),
      keyword: '',
      releaseflag: false,
      themesflag: false,
      breadcrumb: [],
      sideBarWidth: 210,
      warnurl: '',
      userName: '',
      roleName: '',
      usericon: '',
      warnicon: '',
      moreicon: ''
    }
  },
  components: {
    AppMain,
    AsideTree,
    NavMenu,
    release,
    NewAsideTree,
    Themes
  },
  computed: {
    getUserThemes() {
      return this.$store.state.userThemes;
    },
  },
  mounted() {
    if (window.localStorage.getItem('data-theme') != undefined) {
      window.document.documentElement.setAttribute('data-theme', window.localStorage.getItem('data-theme'));
    }
    this.warnurl = encodeURI(window.ENV.API_WARN + '/#/alert/dashboard?platform=数据工厂产品线');
    let  _this = this;
    this.$ajax
      .get(window.ENV.API_DACM + "/caccesssysRelationWorkInfo/getSystemSet")
      .then(function(res) {
        if (res.data.result == "success") {
          var configs = JSON.parse(res.data.message);
          for (var value of configs) {
            if (value.key.trim() == "每页展示条数") {
              _this.$store.commit("setPageSize", parseInt(value.name));
              break;
            }
          }
        }
        _this.$store.commit("setPageReady");
      })
      .catch(function(err) {
        _this.$store.commit("setPageReady");
      });
  },
  created() {
    if (sessionStorage.getItem("store")) {
      var oldStore = JSON.parse(sessionStorage.getItem("store"));
      oldStore.app.token = this.$store.getters.token;
      this.$store.replaceState(Object.assign({}, this.$store.state, oldStore));
    }
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
    this.$root.eventHub.$on("setKeyword", keyword => {
      this.keyword = keyword;
    });

    this.getBreadcrumb();
    let _self = this;
    setTimeout(function() {
      let usrObj = _self.$store.state.userInfo;
      _self.userName = usrObj.userName;
      _self.roleName = usrObj.roleName;
      _self.getUser();
    }, 1000)
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
      this.keyword = this.$route.query.keyword;
    },
    getUserThemes() {
      this._getColor();
    }
  },
  methods: {
    _getColor() {

      if (this.$store.state.userThemes == 'PURPLE') {
        this.usericon = `${userp}`;
        this.warnicon = `${warnp}`;
        this.moreicon = `${morep}`;
      } else if (this.$store.state.userThemes == 'GREEN') {
        this.usericon = `${userg}`;
        this.warnicon = `${warng}`;
        this.moreicon = `${moreg}`;
      } else if (this.$store.state.userThemes == 'BLUE') {
        this.usericon = `${userb}`;
        this.warnicon = `${warnb}`;
        this.moreicon = `${moreb}`;
      } else if (this.$store.state.userThemes == 'GOLDEN') {
        this.usericon = `${usery}`;
        this.warnicon = `${warny}`;
        this.moreicon = `${morey}`;
      } else {

        this.usericon = `${userd}`;
        this.warnicon = `${warnd}`;
        this.moreicon = `${mored}`;
      }
    },
    _goWarn() {
      window.open(this.warnurl);
    },
    _release() {
      this.releaseflag = true;
    },
    _changeSkin() {
      this.themesflag = true;
    },
    changeSideBar() {
      this.sideBarWidth = this.sideBarWidth == 0 ? 210 : 0;
    },
    loginOut() {
      window.localStorage.removeItem('data-theme');
      this.$keycloak.logout();
    },
    //换肤
    getUser() {

      let userids = window.localStorage.getItem('userID');
      if (userids == null || userids == undefined) {
        userids = this.$store.state.userInfo.userId;
      }
      this.$ajax({
          method: "POST",
          url: this.GLOBAL.skin.API_SKIN + "/BCM/skin/query",
          data: {
            userId: userids,
            appId: 'DACM'
          }
        })
        .then(res => {
          if (res.data.success && res.data.data) {
            let obj = {
              "cnName": res.data.data.cnName,
              "color": res.data.data.color,
              "appId": 'DACM',
              "userId": res.data.data.userId,
              "userName": res.data.data.userName
            }
            let values = '';
            if (res.data.data.color == 'PURPLE') {
              values = 'theme1';
            }
            if (res.data.data.color == 'GREEN') {
              values = 'theme3';
            }
            if (res.data.data.color == 'BLUE') {
              values = 'theme2';
            }
            if (res.data.data.color == 'GOLDEN') {
              values = 'theme4';
            }
            window.localStorage.setItem('data-theme', values);
            window.document.documentElement.setAttribute('data-theme', values);
            this.$store.commit('setThemes', res.data.data.color);
            obj = JSON.stringify(obj);
            localStorage.setItem("userSet", obj);
          } else {
            let obj = {
              "cnName": window.localStorage.getItem('userNames'),
              "color": "DEFAULT",
              "appId": 'DACM',
              "userId": window.localStorage.getItem('userID'),
              "userName": window.localStorage.getItem('userNames')
            }
            localStorage.setItem("userSet", JSON.stringify(obj));
            this._getColor();
          }
        }).catch(error => {
          let obj = {
            "cnName": window.localStorage.getItem('userNames'),
            "color": "DEFAULT",
            "appId": 'DACM',
            "userId": window.localStorage.getItem('userID'),
            "userName": window.localStorage.getItem('userNames')
          }
          localStorage.setItem("userSet", JSON.stringify(obj));
          this._getColor();
        })
    },
    goRoute: function(name) {
      this.$router.push({ name: name });
    },
    getBreadcrumb() {
      var routeName = this.$route.name;
      if (
        routeName == "dashboard" ||
        routeName == "accessObjManage" ||
        routeName == "accessObjInfo"
      ) {
        this.breadcrumb = [{
          name: "dashboard",
          breadcrumbName: "数据接入",
          params: {},
          query: this.$store.state.queryParams["dashboard"]
        }];
        if (this.$route.params.sourceId && this.$route.params.sourceName) {
          this.breadcrumb.push({
            name: "accessObjManage",
            breadcrumbName: decodeURI(this.$route.params.sourceName),
            params: {
              sourceId: this.$route.params.sourceId,
              sourceName: decodeURI(this.$route.params.sourceName),
              type: this.$route.params.type
            },
            query: this.$store.state.queryParams["accessObjManage"]
          });
        }
        if (this.$route.params.objId && this.$route.params.objName) {
          this.breadcrumb.push({
            name: "accessObjInfo",
            breadcrumbName: decodeURI(this.$route.params.objName),
            params: {
              sourceId: this.$route.params.sourceId,
              sourceName: decodeURI(this.$route.params.sourceName),
              objId: this.$route.params.objId,
              objName: decodeURI(this.$route.params.objName),
              type: this.$route.params.type
            }
          });
        }
      } else {
        var list = [];
        this.$route.matched.forEach((item, index) => {
          if (item.path != "") {
            list.push({
              name: this.$route.name,
              breadcrumbName: this.$route.meta.title
            });
          }
        });
        this.$set(this.$data, "breadcrumb", list);
      }
    }
  }
};

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
@import "src/styles/mixin.scss";
.warn-menu a {
  line-height: 30px;
}

.warncon {
  width: 66px;
  height: 66px;
  float: left
}

.warn-menu li a {
  border-bottom: none;
  text-align: center;
}

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.clearfix {
  float: none;
  clear: both;
}

.enc-header .right-menu .el-button.moreSys:focus,
.enc-header .right-menu .el-button.moreSys:hover {
  width: 66px;
  height: 66px;
}

.enc-header .right-menu .el-button.user {
  background: #479bd9 !important;
}

.enc-aside {
  width: 210px;
  @include aside-bg-color($enc-aside-background-theme);
  /*padding:20px;*/
  overflow: hidden;
}

.enc-main {
  padding: 0;
}

.enc-sub-header {
  text-indent: 30px;
  margin-top: 0px; // margin-right:300px;
  padding-left: 20px;
  height: $enc-nav-sub-header-height;
  line-height: $enc-nav-sub-header-height;
  color: #465167;
  font-size: 18px;
  background: #eff3f6;
}

@media screen and ( max-width: 1280px) {
  .enc-sub-header {
    margin-top: 0px;
  }
}

.enc-search {
  float: right;
  margin-top: 3px;
  height: $enc-nav-sub-header-height;
  width: 300px;
  line-height: $enc-nav-sub-header-height;
  background-color: #e2e4e7;
  border-left: 3px solid #fff;
  input {
    margin-left: 5px;
    width: 250px;
    background-color: transparent;
    border: 0 none;
    outline: 0 none;
  }
   ::-webkit-input-placeholder {
    color: #999;
  } ///* 使用webkit内核的浏览器 */
   :-moz-placeholder {
    color: #999;
  } ///* Firefox版本4-18 */
   ::-moz-placeholder {
    color: #999;
  } ///* Firefox版本19+ */
   :-ms-input-placeholder {
    color: #999;
  } ///* IE浏览器 */
  a {
    display: inline-block;
    margin-left: 10px;
    font-size: 18px;
     :link,
     :visited {
      color: #eff2f5;
    }
     :hover,
     :active {
      color: #479ad8;
    }
  }
}

.popup-menu {
  margin: 0;
  padding: 0;
  li {
    list-style: none;
    a {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}

</style>
<style rel="stylesheet/scss" lang="scss">
.moreSys {
  width: 66px;
  height: 66px;
  float: left
}

.warn-popover li {
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

.even-li {
  color: #425365 !important;
}

.odd-li {
  color: #c6c6c6!important;
  border-bottom: none;
}

.warn-popover .theme-li {
  border-bottom: 1px solid #d6d6d6;
  line-height: 5px;
  height: 5px;
  margin-bottom: 10px;
}

</style>
