<template>
<div class="data-processing"></div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DataProcessing',
  components: {},
}
</script>

<style scoped>
  .data-processing {
    width: 100%;
    height: calc(100vh - 66px)!important;
    background: url('../../assets/images/sjcl.jpg') no-repeat;
    background-size: cover;
  }
</style>
