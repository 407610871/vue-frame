const getters = {
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
 // visitedViews: state => state.tagsView.visitedViews,
 // cachedViews: state => state.tagsView.cachedViews,
  token: state => state.app.token,
 // name: state => state.user.name,
//  introduction: state => state.user.introduction,
//  status: state => state.user.status,
//  roles: state => state.user.roles,
 // setting: state => state.user.setting,
  //addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
};
export default getters;
