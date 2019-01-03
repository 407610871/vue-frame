<template>
  <div class="nav-menu owntmenu">
    <el-menu :default-active="activeIndex" class="enc-nav-menu" mode="horizontal" @select="handleSelect" >
      <el-menu-item index="1">
        <i class="enc-icon-shujujieru"></i>数据接入
      </el-menu-item>
      <el-menu-item index="2">
        <i class="enc-icon-shujuchuli"></i>数据处理
      </el-menu-item>
      <!-- <el-menu-item index="3">  <i class="enc-icon-renwuzhongxin"></i>任务中心    </el-menu-item> -->
      <el-submenu index="3">
        <template slot="title">
          <i class="enc-icon-renwuzhongxin"></i>任务中心
        </template>
        <el-menu-item index="3-1">汇聚任务</el-menu-item>
        <el-menu-item index="3-2">Kettle任务</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1"
    };
  },
  watch: {},
  created() {
    this.$root.eventHub.$on("setActiveNav", index => {
      this.activeIndex = index + "";
    });
    this.getRout();
  },
  methods: {
    handleSelect(key, keyPath) {
      // this.$router.push({path:'/dashboard'});
      switch (key) {
        case "3-1":
          this.$router.push({ path: "/task" });
          this.activeIndex = "3";
          break;
        case "3-2":
          this.$router.push({ path: "/kettleTask" });
          this.activeIndex = "3";
          break;
        case "1":
          this.activeIndex = "1";

          let storeData = JSON.parse(
            JSON.stringify(this.$store.state.queryParams["dashboard"])
          );
          storeData.timeFlag = new Date().getTime();
          this.$store.commit("setQueryParams", {
            name: "dashboard",
            data: storeData
          });
          this.$router.push({ path: "/dashboard" });
          break;
        case "2":
          this.activeIndex = "2";
          // this.$router.push({ path: "/data-processing" });
          break;
      }
    },

    getRout() {
      let path = this.$route.path;
      switch (path) {
        case "/task":
          this.activeIndex = "3-1";
          break;
        case "/kettleTask":
          this.activeIndex = "3-2";
          break;
        case "/dashboard":
          this.activeIndex = "1";
          break;
        case "/data-processing":
          this.activeIndex = "2";
          break;
      }
      // console.log(this.activeIndex);
    }
  }
};

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
.nav-menu {
  display: inline-block;
  padding-left: 0px;

  .enc-nav-menu {
    background: transparent;

    .el-menu-item {
      height: $enc-nav-header-height;
      line-height: $enc-nav-header-height;
      font-size:15px;
      margin-left: 36px;
      i {
        margin-right: 7px;
        font-size: 36px;
        color: #425365;
      }
    }
    .el-submenu {
      margin-left: 36px;
      .el-submenu__title {
        color: #425365;
        i {
          margin-right: 7px;
          font-size: 36px;
          color: #425365;
        }
      }
    }
    .is-active {
      i {
        color: #409efe;
      }
    }
    .el-menu-item:hover,
    .el-menu-item:focus {
      i {
        color: #fff;
      }
    }

    .el-submenu {
      height: $enc-nav-header-height;
      line-height: $enc-nav-header-height;
    }
  }
  .el-submenu:hover,
  .el-submenu:focus {
    i {
      color: #fff;
    }
    .el-submenu__title i {
      color: #fff;
    }
  }
  .el-menu--horizontal>.el-menu-item {
    color: #425365;
  }
}

@media screen and ( max-width: 1280px) {
  .nav-menu {
    .enc-nav-menu {
      .el-menu-item {
        height: $enc-nav-header-mini-height;
        line-height: $enc-nav-header-mini-height;
      }
    }
  }
  .nav-menu .enc-nav-menu .el-submenu {
    height: $enc-nav-header-mini-height;
    line-height: $enc-nav-header-mini-height;
  }
  .enc-sub-header{
    margin-top:0px;
  }
}

</style>
<style rel="stylesheet/scss" lang="scss">
.owntmenu .el-submenu:hover,
.owntmenu .el-submenu:focus {
  i {
    color: #fff;
  }
  .el-submenu__title i {
    color: #fff;
  }
}

</style>
