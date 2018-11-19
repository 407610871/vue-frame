<template>
<div v-loading="loading">
    <div class="count-container">
        <div class="searchDiv">
            <div class="dataSearch">
                <i class="el-icon-search"></i>
                <input type="text" v-model="taskName" placeholder="请输入任务名称" />
            </div>
            <span  @click="doMoreSearch" >高级搜索 <i :class="!moreSearch?'el-icon-caret-bottom':'el-icon-caret-top'"></i>  </span>
            <el-button type="primary" class="doCearch" @click="search">查询</el-button> 
        </div>
        <!-- <el-tag
            v-for="(item,index) in status"
            :key="index"
            :disable-transitions="false"
            closable
            @close="handleClose(item)">
            {{getStatusName(item)}}
        </el-tag> -->
        <el-form label-width="110px" class="formGroup">
            <el-form-item label="已选查询条件:">
                <div v-show="status.length>0" class="selected-task-type" style="display: inline-block;">
                    <span>任务状态:</span>
                    <span v-show="status.indexOf('Paused')>-1">暂停<span @click="pop('Paused',status);"><i class="el-icon-error"></i></span></span>
                    <span v-show="status.indexOf('create')>-1">新建<span @click="pop('create',status);"><i class="el-icon-error"></i></span></span>
                    <span v-show="status.indexOf('Finished (with errors)')>-1">失败<span @click="pop('Finished (with errors)',status);"><i class="el-icon-error"></i></span></span>
                    <span v-show="status.indexOf('Running')>-1">运行<span @click="pop('Running',status);"><i class="el-icon-error"></i></span></span>
                    <span v-show="status.indexOf('Finished')>-1">完成<span @click="pop('Finished',status);"><i class="el-icon-error"></i></span></span>
                </div>
                <div v-show="time!=null && time.length>0" class="selected-task-type">
                    <span style="margin-right:10px;">任务开始时间:</span>
                    <span>{{time==null?'':time[0]}} - {{time==null?'':time[1]}}<span @click="time=[]"><i class="el-icon-error"></i></span></span>
                </div>
            </el-form-item>
        </el-form>
        <el-form ref="form"  label-width="110px" class="formGroup" v-if="moreSearch">
            <el-form-item label="任务状态:">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="status" @change="handleCheckedCitiesChange">
                    <el-checkbox name="status" v-for="item in checkStatus" :label="item.label" :key="item.label">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="任务开始时间:">  
                <el-date-picker
                v-model="time"
                :picker-options="pickerOptions"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['12:00:00']">
                </el-date-picker>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" :height="tableHeight" class="table-data-list">
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="任务名称" prop="taskName" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column label="任务类型"  prop="taskType"></el-table-column>
        <el-table-column label="任务开始时间" :show-overflow-tooltip='true'>
            <template slot-scope="scope">
                <span>{{scope.row.startTime | formatDateTime}}</span>
            </template>
        </el-table-column>
        <el-table-column label="任务停止时间" :show-overflow-tooltip='true'>
            <template slot-scope="scope">
                <span>{{scope.row.endTime | formatDateTime}}</span>
            </template>
        </el-table-column>
        <el-table-column label="任务状态">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 'create'">新建</span>
                <span v-if="scope.row.status == 'Running'">运行</span>
                <span v-if="scope.row.status == 'Paused'">暂停</span>
                <span v-if="scope.row.status == 'Finished (with errors)'" class="finished-fail">失败</span>
                <span v-if="scope.row.status == 'Finished'">完成</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 'Running'" class="icon-span-disabled el-icon-remove-outline"></span>
                <span v-else class="icon-span el-icon-caret-right" title="启动" @click="doStart(scope.row)"></span>
                <span v-if="scope.row.status == 'create'" class="icon-span-disabled el-icon-view"></span>
                <span v-else class="icon-span el-icon-view" title="查看" @click="doView(scope.row)"></span>
                <span v-if="scope.row.status == 'Running'" class="icon-span-disabled el-icon-delete"></span>
                <span v-else class="icon-span el-icon-delete" title="删除" @click="doDelete(scope.row)"></span>
            </template>
        </el-table-column>
    </el-table>
    <el-footer>
        <div class="enc-pagination">
            <el-pagination  style="float:right; margin:10px;"
            @current-change="handleCurrentChange"
            background
            :current-page.sync="pageNum"
            :page-size="pageSize"
            :total="totalPage"
            layout="prev, pager, next, jumper">
            </el-pagination>
        </div>
    </el-footer>
    <dialogTaskView :reqObj="reqObj" v-if="showTaskView" v-on:closeDia="showTaskView=false"></dialogTaskView>
</div>
</template>
<script>
const baseUrl = ENV.API_DOWN;
import dialogTaskView from './dialogTaskView';
export default {
    data(){
        return {
            loading:false,
            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            status:[],
            checkStatus:[{name:'暂停',label:'Paused'},{name:'新建',label:'create'},{name:'失败',label:'Finished (with errors)'},{name:'运行',label:'Running'},{name:'完成',label:'Finished'}],
            isIndeterminate:false,
            checkAll:false,
            taskName:'',
            tableData:[],
            moreSearch:false,
            time: [],
            pickerOptions: {
                disabledDate(time) {
                return time.getTime() > Date.now();
                }
            },
            reqObj:{},
            showTaskView:false
        }
    },
    created(){
       this.init();
    },
    components:{
        dialogTaskView:dialogTaskView
    },
    computed:{
        tableHeight() {
            return  !this.moreSearch?   window.innerHeight - 340:window.innerHeight - 455;
        },
        _checkStatus(){
            return this.checkStatus.map(item => item.label);
        },
    },
    methods: {
        pop:function(val,arr){
            if(arr.indexOf(val)>-1){
                let ind = arr.indexOf(val);
                arr.splice(ind,1);
            }
            this.isIndeterminate = this.status.length > 0 && this.status.length < this.checkStatus.length;
            this.checkAll = this.status.length == this.checkStatus.length;
        },
       /*  handleClose(item){

        },
        getStatusName(label){
            let obj = this.checkStatus.find(item => item.label == label);
            return obj.name;
        }, */
        handleCheckAllChange(val){
            if(val){
                this.status = [].concat(this._checkStatus);
            }else{
                this.status = [];
            }
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value){
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.checkStatus.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkStatus.length;
        },
        handleCurrentChange() {
            this.init();
        },
        init(){
            let that = this;
            this.loading = true;
            this.$ajax.get(baseUrl+'/manager/govern/queryGovern',{
                params:{
                    pageNum:that.pageNum,
                    pageSize:that.pageSize,
                    status:that.status.join(),
                    startTime:that.time[0],
                    endTime:that.time[1],
                    taskName:that.taskName
                }
            }).then(res => {
                res = res.data;
                this.loading = false;
                if(res.success){
                    that.pageNum = res.data.pageNum;
                    that.totalPage = res.data.total;
                    that.tableData = res.data.result;
                }else{
                     that.$message({
                        showClose:true,
                        message:res.message,
                        duration:3500
                    });
                }
            }).catch(()=> {
                this.loading = false;
            });
        },
        //启动
        doStart(row){
            this.loading = true;
            this.$ajax.post(baseUrl+'/manager/govern/startGovern',{
                    "jobPath":row.jobPath,
                    "jobName":row.taskName
                }).then(res => {
               res = res.data;
               this.loading = false;
               if(res.success){
                   //row.status = 'Running';
                   this.init();
               }else{
                   row.status = 'Finished (with errors)';
               }
            }).catch(() => {
                this.loading = false;
            });
        },
        //查看
        doView(row){
            this.reqObj = row;
            this.showTaskView = true;
        },
        //删除
        doDelete(row){
            let that = this;
            this.$confirm(
                "是否确认要删除",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info"
                }
            ).then(() => {
                this.loading = true;
                this.$ajax.post(baseUrl+'/manager/govern/deleteGovern',{
                        id:row.id,
                        carteObjectId:row.carteObjectId,
                        jobName:row.taskName,
                        jobPath:row.jobPath
                }).then(res => {
                    res = res.data;
                    this.loading = false;
                    if(res.success){
                        that.$alert('删除成功','提示');
                        that.init();
                    }else{
                            that.$alert(res.message,'删除');
                    }
                }).catch(() => {
                    this.loading = false;
                });
            }).catch(() => {});
            
        },
        //查询按钮
        search(){
            this.init();
        },
        //高级搜索
        doMoreSearch(){
            this.moreSearch=!this.moreSearch;
            //this.status=[];
        },
    },
    filters:{
        formatDateTime(val){
            if(typeof(val)=="undefined"||val==""||val==null){
                return "";
            } else {
                var value=new Date(val);
                var year=value.getFullYear();
                var padDate=function(va){
                    va=va<10?'0'+va:va;
                    return va
                }
                var month=padDate(value.getMonth()+1);
                var day=padDate(value.getDate());
                var hour=padDate(value.getHours());
                var minutes=padDate(value.getMinutes());
                var seconds=padDate(value.getSeconds());
                return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.selected-task-type span{
  margin-right: 10px;
  color: #425365;
}
.selected-task-type span:first-child{
  font-weight: 600;
}
.selected-task-type span i{
  margin-left: 3px;
}
.count-container {
  background-color: #fff;
  border-bottom: 1px solid #d9d9d9;
  margin: 0 auto;
  padding-top: 20px;
}
.dataSearch {
  display: inline-block;
  width: 210px;
  height: 30px;
  border: 1px solid #c9cdd0;
  input {
    margin-left: 5px;
    width: 180px;
    background-color: transparent;
    border: 0 none;
    outline: 0 none;
    height: 28px;
    font-size: 14px;
  }
  i{
    text-indent: 5px;
  }
  ::-webkit-input-placeholder {
    color: #999;
  } /* 使用webkit内核的浏览器 */
  :-moz-placeholder {
    color: #999;
  } //* Firefox版本4-18 */
  ::-moz-placeholder {
    color: #999;
  } //* Firefox版本19+ */
  :-ms-input-placeholder {
    color: #999;
  } //* IE浏览器 */
}
.searchDiv {
    margin-left: 2.5%;
    margin-bottom: 20px;
    span {
        display: inline-block;
        font-size: 14px;
        cursor: pointer;
        width: 100px;
        height: 30px;
        border: 1px solid #c9cdd0;
        border-left: none;
        line-height: 30px;
        text-align: center;
        position: relative;
        top: 1px;
    }
}
.doCearch{
    display:inline-block;
    height:28px;
    margin-left:15px;
    margin-top:0;
    position:relative;
    top:2px;
    line-height:10px;
}
.el-checkbox-group{
    display:inline-block;
    margin-left:30px;
}
.icon-span{
    font-size:18px;
    color:#0095e7;
    cursor:pointer;
    margin-right:5px;
}
.icon-span-disabled{
    font-size:18px;
    color:#ccc;
    cursor: not-allowed;
    margin-right:5px;
}
.finished-fail{
    color:red;
}
.table-data-list{
    margin:20px auto 0;
    width:95%;
}
</style>
<style lang="scss">
.search-btn.el-button:focus, .search-btn.el-button:hover {
    color: #FFF;
    border-color: #85ce61;
    background-color: #85ce61;
}
</style>
