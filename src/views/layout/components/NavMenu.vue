<template>
  <div class="nav-menu">
    <el-menu
      class="enc-nav-menu"
      mode="horizontal"
      text-color="#425365"
      :default-active="activeRoutePath"     
      @select="handleSelect"
      router
    >
      <el-menu-item index="user">
        <i class="enc-icon-taskShow navIcon"/>
        <span class="tit">用户管理</span>
      </el-menu-item>
      <el-menu-item index="role">
        <i class="enc-icon-taskShow navIcon"/>
        <span class="tit">角色管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeRoutePath: "user"
    };
  },
  created() {
    this.activeRoutePath = `${this.$route.name}`;
  },
  mounted() {},
  computed: {
 
  },
  watch: {
    $route(to) {
      this.activeRoutePath = `${this.$route.name}`;
    }
  },
  methods: {
    handleSelect(key, keyPath) {

    },
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";
.nav-menu {
  display: inline-block;
  @media screen and(max-width:1060px) {
    padding-left: 26px;
  }
  .enc-nav-menu {
    background: transparent;

    .el-menu-item {
      height: $enc-nav-header-height;
      line-height: $enc-nav-header-height;
      padding: 0 30px 0 26px;
      font-size: 0;
      &.is-active {
        color: #00b6ff;
      }
      .navIcon {
        width: 24px;
        font-size: 23px;
        margin-right: 7px;
        display: inline-block;
        vertical-align: middle;
      }
      .tit {
        display: inline-block;
        vertical-align: middle;
        font-size: 15px;
      }
    }

    .el-submenu {
      height: $enc-nav-header-height;
      line-height: $enc-nav-header-height;
    }
  }
}
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom-width: 2px;
}
</style>
