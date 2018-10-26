<template>
  <div>
    <p style="text-align: center">{{title}}</p>
    <v-chart :force-fit="true" :height="height" :data="data" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-line position="month*temperature" color="city" />
      <v-point position="month*temperature" color="city" :size="4" :v-style="style" :shape="'circle'" />
    </v-chart>
  </div>
</template>

<script>
  const DataSet = require('@antv/data-set');

  const sourceData = [
    { month: '09-01', 原始区: 7.0, 标准区: 3.9 },
    { month: '09-02', 原始区: 6.9, 标准区: 4.2 },
    { month: '09-03', 原始区: 9.5, 标准区: 5.7 },
    { month: '09-04', 原始区: 14.5, 标准区: 8.5 },
    { month: '09-05', 原始区: 18.4, 标准区: 11.9 },
    { month: '09-06', 原始区: 21.5, 标准区: 15.2 },
    { month: '09-07', 原始区: 25.2, 标准区: 17.0 },
    { month: '09-08', 原始区: 26.5, 标准区: 16.6 },
    { month: '09-09', 原始区: 23.3, 标准区: 14.2 }
  ];

  const dv = new DataSet.View().source(sourceData);
  dv.transform({
    type: 'fold',
    fields: ['原始区', '标准区'],
    key: 'city',
    value: 'temperature',
  });
  const data = dv.rows;

  const scale = [{
    dataKey: 'month',
    min: 0,
    max: 1,
  }];

  export default {
    name:"MultiLinechart",
    data() {
      return {
        title:"这是标题",
        data,
        scale,
        height: 400,
        style: { stroke: '#fff', lineWidth: 1 },
      };
    }
  };
</script>
