import request from "@/utils/request";
const env = window.ENV || {
  API_SUER: ""
};

//版本信息
export function getVersionList(url){
  return request({
    url: url,
    method: "get"
  });
}
export function getUserList(query) {
  return request({
    url: env.API_SUER + "/register-server/api/app/findAppAuths",
    method: "get",
    params: query
  });
}
export function addUserInfo(data) {
  return request({
    url: env.API_SUER + "/register-server/api/auth/insertAuths",
    method: "post",
    data: data
  });
}
