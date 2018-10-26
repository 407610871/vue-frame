<template>
  <div class="taskMDialog release">
    <el-button @click="dialogVisible = true" class="setting" icon="enc-icon-setting"></el-button>
    <el-dialog :title="versionDes + '  '+ versionDate" :visible.sync="dialogVisible" width="60%" :before-close="closeDialog">
      <div class="title-gra">
        <span class="grab gra-l"></span>
        <span class="grab gra-r"></span>
      </div>
      <div class="proInfo-box clearfix">
        <ul class="directory">
          <li><a href="#txqd">特性清单</a></li>
          <li><a href="#zdbglb">重大变更列表</a></li>
          <li><a href="#wtjjqd">解决问题清单</a></li>
          <li><a href="#yzwthxz">已知问题和限制</a></li>
        </ul>
        <div class="daiInfo-title proInfo-title" id="txqd">
          <h2>特性清单</h2>
        </div>
        <div class="proInfo-box clearfix">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
          </el-table>
        </div>
       
         <div class="proInfo-box clearfix" id="zdbglb">
           <h2>重大更新列表</h2>
           <ul class="imlist">
             <li>N/A</li>
           </ul>
         </div>
         <div class="proInfo-box clearfix" id="wtjjqd">
           <h2>解决问题清单</h2>
           <ul class="imlist">
             <li>N/A</li>
           </ul>
         </div>
         <div class="proInfo-box clearfix" id="yzwthxz">
           <h2>已知问题和限制</h2>
           <ul class="imlist">
             <li>N/A</li>
           </ul>
         </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "taskMDialog",
  data: function() {
    //判断是否必选项为空
    const validateNull = (rule, value, callback) => {
      debugger;
      if (value == "") {
        callback(new Error("不能为空"));
      } else {
        debugger;
        callback();
      }
    };
    return {
      dialogVisible: false,
      versionDes: '数据引擎产品版本发布说明书(V1.2.2)',
      versionDate: '2018/09/28',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
      // msgId:this.dialogMsg?this.dialogMsg[1]:''
    };
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['ruleForm'].resetFields();
    },
    //滚动
    godToId(ID){
      $('html,body').animate({scrollTop: $("#"+ID).offset().top}, 500);
    }
  },
  components: {

  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {

      }
    }

  }

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.el-select {
  width: 100%;
}

.otherInfo .el-radio {
  margin-bottom: 12px;
  margin-top: 8px;
  margin-left: 30px;
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

.release .el-button {
  width: 88px;
  height: 66px;
  margin: 0;
  border-radius: 0;
  border: 0;
  padding: 0;

  &.user {
    background: #cacfd5;
  }
  &.setting {
    background: #50609c;
    i {
      color: #fff;
    }
  }
  &.document {
    background: #479bd9;
    i {
      color: #fff;
    }
  }
}

.release {
  display: inline-block;
.daiInfo-title{
  margin-top:40px;
}
  .el-dialog .el-dialog__header {
    height: 30px;
    padding-top: 0px !important;
  }
  ul {
    margin: 0px;
    line-height: 20px;
    li {
      display: inline-block;
      line-height: 20px;
      margin-right: 50px;
      a {
        text-decoration: underline;
      }
    }
  }
  .proInfo-box{
    padding: 10px 0px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  h2{
    line-height: 50px;
  }
}

</style>
