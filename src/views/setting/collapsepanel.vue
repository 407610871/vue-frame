<template>
  <div>
    <div class="collapsepanel" v-if="pageReady && storageList.length>=pageSize*(pageNum-1)" >
      <div v-for="(item,index) in storageList" :key="index"> 
        <div class="collapsepanel-title" v-show="index != activeIndex"
        v-on:click="activeIndex = index">{{item.storageName}}<i class="el-icon-arrow-right"></i></div>
        <el-row :gutter="20" v-show="index == activeIndex">
          <el-col :span="4">
            <div class="grid-content">
              <div class="collapsepanel-subtitle">{{item.storageName}}</div>
            </div>
          </el-col>
          <el-col :span="11" class="setinfo">
            <div class="grid-content">
              <p>
                <span class="title1">{{item.name}}</span>
                <br /> hdfs主机名:{{item.name}}
                <br /> 端口号：{{item.port}}
                <br /> hdfs.url：{{item.url}}
                <br /> 备用节点字符串：{{item.bak}}
                <br /> 根目录：{{item.root}}
                <br /> impala服务器地址：{{item.impalaPath}}
              </p>
            </div>
          </el-col>
          <el-col :span="9" class="collapsepanel-tools ">
            <div class="grid-content collaspe-btn clearfix">
              <div class="edithdd" style="display: inline-block; margin-left:10px; margin-right: 10px;line-height: 2;margin-bottom: 12px;">
                <hdfs-edit :indexEq="index" :ownId="item.storageId" @refresh="refreshs(index)" ></hdfs-edit>
              </div>
              <el-button type="primary" @click="setConnect" :id="item.storageId" :disabled="item.storageId == seledId">关联</el-button>
              <el-button type="primary" @click="setDelete" :id="item.storageId" :disabled="item.storageId != seledId">取消关联</el-button>
              <el-button type="primary" @click="setDeleted" :id="item.storageId"  :disabled="item.storageId == seledId">删除</el-button>
            </div>
          </el-col>
      </el-row>
      </div>
    </div>
    <div class="enc-pagination" v-if="pageSize<total && pageReady">
      <el-pagination style="float:right; margin:10px;" @current-change="goPage" background :page-size="pageSize" :total="total" layout="prev, pager, next, jumper" :current-page.sync="currentPage">
      </el-pagination>
    </div>
    <div class="clearfix">
      <hdfs-add :msg="1" @refresh="refresh()"></hdfs-add>
    </div>
  </div>
</template>
<script>
import hdfsAdd from '@/views/mainLay/dialog/hdfs_add'
import hdfsEdit from '@/views/mainLay/dialog/hdfs_edit'
export default {
  data() {
    return {
      storageList: [],
      activeIndex: 0,
      seledId: -1,
      editingId: -1,
      editTxt: '',
      currentPage: 1,
      total: 1,
      pageReady: false,
      pageNum: 1,
      pageSize: 5,
      isEditIndex:-1,
      isEditPage:-1,
      isDelPage:-1,
      isAddFlag:-1,
    }
  },
  props: {
    settingList: {
      type: Object,
      required: true
    },
  },
  watch: {
    settingList: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.settingList = newVal;
        if(this.isDelPage !=-1){//删除之后跳转到操作页面并不展示内容
          this.activeIndex =-1;
          this.currentPage =this.isDelPage;
          this.pageNum =this.isDelPage;
        }else if(this.isAddFlag !=-1){//新增flag，新增之后跳到第一页第一个
        this.activeIndex =0;
        this.currentPage =1;
        this.pageNum =1;
        }else if(this.isEditIndex !=-1){//修改flag，修改之后跳转到当前页，当前项
              this.activeIndex  = this.isEditIndex;
         this.currentPage = this.isEditPage;
         this.pageNum = this.isEditPage;
        }else{
       this.seledId = this.settingList.seledId;
        for (var i = 0; i < this.settingList.list.length; i++) {
          if (this.settingList.list[i].storageId == this.settingList.seledId) {
            this.activeIndex = i;
            this.pageNum = Math.ceil((i + 1) / this.pageSize);
            this.currentPage = Math.ceil((i + 1) / this.pageSize);
            break;
          }
        }
    }   
        this.storageList = this.settingList.list;
        this.total = this.settingList.list.length;
        this.pageReady = true;
        this.isDelPage =-1;//重置flag
        this.isAddFlag =-1;
        this.isEditIndex =-1;
        this.isEditPage =-1;
      }
    }
  },
  mounted() {

    console.log('111');
    console.log(this.settingList.list);
   
    this.seledId = this.settingList.seledId;
    for (var i = 0; i < this.settingList.list.length; i++) {
      if (this.settingList.list[i].storageId == this.settingList.seledId) {
        this.activeIndex = i;
        this.pageNum = Math.ceil((i + 1) / this.pageSize);
        this.currentPage = Math.ceil((i + 1) / this.pageSize);
        break;
      }
    }
    this.storageList = this.settingList.list;
    this.total = this.settingList.list.length;
    this.pageReady = true;
  },
  methods: {
    setConnect(event) {
      var id = event.target.id ? parseInt(event.target.id) : parseInt(event.target.parentNode.id);
      if (this.seledId == id) {
        return;
      } else {
        this.editingId = id;
      }
      this.editTxt = '关联';
      console.log(event.target);
      console.log(this.editingId);
      this.connectConfirm()
    },
    setDelete(event) {
      var id = event.target.id ? parseInt(event.target.id) : parseInt(event.target.parentNode.id);
      if (this.seledId != id) {
        return;
      } else {
        this.editingId = id;
      }
      this.editTxt = '取消关联';
      this.connectConfirm()
    },
       setDeleted(event) {
      var id = event.target.id ? parseInt(event.target.id) : parseInt(event.target.parentNode.id);
     this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: '取消',
        cancelButtonClass: "el-button--primary",
        type: 'warning'
      }).then(() => {
        this.delectAjax(id);
      });
    },
    connectConfirm() {
      this.$confirm('确认要' + this.editTxt + '吗?', '提示', {
        confirmButtonText: this.editTxt,
        cancelButtonText: '取消',
        cancelButtonClass: "el-button--primary",
        type: 'warning'
      }).then(() => {
        this.connectAjax();
      });
    },
    connectAjax() {
      var _self = this;
      var storageId = _self.editTxt == '关联' ? this.editingId : 0;
      this.$ajax.get(window.ENV.API_DACM + '/caccesssysRelationWorkInfo/operate', {
          params: {
            nodeId: 2,
            storageId: storageId
          }
        }).then(function(res) {
          if (res.data.result == 'succeed') {
            _self.$alert(_self.editTxt + '成功', '提示', {
              confirmButtonText: '确定'
            });
            if (_self.editTxt == '关联') {
              _self.seledId = _self.editingId;
            } else {
              _self.seledId = -1;
            }
          } else {
            _self.$alert(_self.editTxt + '失败', '提示', {
              confirmButtonText: '确定'
            });
          }
        })
        .catch(function(err) {
          console.log(err)
          _self.$alert(_self.editTxt + '失败', '提示', {
            confirmButtonText: '确定'
          });
        });
    },
      delectAjax(id) {
      var _self = this;
      this.$ajax.get(window.ENV.API_DACM + '/caccesssysRelationWorkInfo/delete', {
          params: {
            pid:2,
            id: id,
          }
        }).then(function(res) {
          if (res.data.result == 0) {//后端要求
            _self.$alert( '删除成功', '提示', {
              confirmButtonText: '确定'
            }).then(()=>{
              _self.$emit('refresh','');
               _self.isDelPage =_self.currentPage; //删除flag
            })
          } else {
            _self.$alert(res.data.message, '提示', {
              confirmButtonText: '确定'
            });
          }
        })
        .catch(function(err) {
          console.log(err)
          _self.$alert('删除失败', '提示', {
            confirmButtonText: '确定'
          });
        });
    },
    //新增成功刷新
    refresh() {
      this.isAddFlag =1;
      this.$emit('refresh','');
    },
    refreshs(value){
     this.isEditIndex =value;//写入修改信息的地址
     this.isEditPage =this.currentPage;//写入修改信息的地址
     this.$emit('refresh',value); 
    },
    goPage: function(val) {
      this.pageNum = val;
    },
  },
  components: {
    hdfsAdd,
    hdfsEdit
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.collapsepanel {
  margin-bottom: 10px;
  color: #666;
  border-bottom: 1px solid #ddd;
  .collapsepanel-title,
  .collapsepanel-subtitle {
    padding-left: 20px;
    font-size: 18px;
    font-weight: bold;
  }
  .collapsepanel-title {
    line-height: 30px;
    padding-bottom: 10px;
    cursor: pointer;
    i {
      margin-left: 20px;
    }
  }
  .collapsepanel-subtitle {
    margin: 50px 0;
    height: 100px;
    line-height: 100px;
    border-right: 2px solid #ddd;
  }
  .setinfo {
    padding-left: 80px !important;
    line-height: 30px;
  }
  .collapsepanel-tools {
    margin: 50px 0;
    padding-left: 20px;
    height: 100px;
    line-height: 100px;
    text-align: right;
  }
}

</style>
