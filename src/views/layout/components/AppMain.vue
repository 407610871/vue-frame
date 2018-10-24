<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view :key="key"/>
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
<<<<<<< HEAD
.app-main>div{
  height:calc(100vh - 113px);
}
</style>
=======
</style>

>>>>>>> 13cee708e0d47163f3aaee0fd02dce1d22e4fc64
