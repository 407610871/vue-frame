import Mock from "mockjs";
import data from "./../static/json/mainTable.json";
import accessSourceType from "./../static/json/accessSourceType.json";
import accessDataSource from "./../static/json/accessDataSource.json";
import accessObjType from "./../static/json/accessObjType.json";
import typeMap from "./../static/json/typeMap.json";
import columnType from "./../static/json/columnType.json";
import configData from "./../static/json/dbconfig.json";
import provinceList from "./../static/json/areaProvinces.json";
import cityList from "./../static/json/areaCitys.json";
export default Mock;
var mainTableData = data;
function getTableData(options){
  setTimeout(function(){
    return mainTableData;
  },10)
}

var sysParamConfig = [{
    "createname": "",
    "createtime": "2018-08-22 15:45:21",
    "id": 7821,
    "key": "行政区域",
    "name": [{
        "pro": "320000",
        "proname": "江苏省",
        "city": "320100",
        "cityname": "南京市"
    }],
    "note": "test",
    "status": "U"
}, {
    "createname": "",
    "createtime": "2018-08-22 15:45:21",
    "id": 7822,
    "key": "数据源时区",
    "name": "东六区",
    "note": "a",
    "status": "U"
}, {
    "createname": "",
    "createtime": "2018-08-22 15:45:21",
    "id": 7823,
    "key": "字符集",
    "name": "Unicode",
    "note": "测试",
    "status": "U"
}, {
    "createname": "",
    "createtime": "2018-08-28 15:45:21",
    "id": 7824,
    "key": "更换皮肤",
    "name": "原生绿",
    "status": "U"
}, {
    "createname": "",
    "createtime": "2018-08-28 15:45:21",
    "id": 7825,
    "key": "每页展示条数",
    "name": "30",
    "status": "U"
}, {
    "createtime": "2018-08-28 15:45:21",
    "id": 7826,
    "key": "数据资源事权单位机构代码",
    "name": "010000300000",
    "status": "U"
}, {
    "createtime": "2018-08-28 15:45:21",
    "id": 7827,
    "key": "本地文件采集Hdfs路径",
    "name": "kettlePath88",
    "status": "U"
}]

var deptJson = [];


Mock.mock(/\/list\?[a-z0-9A-Z=,]{0,}/,/get|post/i,mainTableData);
Mock.mock(/http:\/\/localhost:8080\/list\?[*]{0,}/,/get|post/i,mainTableData);

Mock.mock(/\/getAccessSourceType/,/get|post/i,accessSourceType);

Mock.mock(/\/getAccessDataSource/,/get|post/i,accessDataSource);

Mock.mock(/\/getExchangePlatform/,/get|post/i,accessDataSource);

Mock.mock(/\/getDbConfig/,/get|post/i,configData);
Mock.mock(/\/sysParamConfig/,/get|post/i,sysParamConfig);

Mock.mock(/\/getProvinceList/,/get|post/i,provinceList);
Mock.mock(/\/getCityList/,/get|post/i,{
	success:true,
	data:cityList
});

// Mock.mock(/\/getDept/,/get|post/i,deptJson);

Mock.mock(/\/sysParamConfig/,/get|post/i,);
Mock.mock(/\/getAccessObjType/,/get|post/i,accessObjType);
Mock.mock(/\/getTypeMap/,/get|post/i,typeMap);
Mock.mock(/\/getColumnType/,/get|post/i,columnType);


Mock.mock(/\/success/,/get|post/i,{"success":true});
Mock.mock(/\/addDept/,/get|post/i,{"success":true,"id":parseInt(Math.random()*10000)});
