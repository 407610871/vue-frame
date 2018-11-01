<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  beforeCreate() {
    console.log(this);

      // axios({
      //   url: "http://localhost:8088/DAM/users/userInfo",
      //   method: "GET",
      //   headers: {
      //     Authorization: "bearer " + this.$keycloak.token
      //   }
      // });

  }
};
</script>
