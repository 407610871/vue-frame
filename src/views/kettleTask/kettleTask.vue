<template>
<div v-loading="loading">
    <div class="" ref="searchArea" style="margin-bottom:20px;">
        <div class="searchDiv">
            <div class="dataSearch">
                <i class="el-icon-search"></i>
                <input type="text" v-model="taskName" placeholder="请输入任务名称" @keyup.13 = "search" />
            </div>
            <span  @click="doMoreSearch" >高级搜索 <i :class="!moreSearch?'el-icon-caret-bottom':'el-icon-caret-top'"></i>  </span>
            <el-button type="primary" class="doCearch" @click="search">查询</el-button> 
        </div>
        <el-form label-width="110px" class="formGroupSelect" v-if="taskName!='' || status.length || time.length">
            <el-form-item label="已选查询条件:">
                <div v-show="taskName!=''" class="selected-task-type">
                    <span>查询条件:</span>
                    <span><em class="limtLength">{{taskName}}</em><i class="el-icon-error" @click="taskName = ''"></i></span>
                </div>
                <div v-show="status.length>0" class="selected-task-type">
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
        <el-table :data="tableData" :height="tableHeight" stripe border tooltip-effect="light">
            <el-table-column label="序号" type="index" width="100"></el-table-column>
            <el-table-column label="任务名称" prop="taskName" :show-overflow-tooltip='true' min-width="95"></el-table-column>
            <el-table-column label="任务类型"  prop="taskType" min-width="95"></el-table-column>
            <el-table-column label="任务开始时间" :show-overflow-tooltip='true' min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.startTime | formatDateTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务停止时间" :show-overflow-tooltip='true' min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.endTime | formatDateTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务状态" min-width="95">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 'create'">新建</span>
                    <span v-if="scope.row.status == 'Running'">运行</span>
                    <span v-if="scope.row.status == 'Paused'">暂停</span>
                    <span v-if="scope.row.status == 'Finished (with errors)'" class="finished-fail">失败</span>
                    <span v-if="scope.row.status == 'Finished'">完成</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="90">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 'Running'" class="icon-span-disabled enc-icon-feizhi"></span>
                    <span v-else class="icon-span enc-icon-qidongyunhang1" title="启动" @click="doStart(scope.row)"></span>
                    <span v-if="scope.row.status == 'create'" class="icon-span-disabled enc-icon-heyanchakan"></span>
                    <span v-else class="icon-span enc-icon-heyanchakan" title="查看" @click="doView(scope.row)"></span>
                    <span v-if="scope.row.status == 'Running'" class="icon-span-disabled enc-icon-shanchu"></span>
                    <span v-else class="icon-span enc-icon-shanchu" title="删除" @click="doDelete(scope.row)"></span>
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
            collapse:false,
            pageNum: 1,
            totalPage: 0,
            status:JSON.parse(JSON.stringify(this.$store.state.kettleTask.status)),
            checkStatus:[{name:'暂停',label:'Paused'},{name:'新建',label:'create'},{name:'失败',label:'Finished (with errors)'},{name:'运行',label:'Running'},{name:'完成',label:'Finished'}],
            isIndeterminate:false,
            checkAll:false,
            taskName:JSON.parse(JSON.stringify(this.$store.state.kettleTask.taskName)),
            tableData:[],
            moreSearch:false,
            time: JSON.parse(JSON.stringify(this.$store.state.kettleTask.time)),
            pickerOptions: {
                disabledDate(time) {
                return time.getTime() > Date.now();
                }
            },
            reqObj:{},
            showTaskView:false,
            searchHeight:71
        }
    },
    created(){
       this.init();
    },
    mounted() {
        this.$root.eventHub.$emit(
        "selTreeNode",
        this.$store.state.deptId
        );
        this.$root.eventHub.$emit("setActiveNav", 3);
    },
    components:{
        dialogTaskView:dialogTaskView
    },
    computed:{
        tableHeight() {
            return this.collapse ?
                window.innerHeight - this.searchHeight - 205:
                window.innerHeight - 245;
        },
        _checkStatus(){
            return this.checkStatus.map(item => item.label);
        },
        pageSize(){
            return this.$store.state.pageSize;
        },
    },
    watch:{
        taskName(){
            this.getSearchArea();
        },
        status(){
            this.getSearchArea();
        },
        moreSearch(){
            this.getSearchArea();
        },
        time(){
            this.getSearchArea();
        },
        $route(to,form){
            if(to.name == "kettleTask") this.init();
        },
    },
    methods: {
        getSearchArea(){
            this.$nextTick(()=>{
                this.searchHeight = this.$refs.searchArea.clientHeight;
            });
        },
        pop:function(val,arr){
            if(arr.indexOf(val)>-1){
                let ind = arr.indexOf(val);
                arr.splice(ind,1);
            }
            this.isIndeterminate = this.status.length > 0 && this.status.length < this.checkStatus.length;
            this.checkAll = this.status.length == this.checkStatus.length;
        },

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
                cancelButtonClass: "el-button--primary",
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
            this.$store.state.kettleTask.status = JSON.parse(JSON.stringify(this.status));
            this.$store.state.kettleTask.taskName = JSON.parse(JSON.stringify(this.taskName));
            this.$store.state.kettleTask.time = JSON.parse(JSON.stringify(this.time));
            this.init();
        },
        //高级搜索
        doMoreSearch(){
            this.collapse = !this.collapse;
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
.limtLength{
    display:inline-block;
    max-width:140px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    font-style: normal;
    margin-top: -3px;
}
.formGroupSelect{
    max-height:82px;
    overflow:auto;
    padding-left:27px;
}
.formGroup{
    padding-left:27px;
}
.selected-task-type{
    display:inline-block;
    span{
        margin-right: 10px;
        color: #425365;
        &first-child{
            font-weight: 600;
        }
    }
    i{
        margin-left: 3px;
        cursor:pointer;
    }
}

.searchDiv {
  span {
    display: inline-block;
    font-size: 15px;
    cursor: pointer;
    width: 100px;
    height: 30px;
    border: 1px solid #C8CFD5;
    border-left: none;
    line-height: 30px;
    text-align: center;
    position: relative;
  }
}
.dataSearch {
  display: inline-block;
  width: 210px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #C8CFD5;
  input {
    margin-left: 7px;
    width: 180px;
    background-color: transparent;
    border: 0 none;
    outline: 0 none;
  }
  i {
    text-indent: 5px;
  }
  ::-webkit-input-placeholder {
    color: #999;
  } ///* 使用webkit内核的浏览器 */
  :-moz-placeholder {
    color: #999;
  } ///* Firefox版本4-18 */
  ::-moz-placeholder {
    color: #999;
  } ///* Firefox版本19+ */
  :-ms-input-placeholder {
    color: #999;
  } ///* IE浏览器 */
}
.doCearch {
  display: inline-block;
  margin-left: 15px;
  margin-top: 0;
  position: relative;
  line-height: 12px;
}
.el-checkbox-group{
    display:inline-block;
    margin-left:30px;
}
.icon-span{
    font-size:21px;
    cursor:pointer;
    margin-right:5px;
}
.icon-span-disabled{
    font-size:21px;
    color:#ccc;
    cursor: not-allowed;
    margin-right:5px;
}
.finished-fail{
    color:red;
}
</style>
<style lang="scss">
.search-btn.el-button:focus, .search-btn.el-button:hover {
    color: #FFF;
    border-color: #85ce61;
    background-color: #85ce61;
}
</style>
