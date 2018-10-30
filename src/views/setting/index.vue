<template>
  <div style="padding:20px; background: #fff;" v-bind:style="{height:mainHeight}">
    <el-collapse v-model="activeName" accordion v-if="dataReady">
      <el-collapse-item :title="item.name" name="1" v-for="item in settingList">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content">
              <span class="title1">{{item.name}}</span>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="grid-content">
              <p>
                <span class="title1">{{item.name}}</span><br />
                {{item.type}}<br />
                {{item.port}}<br />
                {{item.url}}<br />
                {{item.bak}}<br />
                {{item.root}}<br />
                {{item.impalaPath}}
              </p>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="grid-content">
              <el-button>关联</el-button>
              <el-button>修改</el-button>
              <el-button>删除</el-button>
            </div>
          </el-col>
        </el-row>

      </el-collapse-item>
    </el-collapse>
    <el-button>添加</el-button>
  </div>
</template>

<script>
import { mapState} from 'vuex'

export default {
  name: 'config',
  data() {
    return {
      activeName: '1',
      mainHeight:window.innerHeight - 118+'px',
      dataReady:true,
      settingList:[]
    }
  },
  components: {
  },
  computed: {
  },
  watch: {

  },
  created(){
  },
  mounted(){
    var _self = this;
    this.$ajax.get('./getConfig').then(function(res){
      var list = [];
      console.log(res)
      for(var value of res.data){
        switch (value.type) {
          case 'hdfs':
            var bakList = value.config['hdfs.url'].split(",");
            bakList = bakList.splice(1,bakList.length-1);
            var obj = {
              name:value.name,
              type:value.type,
              port:value.config['hdfs.url'].split(",")[0].split(":")[1],
              url:value.config['hdfs.url'],
              bak:bakList.join(','),
              root:value.config['topics.dir'],
              impalaPath:value.dataCenter.serviceUrl
            }
            list.push(obj);
            break;
          default:
            break
        }
      }
      _self.settingList = list;
    })
    .catch(function(err){
      console.log(err);
    });
  },
  methods:{

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .grid-content {
    min-height: 36px;
  }
</style>
