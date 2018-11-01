<template>
  <div id="NewAisdeTree">
    <div class="tree-tools">
      <a href="javascript:void(0)" v-on:click="addNode"><i class="el-icon-plus"></i></a>
      <a href="javascript:void(0)" v-on:click="editNode"><i class="el-icon-edit"></i></a>
      <a href="javascript:void(0)" v-on:click="delNode"><i class="el-icon-close"></i></a>
    </div>
    <v-jstree v-if="dataReady" :data="data" :multiple="false" allow-batch whole-row text-field-name="deptName" value-field-name="id" @item-click="itemClick">
      <!-- <template scope="_">
        <div style="display: inherit; width: 200px" @click.ctrl="customItemClickWithCtrl">
          <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
          <span>{{_.model.deptName}}</span>
          <button style="border: 0px; background-color: transparent; cursor: pointer;" v-if="_.model.id != 0"><i class="el-icon-plus"></i></button>
          <button style="border: 0px; background-color: transparent; cursor: pointer;"><i class="el-icon-edit"></i></button>
          <button style="border: 0px; background-color: transparent; cursor: pointer;"><i class="el-icon-close"></i></button>
        </div>
      </template> -->
    </v-jstree>
    <el-dialog
      title="部门节点名称修改"
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
          editingNode:null,
          editingItem:{},
          itemTxt:'',
          dataReady:false,
          dialogVisible:false,
          actionFlag:''
        }
      },
      mounted(){
        this.loadTree();
      },
      methods: {
        loadTree(){
          var _self = this;
          this.$ajax.post('http://10.19.160.29:8088/demo/deptInfo/getDeptInfo').then(function(res){
            console.log('dataLoaded:treeData');
            console.log(res);
            _self.data = res.data.datas;
            _self.dataReady = true;
            console.log(_self.data);
          })
          .catch(function(err){
            console.log(err)
          });
        },
        itemClick (node) {
          // console.log(node.model.text + ' clicked !')
          this.$store.commit('selDept',node.model.id);
          this.editingNode = node;
          this.editingItem = node.model;
        },
        addNode(){
          if(this.editingItem.id !== undefined){
            this.itemTxt = '';
            this.actionFlag = 'add';
            this.dialogVisible = true;
          }else{
            alert('请先选择一个部门节点');
          }
        },
        editNode(){
          if(this.editingItem.id !== undefined){
            this.itemTxt = this.editingItem.deptName;
            this.actionFlag = 'edit';
            this.dialogVisible = true;
          }else{
            alert('请先选择一个部门节点');
          }
        },
        nodeAJax(){
          var _self = this;
          if(this.actionFlag == 'add'){
            this.$ajax.post('http://10.19.160.29:8088/demo/deptInfo/insertDeptInfo?pid='+this.editingItem.id+'&deptName='+this.itemTxt+'&level='+(this.editingItem.children?this.editingItem.children.length:0)).then(function(res){
              console.log('addsuccess');
              if(res.data.success){
                _self.dialogVisible = false;
                _self.editingItem.addChild({
                  deptName: _self.itemTxt,
                  id: res.data.id
                });
              }else{
                console.log(res.data.code)
              }
            })
            .catch(function(err){
              console.log(err)
            });
          }else{
            this.$ajax.post('http://10.19.160.29:8088/demo/deptInfo/updateDeptInfo?id='+this.editingItem.id+'&deptName='+this.itemTxt).then(function(res){
              console.log('editsuccess');
              if(res.data.success){
                _self.dialogVisible = false;
                _self.editingItem.deptName = _self.itemTxt;
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
          if(this.editingItem.id !== undefined){
            var _self = this;
            this.$ajax.post('http://10.19.160.29:8088/demo/deptInfo/delDeptInfo?id='+this.editingItem.id).then(function(res){
              console.log('delsuccess');
              if(res.data.success){
                var index = _self.editingNode.parentItem.indexOf(_self.editingItem)
                _self.editingNode.parentItem.splice(index, 1);
                _self.dialogVisible = false;
              }else{
                console.log(res.data.code)
              }
            })
            .catch(function(err){
              console.log(err)
            });
          }else{
            alert('请先选择一个部门节点');
          }
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
  #NewAisdeTree .tree{
    margin-top:26px;
  }
  .tree-anchor i{
    display: none !important;
  }
  .tree-anchor span{
    color: #eeeeee;
  }
  .tree-selected span{
    font-weight:bold;
    color:#489bd9;
  }
  .input-dialog{
    .el-dialog__body{
      padding-top:10px;
      padding-bottom:10px;
    }
  }
</style>
