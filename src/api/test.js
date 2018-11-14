import request from "@/utils/request";

const env = window.ENV || {
  API_DACM: "/api"
};

export function fetchList(query) {
  return request({
    url: "/test/list",
    method: "get",
    params: query
  });
}

export function fetchTest(id) {
  return request({
    url: "/test/detail",
    method: "get",
    params: { id }
  });
}
export function createTest(data) {
  return request({
    url: "/test/create",
    method: "post",
    data
  });
}

export function updateTest(data) {
  return request({
    url: "/test/update",
    method: "post",
    data
  });
}
