
<template> 
<el-form label-width="150px" class="form-fliter" :style="{height:formHeight}"> 
<el-form-item v-for="(item,indexs) in dataObj" :label="item.name" v-if='indexs<formHeight'> 

<el-radio v-if="item.type=='radio'" v-for="subItem in item.checkData" v-model="formSeled[item.id]" :label="subItem.id" :key="subItem.id" @change="formFilter">{{subItem.name}}</el-radio> 
<el-checkbox-group v-if="item.type=='checkbox'" v-model="formSeled[item.id]" @change="formFilter"> 
<el-checkbox    v-for="(subItem) in item.checkData" :label="subItem.id" :key="subItem.id" >{{subItem.name}}</el-checkbox> 
</el-checkbox-group> 
</el-form-item> 
</el-form> 
</template> 
<script>
export default {
  data() {
    return {
      formSeled: {}
    };
  },
  props: {
    dataObj: {
      type: Array,
      required: true
    },
    formCollapse: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    formHeight: function() {
      return this.formCollapse ? 1 : 3;
    }
  },
  mounted() {
    this.getFormSeled();
  },
  methods: {
    formFilter: function() {
      this.$emit("formFilter", this.formSeled);
    },
    getFormSeled: function() {
      var obj = {};
      for (var value of this.dataObj) {
        obj[value.id] = value.seledData;
      }
      this.formSeled = obj;
     
           
    }
  }
};
</script> 

<style rel="stylesheet/scss" lang="scss" scoped>
.form-fliter {
  overflow: hidden;
  .el-form-item {
    margin-bottom: 2px;
  }
}
</style> 
