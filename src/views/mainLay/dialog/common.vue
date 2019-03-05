<script>
/*const api = 'http://10.19.248.200:32661/DACM/';*/
const api = window.ENV || {
  API_DACM: "http://10.19.248.200:31950/DACM"
};
const skin = window.ENV || {
  "API_SKIN":"http://10.19.248.200:32470",
};
const dam = window.ENV || {
  "API_DAM":"http://10.19.248.200:31777",
};
/*
const api = window.ENV.API_DACM+'';
*/
//校验邮箱
const validateEmail = (rule, value, callback) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (value !== '') {
    if (re.test(value)) {
      callback();
    } else {
      callback(new Error("请输入正确的邮箱"));
    }
  } else {
    callback();
  }

}
//校验是否纯数字
const validateNumber = (rule, value, callback) => {
  const re = /^\+?[1-9][0-9]*$/;
  if (value != '') {
    if (re.test(value)) {
      callback()
    } else {
      callback(new Error("请输入正确的QQ"));
    }
  } else {
    callback();
  }

}
//校验电话号码和座机
const validatePhone = (rule, value, callback) => {
  const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  const isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|17[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
  if (rule.required) {
    if (value == '') {
      callback(new Error("请输入正确的号码"));
    } else {
      if (isPhone.test(value) || isMob.test(value)) {
        callback()
      } else {
        callback(new Error("请输入正确的号码"));
      }
    }
  }
  if (value != '') {
    if (isPhone.test(value) || isMob.test(value)) {
      callback()
    } else {
      callback(new Error("请输入正确的号码"));
    }
  } else {
    callback();
  }

}
export default {
  api, //接口地址
  skin, //换肤地址
  dam,
  validateEmail, //邮箱地址校验
  validateNumber, //数字的校验
  validatePhone, //手机号校验
}

</script>
