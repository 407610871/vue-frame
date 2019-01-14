<template>
  <el-form label-width="120px" class="form-fliter" @submit.native.prevent>
    <div class="searchDiv">
      <div class="dataSearch">
        <el-input type="text" v-model="keyword" placeholder="请输入查询条件" @keyup.enter="search"/>
      </div>
      <el-button type="primary" class="doCearch" icon="enc-icon-sousuo1" @click="search"></el-button>
      <i v-if="this.$route.params.type=='ftp'||this.$route.params.type=='mongodb'"></i>
      <span v-else @click="doCollapse">高级搜索
        <i :class="collapse?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
      </span>
    </div>

    <div class="checkDiv" @mouseleave="mouseleave()"
       v-show="!collapse"
    >
      <el-form-item class="checkDivItem"
       v-for="(item,indexs) in dataObj"
        :label="item.name"
        :key="indexs" >
        <el-checkbox-group
          v-if="item.type=='checkbox'"
          v-model="formSeled[item.id]"
          @change="formFilter"
        >
          <el-checkbox
            v-for="(subItem,index) in item.checkData"
            v-show="index<(dataObj[indexs].limit+1)"
            :label="subItem.id"
            :key="index"
          >{{subItem.name}}</el-checkbox>
        </el-checkbox-group>

        <el-radio
          v-for="(subItem) in item.checkData"
          v-if="item.type=='radio'"
          v-model="formSeled[item.id]"
          :label="subItem.id"
          :key="subItem.id"
          @change="formFilter"
        >{{subItem.name}}</el-radio>
        <span
          v-if="item.checkData.length>dataObj[indexs].limit&&item.checkData.length>5"
          class="moreSeclect"
          @click="domoreSeclect(indexs)"
        >更多
          <i :class="!doMoreArray[indexs]?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
        </span>
        <span
          v-else-if="item.checkData.length<=dataObj[indexs].limit&&item.checkData.length>5"
          class="moreSeclect"
          @click="domoreSeclect(indexs)"
        >收起
          <i :class="!doMoreArray[indexs]?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
        </span>
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
    },
    deleteData: [Object]
  },
  computed: {
    key_word(){
      return this.$store.state.majorData.keyword;
    }
  },
  watch: {
    keyword(newValue, oldValue) {
      
      let map = {
        dataObj: this.dataObj,
        formSeledShow: this.formSeledShow,
        keyword: newValue
      };
      this.$store.commit("setMajorData", map);
    },
    deleteData(newValue, oldValue) {
      this.delSelect(newValue.id, newValue.index);
    },
    key_word(newValue, oldValue) {
      console.log("11111111111111", newValue);
      this.keyword = newValue;
      let map = {
        dataObj: this.dataObj,
        formSeledShow: this.formSeledShow,
        keyword: newValue
      };
      this.$store.commit("setMajorData", map);
    }
  },
  created() {
    for (let i = 0; i < this.dataObj.length; i++) {
      this.doMoreArray.push(false);
      this.doMore.push(false);
    }
    this.getFormSeled();
    this.getFormSeledShow();
    console.log("this.$store.state.queryParams[this.$route.name].condition",this.$store.state.queryParams[this.$route.name].condition)
    this.keyword =
      this.$store.state.queryParams[this.$route.name].condition || "";
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
    },
    //更多收起功能
    domoreSeclect(index) {
      this.doMore[index] = !this.doMore[index];
      this.doMoreArray[index] = !this.doMoreArray[index];
      this.doMoreArray[index]
        ? (this.dataObj[index].limit = this.dataObj[index].checkData.length)
        : (this.dataObj[index].limit = 4);

      let heit = 0;
      for (let i = 0; i < this.doMore.length; i++) {
        if (this.doMore[i]) {
          heit++;
        }
      }
      this.$emit("highMore", heit);
    },
    //查询按钮
    search() {
      this.$emit("formFilter", this.formSeled);
      this.$emit("doSearch", this.keyword);
    },

    formFilter: function() {
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
      let map = {
        dataObj: this.dataObj,
        formSeledShow: this.formSeledShow,
        keyword: this.keyword
      };
      this.$store.commit("setMajorData", map);
    },

    getFormSeled: function() {
      if (this.ObjManage) {
        //进入数据源展示搜索条件清空
        this.keyword = "";
        this.formSeledShow.objectType = [];
        this.formSeledShow.dataRange = [];
        this.formSeled.objectType = [];
        this.formSeled.dataRange = [];
      } else {
        for (var value of this.dataObj) {
          this.$set(this.formSeled, value.id, value.seledData);
        }
      }
    },
    mouseleave() {
      this.collapse = !this.collapse;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.searchDiv {
  float: right;
  margin-top: -41px;
  margin-right: 20px;
  height: 40px;
  span {
    display: inline-block;
    font-size: 15px;
    cursor: pointer;
    width: 100px;
    height: 35px;
    border: 1px solid #c9cdd0;
    border-left: none;
    line-height: 35px;
    text-align: center;
    position: relative;
  }
}
.dataSearch {
  display: inline-block;
  width: 220px;
  height: 40px;
  line-height: 40px;
  ::-webkit-input-placeholder {
    color: #999;
    font-size: 15px;
  } ///* 使用webkit内核的浏览器 */
  :-moz-placeholder {
    color: #999;
    font-size: 15px;
  } ///* Firefox版本4-18 */
  ::-moz-placeholder {
    font-size: 15px;
    color: #999;
  } ///* Firefox版本19+ */
  :-ms-input-placeholder {
    font-size: 15px;
    color: #999;
  } ///* IE浏览器 */
}
.doCearch {
  display: inline-block;
  margin-top: 0;
  position: relative;
  i {
    text-indent: 5px;
    font-size: 21px;
  }
}

.checkDiv {
  padding: 30px;
  position: absolute;
  z-index: 1001;
  border: 1px solid #eff3f6;
  border-radius: 0px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  width: 800px;
  right: 0px;
  .isSelect {
    width: 100%;
    max-height: 70px;
    overflow-y: auto;
  }
  div {
    display: inline-block;
    //margin-left: 15px;
    width: 100%;
  }
  .look {
    width: auto;
    /* color: #425365; */
    font-weight: 600;
    overflow: hidden;
    margin-right: 20px;

    .lookstyle {
      font-weight: normal;
    }
    .searchStyle {
      max-width: 140px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      margin-top: -10px;
      position: relative;
      top: 9px;
    }
  }
  .el-checkbox-group {
    display: inline-block;
    max-height: 70px;
    overflow-y: auto;
    width: 80%;
    float: left;
    .el-checkbox + .el-checkbox {
      margin-left: 15px;
    }
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
      cursor: pointer;
    }
  }
}
</style>
