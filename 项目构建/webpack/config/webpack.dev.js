const path = require('path')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'), // 此属性可以是字符串或者数组。指定静态资源位置，用于开发阶段
    hot: true,
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        pathRewrite: {
          '^/api': ''
        }, // http://localhost:8080 -> https://api.github.com/users
        changeOrgin: true // 不适用 localhost:8080 作为请求 github 的主机名
      }
    }
  }
})
