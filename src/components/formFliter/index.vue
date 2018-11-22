<template>
  <el-form label-width="120px" class="form-fliter">
    <div class="searchDiv">
      <div class="dataSearch">
        <i class="el-icon-search"></i>
        <input type="text" v-model="keyword" placeholder="请输入查询条件" />
      </div>
      <span @click="doCollapse">高级搜索 <i :class="collapse?'el-icon-caret-bottom':'el-icon-caret-top'"></i> </span>
      <el-button type="primary" class="doCearch" @click="search">查询</el-button>
    </div>

    <div class="checkDiv">
      <el-form-item class="isSelect" label="已筛选条件：" v-show="keyword!=''||formSeledShow.dataSourceName.length!=0||formSeledShow.network.length!=0||formSeledShow.platform.length!=0||formSeledShow.objectType.length!=0||formSeledShow.dataRange.length!=0">
        <div class="look" v-show="keyword!=''">
              查询条件：<span class="lookstyle">{{keyword}}</span> <i style="margin-left: 5px;" class="el-icon-error" @click="keyword=''"></i>
        </div>
        <div class="look" v-show="formSeledShow[item.id].length!=0" v-for="(item,index1) in dataObj" :key="index1">{{item.name}}
          <span   class="lookstyle" v-for="(item1,index) in formSeledShow[item.id]" :key="index"> {{item1.name}} <i class="el-icon-error" @click="delSelect(index,index1)"></i>
          </span>
        </div>
        <!-- <div class="look" v-show="formSeledShow.dataSourceName.length!=0">接入源类型：
          <span v-for="(dataSourceName,key,index) in formSeledShow.dataSourceName" :key="index">{{dataSourceName.name}} <i class="el-icon-error" @click="delSelect(index,0)"></i> </span>
        </div>
        <div class="look" v-show="formSeledShow.network.length!=0">接入数据来源：
          <span v-for="(network,key,index) in formSeledShow.network" :key="index">{{network.name}} <i class="el-icon-error" @click="delSelect(index,1)"></i> </span>
        </div>
        <div class="look" v-show="formSeledShow.platform.length!=0">对接平台：
          <span v-for="(platform,key,index) in formSeledShow.platform" :key="index">{{platform.name}} <i class="el-icon-error" @click="delSelect(index,2)"></i> </span>
        </div>
        <div class="look" v-show="formSeledShow.objectType.length!=0">接入对象类型：
          <span v-for="(objectType,key,index) in formSeledShow.objectType" :key="index">{{objectType.name}} <i class="el-icon-error" @click="delSelect(index,0)"></i> </span>
        </div>
        <div class="look" v-show="formSeledShow.dataRange.length!=0">数据范围：
          <span v-for="(dataRange,key,index) in formSeledShow.dataRange" :key="index">{{dataRange.name}} <i class="el-icon-error" @click="delSelect(index,1)"></i> </span>
        </div>
         -->
      </el-form-item>
      <el-form-item v-show="!collapse" v-for="(item,indexs) in dataObj" :label="item.name" :key="indexs" class="checkDivItem">
        <el-checkbox-group v-if="item.type=='checkbox'" v-model="formSeled[item.id]" @change="formFilter">
          <el-checkbox v-for="(subItem,index) in item.checkData" v-show="index<=dataObj[indexs].limit" :label="subItem.id" :key="index">{{subItem.name}}</el-checkbox>
        </el-checkbox-group> 

        <el-radio  v-if="item.type=='radio'" v-for="(subItem) in item.checkData" v-model="formSeled[item.id]" :label="subItem.id" :key="subItem.id" @change="formFilter">{{subItem.name}}</el-radio>
        <span v-if="item.checkData.length>dataObj[indexs].limit" class="moreSeclect" @click="domoreSeclect(indexs)"> {{doMoreArray[indexs]?"收起":" 更多 "}} <i :class="!doMoreArray[indexs]?'el-icon-caret-bottom':'el-icon-caret-top'"></i> </span>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      formSeled: {
        objectType: [],
        dataRange: [],
        platform: [],
        network: [],
        dataSourceName: []
      },
      formSeledShow: {
        objectType: [],
        dataRange: [],
        platform: [],
        network: [],
        dataSourceName: []
      },

      collapse: true,
      keyword: "",
      typeLength: 4,
      platformLength: 4,
      doMoreArray: [], //更多操作的flag
      doMore: [], //向父组件组件传值，更改表格高度
      selectArray: []
    };
  },
  props: {
    ObjManage: {
      type: Boolean
    },
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
    for (let i = 0; i < this.dataObj.length; i++) {
      this.doMoreArray.push(false);
      this.doMore.push(false);
    }
    this.getFormSeled();
    this.getFormSeledShow();
  },
  mounted() {
    this.getFormSeled();
    this.getFormSeledShow();
  },

  methods: {
    //高级搜索
    doCollapse() {
      this.collapse = !this.collapse;
      this.$emit("highSeaech", this.collapse);
    },
    //搜索条件关闭
    delSelect(index, a) {
      this.formSeledShow[this.dataObj[a].id].splice(index, 1);
      this.formSeled[this.dataObj[a].id].splice(index, 1);
      this.$emit("formFilter", this.formSeled);
    },
    //更多收起功能
    domoreSeclect(index) {
      this.doMore[index] = !this.doMore[index];
      let heit = 0;
      for (let i = 0; i < this.doMore.length; i++) {
        if (this.doMore[i]) {
          heit++;
        }
      }
      this.$emit("highMore", heit);
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
      this.$emit("formFilter", this.formSeled);
      this.getFormSeledShow();
    },

    //存放数组展示用
    getFormSeledShow() {
      for (let i = 0; i < this.dataObj.length; i++) {
        this.formSeledShow[this.dataObj[i].id] = [];
        for (let z = 0; z < this.formSeled[this.dataObj[i].id].length; z++) {
          for (let x = 0; x < this.dataObj[i].checkData.length; x++) {
            if (
              this.formSeled[this.dataObj[i].id][z] ==
              this.dataObj[i].checkData[x].id
            ) {
              // this.$nextTick(() => {
              this.formSeledShow[this.dataObj[i].id].push({
                id: this.dataObj[i].checkData[x].id,
                name: this.dataObj[i].checkData[x].name
                // });
              });
            }
          }
        }
      }
    },

    getFormSeled: function() {
      console.log(this.ObjManage);
      if (this.ObjManage) {
        //进入数据源展示搜索条件清空
        this.keyword="";
      } else {
        for (var value of this.dataObj) {
          this.$set(this.formSeled, value.id, value.seledData);
        }
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-fliter {
  // overflow: hidden;
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
  height: 30px;
  margin-left: 15px;
  margin-top: 0;
  position: relative;
  // top: 2px;
  line-height: 8px;
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
    max-height: 70px;
    overflow-y: auto;
  }
  div {
    display: inline-block;
    margin-left: 20px;
    width: 100%;
  }
  .look {
    width: auto;
    color: #425365;
    font-weight: 600;
    .lookstyle {
      font-weight: normal;
    }
  }
  .checkDivItem {
    border-bottom: 1px solid #d9d9d957;
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
      // color: #747474;
      margin-left: 5px;
    }
  }
}
</style>
