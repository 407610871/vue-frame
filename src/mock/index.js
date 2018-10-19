import Mock from "mockjs";
import data from "./../static/json/mainTable.json";

export default Mock;
var mainTableData = data;
function getTableData(options){
  console.log(options);
  return mainTableData;
}
Mock.mock(/\/list\?pageNum=([\d]){1,}&pageSize=([\d]){1,}/,/get|post/i,mainTableData);
