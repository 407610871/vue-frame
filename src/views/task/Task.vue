<template>
    <div>
        123

        <el-button type="text" @click="dialogIsCheck = true">数据核验 Dialog</el-button>
        <el-button type="text" @click="dialogTaskDetail = true">接入任务详情 Dialog</el-button>
        <el-dialog title="接入任务详情" :visible.sync="dialogTaskDetail">
            </el-dialog>
             <el-dialog title="数据核验" :visible.sync="dialogIsCheck">
            </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
dialogIsCheck:false,
dialogTaskDetail:false


    };
  }
};
</script>

