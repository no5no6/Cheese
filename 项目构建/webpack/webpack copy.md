# 通过 Webpack 实现 简单的 vue-cli

## 配置
  + ### webpack.common.js
    - 项目根目录添加 `webpack.config.js` 。 因为执行在 node 下，所以遵循 Commonjs 规范。
    - 基础配置
      ```javascript
      const path = require('path')

      module.exports = {
        entry: './src/main.js', // 指定入口文件位置
        output: {
          filename: 'js/[name].[contenthash:6].js', // 打包后文件名称
          path: path.join(__dirname, 'output') // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
        }
      }
      ```
      > + `[name]` 占位符的值为文件名。  
      > + `[contenthash:6]` 占位符的值为 6 位的 hash 值， 只有文件内容改变 hash 值才会改变。 同时还有另外2种模式 `hash` 、`chunkhash`  。
    - 打包 `less` 文件
      + `yarn add less --dev`
      + `yarn add less-loader --dev`
      + 在 `webpack.config.js` 中添加配置。
          ```javascript
            module.exports = {
              // ..省略代码
              module: {
                rules: [
                  {
                    test: /\.less$/,
                    use: [
                      {
                        loader: 'style-loader'
                      }, 
                      {
                        loader: 'css-loader'
                      }, 
                      {
                        loader: 'less-loader'
                      }
                    ]
                  }
                ]
              }
            }
          ```
    - 打包 `vue` 文件
      + `yarn add vue-loader --dev` 
      + `yarn add vue-template-compiler --dev` 
        > - 注意： `vue` 和 `vue-template-compiler` 版本必须一致！！！  
        > - 每个 `vue` 包的新版本发布时，一个相应版本的 `vue-template-compiler` 也会随之发布。编译器的版本必须和基本的 `vue` 包保持同步，这样 `vue-loader` 就会生成兼容运行时的代码。这意味着你每次升级项目中的 vue 包时，也应该匹配升级 `vue-template-compiler`。
        - 在 `webpack.config.js` 中添加配置。
          ```javascript
            const VueLoaderPlugin = require('vue-loader/lib/plugin') // 必须加

            module.exports = {
              // ...省略代码
              module: {
                rules: [
                  // ...省略代码

                  {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                  }
                ]
              },
              plugins: [
                new VueLoaderPlugin() // 必须加
              ]
            }
          ```
          > `VueLoaderPlugin` 插件，作用为将每一个单文件 `vue`，都应用一遍 `loader` 的规则。
      + 处理 `.vue` 文件中的 `<style>` 标签编译
        - `yarn add vue-style-loader --dev`
        - `yarn add css-loader --dev`
          > + 同时依赖 `css-loader`, 需要 `css-loader` 先解析 `css` 文件后，再通过 `vue-style-loader` 用 `style` 标签方式追加到模板中。  
          > + 此处也可将 `vue-style-loader` 替换成 `style-loader`
        - 在 `webpack.config.js` 中添加配置。
          ```javascript
            module.exports = {
              // ...省略代码
              module: {
                
                rules: [
                  // ...省略代码

                  // 它会应用到普通的 `.css` 文件
                  // 以及 `.vue` 文件中的 `<style>` 块
                  {
                    test: /\.css$/,
                    use: [
                      'vue-style-loader',
                      'css-loader'
                    ]
                  },
                ]
              }
            }
          ```
      + 处理 `.vue` 文件中的 `<script>` 标签内代码，ES版本编译
        - 安装 babel 核心插件, `yarn add @/babel/core --dev`。
        - 处理 `es6` 转换 `es5` 的 babel ES 新特性 插件, `yarn add @/babel/preset-env --dev` 。
        - 安装 babel-loader , `yarn add babel-loader --dev` 。
        - 在 `webpack.config.js` 中添加配置。
          ```javascript
            module.exports = {
              // ...省略代码
              module: {
                
                rules: [
                  // ...省略代码

                  // 它会应用到普通的 `.js` 文件
                  // 以及 `.vue` 文件中的 `<script>` 块
                  {
                    test: /\.js$/,
                    loader: 'babel-loader'
                  }
                ]
              }
            }
            ```
    - 清除打包文件
      + `yarn add clean-webpack-plugin --dev`
      + 在 `webpack.config.js` 中添加配置。
        ```javascript
          const { CleanWebpackPlugin } = require('clean-webpack-plugin')

          module.exports = {
            // ...省略代码
            plugins: [
              // ...省略代码
              new CleanWebpackPlugin()
            ]
          }
        ```

    - 生成 html 入口
      + `yarn add html-webpack-plugin --dev`
      + 在 `webpack.config.js` 中添加配置。
        ```javascript
          // ...省略代码
          const webpack = require('webpack')
          const HtmlWebpackPlugin = require('html-webpack-plugin')

          module.exports = {
            // ...省略代码
            plugins: [
              // ...省略代码
              new HtmlWebpackPlugin({
                template: './public/index.html',
                title: 'My vue-cli'
              }),
              new webpack.DefinePlugin({
                BASE_URL: '"/"'
              })
            ]
          }
        ```
        > + `HtmlWebpackPlugin` 中， `title` 是为了给 index.html 中的模板赋值 `<%= htmlWebpackPlugin.options.title %>`  
        > + `new webpack.DefinePlugin` 设置环境变量， 必须设置 `BASE_URL`。注意： `'"/"'` 如果需要一个字符串的值，需要写2层引号。
    - 打包图片
      + `yarn add url-loader --dev`
      + `yarn add file-loader --dev` 
      + 在 `webpack.config.js` 中添加配置。
        ```javascript
          module.exports = {
            // ...省略代码
            module: {
              rules: [
                // ...省略代码
                {
                  test: /\.(png|jpg|jpeg|gif)$/,
                  use: {
                    loader: 'url-loader',
                    options: {
                      esModule: false,
                      name: 'img/[name].[contenthash:6].[ext]',
                      limit: 8 * 1024
                    }
                  }
                }
              ]
            }
          }
          ```
          > + `esModule: false` 原因为 `webpack` 遵循 commonjs 规范，url-loader 导出一个 `default` ，为 esModule 规范，所以导致图片路径为一个 Object 。因此需要关闭 `url-loader` esModule 模式。  
          > + `[ext]` 的值为当前文件的扩展名。  
          > + `limit` 单位为 kb。  
          > + 代码里未出现 `file-loader` ，但是在图片超过 `limit` 限制的时候， `url-loader` 会自动 fallback `file-loader` 。
  
  + ### webpack.dev.js
    - 设置 webpack 模式 `mode` 。
    - 设置 source-map 模式 `devtool` 。
      > `cheap-module-eval-source-map` 模式是为经过 Loader 处理的源码，方便开发阶段调试。
    - 设置本地运行服务器 `devServer` 。
      > + `contentBase` 为静态资源文件读取目录，可配多个。因为为了节省效率，开发阶段不使用 `CopyWebpackPlugin` 插件拷贝静态文件，所以，需要更改读取静态文件的目录。 
      > + `proxy` 为本地请求设置代理，解决跨域问题，例子中假设请求地址是 `github` 。
    - 在 `webpack.config.js` 中添加配置。
      ```javascript
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
      ```
      > `webpack-merge` 和 `Object.assign()` 区别，前者可以做到同名属性，值为数组，可以在原有值后增加值，后者为完全覆盖。

  + ### webpack.prod.js  
    - 设置 webpack 模式 `mode` 。
    - 设置 source-map 模式 `devtool` 。
    - 使用 `copy-webpack-plugin` 插件拷贝静态文件到打包目录 。
    - 在 `webpack.config.js` 中添加配置。 
    ```javascript
      const path = require('path')
      const common = require('./webpack.common')
      const { merge } = require('webpack-merge')
      const CopyWebpackPlugin = require('copy-webpack-plugin')

      module.exports = merge(common, {
        mode: 'production',
        devtool: 'none',
        plugins: [
          new CopyWebpackPlugin({
            patterns: [
              {
                from: path.join(__dirname, '/public'),
                to: path.join(__dirname, '/dist')
              }
            ]
          })
        ]
    ```
  + ### `package.json` 中添加 `script` 命令。
    ```json
      {
        "scripts": {
          "serve": "webpack-dev-server --config webpack.dev.js --open",
          "build": "webpack --config webpack.prod.js",
          "lint": "eslint . --fix"
        }
      }
    ```  