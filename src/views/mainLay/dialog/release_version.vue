<template>
  <div>
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
  </div>
</template>
<script>
export default {
  name: "taskMDialog",
  data: function() {
    return {
      versionDes: '数据引擎产品版本发布说明书(V1.2.2)',
      versionDate: '2018/09/28',
      tableData: []
      // msgId:this.dialogMsg?this.dialogMsg[1]:''
    };
  },
  methods: {
    _getXml() {
      console.log("46545");
      var jsonObj = this.$x2js.xml2js('<note><name>数据引擎产品版本发布说明书（V1.2.2）</name><date>2018/09/28</date><specialityList><name>清单特性</name><item><Introduction>批式接入</Introduction><content>历史数据的接入-支持类型数据库，支持自动表建立</content><sysName>数据汇聚</sysName><remark></remark></item><item><Introduction>批式接入</Introduction><content>使用kettle进行批式数据的汇聚，支持自动创建impala表</content><sysName>数据汇聚</sysName><remark></remark></item><item><Introduction>批式接入</Introduction><content>汇聚后的任务核验：需要知道数据量和源数据量的对比</content><sysName>数据汇聚</sysName><remark>在数据运维中查看</remark></item><item><Introduction>批式接入和汇聚</Introduction><content>需要看到数据汇聚的结果：上下游的数据量，数据对不上的时候需要提供日志</content><sysName>数据引擎</sysName><remark></remark></item><item><Introduction>批式接入和汇聚</Introduction><content>数据汇聚出错，需要删除HDFS的数据重新进行汇聚</content><sysName>数据引擎</sysName><remark></remark></item><item><Introduction>数据接入</Introduction><content>资产引擎元数据合并</content><sysName>数据引擎</sysName><remark></remark></item><item><Introduction>数据接入</Introduction><content>同IP同账号的注册源的监测提示</content><sysName>数据接入</sysName><remark></remark></item><item><Introduction>数据接入</Introduction><content>注册的数据源废止的时候需要保留被删除的信息</content><sysName>数据接入</sysName><remark></remark></item><item><Introduction>数据接入</Introduction><content>circles对批式数据定时抽取功能</content><sysName>数据接入</sysName><remark></remark></item><item><Introduction>数据接入</Introduction><content>增加资源目录规范文档下载</content><sysName>数据接入</sysName><remark></remark></item></specialityList><changeList><name>重大变更列表</name></changeList><finishedPunchList><name>解决问题清单</name><item><content>1. 增量字段自动提示显示</content></item><item><content>2. 数据调研增加其他类别，D-131000000000 改为系统设置</content></item><!--item><content>5. 解决表描述导入无法在资产中显示的问题</content></item--></finishedPunchList><questionList><name>已知问题和限制</name><item><Introduction>数据接入</Introduction><content>ftp设置路径中增加提示：暂不支持中文路径采集</content><Influence>不支持中文路径采集</Influence><Solve>无</Solve></item><item><Introduction>数据接入</Introduction><content>Kafka暂时不支持restful API的封装</content><Influence></Influence><Solve>无</Solve></item></questionList></note>');
      var newjsonObj = this.$x2js.xml2js(jsonObj.note);
      console.log(newjsonObj);
     /* for (var i = 0; i < newjsonObj.NODES.NODE.length; i++) {
        console.log(newjsonObj.NODES.NODE[i].NAME)
        console.log(newjsonObj.NODES.NODE[i].VALUE)
      }*/
    }
  },
  components: {

  },
  watch: {

  },
  mounted(){
    this._getXml();
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
  .daiInfo-title {
    margin-top: 40px;
  }
  .el-dialog .el-dialog__header {
    height: 30px;
    padding-top: 0px !important;
  }
  ul {
    margin: 0px;
    line-height: 20px;
    padding: 0px;
    li {
      display: inline-block;
      line-height: 20px;
      margin-right: 50px;
      a {
        text-decoration: underline;
      }
    }
  }
  .proInfo-box {
    padding: 10px 0px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  h2 {
    line-height: 50px;
  }
}

.taskMDialog .el-dialog__body {
  float: none;
  clear: both;
  overflow: hidden;
}

.release-box {

  padding-left: 70px;
}

</style>
