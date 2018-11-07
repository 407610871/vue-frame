// this is vue config
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://10.37.146.46/circles",
        headers: {
          Cookie: "JSESSIONID=CD4E04BAD7C48B101F193E540000F3A6"
        },
        pathRewrite: { "^/api": "" },
        ws: true,
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin("define")
      .when(process.env.NODE_ENV === "production", plugin => {
        plugin.tap(definitions => {
          definitions[0] = Object.assign(definitions[0], {
            ENV: "ENV"
          });
          return definitions;
        });
      });
    config.plugin("copy").tap(args => {
      args[0].push({
        from: require("path").resolve("env.js"),
        to: require("path").resolve("dist")
      });
      return args;
    });
    config.module
      .rule("xml")
      .test(/\.xml$/)
      .use("xml-loader")
      .loader("xml-loader")
      .end();
  }
};
