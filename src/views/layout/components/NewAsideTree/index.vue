<template>
  <div id="NewAisdeTree">
    <v-jstree :data="data" multiple allow-batch whole-row @item-click="itemClick"></v-jstree>
  </div>
</template>

<script>
    export default {
        name: "NewAsideTree",
      data() {
        return {
          data: [
            {
              "text": "部门",
              "children": [
                {
                  "text": "部门",
                  "selected": true
                },
                {
                  "text": "部门"
                },
                {
                  "text": "部门",
                  "opened": true,
                  "children": [
                    {
                      "text": "部门"
                    }
                  ]
                },
                {
                  "text": "部门"
                },
                {
                  "text": "部门"
                }
              ]
            },
            {
              "text": "部门",
              "opened": true,
              "children": [
                {
                  "text": "部门",
                  "selected": true
                },
                {
                  "text": "部门"
                },
                {
                  "text": "部门",
                  "opened": true,
                  "children": [
                    {
                      "text": "部门"
                    }
                  ]
                },
                {
                  "text": "部门"
                },
                {
                  "text": "部门"
                }
              ]
            },
            {
              "text": "部门"
            }
          ]
        }
      },
      methods: {
        itemClick (node) {
          console.log(node.model.text + ' clicked !')
        }
      }
    }
</script>

<style >
  .tree-anchor i{
    display: none !important;
  }

  .tree-anchor span{
    color: #eeeeee;
  }
</style>
