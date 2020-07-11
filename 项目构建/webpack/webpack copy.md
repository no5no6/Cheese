# 通过 Webpack 实现 简单的 vue-cli

## 配置
  - 项目根目录添加 `webpack.config.js` 。 因为执行在 node 下，所以遵循 Commonjs 规范。
  - 基础配置
    ```javascript
    const path = require('path')

    module.exports = {
      entry: './src/main.js', // 指定入口文件位置
      output: {
        filename: 'vendor.js', // 打包后文件名称
        path: path.join(__dirname, 'output') // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
      }
    }
    ```
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
      > 注意： `vue` 和 `vue-template-compiler` 版本必须一致！！！  
      > 每个 `vue` 包的新版本发布时，一个相应版本的 `vue-template-compiler` 也会随之发布。编译器的版本必须和基本的 `vue` 包保持同步，这样 `vue-loader` 就会生成兼容运行时的代码。这意味着你每次升级项目中的 vue 包时，也应该匹配升级 `vue-template-compiler`。
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
        > 同时依赖 `css-loader`, 需要 `css-loader` 先解析 `css` 文件后，再通过 `vue-style-loader` 用 `style` 标签方式追加到模板中。  
        > 此处也可将 `vue-style-loader` 替换成 `style-loader`
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
  
