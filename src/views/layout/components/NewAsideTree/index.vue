<template>
  <div id="NewAisdeTree">
    <div class="tree-tools">
      <a href="javascript:void(0)" v-on:click="addNode"><i class="el-icon-plus"></i></a>
      <a href="javascript:void(0)" v-on:click="editNode"><i class="el-icon-edit"></i></a>
      <a href="javascript:void(0)" v-on:click="delNode"><i class="el-icon-close"></i></a>
    </div>
		<div class="treeContainer" v-bind:style="{'height':treeHeight}">
			<el-tree
				v-if="dataReady"
				:data="data"
				node-key="id"
				show-checkbox
				default-expand-all
				highlight-current
				draggable
				:props="defaultProps"
				@node-click="handleNodeClick"
				check-strictly
				:default-checked-keys="checkedDepts"
				@check="selDept"
				@node-drop="dragDept"
				ref="tree"
				>
			</el-tree>
		</div>
    <el-dialog
      title="请输入部门节点名称"
      :visible.sync="dialogVisible"
      width="30%"
      class="input-dialog">
      <el-input style="margin-top:10px;" type="text" v-model="itemTxt" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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
          editingNode:null,
          editingData:{},
          itemTxt:'',
          dataReady:false,
          dialogVisible:false,
          actionFlag:'',
					checkedDepts:[]
        }
      },
			computed:{
				// checkedDepts:function(){
					// return this.$store.state.queryParams[this.$route.name].deptId?this.$store.state.queryParamsDefault[this.$route.name].deptId:this.$store.state.deptId;
				// }
				treeHeight:function(){
					return (window.innerHeight-107)+'px';
				}
			},
			created(){
				this.$root.eventHub.$on('selTreeNode', (ids)=>{
					this.checkedDepts = ids;
				});
			},
      mounted(){
        this.loadData();
      },
      methods: {
        loadData(){
          var _self = this;
          this.$ajax.post('http://10.19.248.200:32661/DACM/deptInfo/getDeptInfo?t=' + new Date().getTime()).then(function(res){
            if(res.data.success){
              _self.data = res.data.datas;
              _self.dataReady = true;
							
							// _self.$root.eventHub.$on('selDeptTree', (ids)=>{
								// _self.$refs.tree.setCheckedKeys(ids)
							// });
            }else{
              console.log(res.code);
            }
          })
          .catch(function(err){
            console.log(err)
          });
        },
        handleNodeClick(node,data){
          this.editingNode = node;
          this.editingData = data;
        },
        addNode(){
          if(this.editingNode){
            this.itemTxt = '';
            this.actionFlag = 'add';
            this.dialogVisible = true;
          }else{
            this.selDeptFirst();
          }
        },
        editNode(){
          if(this.editingNode){
            this.itemTxt = this.editingNode.deptName;
            this.actionFlag = 'edit';
            this.dialogVisible = true;
          }else{
            this.selDeptFirst();
          }
        },
        nodeAJax(){
          var _self = this;
          if(this.actionFlag == 'add'){
            this.$ajax.post('http://10.19.248.200:32661/DACM/deptInfo/insertDeptInfo?pid='+this.editingNode.id+'&deptName='+this.itemTxt+'&level='+(this.editingNode.children?this.editingNode.children.length:0)).then(function(res){
            // this.$ajax.post('./addDept').then(function(res){
              console.log('addsuccess');
              console.log(res);
              if(res.data.success){
                _self.dialogVisible = false;
                const newChild = { id:res.data.id, deptName: _self.itemTxt, children: [] };
                if (!_self.editingNode.children) {
                  _self.$set(_self.editingNode, 'children', []);
                }
                _self.editingNode.children.push(newChild);
              }else{
                console.log(res.data.code)
              }
            })
            .catch(function(err){
              console.log(err)
            });
          }else{
            this.$ajax.post('http://10.19.248.200:32661/DACM/deptInfo/updateDeptInfo?id='+this.editingNode.id+'&deptName='+this.itemTxt).then(function(res){
            // this.$ajax.post('./success').then(function(res){
              console.log('editsuccess');
              if(res.data.success){
                _self.dialogVisible = false;
                _self.editingNode.deptName = _self.itemTxt;
              }else{
                console.log(res.data.code)
              }
            })
            .catch(function(err){
              console.log(err)
            });
          }
        },
        delNode(){
          if(this.$refs.tree.getCurrentKey()){
            var _self = this;
            this.$ajax.post('http://10.19.248.200:32661/DACM/deptInfo/delDeptInfo?id='+this.editingNode.id).then(function(res){
            // this.$ajax.post('./success').then(function(res){
              console.log('delsuccess');
              if(res.data.success){
                const parent = _self.editingData.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === _self.editingNode.id);
                children.splice(index, 1);
              }else{
                console.log(res.data.code)
              }
            })
            .catch(function(err){
              console.log(err)
            });
          }else{
            this.selDeptFirst();
          }
        },
        selDeptFirst(){
          this.$alert('请先选择一个部门节点','提示', {
            confirmButtonText: '确定'
          });
        },
        selDept(node,nodeStatus){
					var list = this.$refs.tree.getCheckedNodes();
					var deptIds = this.$refs.tree.getCheckedKeys();
          if(nodeStatus.checkedKeys.indexOf(node.id) == -1){
            this.$refs.tree.setChecked(node.id,false)
          }else{
            var factorial=(function f(obj,tree){
                list.push(obj);
                deptIds.push(obj.id);
                if(obj.children){
                  for(var value of obj.children){
                    f(value,tree)
                  }
                }
            });
            var anotherFactorial=factorial;
            factorial=null;
            anotherFactorial(node,this.$refs.tree);
            this.$refs.tree.setCheckedNodes(list);
          }
					
					this.$store.commit('selDept',deptIds);
					this.$root.eventHub.$emit('selDept',deptIds);
					if(this.$route.name=="accessObjManage" || this.$route.name=="accessObjInfo"){
						this.$router.push({name:'dashboard'});
					}
        },
        dragDept(Node,toDragNode,position,e){
          const parent = position=='inner'?toDragNode:toDragNode.parent;
          const children = parent.data.children || parent.data;
          var list = [];
          for(var i=0;i<children.length;i++){
            list.push({
              id:children[i].id,
              pid:parent.data.id, //不能直接用parent.id，否则就是tree自己内部的id了
              name:children[i].deptName,
              level:i
            })
          }
          this.$ajax.post('http://10.19.248.200:32661/DACM/deptInfo/updateDeptLevel',list).then(function(res){
            if(res.data.success){
              console.log('move success!')
            }else{
              console.log(res.data.code)
            }
          })
          .catch(function(err){
            console.log(err)
          });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
  .tree-tools{
    position: fixed;
    top:66px;
    left:0;
    width:210px;
    height:40px;
    line-height:40px;
    padding-left:10px;
    background-color: #5F6676;
    border-bottom:1px solid #414650;
    text-align: right;
    a{
      display: inline-block;
      margin:0 20px 0 0;
      color:#fff;
      font-size: 16px;
      :hover{
        color:#489bd9;
      }
    }
  }
  #NewAisdeTree{
		.treeContainer{
			margin-top:40px;
			overflow:auto;
		}
		.el-tree{
			background-color: transparent;
			color:#fff;
			.el-tree-node__content:focus,
			.el-tree-node__content:hover{
				background-color: transparent;
				color:#409EFF;
			}
			/* .el-tree-node:focus>.el-tree-node__content{ */
				/* background-color:transparent; */
				/* color:#409EFF; */
			/* } */
			.is-current>.el-tree-node__content{
				background-color:transparent;
				color:#409EFF;
			}
			.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
				background-color:#409EFF;
				border-color:#409EFF;
			}
		}
	}
</style>
