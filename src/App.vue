<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "App",
  beforeCreate() {
    
      // request({
         // url: "http://localhost:8088/DAM/users/userInfo",
        // method: "GET",

      // });
  }
};
</script>
<style>
#app {
  overflow: hidden;
}
</style>

