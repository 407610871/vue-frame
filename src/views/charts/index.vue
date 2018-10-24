<template>
  <div>
    <pie-chart></pie-chart>
    <hr/>
    <bar-chart></bar-chart>
    <hr/>
    <multi-linechart></multi-linechart>
    <hr/>
    <div style="margin-left: 40%">
      <percent-vis></percent-vis>
    </div>
  </div>
</template>

<script>
  import {PercentVis, PieChart, BarChart, MultiLinechart} from '../charts/components'


    export default {
        name: "index",
      components:{
        BarChart,
          PercentVis,
        PieChart,
        MultiLinechart
      }
    }
</script>

<style scoped>

</style>
