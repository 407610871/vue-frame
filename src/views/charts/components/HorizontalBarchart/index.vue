<template>
  <div>
    <p style="text-align: center">{{title}}</p>
    <p style="text-align: left;margin-left: 10px">{{subtitle}}</p>
    <p style="text-align: left;margin-left: 10px;font-size: 1px">{{unit}}</p>
    <v-chart :forceFit="true" :height="height" :data="data" renderer='svg'>
      <v-coord type="rect" direction="LB" />
      <v-tooltip />
      <v-axis dataKey="country" :label="label" />
      <v-bar position="country*population" />
    </v-chart>
  </div>
</template>

<script>
  const DataSet = require('@antv/data-set');

  const sourceData = [
    { country: '其他', population: 131744 },
    { country: '移动警务', population: 104970 },
    { country: '国内旅客', population: 29034 },
    { country: '卡口信息', population: 23489 },
    { country: '常住人口', population: 18203 },
  ];

  const dv = new DataSet.View().source(sourceData);
  dv.transform({
    type: 'sort',
    callback(a, b) {
      return a.population - b.population > 0;
    },
  });
  const data = dv.rows;

  const label = { offset: 12 };

  export default {
    data() {
      return {
        title:"业务类别数据量分析 单位:万",
        subtitle:"表使用频率统计",
        unit:"单位：次",
        name:"HorizontalBarchart",
        data,
        height: 400,
        label: label,
      };
    }
  };
</script>
