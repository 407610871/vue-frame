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
      args[0].push({
        from: require('path').resolve("env.js"),
        to: require('path').resolve("dist")
      });
      return args;
    })
  },
  devServer: {
    proxy: {
      "/API_GC": {
        target: "http://10.19.248.200:30830",
        pathRewrite: {
          "^/API_GC": ""
        },
        ws: true,
        changeOrigin: true
      },
      "/API_ZC": {
        target: "http://10.19.248.200:31678",
        pathRewrite: {
          "^/API_ZC": ""
        },
        ws: true,
        changeOrigin: true
      },
      "/API_ZL": {
        target: "http://10.19.248.200:31688",
        pathRewrite: {
          "^/API_ZL": ""
        },
        ws: true,
        changeOrigin: true
      },
      "/API_FW": {
        target: "http://10.19.248.200:31289",
        pathRewrite: {
          "^/API_FW": ""
        },
        ws: true,
        changeOrigin: true
      }
    }
  }
};
