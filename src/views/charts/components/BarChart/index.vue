<template>
  <div>
    <p style="text-align: center">{{title}}</p>
    <v-chart :forceFit="true" :height="height" :data="data" renderer='svg'>
      <v-legend />
      <v-tooltip />
      <v-axis />

      <v-bar position="Key*Data" color="name" :adjust="adjust" />
    </v-chart>
  </div>
</template>

<script>
  const DataSet = require('@antv/data-set');

  const sourceData = [
    { name: '符合质量', '原始库区': 18.9, '标准库区': 28.8, '专题库区': 39.3 },
    { name: '不符合质量', '原始库区': 12.4, '标准库区': 23.2, '专题库区': 34.5 },
  ];

  const dv = new DataSet.View().source(sourceData);
  dv.transform({
    type: 'fold',
    fields: ['原始库区', '标准库区', '专题库区'],
    key: 'Key',
    value: 'Data',
  });
  const data = dv.rows;


  export default {
    name:"BarChart",
    data() {
      return {
        data,
        title:"表完整性统计",
        height: 400,
        adjust: [{
          type: 'dodge',
          marginRatio: 0 / 32,
        }],
      };
    }
  };
</script>

<style scoped>

</style>
