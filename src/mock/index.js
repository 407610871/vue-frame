import Mock from "mockjs";
import data from "./../static/json/mainTable.json";
import accessSourceType from "./../static/json/accessSourceType.json";
import accessDataSource from "./../static/json/accessDataSource.json";
import accessObjType from "./../static/json/accessObjType.json";
import typeMap from "./../static/json/typeMap.json";
import columnType from "./../static/json/columnType.json";
import configData from "./../static/json/config.json";
export default Mock;
var mainTableData = data;
function getTableData(options){
  setTimeout(function(){
    return mainTableData;
  },10)
}
Mock.mock(/\/list\?[a-z0-9A-Z=,]{0,}/,/get|post/i,mainTableData);
Mock.mock(/http:\/\/localhost:8080\/list\?[*]{0,}/,/get|post/i,mainTableData);

Mock.mock(/\/getAccessSourceType/,/get|post/i,accessSourceType);

Mock.mock(/\/getAccessDataSource/,/get|post/i,accessDataSource);

Mock.mock(/\/getExchangePlatform/,/get|post/i,accessDataSource);

Mock.mock(/\/getConfig/,/get|post/i,configData);

Mock.mock(/\/getAccessObjType/,/get|post/i,accessObjType);
Mock.mock(/\/getTypeMap/,/get|post/i,typeMap);
Mock.mock(/\/getColumnType/,/get|post/i,columnType);
