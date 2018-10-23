<template>
  <div>
    <pie-chart></pie-chart>
    <hr/>
    <div style="margin-left: 40%">
      <percent-vis></percent-vis>
    </div>
    <hr/>
  </div>
</template>

<script>
  import {PercentVis, PieChart} from '../charts/components'

    export default {
        name: "index",
      components:{
          PercentVis,
        PieChart
      }
    }
</script>

<style scoped>

</style>
