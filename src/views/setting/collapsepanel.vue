<template>
  <div>
    <div class="collapsepanel" v-for="(item,index) in storageList">
      <div class="collapsepanel-title" v-show="index != activeIndex" v-on:click="activeIndex = index">{{item.storageName}}<i class="el-icon-arrow-right"></i></div>
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
              <br /> 端口号：{{item.port}} hdfs.url：{{item.url}}
              <br /> 备用节点字符串：{{item.bak}}
              <br /> 根目录：{{item.root}}
              <br /> impala服务器地址：{{item.impalaPath}}
            </p>
          </div>
        </el-col>
        <el-col :span="9" class="collapsepanel-tools">
          <div class="grid-content">
            <div class="edithdd" style="display: inline-block; margin-left:10px; margin-right: 10px;">
             <hdfs-edit :indexEq="index" :ownId="item.storageId" @refresh="refresh()"></hdfs-edit>
            </div>
            <el-button type="primary" @click="setConnect" :id="item.storageId" :disabled="item.storageId == seledId">关联</el-button>
            <el-button type="primary" @click="setDelete" :id="item.storageId" :disabled="item.storageId != seledId">删除</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="regbtn">
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
      activeIndex: 0,
			seledId:-1,
			editingId:-1,
			editTxt:''
    }
  },
  props: {
    settingList: {
      type: Object,
      required: true
    },
  },
  computed: {
		storageList:function(){
			this.seledId = this.settingList.seledId;
			console.log('this.settingList');
			console.log(this.settingList);
			console.log('this.settingList');
			return this.settingList.list
		}
  },
  mounted() {
		
  },
  methods: {
		setConnect(event){
			var id = event.target.id?parseInt(event.target.id):parseInt(event.target.parentNode.id);
			if(this.seledId == id){
				return;
			}else{
				this.editingId = id;
			}
			this.editTxt = '关联';
			console.log(event.target);
			console.log(this.editingId);
			this.connectConfirm()
		},
		setDelete(event){
			var id = event.target.id?parseInt(event.target.id):parseInt(event.target.parentNode.id);
			if(this.seledId != id){
				return;
			}else{
				this.editingId = id;
			}
			this.editTxt = '取消关联';
			this.connectConfirm()
		},
		connectConfirm(){
			this.$confirm('确认要'+this.editTxt+'吗?', '提示', {
				confirmButtonText: this.editTxt,
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.connectAjax();
			});
		},
		connectAjax(){
			var _self = this;
			var storageId = _self.editTxt == '关联'?this.editingId:0;
			console.log(storageId);
			this.$ajax.get('http://10.19.248.200:32661/DACM/caccesssysRelationWorkInfo/operate',{
				params:{
					nodeId:2,
					storageId:storageId
				}
			}).then(function(res){
				if(res.data.result == 'succeed'){
					_self.$alert(_self.editTxt+'成功','提示', {
						confirmButtonText: '确定'
					});
					if(_self.editTxt == '关联'){
						_self.seledId = _self.editingId;
					}
				}else{
					_self.$alert(_self.editTxt+'失败','提示', {
						confirmButtonText: '确定'
					});
				}
			})
			.catch(function(err){
				console.log(err)
				_self.$alert(_self.editTxt+'失败','提示', {
					confirmButtonText: '确定'
				});
			});
		},
    //新增成功刷新
    refresh(){
      this.$emit('refresh');
    }
  },
  components:{
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
  }
}

</style>
