<template>
  <div>
    <pie-chart></pie-chart>
    <hr/>
    <percent-vis></percent-vis>
  </div>
</template>

<script>
  import {PercentVis} from '../charts/components'
  import {PieChart} from '../charts/components'
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
