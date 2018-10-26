<template>
  <el-form label-width="150px" class="form-fliter" :style="{height:formHeight}">
    <el-form-item v-for="item in dataObj" :label="item.name">
      <el-checkbox-group v-model="formSeled[item.id]" @change="formFilter">
        <el-checkbox v-for="subItem in item.checkData" :label="subItem.id" :key="subItem.id">{{subItem.name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data(){
    return {
      formSeled:{}
    }
  },
  props: {
    dataObj: {
      type: Array,
      required: true
    },
    formCollapse:{
      type: Boolean,
      required: false,
      default:true
    }
  },
  computed:{
    formHeight:function(){
      return this.formCollapse?'40px':'auto';
    }
  },
  mounted(){
    this.getFormSeled();
  },
  methods: {
    formFilter:function(){
      this.$emit('formFilter',this.formSeled);
    },
    getFormSeled:function(){
      var obj = {};
      for(var value of this.dataObj){
        obj[value.id] = value.seledData;
      }
      this.formSeled = obj;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .form-fliter{
    overflow: hidden;
    .el-form-item{
      margin-bottom:2px;
    }
  }
</style>
