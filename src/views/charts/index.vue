<template>
  <div>
    <pie-chart></pie-chart>
    <hr/>
    <div style="margin-left: 40%">
      <percent-vis></percent-vis>
    </div>
    <hr/>
    <bar-chart></bar-chart>
  </div>
</template>

<script>
  import {PercentVis, PieChart, BarChart} from '../charts/components'


    export default {
        name: "index",
      components:{
        BarChart,
          PercentVis,
        PieChart
      }
    }
</script>

<style scoped>

</style>
