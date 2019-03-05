<template>
  <div class="aside-tree">
    <el-tree :data="data" :props="defaultProps" :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
  </div>
</template>
<script>
export default {
  data() {
      return {
        data: [{
          label: '部门',
          children: [{
            label: '07TEST',
            children: [{
              label: '4号（勿删）'
            }],
          }, {
            label: '07TEST',
            children: [{
              label: '4号（勿删）'
            }]
          }, {
            label: '07TEST',
            children: [{
              label: '4号（勿删）'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .aside-tree {
    padding: 36px;
    .el-tree {
      color: #8a8e97;
      background: transparent;
    }
  }
</style>