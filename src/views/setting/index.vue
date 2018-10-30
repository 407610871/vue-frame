<template>
  <div style="padding:20px; background: #fff; overflow-y:auto;" v-bind:style="{height:mainHeight}">
    <div class="panel">
      <div class="panel-title" style="margin-bottom:10px;">库区设置</div>
      <el-collapse v-model="activeName" accordion v-if="dataReady">
        <el-collapse-item :title="item.name" name="1" v-for="item in settingList">
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="grid-content">
                <span class="title1">{{item.name}}</span>
              </div>
            </el-col>
            <el-col :span="11" class="setinfo">
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
                <el-button type="primary">关联</el-button>
                <el-button type="primary">修改</el-button>
                <el-button type="primary">删除</el-button>
              </div>
            </el-col>
          </el-row>

        </el-collapse-item>
      </el-collapse>
      <el-button>添加</el-button>
    </div>

    <div class="panel">
      <div class="panel-title">外观</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="theme-preview">
            <img src="./../../static/img/1.jpg" />
          </el-card>
        </el-col>
        <el-col :span="16">
          <div class="theme-item">
            <img src="./../../static/img/1.jpg" />
            风格1
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="panel">
      <div class="panel-title">系统参数</div>
      <el-form label-width="100px" class="setting-form">
        <div class="proInfo-box clearfix">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="行政区划">
                <el-col :span="11" class="col-inside">
                  <el-select v-model="sysParam.province" placeholder="请选择省">
                    <el-option :label="item.name" :value="item.code" v-for="item in provinceList"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2" style="text-align:center;" class="col-inside">-</el-col>
                <el-col :span="11" class="col-inside">
                  <el-select v-model="sysParam.city" placeholder="请先选择省">
                    <el-option :label="item.name" :value="item.code" v-for="item in cityList"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据资源事权单位机构代码" label-width="180px">
                <el-input v-model="sysParam.mecodeOrg"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="每页展示条数">
                <el-select v-model="sysParam.pageLimit" value-key="pageLimit" placeholder="请选择条数">
                  <el-option label="10条" value="10">10条</el-option>
                  <el-option label="20条" value="20">20条</el-option>
                  <el-option label="30条" value="30">30条</el-option>
                  <el-option label="50条" value="50">50条</el-option>
                  <el-option label="100条" value="100">100条</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本地文件采集hdfs路径" label-width="180px">
                <el-input v-model="sysParam.hdfsPaOrg"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
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
      settingList:[],
      provinceList:[],
      cityList:[],
      sysParam: {
        mecodeOrg: '',
        hdfsPaOrg: '',
        pageLimit: '20',
        province: '',
        city: ''
      }
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
    this.$ajax.get('./getDbConfig').then(function(res){
      var list = [];
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

    this.$ajax.get('./sysParamConfig').then(function(res){
      for(var value of res.data){
        switch (value.key.trim()) {
          case '数据资源事权单位机构代码':
            _self.sysParam.mecodeOrg = value.name;
            break;
          case '本地文件采集Hdfs路径':
            _self.sysParam.hdfsPaOrg = value.name;
            break;
          case '每页展示条数':
            _self.sysParam.pageLimit = value.name;
            break;
          case '行政区域':
            _self.sysParam.province = value.name[0].pro;
            _self.$ajax.get('./getCityList').then(function(res){
              _self.cityList = res.data;
            })
            .catch(function(err){
              console.log(err);
            });
            _self.sysParam.city = value.name[0].city;
            break;
          default:
            break;
        }
      }
      console.log(_self.sysParam)
    })
    .catch(function(err){
      console.log(err);
    });

    this.$ajax.get('./getProvinceList').then(function(res){
      _self.provinceList = res.data;
    })
    .catch(function(err){
      console.log(err);
    });
  },
  methods:{
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
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
  .panel{
    margin-bottom:10px;
    .panel-title{
      height:46px;
      line-height: 46px;
      border-bottom: 1px solid #ddd;
      margin-bottom:20px;
    }
    .setting-form{
      width:70%;
      min-width:900px;
      .col-inside{
        padding-left:0 !important;
        padding-right:0 !important;
      }
    }
    .el-collapse{
      margin-bottom:10px;
      border-top:0 none;
      .setinfo{
        padding-left:80px !important;
        border-left: 1px solid #eee;
      }
    }
    .theme-preview{
      width:80%;
      margin-left:10px;
      img{
        width: 100%;
        background-color: #f90;
      }
    }
    .theme-item{
      width:160px;
      text-align: center;
      img{
        width:100%;
        margin-bottom:10px;
      }
    }
  }

</style>
