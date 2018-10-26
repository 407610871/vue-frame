// this is vue config
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.37.146.46/circles',
        headers:{
          "Cookie":"JSESSIONID=CD4E04BAD7C48B101F193E540000F3A6"
        },
        pathRewrite:{"^/api":""},
        ws: true,
        changeOrigin: true
      }
    }
  }
}
