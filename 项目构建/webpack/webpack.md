# Webpack
## 模块打包工具
  + 可以通过 Loader 代码转换器，打包同时转换文件，解决环境兼容问题。
  + 可以通过代码拆分，定制化打包，把首屏用到的文件打包到一起，其他文件使用渐进式方式加载（用到了再加载）。
  + 支持模块化载入资源模块，如 css（`import './my_csss'`）, 图片等。

## 安装  
  + `yarn add webpack webpack-cli --dev`

## 使用 （webpack 4.0 之后支持零配置打包）
  + `yarn webpack`

## 工作模式 （webpack 4.0 z之后支持）
  + 在 `webpack.config.js` 添加 `mode` 属性。
  + 预设了 3 中模式 `development`、 `production`、 `node` 。

## 配置
  + 项目根目录添加 `webpack.config.js` 。 因为执行在 node 下，所以遵循 Commonjs 规范。
    - 打包 javascript 文件
      ```javascript
      // webpack.config.js
      const path = require('path')

      module.exports = {
        entry: './src/main.js', // 指定入口文件位置
        output: {
          filename: 'vendor.js' // 打包后文件名称
          path: path.join(__dirname, 'output') // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
        }
      }
      ```
    - 打包 css 文件
      + 安装打包样式文件的 loader ，
        - `css-loader` 用于打包css文件，执行 `yarn add css-loader --dev` 。 
        - `style-loader` 用于将打包完的 `css` ，用 `style` 标签的方式加载到 `html` 中，执行 `yarn add style-loader --dev`。
        - 在 `js` 代码中引入样式资源文件， `import './main.css'`
        - 在 `webpack.config.js` 中添加配置。
          ```javascript
            // webpack.config.js
            const path = require('path')

            module.exports = {
              entry: './src/main.js', // 指定入口文件位置
              output: {
                filename: 'vendor.js' // 打包后文件名称
                path: path.join(__dirname, 'output') // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
              },
              module: {
                rules: [
                  {
                    tset: /.css$/,  // 匹配文件规则
                    use: [          // 匹配文件使用的的 loader 插件
                    'style-loader',
                    'css-loader'
                    ]
                  }
                ]
              }
            }
          ``` 
          > 注意: use 中执行时从后往前执行，所以第一个要执行的 loader 要放到数组最后。

