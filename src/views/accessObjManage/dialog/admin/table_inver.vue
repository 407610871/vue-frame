<template>
  <div class="taskMDialog userSurveyDialog">
    <!--  <el-button class="diabtn tin-btn add-btn" @click="dialogVisible = true">核验报告</el-button> -->
    <el-tooltip class="item" effect="light" content="核验报告" placement="top">
      <span class="dialogo diabtn tin-btn add-btn" @click="dialogVisible = true"></span>
    </el-tooltip>
    <!--  <i class="el-icon-info" @click="dialogVisible = true">用户调研</i> -->
    <el-dialog title="核验报告" :visible.sync="dialogVisible" width="73%" :before-close="closeDialog">
      <div class="title-gra plr30">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <div class="proInfo-box bornone clearfix">
        <p style="text-align: center">{{name}}</p>
        <el-button size="mini" type="primary" @click="downTable()" class="dowBtn">导出报告</el-button>
      </div>
      <div class="proInfo-box">
        <div class="comTable">
          <el-table :data="tableData" style="width: 100%" height="250" stripe>
            <el-table-column prop="source_tableName" label="源表">
            </el-table-column>
            <el-table-column prop="flag" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.flag=="1"?'已核验':'未核验'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="source_tableNum" label="源数据量">
            </el-table-column>
            <el-table-column prop="target_tableName" label="目标表" width="180">
            </el-table-column>
            <el-table-column prop="target_tableNum" label="数据量">
            </el-table-column>
            <el-table-column prop="testresults_dvalue" label="数据差值">
            </el-table-column>
            <el-table-column label="检验结果">
              <template slot-scope="scope">
                <span v-if="scope.row.testresults_result!=undefined">{{scope.row.testresults_result=="1"?'不一致':'一致'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" class="clearfix">
              <template slot-scope="scope">
                <el-button size="mini" type="info" v-if="scope.row.status=='0'" class="fl mr5">核验中</el-button>
                <el-button v-if="scope.row.status=='1'" size="mini" type="primary" @click="startDaver(scope.row.taskId)" class="fl mr10">核验</el-button>
                <data-top :msg='innerVisible' :taskId='taskId' @showIncre="showInver()" @saveIncre="saveInver($event)"></data-top>
                <el-button size="mini" type="primary" class="fl" @click="checkLog(scope.row.id,scope.$index)">查看日志</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="proInfo-box log-box clearfix ptb20">
        <textarea name="" id="" disabled="disabled" v-show="textShow">{{loginfo}}</textarea>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dataTop from '@/views/accessObjManage/dialog/admin/data_top_inver'
import { myBrowser } from '@/utils/mix.js'
import request from "@/utils/request"
export default {
  name: "dataInver",
  data: function() {
    return {
      cindex: '',
      dialogVisible: false,
      innerVisible: false,
      accessSysId: '',
      loading2: false,
      taskId: '',
      loginfo: '',
      name: '',
      textShow: false,
      result: '0',
      tableData: []

    }
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;

    },
    //核验弹框的再次打开
    showInver() {

      this.innerVisible = false;
    },
    saveInver() {
      this.innerVisible = false;
      this._getTableNum();
      //刷新数据
    },
    //数据表核验
    _getTableNum() {
      console.log(this.cindex);
      this.$ajax({
        method: "GET",
        url: this.GLOBAL.api.API_DACM + '/ccheckData/tableSourceNum',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
          accessSysId: this.accessSysId
        }

      }).then(res => {
        this.tableData = res.data.data;
      })
    },
    //开始核验
    startDaver(value) {
      console.log(value);
      this.taskId = value;
      this.innerVisible = true;
    },
    //查询日志
    checkLog(value, tindex) {
      this.cindex = tindex;
      this.loading2 = true;
      this.$ajax({
        method: "GET",
        url: this.GLOBAL.api.API_DACM + '/ccheckData/checkLog',
        // headers:{
        //   'Content-Type':'application/json;charset=utf-8',
        // },
        params: {
          id: value
        }

      }).then(res => {
        this.loading2 = false;
        if (res.data.success == "true" || res.data.success == true) {

          if (res.data.data.result == false) {
            this.textShow = false;
            this.$alert("查看日志失败", "查看日志", {
              confirmButtonText: "确定"
            });
            return false;
          }
          this.textShow = true;
          let logData = res.data.data.testresults_result == 0 ? "一致" : "不一致";
          this.loginfo = `源库：${res.data.data.source_library}\n
源表：${res.data.data.source_tableName}\n
数据核验查询语句：${res.data.data.source_sql}\n
执行结果：${res.data.data.source_tableNum}\n
\n
目标库：${res.data.data.target_library}\n
目标表：${res.data.data.target_tableName}\n
数据核验查询语句：${res.data.data.target_sql}\n
执行结果：${res.data.data.target_tableNum}\n
\n
核验结果:${logData}\n
核验差值:${res.data.data.testresults_dvalue}\n
`;
        } else {
          this.loading2 = false;
          if (res.data.data.result == false) {
            this.textShow = false;
            this.$alert("查看日志失败", "查看日志", {
              confirmButtonText: "确定"
            });
          }
        }
      })
    },
    //导出数据源报告
    downTable() {
      var browser = myBrowser();
      if (!browser) {
        browser = 'IE'
      }
      request({
        /*url: this.exportUrl,*/
        url: `${this.GLOBAL.api.API_DACM}/ccheckData/download?accessSysId=${this.pdata.accessSysId}&browser=${browser}&accessName=${this.$route.params.sourceName}`,
        /* url:`http://10.19.160.59:8080/DACM/ccheckData/download?accessSysId=${this.pdata.accessSysId}&browser=${browser}&accessName=${this.$route.params.sourceName}`,*/
        method: "GET",
        responseType: "blob"
      }).then(res => {
        console.log(res);　
        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        　
        if (window.navigator.msSaveBlob) {
          window.navigator.msSaveBlob(blob, unescape(res.headers.filename.replace(/\\u/g, '%u')));
        } else {
          var downloadElement = document.createElement('a');　　
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          　　
          downloadElement.href = href;　　
          downloadElement.download = unescape(res.headers.filename.replace(/\\u/g, '%u')); //下载后文件名
          　　
          document.body.appendChild(downloadElement);　　
          downloadElement.click(); //点击下载
          　　
          document.body.removeChild(downloadElement); //下载完成移除元素
          　　
          window.URL.revokeObjectURL(href); //释放掉blob对象 
        }　

      })
      /* window.location.href = `${this.GLOBAL.api.API_DACM}/ccheckData/downloadCheckDataById?id=${this.pdata.id}&browser=${browser}&accessName=${this.$route.params.sourceName}`*/
    }
  },
  components: {
    dataTop
  },
  mounted() {

  },
  created() {

  },
  computed: {

  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.accessSysId = this.pdata.accessSysId;
        this._getTableNum();
         this.textShow = false;
        this.name = decodeURI(this.$route.params.sourceName);
      }
    }

  },
  props: ['pdata']

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.userSurveyDialog .el-dialog__body {
  padding-left: 0px;
  padding-right: 0px;
}

.dowBtn {
  float: right;
  margin-right: 33px;
}

.el-select {
  width: 100%;
}

.otherInfo .el-radio {
  margin-bottom: 12px;
  margin-top: 8px;
  margin-left: 30px;
}

.userSurveyDialog .dataInfo-box {
  border: none
}

.test-btn {
  .el-form-item--medium .el-form-item__content {
    margin-left: 0px !important;
  }
}

.el-radio+.el-radio {
  margin-left: 19px;
}

.reginfo .el-form-item__content {
  margin-left: 0px !important;
  text-align: center;
  margin-top: 30px;
}

.el-dialog .otherInfo .el-form-item__label {
  width: 103px !important;
}

.otherInfo .el-form-item--medium .el-form-item__content {
  margin-left: 103px !important;
}

.el-dialog .otherInfo .fileItem .el-form-item__label {
  width: 235px !important;
}

.surveybg {
  background: #f0f3f6;
  padding-top: 20px;
}

.plr30 {
  padding-left: 30px;
  padding-right: 30px;
}

.sursavebtn .el-form-item--medium .el-form-item__content {
  margin-left: 0px;
}

.radiow100 {
  .el-radio-group {
    width: 100%;
  }
}

.log-box {
  padding: 20px 30px;
}

.comTable {
  padding: 20px 30px;
  .el-table .cell .el-button--primary {
    color: #fff;
    background-color: #489bd9;
    border-color: #489bd9;
    display: inline-block;
  }
}

.proInfo-box {
  border-bottom: 1px solid $border-color-dai;
}

.vs {
  color: #2f6ac5;
  display: inline-block;
  font-size: 100px;
  max-width: 260px;
  text-align: left;
  margin-top: 30px;
}

.resultIcon .yes {
  background: url("../../../../assets/images/data_ri.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}

.resultIcon .wrong {
  background: url("../../../../assets/images/data_err.png") no-repeat;
  width: 16px;
  height: 16px;
  display: inline-block;
  background-size: 100% 100%;
}

textarea {
  width: 80%;
}

.tin-btn {
  float: right;
  margin-left: 10px;
}

textarea {
  margin-left: 30px;
}

.title-gra {}

.el-table .cell {
  white-space: nowrap;
}

.dialogo {
  width: 30px;
  height: 30px;
  background: url('../../../../assets/images/dataReport.svg');
  display: inline-block;
  cursor: pointer;
}

</style>
