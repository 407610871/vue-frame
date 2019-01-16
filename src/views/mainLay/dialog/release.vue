<template>
  <div class="taskMDialog release">
    <!-- <el-tooltip class="item" effect="light" content="版本信息" placement="bottom">
      <el-button @click="dialogVisible = true" class="document" icon="enc-icon-documents"></el-button>
    </el-tooltip> -->
    <!--  <a href="javascript:void(0)" @click="dialogVisible = true" >版本信息</a> -->
    <el-dialog :title="versionDes + '  '+ versionDate" :visible.sync="dialogVisible" width="73%" :before-close="closeDialog">
      <div class="title-gra plr30">
        <div class="grab gra-r">
          <span class="grab gra-l"></span>
        </div>
      </div>
      <el-col :span="4">
        <el-tabs tab-position="left" style="height: 200px;" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in versionData" :key="index" :label="item"></el-tab-pane>
          <!-- <el-tab-pane label="用户管理"></el-tab-pane>
          <el-tab-pane label="配置管理"></el-tab-pane>
          <el-tab-pane label="角色管理"></el-tab-pane>
          <el-tab-pane label="定时任务补偿"></el-tab-pane> -->
        </el-tabs>
      </el-col>
      <el-col :span="20" class="release-box release-ver-con">
        <div class="proInfo-box release-Info bornone clearfix">
          <ul class="directory">
            <li><a href="javascript:void(0)" @click="goAnchor('txqd')">特性清单</a></li>
            <li><a href="javascript:void(0)" @click="goAnchor('zdbglb')">重大变更列表</a></li>
            <li><a href="javascript:void(0)" @click="goAnchor('wtjjqd')">解决问题清单</a></li>
            <li><a href="javascript:void(0)" @click="goAnchor('yzwthxz')">已知问题和限制</a></li>
          </ul>
          <div class="daiInfo-title proInfo-title" id="txqd">
            <h2>特性清单</h2>
          </div>
          <div class="proInfo-box comTable retable clearfix">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column label="编号" width="80">
                <template slot-scope="scope">
                  <span>{{scope.$index}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="Introduction" label="特性名称">
              </el-table-column>
              <el-table-column prop="content" label="具体描述" width="350" class="tleft">
              </el-table-column>
              <el-table-column prop="sysName" label="子系统/产品">
              </el-table-column>
              <el-table-column prop="remark" label="备注">
              </el-table-column>
            </el-table>
          </div>
          <div class="proInfo-box clearfix" id="zdbglb">
            <h2>重大更新列表</h2>
            <ul class="imlist">
              <!--  <li v-if="changeData.length==0">N/A</li> -->
              <li v-for="item in changeData">{{item.content}}</li>
            </ul>
          </div>
          <div class="proInfo-box clearfix" id="wtjjqd">
            <h2>解决问题清单</h2>
            <ul class="imlist">
              <!--  <li v-if="finishData.length==0">N/A</li> -->
              <li v-for="item in finishData">{{item.content}}</li>
            </ul>
          </div>
          <div class="proInfo-box bornone clearfix" id="yzwthxz">
            <h2>已知问题和限制</h2>
            <div class="proInfo-box comTable rectable bornone clearfix">
              <el-table :data="knownData" stripe style="width: 100%">
                <el-table-column label="编号" width="80">
                  <template slot-scope="scope">
                    <span>{{scope.$index}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="问题描述" width="350">
                </el-table-column>
                <el-table-column prop="Influence" label="影响" width="150">
                </el-table-column>
                <el-table-column prop="Solve" label="权变解决方法">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
    </el-dialog>
  </div>
</template>
<script type="text/javascript" src="../release/js/xml2json.min.js"></script>
<script>
/*import version from '@/views/mainLay/dialog/release_version'*/
// import versionBank from '@/views/mainLay/release/data/version1.2.2.xml'
/*console.log(versionBank);*/
export default {
  name: "taskMDialog",
  data: function() {
    return {
      dialogVisible: true,
      versionDes: '',
      versionDate: '',
      loading: false,
      versionData: [
        '1.1.1', '1.1.0', '1.0.1', '1.0.0'
      ],
      tableData: [],
      changeData: [],
      finishData: [],
      knownData: []
    };
  },
  mounted() {
    this._getVersion('1.1.1');
  },
  methods: {
    //关闭对话框
    closeDialog() {
      this.$emit('closeDia', );
      this.dialogVisible = false;

    },
    handleClick(tab, event) {
      /* console.log(tab, event);*/
      if (tab.label == '当前') {
        this._getVersion('1.1.1');
      } else {
        this._getVersion(tab.label);
      }

    },
    //版本信息滚动
    goAnchor(selector) {
      document.getElementById(selector).scrollIntoView();
    },
    //滚动
    godToId(ID) {
      $('html,body').animate({ scrollTop: $("#" + ID).offset().top }, 500);
    },
    _getVersion(url) {
      this.loading = true;
      let _self = this;
      this.$ajax.get(`/data/version${url}.xml`).then(function(res) {
          _self.loading = false;
          var jsonObj = _self.$x2js.xml2js(res.data);
          _self.tableData = jsonObj.note.specialityList.item;
          _self.changeData = jsonObj.note.changeList.item;
          _self.finishData = jsonObj.note.finishedPunchList.item;
          _self.knownData = Array.isArray(jsonObj.note.questionList.item) ? jsonObj.note.questionList.item : [jsonObj.note.questionList.item];
          _self.versionDes = jsonObj.note.name;
          _self.versionDate = jsonObj.note.date;

        })
        .catch(function(err) {
          console.log(err)
          _self.loading = false;
        });
    }
  },
  components: {

  },
  watch: {

  }

};

</script>
<style lang="scss">
@import "@/assets/css/base.scss";
@import "@/assets/css/dialog.scss";
.el-select {
  width: 100%;
}

.el-table thead {
  line-height: 1;
}

.release-Info .imlist li {
  display: block;
}

.release {
  max-height: 600px;
  height: 600px;
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

  padding-left: 0px;
}

.release .directory ul li {
  display: inline-block !important;
}


@media screen and ( max-width: 1280px) {
  .taskMDialog {
    vertical-align: top;
  }
  .release .el-button {
    width: 60px;
    height: 50px;
    vertical-align: top;
  }
}

.retable .el-table td:nth-child(1) .cell {
  text-align: center;
}

.rectable .el-table td:nth-child(1) .cell {
  text-align: center;
}

.rectable .el-table .cell {
  text-align: left;
  white-space: normal;
}

.retable .el-table .cell {
  text-align: center;
  white-space: normal;
}

.retable .el-table th>.cell,.rectable .el-table th>.cell {
  text-align: center
}

.release {
  line-height: 55px !important;
  .el-dialog__body {
    padding-top: 13px !important;
  }
  .el-dialog .el-dialog__header {
    line-height: 76px !important;
  }
}

.retable {
  .el-table__row td:nth-child(3) .cell,
  .el-table__row td:nth-child(5) .cell {
    text-align: left;
  }
}

</style>
