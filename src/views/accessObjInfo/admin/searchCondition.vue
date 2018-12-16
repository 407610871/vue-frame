<template>
<el-form :model="searchFormItem" label-width="100px" class="search-form" ref="searchFormItem">
<el-row :gutter="20">
  <el-col :span="4" v-if="NOIndex == 0">
    <el-form-item label="设置查询条数:">
      <el-input v-model.trim ="count" placeholder="请输入条数" ></el-input>
    </el-form-item>
  </el-col>
  <el-col :span="4" v-else>
    <el-form-item class="outrelate-form-item">
      <el-select v-model="searchFormItem.outrelate" placeholder="">
        <el-option v-for="(item,index) in outrelateList" :key="index" :value="item.value" :label="item.name"></el-option>
      </el-select>
    </el-form-item>
  </el-col>
  <el-col :span="4">
    <el-select v-model="searchFormItem.filtercolumn" placeholder="查询项" @change="changeFiltercolumn">
      <el-option v-for="(item,index) in filtercolumnList" :key="index" :value="item.name" :label="item.name"></el-option>
    </el-select>
  </el-col>
  <el-col :span="4" v-if="isTimestamp(searchFormItem.filtercolumn)">
    <el-form-item prop="timestamp" :rules="{required: true, message:'请选择时间格式',trigger:'change'}" class="timestamp-form-item">
    <el-select v-model="searchFormItem.timestamp" placeholder="时间格式">
      <el-option v-if="tableParams.ACCESS_SYS_DIALECT_ID == '10002'" v-for="(item,index) in dateFormat1" :key="index" :value="item.value" :label="item.name"></el-option>
      <el-option v-if="tableParams.ACCESS_SYS_DIALECT_ID == '10001'" v-for="(item,index) in dateFormat2" :key="index" :value="item.value" :label="item.name"></el-option>
    </el-select>
    </el-form-item>
  </el-col>
  <el-col :span="4">
    <el-select v-model="searchFormItem.filtertype" placeholder="">
      <el-option v-for="(item,index) in filtertypeList" :key="index" :value="item.value" :label="item.name"></el-option>
    </el-select>
  </el-col>
  <el-col :span="4">
    <el-form-item prop="filterdata" class="filterdata-form-item" :rules="{validator: validateFilterdata,trigger: 'blur'}">
    <el-input v-model.trim ="searchFormItem.filterdata" placeholder="请输入查询的条件"></el-input>
    </el-form-item>
  </el-col>
  <el-col :span="4" v-if="NOIndex == 0">
    <el-button type="primary" size="mini" @click="searchAll">查询</el-button>
  </el-col>
  <el-col :span="4" v-else>
    <el-button type="primary" size="mini" @click="delCondition(NOIndex)">删除</el-button>
  </el-col>
</el-row>
</el-form>
</template>
<script>
export default {
 name: 'searchCondition',
 data() {
      return {
        count:'',
        outrelateList:[{name:'并且',value:'and'},{name:'或者',value:'or'}],
        filtertypeList:[{name:'模糊查询',value:'4'},{name:'等于',value:'0'}],
        dateFormat1:[{value:'yyyy-mm-dd',name:'YYYY-MM-DD'},{value:'yyyy-mm-dd hh24',name:'YYYY-MM-DD HH(24小时制)'},{value:'yyyy-mm-dd hh24:mi',name:'YYYY-MM-DD HH:MI(24小时制)'},{value:'yyyy-mm-dd hh24:mi:ss',name:'YYYY-MM-DD HH:MI:SS(24小时制)'}],
        dateFormat2:[{value:'%Y-%m-%d',name:'YYYY-MM-DD'},{value:'%Y-%m-%d %H',name:'YYYY-MM-DD HH(24小时制)'},{value:'%Y-%m-%d %H:%i',name:'YYYY-MM-DD HH:MI(24小时制)'},{value:'%Y-%m-%d %H:%i:%s',name:'YYYY-MM-DD HH:MI:SS(24小时制)'}],
      }
 },
 props:['searchFormItem','filtercolumnList','NOIndex','searchForm'],
 methods:{
   searchAll(){
     this.$emit('searchAll',this.count);
   },
   checkForm(){
      return new Promise((resolve, reject)=>{
          this.$refs.searchFormItem.validate(valid =>{
            resolve(valid);
          })
        });
      },
   //删除搜索条件
      delCondition(index ){
        this.searchForm.splice(index,1);
      },
      changeFiltercolumn(){
        if(this.isTimestamp(this.searchFormItem.filtercolumn)){
          this.searchFormItem.columnType = "TIMESTAMP";
        }else{
          this.searchFormItem.columnType =this.test(this.searchFormItem.filtercolumn);
          delete this.searchFormItem.timestamp;
        }
      },
      test(name){
        let datatypeArr =  this.filtercolumnList.find(item=>item.name == name);
        return datatypeArr.datatype;
      },
      isTimestamp(name){
        let datatypeArr =  this.filtercolumnList.find(item=>item.name == name);
        if(!datatypeArr) return false;
        let datatype = datatypeArr.datatype;
        if(this.tableParams.ACCESS_SYS_DIALECT_ID == '10001'){
          return datatype == "timestamp";
        }else if(this.tableParams.ACCESS_SYS_DIALECT_ID == '10002'){
          //return datatype == "TIMESTAMP(0)";
          return datatype.indexOf('TIMESTAMP') > -1;
        }else{
          return false;
        }
      },
      validateFilterdata(rule, value, callback){
        let reg = this.getRegStr();
        if(!reg||reg.test(value)){
          callback();
        }else{
          callback(new Error("请输入正确时间格式"));
        }
      },
      getRegStr(){
        let reg1 = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;//2014-01-01
        let reg2 = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d)$/;//2014-01-01 12
        let reg3 = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d$/;//2014-01-01 12:00
        let reg4 = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;//2014-01-01 12:00:00
        let timestamp = this.searchFormItem.timestamp;
        if(timestamp == this.dateFormat1[0].value||timestamp == this.dateFormat2[0].value){
          return reg1;
        }else if(timestamp == this.dateFormat1[1].value||timestamp == this.dateFormat2[1].value){
          return reg2;
        }else if(timestamp == this.dateFormat1[2].value||timestamp == this.dateFormat2[2].value){
          return reg3;
        }else if(timestamp == this.dateFormat1[3].value||timestamp == this.dateFormat2[3].value){
          return reg4;
        }else{
          return "";
        }
      },
 },
  computed: {
      tableParams: function() {
        return this.$store.state.queryParams.accessObjInfo;
      },
  }
}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
.timestamp-form-item,
.filterdata-form-item,
.outrelate-form-item{
    .el-form-item__content{
      margin-left:0!important;
    }
  }
</style>
