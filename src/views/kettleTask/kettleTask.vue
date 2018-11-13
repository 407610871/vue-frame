<template>
<div>
    <el-form ref="form"  label-width="80px" class="formGroup">
        <el-form-item label="任务状态" >
            <el-checkbox-group v-model="status">
                <el-checkbox label="0" name="status">全选</el-checkbox>
                <el-checkbox label="1" name="status">暂停</el-checkbox>
                <el-checkbox label="2" name="status">新建</el-checkbox>
                <el-checkbox label="3" name="status">失败</el-checkbox>
                <el-checkbox label="4" name="status">运行</el-checkbox>
                <el-checkbox label="5" name="status">完成</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-row>
            <el-col :span="6">
                <el-form-item label="开始时间"> 
                    <el-date-picker
                        v-model="startTime"
                        :picker-options="pickerOptions"
                        type="datetime"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        :default-time="['12:00:00']">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="结束时间"> 
                    <el-date-picker
                        v-model="endTime"
                        :picker-options="pickerOptions"
                        type="datetime"
                        placeholder="结束时间"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        :default-time="['12:00:00']">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="任务名称">
                    <el-input v-model="taskName" placeholder="请输入任务名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="3">
                <el-button type="success" size="small" class="search-btn">查询</el-button>
            </el-col>
        </el-row>
    </el-form>
    <el-table :data="tableData" :height="tableHeight">
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="任务名称" prop="taskName"></el-table-column>
        <el-table-column label="任务类型"  prop="taskType"></el-table-column>
        <el-table-column label="任务开始时间">
            <template slot-scope="scope">
                <span>{{scope.row.startTime | formatDateTime}}</span>
            </template>
        </el-table-column>
        <el-table-column label="任务停止时间">
            <template slot-scope="scope">
                <span>{{scope.row.endTime | formatDateTime}}</span>
            </template>
        </el-table-column>
        <el-table-column label="任务状态">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 'create'">新建</span>
                <span v-if="scope.row.status == 'Running'">运行</span>
                <span v-if="scope.row.status == 'Paused'">暂停</span>
                <span v-if="scope.row.status == 'Finished (with errors)'">失败</span>
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
</div>
</template>
<script>
const baseUrl = 'http://10.19.160.67:8081/DOMN';
export default {
    data(){
        return {
            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            status:[],
            startTime: '',
            endTime: '',
            taskName:'',
            tableData:[],
            pickerOptions: {
                disabledDate() {
                   
                }
            },
            
        }
    },
    created(){
        this.init();
    },
    computed:{
        tableHeight() {
            return window.innerHeight - 300;
        },
    },
    methods: {
        handleCurrentChange() {
            this.init();
        },
        init(){
            let that = this;
            this.$ajax.get(baseUrl+'/manager/govern/queryGovern',{
            params:{
                pageNum:this.pageNum,
                pageSize:this.pageSize,
                status:this.status.join(),
                startTime:this.startTime,
                endTime:this.endTime,
                taskName:this.taskName
                }
            }).then(res => {
                res = res.data;
                if(res.success){
                    that.pageNum = res.data.pageNum;
                    that.totalPage = res.data.total;
                    that.tableData = res.data.result;
                    console.log(that.tableData)  
                }else{
                     that.$message({
                        showClose: true,
                        message: res.message,
                        duration: 3500
                    });
                }
            });
        },
        //启动
        doStart(){

        },
        //查看
        doView(){

        },
        //删除
        doDelete(){
            
        },
    },
    filters:{
        formatDateTime(val){
            if(!val) return "";
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
        },
    },
};
</script>
<style  lang="scss" scoped>
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
</style>
<style>
.search-btn.el-button:focus, .search-btn.el-button:hover {
    color: #FFF;
    border-color: #85ce61;
    background-color: #85ce61;
}
</style>
