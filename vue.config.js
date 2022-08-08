const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    host: '127.0.0.1',
    port: 5240,
    open: false,
    proxy: {
      '/api': {
        target: 'http://10.20.11.122:9090/',//这里填入你要请求的接口的前缀
        ws: true,//代理websocked
        changeOrigin: true,//虚拟的站点需要更管origin
        // pathRewrite: {
        //   '^/api': ''//重写路径
        // }
      }
    }
  },
  transpileDependencies: true,
  // 关闭语法检测
  lintOnSave: false
})
