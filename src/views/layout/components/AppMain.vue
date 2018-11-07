<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.fullPath
      // return this.$store.state.routeFlag[this.$route.name]
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 113px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #eff3f6;
}
.app-main>div{
  height:calc(100vh - 113px);
}
</style>
