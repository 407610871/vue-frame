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
  height: calc(100vh - 113px);
  width: 100%;
  position: relative;
  overflow: auto;
  background: #eff3f6;
}
</style>
