<template>
<div>
<el-row v-for="(items,index) in searchForm" :key="index" :gutter="20" v-if="index != 0">
  <el-col :span="5">
    <el-form-item label="">
      <el-select v-model="items.outrelate" placeholder="">
        <el-option v-for="(item,index) in outrelateList" :key="index" :value="item.value" :label="item.name"></el-option>
      </el-select>
    </el-form-item>
  </el-col>
  <el-col :span="5">
    <el-select v-model="items.filtercolumn" placeholder="查询项">
      <el-option v-for="(item,index) in filtercolumnList" :key="index" :value="item" :label="item"></el-option>
    </el-select>
  </el-col>
  <el-col :span="5">
    <el-select v-model="items.filtertype" placeholder="">
      <el-option v-for="(item,index) in filtertypeList" :key="index" :value="item.value" :label="item.name"></el-option>
    </el-select>
  </el-col>
  <el-col :span="5">
    <el-input v-model="items.filterdata" placeholder="请输入查询的条件"></el-input>
  </el-col>
  <el-col :span="4">
    <el-button type="primary" size="mini" @click="delCondition(index)">删除</el-button>
  </el-col>
</el-row>
</div>
</template>
<script>
export default {
 data() {
      return {
        outrelateList:[{name:'并且',value:'and'},{name:'或者',value:'or'}],
        filtertypeList:[{name:'模糊查询',value:'4'},{name:'等于',value:'0'}],
      }
 },
 props:['searchForm','filtercolumnList'],
 methods:{
   //删除搜索条件
      delCondition(index ){
        this.searchForm.splice(index,1);
      },
 },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
