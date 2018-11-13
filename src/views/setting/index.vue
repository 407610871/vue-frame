<template>
  <div style="padding:20px; background: #fff; overflow-y:auto;" v-bind:style="{height:mainHeight}">
    <div class="panel">
      <div class="panel-title" style="margin-bottom:10px;">库区设置</div>
      <collapsePanel @refresh="initPage()" v-if="dataReady" v-bind:settingList="settingList" />
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
                  <el-select v-model="sysParam.province" placeholder="请选择省" @change="loadCity">
                    <el-option :label="item.name" :value="item.code" v-for="(item,index) in provinceList" :key="index"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2" style="text-align:center;" class="col-inside">-</el-col>
                <el-col :span="11" class="col-inside">
                  <el-select v-model="sysParam.city" placeholder="请先选择省" @change="changeSet">
                    <el-option :label="item.name" :value="item.code" v-for="(item,index) in cityList" :key="index"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据资源事权单位机构代码" label-width="180px">
                <el-input v-model="sysParam.mecodeOrg" @change="changeSet"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="每页展示条数">
                <el-select v-model="sysParam.pageLimit" value-key="pageLimit" placeholder="请选择条数" @change="changeSet">
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
                <el-input v-model="sysParam.hdfsPaOrg" @change="changeSet"></el-input>
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
import collapsePanel from './collapsepanel.vue'

export default {
  name: 'config',
  data() {
    return {
      dataReady:false,
      activeName: '1',
      mainHeight:window.innerHeight - 118+'px',
      dataReady:true,
      settingList:{},
      provinceList:[],
      cityList:[],
      sysParam: {
        mecodeOrg: '',
        hdfsPaOrg: '',
        pageLimit: '20',
        province: '',
        city: ''
      },
			configs:[]
    }
  },
  components: {
    collapsePanel
  },
  computed: {
		param:function(){
      return this.$store.state.queryParams.setting
    },
  },
  watch: {
		param(newVal,oldVal){
      if(newVal.timeFlag != oldVal.timeFlag){
        this.initPage();
      }
    }
  },
  created(){
  },
  mounted(){
    this.initPage()
  },
  methods:{
		initPage(){
			var _self = this;
		
			this.$ajax.get('http://10.19.248.200:32661/DACM/caccesssysRelationWorkInfo/getStorages',{
				params:{
					nodeId:2,
					pid:1
				}
			}).then(function(res){
				if(res.data.result == 'succeed'){
					var list = [];			
					for(var value of res.data.storages){
						var config = JSON.parse(value.config);
						var IPindex = config['hdfs.url'].split('//')[1].indexOf(':');
						var bakList = config['hdfs.url'].split(",");
						bakList = bakList.splice(1,bakList.length-1);
						var serv = value.dataCenterInfos;
						var seda = serv.serviceDatabase;
						var seurl = serv.serviceUrl;
						var sindex = seurl.indexOf(seda);
						seurl = seurl.substring(0,sindex);
						var obj = {
							storageName:value.infoName,
							storageId:value.id,
							name:config['hdfs.url'].split('//')[1].substring(7, IPindex),
							type:config['hdfs.url'].split(':')[1].substring(IPindex, config['hdfs.url'].length),
							port:config['hdfs.url'].split(",")[0].split(":")[2],
							url:config['hdfs.url'],
							bak:bakList.join(','),
							root:config['topics.dir'],
							impalaPath:seurl + seda
						}
						list.push(obj);
					}
					_self.settingList = {
						seledId:res.data.select,
						list:list
					}
					_self.dataReady = true;
				}else{
					console.log(res.code);
					_self.$alert('获取系统库区设置失败','提示', {
						confirmButtonText: '确定'
					});
				}
			}).catch(function(err){
				console.log(err);
				_self.$alert('获取系统库区设置失败','提示', {
					confirmButtonText: '确定'
				});
			});


			const promist0 = new Promise((resolve, reject) => {
				this.$ajax.get('http://10.19.248.200:32661/DACM/commonInter/getAreas', {
				// this.$ajax.get('./getProvinceList', {
					params:{
						parentid:0
					}
				}).then((res) => {
					if(res.data.success){
						resolve(res);
					}else{
						reject(res);
						_self.$alert('获取行政区划失败','提示', {
							confirmButtonText: '确定'
						});
					}
				}, (err) => {
					console.log(err)
					reject(err);					
					_self.$alert('获取行政区划失败','提示', {
						confirmButtonText: '确定'
					});
				})
			});
			const promist1 = new Promise((resolve, reject) => {
				this.$ajax.get('http://10.19.248.200:32442/DACM/caccesssysRelationWorkInfo/getSystemSet.do').then((res) => {
					if(res.data.result == 'success'){
						resolve(res);
						
					}else{
						_self.$alert('获取系统参数失败','提示', {
							confirmButtonText: '确定'
						});
						reject(res);
					}
				}, (err) => {
					console.log(err)
					reject(err);
					_self.$alert('获取系统参数失败','提示', {
						confirmButtonText: '确定'
					});
				})
			});
			Promise.all([promist0, promist1]).then((resultList) => {
				_self.provinceList = resultList[0].data.data;
				_self.configs=JSON.parse(resultList[1].data.message);
				for(var value of _self.configs){
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
							var position = JSON.parse(value.name)[0];
							_self.sysParam.province = position.pro;
							var city = position.city
							// _self.$ajax.get('./getCityList',{
							_self.$ajax.get('http://10.19.248.200:32661/DACM/commonInter/getAreas',{
								params:{
									parentid:_self.sysParam.province
								}
							}).then(function(res){
								_self.cityList = res.data.data;
								_self.sysParam.city = city;
							})
							.catch(function(err){
								console.log(err);
							});

							break;
						default:
							break;
					}
				}
			});
		},
    loadCity() {
			var _self = this;
      _self.$ajax.get('http://10.19.248.200:32661/DACM/commonInter/getAreas',{
				params:{
					parentid:_self.sysParam.province
				}
			}).then(function(res){
				_self.cityList = res.data.data;
				_self.sysParam.city = "";
			})
			.catch(function(err){
				console.log(err);
			});
    },
    changeSet() {
			if(this.sysParam.province == ''){
				return; //这个是通过选择省份重置的
			}
			var paramsList = JSON.parse(JSON.stringify(this.configs));
			console.log(paramsList);
			for(var value of paramsList){
				switch (value.key.trim()) {
					case '数据资源事权单位机构代码':
						value.name = this.sysParam.mecodeOrg;
						break;
					case '本地文件采集Hdfs路径':
						value.name = this.sysParam.hdfsPaOrg;
						break;
					case '每页展示条数':
						value.name = this.sysParam.pageLimit+'';
						break;
					case '行政区域':
						var position = [];
						for(var value of this.provinceList){
							if(value.code == this.sysParam.province){
								position.push(value)
								break;
							}
						}
						for(var value of this.cityList){
							if(value.code == this.sysParam.city){
								position.push(value)
								break;
							}
						}
						value.name = JSON.stringify(position);
						break;
					default:
						break;
				}
			}
			console.log('==================');
			var _self = this;
      /*_self.$ajax.post('http://10.19.160.176:8080/DACM/caccesssysRelationWorkInfo/saveSystemSet',JSON.stringify({
      // _self.$ajax.post('http://10.19.160.175:8080/DACM/caccesssysRelationWorkInfo/saveSystemSet',
				// JSON.stringify(paramsList)
				paramsList
			).then(function(res){*/
			_self.$ajax({
				// url: 'http://10.19.160.175:8080/DACM/caccesssysRelationWorkInfo/saveSystemSet',
				url: 'http://10.19.248.200:32661/DACM/caccesssysRelationWorkInfo/saveSystemSet',
				method: 'post',
				data: paramsList,
				// headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function (res) {
				if(parseInt(res.data) == 1){
					_self.$alert('设置成功','提示', {
						confirmButtonText: '确定'
					}).then(()=>{
						_self.configs = paramsList;
					});
				}else{
					_self.$alert('修改系统设置失败','提示', {
						confirmButtonText: '确定'
					}).then(()=>{
						for(var value of _self.configs){
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
									var position = JSON.parse(value.name)[0];
									_self.sysParam.province = position.pro;
									_self.sysParam.city = position.city;
									break;
								default:
									break;
							}
						}
					});
				}
			})
			.catch(function(err){
				console.log(err);
				_self.$alert('修改系统设置失败','提示', {
					confirmButtonText: '确定'
				}).then(()=>{
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
							var position = JSON.parse(value.name)[0];
							_self.sysParam.province = position.pro;
							_self.sysParam.city = position.city;
							break;
						default:
							break;
					}
				});
			});
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
