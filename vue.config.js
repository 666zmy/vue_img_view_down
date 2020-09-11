// vue.config.js
module.exports = {
  // 选项...
  publicPath: '/tools',
  productionSourceMap: false, // 打包后文件变小
  devServer: {
    open: true, // 是否自动弹出浏览器页面
    // host: 'localhost',
    port: '8080', // 自己 本机端口号
    // https: false,
    // hotOnly: false,
    proxy: {
      '/open': {
        target: 'http://192.168.1.194:8070' // API服务器的地址
        // ws: true, // 代理websockets
      }
    }
  }
}
