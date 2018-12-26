<template>
  <el-container>
    <el-header height="66px" class="enc-header">
      <div class="enc-logo">
        <img :src="logo" alt>
      </div>
      <nav-menu />
      <div class="right-menu clearfix">
        <el-tooltip class="item" effect="light" content="告警中心" placement="bottom">
          <el-button class="warncon" v-on:click="_goWarn()">
            <span>
              <img :src="warnicon">
            </span>
          </el-button>
        </el-tooltip>
        <release v-if="releaseflag" v-on:closeDia="releaseflag=false"></release>
        <Themes v-if="themesflag" v-on:closeDia="themesflag=false"></Themes>
        <el-popover placement="bottom-start" width="200" trigger="hover">
          <ul class="popup-menu warn-menu warn-popover">
            <li class="even-li">{{ userName }}</li>
            <li class="odd-li">{{ roleName }}</li>
            <li class="" v-on:click="_changeSkin()">主题</li>
            <li class="theme-li"></li>
            <li class="even-li" v-on:click="loginOut()">退出</li>
          </ul>
          <el-button slot="reference" class="moreSys">
            <span>
              <img :src="usericon">
            </span>
          </el-button>
        </el-popover>
        <el-popover placement="bottom-start" width="200" trigger="hover">
          <ul class="popup-menu warn-menu">
            <li><a href="javascript:void(0)" v-on:click="goRoute('setting')">系统参数</a></li>
            <li><a href="javascript:void(0)" v-on:click="goRoute('recyclingBins')">回收箱</a></li>
            <li><a href="javascript:void(0)" @click="_release()">版本信息</a></li>
          </ul>
          <el-button slot="reference" class="moreSys">
            <span>
              <img :src="moreicon">
            </span>
          </el-button>
        </el-popover>
      </div>
    </el-header>
    <div style="display:flex; height: calc(100vh - 66px);">
      <el-aside :width="sideBarWidth+'px'" class="enc-aside">
        <new-aside-tree></new-aside-tree>
        <div class="sidebar-control-btn" v-bind:style="{'left':sideBarWidth+'px'}" v-on:click="changeSideBar">
          <i class="el-icon-caret-left" v-if="sideBarWidth==210"></i>
          <i class="el-icon-caret-right" v-if="sideBarWidth==0"></i>
        </div>
      </el-aside>
      <el-main class="enc-main">
        <div class="enc-sub-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">
              <a href="javascript:void(0)" v-on:click="breadcrumbChange(index,item)">{{item.breadcrumbName}}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <app-main ref="mainTable" />
      </el-main>
    </div>
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
    var _self = this;
    if (window.localStorage.getItem('data-theme') != undefined) {
      window.document.documentElement.setAttribute('data-theme', window.localStorage.getItem('data-theme'));
    }
    _self.warnurl = encodeURI(window.ENV.API_WARN + '/#/alert/dashboard?platform=数据工厂产品线');
    this.$ajax
      .get(window.ENV.API_DACM + "/caccesssysRelationWorkInfo/getSystemSet")
      .then(function(res) {
        if (res.data.result == "success") {
          var configs = JSON.parse(res.data.message);
          for (var value of configs) {
            if (value.key.trim() == "每页展示条数") {
              _self.$store.commit("setPageSize", parseInt(value.name));
              break;
            }
          }
        }
        _self.$store.commit("setPageReady");
      })
      .catch(function(err) {
        console.log(err);
        _self.$store.commit("setPageReady");
      });
    _self.updataFliterItemList();

  },
  created() {
    this.getUser();
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
    }, 1000)
    // this.$root.eventHub.$on("updataFliterItemList", () => {
    //   this.updataFliterItemList();
    // });
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
      this.keyword = this.$route.query.keyword;
      // this.$route.matched.forEach((item, index) => {
      //   console.log(item)
      // })
    },
    getUserThemes() {
      //console.log("454245");
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
    updataFliterItemList() {
      var _self = this;
      this.$ajax
        .get(window.ENV.API_DACM + "/caccess/sysdialect", {
          params: {
            type: 0
          }
        })
        .then(function(res) {
          if (res.data.success) {
            _self.$store.commit("setFilterItmeList", {
              name: "dataSourceName",
              data: res.data.data
            });
            _self.formFilterData[0].checkData = list
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      this.$ajax
        .get(window.ENV.API_DACM + "/commonInter/getListStaticDataOrder", {
          params: {
            dictCode: "NetWork"
          }
        })
        .then(function(res) {
          //  console.log(res)
          var list = [];
          if (res.data != undefined) {
            for (var value of res.data) {
              list.push({
                id: value.sTATIC_CODE,
                name: value.sTATIC_NAME
              });
            }
            _self.$store.commit("setFilterItmeList", {
              name: "network",
              data: list
            });
            _self.formFilterData[1].checkData = list
          }
          console.log(list);
        })
        .catch(function(err) {
          console.log(err);
        });
      this.$ajax
        .get(window.ENV.API_DACM + "/commonInter/getListStaticDataOrder", {
          params: {
            dictCode: "ButtPlatForm"
          }
        })
        .then(function(res) {
          //  console.log(res)

          var list = [];
          for (var value of res.data) {
            list.push({
              id: value.sTATIC_CODE,
              name: value.sTATIC_NAME
            });
          }
          // console.log(list)

          _self.$store.commit("setFilterItmeList", {
            name: "platform",
            data: list
          });
          _self.formFilterData[2].checkData = list
          console.log(_self.formFilterData);
          console.log(res.data);


        })
        .catch(function(err) {
          console.log(err);
        });
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
      
      let userids =  window.localStorage.getItem('userID');
      this.$ajax({
         method: "POST",
          url: "http://10.19.248.200:32470/BCM/skin/query",
          data: {
            userId:userids,
            appId:'DACM'
          }
        })
        .then(res => {
          if (res.data.success) {
            let obj = {
              "cnName": res.data.data.cnName,
              "color": res.data.data.color,
              "appId":'DACM',
              "userId": res.data.data.userId,
              "userName": res.data.data.userName
            }
            let values = '';
            if (res.data.data.color == 'PURPLE') {
              values = 'theme1';
            }
            if (res.data.data.color == 'GREEN') {
              values = 'theme2';
            }
            if (res.data.data.color == 'BLUE') {
              values = 'theme3';
            }
            if (res.data.data.color == 'GOLDEN') {
              values = 'theme4';
            }
            window.localStorage.setItem('data-theme', values);
            window.document.documentElement.setAttribute('data-theme', values);
            this.$store.commit('setThemes', res.data.data.color);
            obj = JSON.stringify(obj);
            localStorage.setItem("userSet", obj);
          } else {}
        })
    },
    goRoute: function(name) {
      if (this.$store.state.queryParams[name]) {
        var obj = {
          resetData: name
        };
        this.$store.commit("resetQueryParam", obj);
      }
      this.$router.push({ name: name });
    },
    search: function() {
      this.$root.eventHub.$emit("search", this.keyword);
    },
    breadcrumbChange: function(index, item) {
      if (index != this.breadcrumb.length - 1) {
        // var obj = {
        // resetData:[]
        // };
        // for(var i = index+1;i<this.breadcrumb.length;i++){
        // obj.resetData.push(this.breadcrumb[i].name)
        // }
        // this.$store.commit('resetQueryParam', obj);
        this.$router.push({
          name: item.name,
          params: item.params,
          query: item.query
        });
      }
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
      //end of getBreadcrumb
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
  /*  background: url("../../assets/images/warnicon.png");
 background-repeat: no-repeat;
 background-size: contain; */
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

.clearfix {
  float: none;
  clear: both;
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
      width: 66px;
      height: 100%;
      margin: 0;
      border-radius: 0;
      border: 0;
      padding: 0;
      float: left;

      &.user {
        background: #cac fd5;
        vertical-align: top;
      }
      &.setting {
        background: #50609c;
        vertical-align: top;
        i {
          color: #fff;
        }
      }
      &.document {
        background: #479bd9;
        vertical-align: top;
        i {
          color: #fff;
        }
      }
    }
  }
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

.el-breadcrumb {
  line-height: $enc-nav-sub-header-height;
  text-indent: 0;
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
    a:hover,
    a:active {
      color: #069;
    }
  }
}

.sidebar-control-btn {
  display: block;
  position: absolute;
  z-index: 1000;
  top: 50%;
  margin-top: -15px;
  width: 8px;
  height: 30px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  color: #999;
  font-size: 12px;
  line-height: 26px;
  i {
    margin-left: -3px;
  }
}

@media screen and (max-width: 1280px) {
  .enc-logo {
    line-height: 50px;
  }

  .el-header {
    .right-menu {
      .el-button {
        width: 60px;
        height: 60px;
      }
    }
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
          color: #fff !important;
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

.enc-header .right-menu .el-button.user {
  background: #479bd9 !important;
}

.moreSys {
  width: 66px;
  height: 66px;
  /* background: url("../../assets/images/moreicon.png");
  background-repeat: no-repeat;
  background-size: contain; */
  float: left
}

.enc-header .right-menu .el-button.moreSys:focus,
.enc-header .right-menu .el-button.moreSys:hover {
  width: 66px;
  height: 66px;
  background: url("../../assets/images/moreicon.png");
  background-repeat: no-repeat;
  background-size: contain;
  float: left
}

.warn-popover li {
  height: 30px;
  line-height: 30px;
  text-align: center;
  list-style: none;
  cursor: pointer;
}

.even-li {
  color: #374673!important;
}

.odd-li {
  color: #c6c6c6!important;
  border-bottom: none;
  margin-left: -15px;
  margin-right: -15px;
}

.warn-popover .theme-li {
  border-bottom: 1px solid #d6d6d6;
  line-height: 5px;
  height: 5px;
  margin-bottom: 10px;
}

</style>
