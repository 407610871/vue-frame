<template>
  <el-container>
    <el-header height="66px" class="enc-header">
      <div class="enc-logo">
        <img :src="logo" alt="">
      </div>
      <nav-menu />
      <div class="right-menu">
        <el-popover
          placement="bottom-start"
          width="200"
          trigger="hover"
          >
            <ul class="popup-menu">
              <li><a href="javascript:void(0)" v-on:click="goRoute('recyclingBins')">回收箱</a></li>
            </ul>
            <el-button slot="reference" class="user" type="primary" icon="enc-icon-user"></el-button>
        </el-popover>
       <!--  <el-button class="document" type="primary" icon="enc-icon-documents"></el-button> -->
				<el-tooltip class="item" effect="light" content="系统设置" placement="bottom">
					<el-button class="setting" type="primary" icon="enc-icon-setting" v-on:click="goRoute('setting')"></el-button>
				</el-tooltip>
				<release></release>

      </div>
    </el-header>
    <el-container>
      <el-aside width="210px" class="enc-aside">
        <!-- <aside-tree></aside-tree> -->
        <new-aside-tree></new-aside-tree>
      </el-aside>
      <el-main class="enc-main">
        <!-- <div class="enc-search">
          <input type="text" v-model="keyword" placeholder="输入查询..." />
          <a href="javascript:void(0)" v-on:click="search"><i class="el-icon-search"></i></a>
        </div> -->
        <div class="enc-sub-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index"><a href="javascript:void(0)" v-on:click="breadcrumbChange(index,item)">{{item.breadcrumbName}}</a></el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <span v-for="item in breadcrumb"> / <a href="javascript:void(0)" v-on:click="goToPage(item.path)">{{item.name}}</a></span> -->
        </div>
        <app-main ref="mainTable" />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { AppMain, AsideTree, NavMenu, NewAsideTree } from './components'
import logo from '@/assets/images/enc-logo.png'
import release from '@/views/mainLay/dialog/release'

export default {
  name: 'Layout',
  data() {
    return {
      logo: logo + '?' + +new Date(),
      keyword:'',
      breadcrumb:[]
    }
  },
  components: {
    AppMain,
    AsideTree,
    NavMenu,
    release,
    NewAsideTree
  },
  computed: {

  },
	mounted(){
		var _self = this;
		
		this.$ajax
			.get(window.ENV.API_DACM+"/caccesssysRelationWorkInfo/getSystemSet.do")
			.then(function(res) {
				if (res.data.result == 'success') {
					var configs = JSON.parse(res.data.message);
					for(var value of configs){
						if(value.key.trim() == '每页展示条数'){
							_self.$store.commit("setPageSize",parseInt(value.name));
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
			
		this.$ajax
			.get(window.ENV.API_DACM+"/caccess/sysdialect", {
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
				}
			})
			.catch(function(err) {
				console.log(err);
			});
		this.$ajax
			.get(window.ENV.API_DACM+"/commonInter/getDictDataCategory")
			.then(function(res) {
				var list = [];
				for (var value of res.data.staticDatas.SJLY) {
					list.push({
						id: value.sTATIC_CODE,
						name: value.sTATIC_NAME
					});
				}
				_self.$store.commit("setFilterItmeList", {
					name: "network",
					data: list
				});
			})
			.catch(function(err) {
				console.log(err);
			});
		this.$ajax
			.get(window.ENV.API_DACM+"/commonInter/getListStaticData.do",{
				params:{
					dictCode:'ButtPlatForm'
				}
			})
			.then(function(res) {
				var list = [];
				for (var value of res.data) {
					list.push({
						id: value.sTATIC_CODE,
						name: value.sTATIC_NAME
					});
				}
				_self.$store.commit("setFilterItmeList", {
					name: "platform",
					data: list
				});
			})
			.catch(function(err) {
				console.log(err);
			});
	},
  created(){
    if (sessionStorage.getItem("store")) {
			var oldStore = JSON.parse(sessionStorage.getItem("store"));
			oldStore.app.token = this.$store.getters.token;
      this.$store.replaceState(Object.assign({}, this.$store.state,oldStore))
    }
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store",JSON.stringify(this.$store.state));
    });
    this.$root.eventHub.$on('setKeyword', (keyword)=>{
      this.keyword = keyword;
    });
    this.getBreadcrumb();
  },
  watch: {
    $route(to,from){
      this.getBreadcrumb();
      this.keyword = this.$route.query.keyword;
      // this.$route.matched.forEach((item, index) => {
      //   console.log(item)
      // })
    }
  },
  methods: {
    goRoute:function(name){
			if(this.$store.state.queryParams[name]){
				var obj = {
					resetData:name
				}
				this.$store.commit('resetQueryParam', obj);
			}
      this.$router.push({ name: name});
    },
    search:function(){
      this.$root.eventHub.$emit('search',this.keyword);
    },
    breadcrumbChange:function(index,item){
      if(index != this.breadcrumb.length-1){
        // var obj = {
          // resetData:[]
        // };
        // for(var i = index+1;i<this.breadcrumb.length;i++){
          // obj.resetData.push(this.breadcrumb[i].name)
        // }
        // this.$store.commit('resetQueryParam', obj);
        this.$router.push({ name: item.name, params:item.params,query:item.query});
      }
    },
    getBreadcrumb(){
      var routeName = this.$route.name;
      if(routeName =='dashboard' || routeName == 'accessObjManage' || routeName == 'accessObjInfo'){
        this.breadcrumb = [
          {
            name:'dashboard',
            breadcrumbName:'数据接入',
            params:{},
            query:this.$store.state.queryParams['dashboard']
          }
        ]
        if(this.$route.params.sourceId && this.$route.params.sourceName){
          this.breadcrumb.push({
            name:'accessObjManage',
            breadcrumbName:decodeURI(this.$route.params.sourceName),
            params:{
              sourceId:this.$route.params.sourceId,
              sourceName:decodeURI(this.$route.params.sourceName)
            },
            query:this.$store.state.queryParams['accessObjManage']
          });
        }
        if(this.$route.params.objId && this.$route.params.objName){
          this.breadcrumb.push({
            name:'accessObjInfo',
            breadcrumbName:decodeURI(this.$route.params.objName),
            params:{
              sourceId:this.$route.params.sourceId,
              sourceName:decodeURI(this.$route.params.sourceName),
              objId:this.$route.params.objId,
              objName:decodeURI(this.$route.params.objName)
            }
          });
        }
      }else{
        var list = [];
        this.$route.matched.forEach((item, index) => {
          if(item.path!=''){
            list.push({
              name:this.$route.name,
              breadcrumbName:this.$route.meta.title,
            })
          }
        });
        this.$set(this.$data, 'breadcrumb',list);
      }
      //end of getBreadcrumb
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
    /*padding:20px;*/
   	overflow: hidden;
  }

  .enc-main {
    padding: 0;
  }

  .enc-sub-header {
    text-indent: 30px;
    margin-top: 3px;
    // margin-right:300px;
    padding-left:20px;
    height: $enc-nav-sub-header-height;
    line-height: $enc-nav-sub-header-height;
    color: #465167;
    font-size: 18px;
    background: #eff3f6;
  }

  .el-breadcrumb {
    line-height: $enc-nav-sub-header-height;
    text-indent: 0;
  }


  .enc-search{
    float:right;
    margin-top: 3px;
    height: $enc-nav-sub-header-height;
    width: 300px;
    line-height: $enc-nav-sub-header-height;
    background-color: #E2E4E7;
    border-left:3px solid #fff;
    input{
      margin-left:5px;
      width:250px;
      background-color: transparent;
      border:0 none;
      outline: 0 none;
    }
    ::-webkit-input-placeholder{color:#999;}    ///* 使用webkit内核的浏览器 */
    :-moz-placeholder{color:#999;}                  ///* Firefox版本4-18 */
    ::-moz-placeholder{color:#999;}                  ///* Firefox版本19+ */
    :-ms-input-placeholder{color:#999;}           ///* IE浏览器 */
    a{
      display:inline-block;
      margin-left:10px;
      font-size:18px;
      :link,
      :visited{
        color:#EFF2F5;
      }
      :hover,
      :active{
        color:#479AD8;
      }
    }
  }
  .popup-menu{
    margin:0;
    padding:0;
    li{
      list-style: none;
      a{
        display: block;
        width:100%;
        height: 100%;
      }
      a:hover,
      a:active{
        color:#069;
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
