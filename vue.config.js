const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    host: '127.0.0.1',
    port: 5240,
    open: false
  },
  transpileDependencies: true,
  // 关闭语法检测
  lintOnSave: false
})
