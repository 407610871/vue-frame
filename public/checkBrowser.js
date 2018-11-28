function checkBrowserVersion() {
    var userAgent = navigator.userAgent.toLowerCase();
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("msie") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    var arr = userAgent.split(' ');
    var chromeVersion = '';
    var computerBit = '';
    var needDownLoad = false;
    if (userAgent.indexOf("win32") >= 0 || userAgent.indexOf("wow32") >= 0) {  //判断电脑为64位还是32位
        computerBit = 32;
    }
    if (userAgent.indexOf("win64") >= 0 || userAgent.indexOf("wow64") >= 0) {
        computerBit = 64;
    }
    if(isIE || isEdge ) {
        needDownLoad = true;
    } else if(isIE11) {
        needDownLoad = false;
    } else{
        for(var i=0;i < arr.length;i++){         //判断浏览器版本
            if(/chrome/i.test(arr[i])){
                chromeVersion = Number(arr[i].split('/')[1].split('.')[0]);
                if(chromeVersion <= 35){
                    needDownLoad = true;
                }
            }
        }
    }
    return [needDownLoad,computerBit];
}
var browser = checkBrowserVersion();
if(browser[0]){
    location.href = '/DownLoadBrowser.html';
}