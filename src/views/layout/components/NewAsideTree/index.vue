<template>
  <div id="NewAisdeTree">
    <div class="tree-tools">
      <a href="javascript:void(0)" v-on:click="addNode" :style="styleObj"><i class="el-icon-plus"></i></a>
      <a href="javascript:void(0)" v-on:click="editNode" :style="styleObj"><i class="el-icon-edit"></i></a>
      <a href="javascript:void(0)" v-on:click="delNode" :style="styleObj"><i class="el-icon-close"></i></a>
    </div>
    <div class="treeContainer">
      <el-tree v-if="dataReady" style="height: calc(100vh - 106px);" :data="data" node-key="id" show-checkbox default-expand-all 
        highlight-current draggable :props="defaultProps" 
        check-strictly :default-checked-keys="checkedDepts" @node-click="handleNodeClick" 
        @check="selDept" @node-drop="dragDept" ref="tree" :allow-drop="allowDrop">
      </el-tree>
    </div>
    <el-dialog title="请输入部门节点名称" :visible.sync="dialogVisible" width="30%" class="input-dialog">
      <el-input style="margin-top:10px;" type="text" v-model="itemTxt" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="nodeAJax">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "NewAsideTree",
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      styleObj: {
        display: ''
      },
      editingNode: null,
      editingData: {},
      itemTxt: '',
      dataReady: false,
      dialogVisible: false,
      actionFlag: '',
      checkedDepts: []
    }
  },
  computed: {
    // checkedDepts:function(){
    // return this.$store.state.queryParams[this.$route.name].deptId?this.$store.state.queryParamsDefault[this.$route.name].deptId:this.$store.state.deptId;
    // }
    treeHeight: function() {
      return (window.innerHeight - 107);
    }
  },
  created() {
    this.$root.eventHub.$on('selTreeNode', (ids) => {
      this.checkedDepts = this.$store.state.deptId;
    });
    let that = this;
    let pathname = window.location.pathname;
    that.styleObj = {
      display: (window.location.pathname == "/task" || window.location.pathname == '/kettleTask') ? 'none' : ''
    }
    setInterval(() => {
      let pathname = window.location.pathname;
      that.styleObj = {
        display: (window.location.pathname == "/task" || window.location.pathname == '/kettleTask') ? 'none' : ''
      }
    }, 1000);
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      var _self = this;
      this.$ajax.post(window.ENV.API_DACM + '/deptInfo/getDeptInfo?t=' + new Date().getTime()).then(function(res) {
          if (res.data.success) {
            _self.data = res.data.datas;
            _self.dataReady = true;
          } else {
            console.log(res.code);
            _self.$alert('加载部门节点失败', '提示', {
              confirmButtonText: '确定'
            });
          }
        })
        .catch(function(err) {
          _self.$alert('加载部门节点失败', '提示', {
            confirmButtonText: '确定'
          });
        });
    },
    handleNodeClick(node, data) {
      this.editingNode = node;
      this.editingData = data;
    },
    addNode() {
      if (this.editingNode) {
        this.itemTxt = '';
        this.actionFlag = 'add';
        this.dialogVisible = true;
      } else {
        this.selDeptFirst();
      }
    },
    editNode() {
      if (this.editingNode) {
        this.itemTxt = this.editingNode.deptName;
        this.actionFlag = 'edit';
        this.dialogVisible = true;
      } else {
        this.selDeptFirst();
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      console.log(dropNode.data.id)
      if (dropNode.data.id == '1') {
        return false;
      } else {
        return true;
      }
    },
    nodeAJax() {
      var _self = this;
      if (_self.itemTxt.replace(/^\s+|\s+$/g, "") == "") {
        _self.$alert('请输入部门节点名称', '提示', {
          confirmButtonText: '确定'
        });
        return;
      }
      if (this.actionFlag == 'add') {
        let len = _self.editingNode.children.length;
        let level = 0;
        if (len == 0) {
          level = 0;
        } else {
          level = Number(_self.editingNode.children[len - 1].level) + 1;
        }
        this.$ajax.post(window.ENV.API_DACM + '/deptInfo/insertDeptInfo?pid=' + this.editingNode.id + '&deptName=' + this.itemTxt + '&level=' + level).then(function(res) {
            if (res.data.success == "true") {
              _self.dialogVisible = false;
              const newChild = { id: res.data.id, deptName: _self.itemTxt, level: level, children: [] };
              if (!_self.editingNode.children) {
                _self.$set(_self.editingNode, 'children', []);
              }
              _self.editingNode.children.push(newChild);

            } else {
              _self.$alert(res.data.message, '提示', {
                confirmButtonText: '确定'
              });
            }
          })
          .catch(function(err) {
            _self.$alert('添加部门节点失败', '提示', {
              confirmButtonText: '确定'
            });
          });
      } else {
        _self.$confirm('确认要修改此部门节点吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: "el-button--primary",
          type: 'warning'
        }).then(() => {
          _self.$ajax.post(window.ENV.API_DACM + '/deptInfo/updateDeptInfo?id=' + _self.editingNode.id + '&deptName=' + _self.itemTxt).then(function(res) {
              if (res.data.success == "true") {
                _self.dialogVisible = false;
                _self.editingNode.deptName = _self.itemTxt;
              } else {
                _self.$alert(res.data.message, '提示', {
                  confirmButtonText: '确定'
                });
              }
            })
            .catch(function(err) {
              _self.$alert('修改部门节点失败', '提示', {
                confirmButtonText: '确定'
              });
            });
        }).catch(() => {

        });

      }
    },
    delNode() {
      if (this.editingNode) {
        this.$confirm('确认要删除此部门节点吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          cancelButtonClass: "el-button--primary",
          type: 'warning'
        }).then(() => {
          this.delNodeAjax();
        });
      } else {
        this.selDeptFirst();
      }
    },
    delNodeAjax() {
      var _self = this;
      const promise0 = new Promise((resolve, reject) => {
        this.$ajax.post(window.ENV.API_DACM + '/deptInfo/queryDeptInfo?id=' + _self.editingNode.id).then(function(res) {
          if (res.data.success) {
            resolve();
          } else {
            reject();
            _self.$alert('有运行的采集任务的部门，无法删除', '提示', {
              confirmButtonText: '确定'
            });
          }
        }).catch(function(err) {
          reject();
          _self.$alert('查询部门采集任务失败，无法删除', '提示', {
            confirmButtonText: '确定'
          });
        });
      });

      Promise.all([promise0]).then(() => {
        this.$ajax.post(window.ENV.API_DACM + '/deptInfo/delDeptInfo?id=' + this.editingNode.id).then(function(res) {
            if (res.data.success != "false" && res.data.success != false) { //后端传过来的flag有“”所以以防万一
              const parent = _self.editingData.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === _self.editingNode.id);
              children.splice(index, 1);
              //删除成功，将存放当前节点的变量清空
              _self.editingData = null;
              _self.editingNode = null;
              //传空数组给监控页面，如果当前选择不是
              _self.$root.eventHub.$emit('selDept', []);
              //跳转到dashboard路由锁在页面
              if (_self.$route.name == "accessObjManage" || _self.$route.name == "accessObjInfo") {
                _self.$router.push({ name: 'dashboard' });
              }
            } else {
              _self.$alert('删除部门节点失败', '提示', {
                confirmButtonText: '确定'
              });
            }
          })
          .catch(function(err) {
            _self.$alert('删除部门节点失败', '提示', {
              confirmButtonText: '确定'
            });
          });
      });
    },
    selDeptFirst() {
      this.$alert('请先选择一个部门节点', '提示', {
        confirmButtonText: '确定'
      });
    },
    selDept(node, nodeStatus) {
      var list = this.$refs.tree.getCheckedNodes();
      var deptIds = this.$refs.tree.getCheckedKeys();
      var factorial;
      if (nodeStatus.checkedKeys.indexOf(node.id) == -1) {
        factorial = (function f(obj, tree) {
          var index1 = deptIds.indexOf(obj.id);
          if (index1 != -1) {
            deptIds.splice(index1, 1);
          }
          if (obj.children) {
            for (var value of obj.children) {
              f(value, tree)
            }
          }
        });
      } else {
        factorial = (function f(obj, tree) {
          list.push(obj);
          deptIds.push(obj.id);
          if (obj.children) {
            for (var value of obj.children) {
              f(value, tree)
            }
          }
        });
      }
      var anotherFactorial = factorial;
      factorial = null;
      anotherFactorial(node, this.$refs.tree);

      if (nodeStatus.checkedKeys.indexOf(node.id) != -1) {
        this.$refs.tree.setCheckedNodes(list);
      } else {
        this.$refs.tree.setCheckedKeys(deptIds)
      }

      this.$store.commit('selDept', deptIds);
      this.$root.eventHub.$emit('selDept', deptIds);
      if (this.$route.name == "accessObjManage" || this.$route.name == "accessObjInfo") {
        this.$router.push({ name: 'dashboard' });
      }
    },
    dragDept(Node, toDragNode, position, e) {
      const parent = position == 'inner' ? toDragNode : toDragNode.parent;
      const children = parent.data.children || parent.data;
      var list = [];
      for (var i = 0; i < children.length; i++) {
        list.push({
          id: children[i].id,
          pid: parent.data.id, //不能直接用parent.id，否则就是tree自己内部的id了
          name: children[i].deptName,
          level: i
        })
      }
      var _self = this;
      this.$ajax.post(window.ENV.API_DACM + '/deptInfo/updateDeptLevel', list).then(function(res) {
          if (res.data.success) {
          } else {
            _self.$alert('移动部门节点失败', '提示', {
              confirmButtonText: '确定'
            }).then(() => {
              _self.loadTree();
            });
          }
        })
        .catch(function(err) {
          console.log(err)
          _self.$alert('移动部门节点失败', '提示', {
            confirmButtonText: '确定'
          }).then(() => {
            _self.loadTree();
          });
        });
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
@import 'src/styles/variables.scss';
@import "src/styles/mixin.scss";
.tree-tools {
  width: 210px;
  height: 40px;
  line-height: 40px;
  @include tree-tools-bg-color($tree-tools-background-theme);
  border-bottom: 1px solid #414650;
  text-align: right;
  a {
    display: inline-block;
    margin: 0 20px 0 0;
    color: #fff;
    font-size: 16px;
     :hover {
     /*  color: #489bd9; */
    }
  }
}

#NewAisdeTree {
  .treeContainer {}
  .el-tree {
    background-color: transparent;
    color: #fff;
    .el-tree-node__content:focus,
    .el-tree-node__content:hover {
      background-color: transparent;
     /*  color: #409EFF; */
    }
    /* .el-tree-node:focus>.el-tree-node__content{ */
    /* background-color:transparent; */
    /* color:#409EFF; */
    /* } */
    .is-current>.el-tree-node__content {
      background-color: transparent;
      color: #409EFF;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
     /*  background-color: #409EFF;
     border-color: #409EFF; */
    }
  }
}

.el-tree {
  width: 100%;
  overflow:auto;
}

.el-tree>.el-tree-node {
  display: inline-block !important;
}
.el-tree-node__label {
  font-size: 15px;
}
</style>
