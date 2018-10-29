<template>
  <div>
    <pie-chart></pie-chart>
    <hr/>
    <bar-chart></bar-chart>
    <hr/>
    <multi-linechart></multi-linechart>
    <hr/>
    <horizontal-barchart></horizontal-barchart>
    <hr/>
    <div style="margin-left: 40%">
      <percent-vis></percent-vis>
    </div>
  </div>
</template>

<script>
  import {PercentVis, PieChart, BarChart, MultiLinechart, HorizontalBarchart} from '../charts/components'


    export default {
        name: "index",
      components:{
        BarChart,
          PercentVis,
        PieChart,
        MultiLinechart,
        HorizontalBarchart
      }
    }
</script>

<style scoped>

</style>
