// IP地址验证
export function isvalidIpAddress(str) {
  //const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(str);
}

//服务ID验证
export function isvalidInterfaceId(val) {
  var pureNumberReg = /^([0-9]\d*)+$/;
  var specialBeginReg = /^([_-])+([a-zA-Z0-9]*)$/; // _开头
  var nomalReg = /^([a-zA-Z0-9_-])+$/;
  var capitalReg = /^(.*[A-Z]+.*)+$/;
  if(val[0] == "_"||val[0] == "-"){
    return "error";
  }
  if (pureNumberReg.test(val)) {
    return "error";
  }
  if (specialBeginReg.test(val)) {
    return "error";
  }
  if (!nomalReg.test(val)) {
    return "error";
  }
  if(capitalReg.test(val)){
    return "error";
  }
}

//应用系统名称验证
export function isvalidSystemName(val) {
  var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"); 
  return reg.test(val);
}

// URL验证
export function isvalidUrl(value) {
  if (!value) {
    return "right";
  }
  var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
  if (!reg.test(value)) {
    return "error";
  }
}

export function dataToString(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString();
  var day = date.getDate().toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  var dateTime = year + "-" + month + "-" + day;
  return dateTime;
}
export function dateTimeToString(dateTime) {
  // let dateTimeStr = dateTime;
  // let dateTimeStr1 = dateTimeStr.split("t")[0];
  // let dateTimeStr2 = dateTimeStr.split("t")[1];
  // let dateTimeStr3 = dateTimeStr2
}


export function trimSpace(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "" || typeof array[i] == "undefined") {
      array.splice(i, 1);
      i = i - 1;
    }
  }
  return array;
}

//判断数组是否重复
export function isRepeat(arr) {
  var hash = {};
  for (var i in arr) {
    if (hash[arr[i]]) return true;
    hash[arr[i]] = true;
  }
  return false;
}

//判断数值是否在数组里面
//var a = Array(1,2,3,4,5);
export function isInArray(search, array) {
  for (var i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;
}

export function isHasElement(searchId, array) {
  for (var i in array) {
    if (array[i].id == searchId) {
      return true;
    }
  }
  return false;
}

export function getTime(str){
  return str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate();
}
