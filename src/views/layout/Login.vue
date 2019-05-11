<template>
      <keep-alive>
        <router-view />
      </keep-alive>
</template>
<script>
import { AppMain} from "./components";
export default {
  name: "Login",
  components: {
    AppMain,
  },
};

</script>
