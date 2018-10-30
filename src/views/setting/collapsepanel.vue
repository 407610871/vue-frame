<template>
  <div>
    <div class="collapsepanel" v-for="(item,index) in settingList">
      <div class="collapsepanel-title" v-show="index != activeIndex" v-on:click="activeIndex = index">{{item.name}}<i class="el-icon-arrow-right"></i></div>
      <el-row :gutter="20" v-show="index == activeIndex">
        <el-col :span="4">
          <div class="grid-content">
            <div class="collapsepanel-subtitle">{{item.name}}</div>
          </div>
        </el-col>
        <el-col :span="11" class="setinfo">
          <div class="grid-content">
            <p>
              <span class="title1">{{item.name}}</span><br />
              hdfs主机名:{{item.name}}<br />
              端口号：{{item.port}}
              hdfs.url：{{item.url}}<br />
              备用节点字符串：{{item.bak}}<br />
              根目录：{{item.root}}<br />
              impala服务器地址：{{item.impalaPath}}
            </p>
          </div>
        </el-col>
        <el-col :span="9" class="collapsepanel-tools">
          <div class="grid-content">
            <el-button type="primary">关联</el-button>
            <el-button type="primary">修改</el-button>
            <el-button type="primary">删除</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-button>添加</el-button>
  </div>
</template>
<script>
export default {
  data(){
    return {
      activeIndex:0
    }
  },
  props: {
    settingList: {
      type: Array,
      required: true
    },
  },
  computed:{

  },
  mounted(){

  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .collapsepanel{
    margin-bottom:10px;
    color:#666;
    border-bottom:1px solid #ddd;
    .collapsepanel-title,
    .collapsepanel-subtitle{
      padding-left:20px;
      font-size:18px;
      font-weight:bold;
    }
    .collapsepanel-title{
      line-height: 30px;
      padding-bottom:10px;
      i{
        margin-left:20px;
      }
    }
    .collapsepanel-subtitle{
      margin:50px 0;
      height:100px;
      line-height: 100px;
      border-right:2px solid #ddd;
    }
    .setinfo{
      padding-left:80px !important;
      line-height:30px;
    }
    .collapsepanel-tools{
      margin:50px 0;
      padding-left:20px;
      height:100px;
      line-height: 100px;
    }
  }
</style>
