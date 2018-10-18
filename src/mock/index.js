import Mock from "mockjs";
import data from "./../static/json/mainTable.json";

export default Mock;
var mainTableData = data;
Mock.mock(/\/list\?pageNum=([\d]){1,}&pageSize=([\d]){1,}/,/get|post/i,mainTableData);
