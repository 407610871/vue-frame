<template>
  <el-form label-width="120px" class="form-fliter">
    <div class="searchDiv">
      <div class="dataSearch">
        <i class="el-icon-search"></i>
        <input type="text" v-model="keyword" placeholder="请输入查询条件" />
      </div>
      <span @click="doCollapse">高级搜索 <i :class="!collapse?'el-icon-caret-bottom':'el-icon-caret-top'"></i> </span>
      <el-button type="primary" class="doCearch" @click="search">查询</el-button>
    </div>

    <div class="checkDiv">
      <el-form-item class="isSelect" label="已筛选条件：">
        <div class="look" v-show="formSeledShow.dataSourceName.length!=0">接入源类型：
          <span v-for="(dataSourceName,key,index) in formSeledShow.dataSourceName" :key="index"> {{dataSourceName.name}} <i class="el-icon-error" @click="delSelect(index,1)"></i>
          </span>
        </div>
        <div class="look" v-show="formSeled.network!=''||formSeled.network==undefined">接入数据来源：
          <span v-if="formSeled.network==1">公安网<i class="el-icon-error" @click="delSelect(formSeled.network,2)"></i></span>
          <span v-else-if="formSeled.network==2">私网<i class="el-icon-error" @click="delSelect(formSeled.network,2)"></i></span>
          <span v-else-if="formSeled.network==3">委办网<i class="el-icon-error" @click="delSelect(formSeled.network,2)"></i></span>
        </div>
        <div class="look" v-show="formSeledShow.platform.length!=0">对接平台：
          <span v-for="(platform,index) in formSeledShow.platform" :key="index">{{platform.name}} <i class="el-icon-error" @click="delSelect(index,3)"></i> </span>
        </div>
      </el-form-item>
      <el-form-item v-show="!collapse" v-for="(item,indexs) in dataObj" :label="item.name" :key="indexs" class="checkDivItem">
        <el-checkbox-group v-if="item.type=='checkbox'" v-model="formSeled[item.id]" @change="formFilter">
          <el-checkbox v-for="(subItem,index) in item.checkData" v-show="index<=dataObj[indexs].limit" :label="subItem.id" :key="subItem.id">{{subItem.name}}</el-checkbox>

        </el-checkbox-group>

        <el-radio  v-if="item.type=='radio'" v-for="subItem in item.checkData" v-model="formSeled[item.id]" :label="subItem.id" :key="subItem.id" @change="formFilter">{{subItem.name}}</el-radio>
        <span v-if="item.type=='checkbox'" class="moreSeclect" @click="domoreSeclect(indexs)"> {{doMoreArray[indexs]?"收起":" 更多 "}} <i :class="!doMoreArray[indexs]?'el-icon-caret-bottom':'el-icon-caret-top'"></i> </span>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      formSeled: {},
      formSeledShow: {
        dataSourceName: [],
        network: "",
        platform: []
      },
      collapse: true,
      keyword: "",
      typeLength: 4,
      platformLength: 4,
      doMoreArray: [false, false, false],
      selectArray: []
    };
  },
  props: {
    dataObj: {
      type: Array,
      required: true
    },
    formCollapse: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {},
  created() {


  },
  mounted() {
    this.getFormSeled();
  },

  methods: {
    //高级搜索
    doCollapse(){
    console.log(this.dataObj);

      this.collapse=!this.collapse;
            this.$emit("highSeaech", this.collapse);
        // console.log(this.collapse)

    },
    //搜索条件关闭
    delSelect(index, a) {
      if (a == 1) {
        this.formSeledShow.dataSourceName.splice(index, 1);
        this.formSeled.dataSourceName.splice(index, 1);
      } else if (a == 2) {
        this.formSeled.network = "";
      } else if (a == 3) {
        this.formSeledShow.platform.splice(index, 1);
        this.formSeled.platform.splice(index, 1);
      }
      this.$emit("formFilter", this.formSeled);
    },
    //更多收起功能
    domoreSeclect(index) {
      this.doMoreArray[index] = !this.doMoreArray[index];
      this.doMoreArray[index]
        ? (this.dataObj[index].limit = this.dataObj[index].checkData.length)
        : (this.dataObj[index].limit = 4);
    },
    //查询按钮
    search() {
      this.$emit("doSearch", this.keyword);
    },
    formFilter: function() {
      this.formSeledShow.dataSourceName = [];
      this.formSeledShow.platform = [];
      // debugger;
      for (let i = 0; i < this.formSeled.dataSourceName.length; i++) {
        for (let z = 0; z < this.dataObj[0].checkData.length; z++) {
          if (
            this.formSeled.dataSourceName[i] == this.dataObj[0].checkData[z].id
          ) {
            this.formSeledShow.dataSourceName.push({
              id: this.dataObj[0].checkData[z].id,
              name: this.dataObj[0].checkData[z].name
            });
          }
        }
      }
      for (let i = 0; i < this.formSeled.platform.length; i++) {
        for (let z = 0; z < this.dataObj[2].checkData.length; z++) {
          if (this.formSeled.platform[i] == this.dataObj[2].checkData[z].id) {
            this.formSeledShow.platform.push({
              id: this.dataObj[2].checkData[z].id,
              name: this.dataObj[2].checkData[z].name
            });
          }
        }
      }

      this.$emit("formFilter", this.formSeled);
    },

    getFormSeled: function() {
      // console.log('this.dataObj');
      // console.log(this.dataObj);
      var obj = {};
      for (var value of this.dataObj) {
        obj[value.id] = value.seledData;
      }
      this.formSeled = obj;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-fliter {
  overflow: hidden;
  .el-form-item {
    margin-bottom: 2px;
  }
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
.doCearch {
  display: inline-block;
  height: 28px;
  margin-left: 15px;
  margin-top: 0;
  position: relative;
  top: 2px;
  line-height: 10px;
}
.el-form-item {
  margin-bottom: 10px;
}
.checkDiv {
  width: 95%;
  // margin-left: 20px;
  margin: 0 auto;
  .isSelect {
    width: 100%;
  }
  div {
    display: inline-block;
    margin-left: 20px;
    width: 100%;
  }
.look{
    width: auto;
}
  .checkDivItem {
    border-bottom: 1px solid #d9d9d9;
  }
  .el-checkbox-group {
    display: inline-block;
    max-height: 70px;
    overflow-y: auto;
    width: 580px;
    float: left;
  }
  .moreSeclect {
    cursor: pointer;
    float: left;
    margin-left: 20px;
  }

  span {
    display: inline-block;
    margin-left: 15px;
    i {
      color: #747474;
      margin-left: 5px;
    }
  }
}
</style>
