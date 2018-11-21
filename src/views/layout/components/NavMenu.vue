<template>
  <div class="nav-menu owntmenu">
    <el-menu :default-active="activeIndex" class="enc-nav-menu" mode="horizontal" @select="handleSelect" text-color="#425365" active-text-color="#499bd7">
      <el-menu-item index="1"><i class="enc-icon-shujujieru"></i>数据接入</el-menu-item>
      <el-menu-item index="2"><i class="enc-icon-shujuchuli"></i>数据处理</el-menu-item>
      <!-- <el-menu-item index="3">  <i class="enc-icon-renwuzhongxin"></i>任务中心    </el-menu-item> -->
      <el-submenu index="3" ref="index3" >
        <template slot="title"><i class="enc-icon-renwuzhongxin"></i>任务中心</template>
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

      // debugger;
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
      }
    },

    getRout() {
      let path = this.$route.path;
      switch(path){
          case "/task":
            this.activeIndex = "3-1";
            // this.$refs.index3.class="index3";
            break;
             case "/kettleTask":
            this.activeIndex = "3-2";
                        // this.$refs.index3.class="index3";

            break;
             case "/dashboard":
            this.activeIndex = "1";
            break;

      }
      console.log(this.activeIndex);

    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
.index3{
  border-bottom-color: rgb(73, 155, 215);
    color: rgb(73, 155, 215);
}
.nav-menu {
  display: inline-block;
  padding-left: 0px;

  .enc-nav-menu {
    background: transparent;

    .el-menu-item {
      height: $enc-nav-header-height;
      line-height: $enc-nav-header-height;
      i {
        margin-right: 10px;
        font-size: 36px;
        color: #4f4f4f;
      }
    }
    .el-submenu {
      .el-submenu__title {
        i {
          margin-right: 10px;
          font-size: 36px;
          color: #4f4f4f;
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