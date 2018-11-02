<template>
    <div>
        <el-button type="text" @click="dialogIsCheck = true">数据核验 Dialog</el-button>
        <el-button type="text" @click="dialogTaskDetail = true">接入任务详情 Dialog</el-button>

        <el-dialog title="接入任务详情" :visible.sync="dialogTaskDetail">
           
        </el-dialog>
        <el-dialog title="数据核验" :visible.sync="dialogIsCheck" class="data-check-dialog" :close-on-click-modal="false"	:close-on-press-escape="false">
          <dialog-check /> 
        </el-dialog>
    </div>
</template>
<script>
import DialogCheck from './DialogIsCheck.vue';
export default {
  data() {
    return {
      dialogIsCheck: false,
      dialogTaskDetail: false,
    };
  },
 components: { 
   DialogCheck
 },
};
</script>
<style lang="scss">
.data-check-dialog {
  .el-dialog{
    min-width:680px;
  }
}
</style>


