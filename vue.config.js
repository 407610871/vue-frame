// this is vue config
// /* eslint-disable */
module.exports = {
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  chainWebpack: config => {
    config
      .plugin("define")
      .when(process.env.NODE_ENV === 'production', plugin => {
        plugin.tap(definitions => {
          definitions[0] = Object.assign(definitions[0], {
            ENV: "ENV"
          });
          return definitions;
        });
      });
    config.plugin("copy").tap(args => {
      args[0].push({ from: require('path').resolve("env.js"), to: require('path').resolve("dist") });
      return args;
    })
  },
  // baseUrl: process.env.NODE_ENV === 'production'? "": "/DAM/",
  // devServer: {
  //   proxy: {
  //     '/DAM': {
  //       target: 'http://127.0.0.1:8080/DAM/',
  //       headers:{
  //         "Cookie":"JSESSIONID=1E7DF00899421C71C388FF7C168C8F47"
  //       },
  //       pathRewrite:{"^/DAM":""},
  //       ws: true,
  //       changeOrigin: true
  //     }
  //   }
  // }
};
