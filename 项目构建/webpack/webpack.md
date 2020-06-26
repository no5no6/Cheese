# Webpack
## 核心工作原理
  + 项目中散落着各种各样的代码及资源文件， `webpack` 根据配置文件，找到项目的入口文件，顺着入口文件中的代码，通过代码中 `import`、 `require` 这些语句解析推断出所依赖的资源模块，最后形成一个项目中所有资源模块依赖关系的依赖树，然后 `webpack` 会递归这个依赖树，找到每一个节点所对应的资源文件，再通过配置文件中的 `rules` 属性，去找到每个模块需要执行的加载器，加载这个模块，最后会把加载结果放到指定结果输出文件中。
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

  + ### Loader
    - 项目根目录添加 `webpack.config.js` 。 因为执行在 node 下，所以遵循 Commonjs 规范。
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
      + 在 `js` 代码中引入样式资源文件， `import './main.css'`
      + 在 `webpack.config.js` 中添加配置。
          ```javascript
            // webpack.config.js
            const path = require('path')

            module.exports = {
              entry: './src/main.js', // 指定入口文件位置
              output: {
                filename: 'vendor.js', // 打包后文件名称
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
    - 打包图片或字体
      > 最佳实践：
      > + 大的资源文件使用 `file-loader` 打包。只是将文件放到打包后的文件夹下，然后通过 url 引入。
      > + 小的资源文件使用 `url-loader` 打包。把图片压缩成 `data urls` (图片会被压缩成 base64 格式)，然后在项目中直接引入此 data urls` 资源。
      > + 直接在 `rules` 里配置 `url-loader` 并在 `url-loader` 里的 `options` 里设置了 `limit` 属性， 这样配置后，超过 `limit` 设置大小的资源，会自动隐式调用 `file-loader` 打包。
      + 安装 file-loader , `yarn add file-loader --dev` 。
        >  
      + 安装 url-loader , `yarn add url-loader --dev` 。
      + 在 `webpack.config.js` 中添加配置。
        > 注意： 如果资源文件引入地址不是根目录，需在 `output` 属性中增加 `publicPath` 属性来指定引入资源位置。 
        ```javascript
          // webpack.config.js
          const path = require('path')

          module.exports = {
            entry: './src/main.js', // 指定入口文件位置
            output: {
              filename: 'vendor.js', // 打包后文件名称
              path: path.join(__dirname, 'output'), // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
              publicPath: 'dist/'  // 注意斜线不能省略
            },
            module: {
              rules: [
                {
                  tset: /.css$/,  // 匹配文件规则
                  use: [          // 匹配文件使用的的 loader 插件
                  'style-loader',
                  'css-loader'
                  ]
                },
                //{
                  //test: /.png$/,
                  //use: ['file-loader']
                //}
                {
                  test: /.png$/,
                  use: {
                    loader: 'url-loader',
                    options: {
                      limit: 10 * 1024  // 10kb
                    }
                  }
                }
              ]
            }
          }
        ```
    - 转换 `es6` 为 `es5` 。
      + 安装 babel , `yarn add babel-loader --dev` 。
      + 安装 babel 核心库, `yarn add @/babel/core --dev` 。
      + 处理 `es6` 转换 `es5` 的 babel 插件, `yarn add @/babel/preset-env --dev` 。
      + 在 `webpack.config.js` 中添加配置。
        ```javascript
          // webpack.config.js
          const path = require('path')

          module.exports = {
            entry: './src/main.js', // 指定入口文件位置
            output: {
              filename: 'vendor.js', // 打包后文件名称
              path: path.join(__dirname, 'output'), // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
              publicPath: 'dist/'  // 注意斜线不能省略
            },
            module: {
              rules: [
                {
                  test: /js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@/babel/preset-env']
                    }
                  }
                },
                {
                  tset: /.css$/,  // 匹配文件规则
                  use: [          // 匹配文件使用的的 loader 插件
                  'style-loader',
                  'css-loader'
                  ]
                },
                //{
                  //test: /.png$/,
                  //use: ['file-loader']
                //}
                {
                  test: /.png$/,
                  use: {
                    loader: 'url-loader',
                    options: {
                      limit: 10 * 1024  // 10kb
                    }
                  }
                }
              ]
            }
          }
        ```
    - 转换 html 中的资源文件。
      + 安装 loader , `yarn add html-loader --dev` 。
        > 如果不配置 `options` 属性，默认只转换 `img` 标签中 `src` 属性引用的资源文件。 
      + 在 `webpack.config.js` 中添加配置。 
        ```javascript
          // webpack.config.js
          const path = require('path')

          module.exports = {
            entry: './src/main.js', // 指定入口文件位置
            output: {
              filename: 'vendor.js', // 打包后文件名称
              path: path.join(__dirname, 'output'), // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
              publicPath: 'dist/'  // 注意斜线不能省略
            },
            module: {
              rules: [
                {
                  test: /js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@/babel/preset-env']
                    }
                  }
                },
                {
                  tset: /.css$/,  // 匹配文件规则
                  use: [          // 匹配文件使用的的 loader 插件
                  'style-loader',
                  'css-loader'
                  ]
                },
                //{
                  //test: /.png$/,
                  //use: ['file-loader']
                //}
                {
                  test: /.png$/,
                  use: {
                    loader: 'url-loader',
                    options: {
                      limit: 10 * 1024  // 10kb
                    }
                  }
                },
                {
                  test: /.html$/,
                  use : {
                    loader: 'html-loader',
                    options: {
                      attrs: ['img:src', 'a:href'] // 需要在 html 中转换的属性添加到此处
                    }
                  }
                }
              ]
            }
          }
        ``` 
  + ### Plugin  
    - 清除打包目录插件。
      + 安装 `yarn add clean-webpack-plugin --dev`。
      + 引入 `import { CleanWebpackPlugin } from 'clean-webpack-plugin'`    
        > 多数插件导出都为一个类型，直接用这个类型创建对象实例使用 
      + 在 `webpack.config.js` 中添加配置。 
        ```javascript
          // webpack.config.js

          const path = require('path')
          import { CleanWebpackPlugin } from 'clean-webpack-plugin'

          module.exports = {
            entry: './src/main.js', // 指定入口文件位置
            output: {
              filename: 'vendor.js', // 打包后文件名称
              path: path.join(__dirname, 'output'), // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
              publicPath: 'dist/'  // 注意斜线不能省略
            },
            module: {
              rules: [
                {
                  test: /js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@/babel/preset-env']
                    }
                  }
                },
                {
                  tset: /.css$/,  // 匹配文件规则
                  use: [          // 匹配文件使用的的 loader 插件
                  'style-loader',
                  'css-loader'
                  ]
                },
                //{
                  //test: /.png$/,
                  //use: ['file-loader']
                //}
                {
                  test: /.png$/,
                  use: {
                    loader: 'url-loader',
                    options: {
                      limit: 10 * 1024  // 10kb
                    }
                  }
                },
                {
                  test: /.html$/,
                  use : {
                    loader: 'html-loader',
                    options: {
                      attrs: ['img:src', 'a:href'] // 需要在 html 中转换的属性添加到此处
                    }
                  }
                }
              ]
            },
            plugins: [
              new CleanWebpackPlugin()
            ]
          }
        ```  
    - 复制静态文件
      + 安装 `yarn add copy-webpack-plugin --dev`。
      + 引入 `import { CopyWebpackPlugin } from copy-webpack-plugin` 。
      + 在 `webpack.config.js` 中添加配置。 
        ```javascript
          // webpack.config.js

          const path = require('path')
          import { CleanWebpackPlugin } from 'clean-webpack-plugin'
          import { CopyWebpackPlugin } from copy-webpack-plugin

          module.exports = {
            entry: './src/main.js', // 指定入口文件位置
            output: {
              filename: 'vendor.js', // 打包后文件名称
              path: path.join(__dirname, 'output'), // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
              publicPath: 'dist/'  // 注意斜线不能省略
            },
            module: {
              rules: [
                {
                  test: /js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@/babel/preset-env']
                    }
                  }
                },
                {
                  tset: /.css$/,  // 匹配文件规则
                  use: [          // 匹配文件使用的的 loader 插件
                  'style-loader',
                  'css-loader'
                  ]
                },
                //{
                  //test: /.png$/,
                  //use: ['file-loader']
                //}
                {
                  test: /.png$/,
                  use: {
                    loader: 'url-loader',
                    options: {
                      limit: 10 * 1024  // 10kb
                    }
                  }
                },
                {
                  test: /.html$/,
                  use : {
                    loader: 'html-loader',
                    options: {
                      attrs: ['img:src', 'a:href'] // 需要在 html 中转换的属性添加到此处
                    }
                  }
                }
              ]
            },
            plugins: [
              new CleanWebpackPlugin(),
              new CopyWebpackPlugin({
                //'public/**'
                'public'
              })
            ]
          }
        ```  

    - 通过 Webpack 输出 html (主要解决 `index.html` 的输出)。
      + 安装 `yarn add html-webpack-plugin --dev`。
      + 引入 `import HtmlWebpackPlugin from 'html-webpack-plugin'` 。
      + 添加 `index.html` 模板。
        ```html
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <title>webpack</title>
          </head>
          <body>
            <div>
              <h1><%= htmlWebpackPlugin.options.title %></h1>
            </div>
          </body>
          </html>
        ``` 
        > 通过 `htmlWebpackPlugin` 对象获取配置中的变量参数。
      + 在 `webpack.config.js` 中添加配置。 
        ```javascript
          // webpack.config.js

          const path = require('path')
          import { cleanWebpackPlugin } from 'clean-webpack-plugin'
          import HtmlWebpackPlugin from 'html-webpack-plugin'

          module.exports = {
            entry: './src/main.js', // 指定入口文件位置
            output: {
              filename: 'vendor.js', // 打包后文件名称
              path: path.join(__dirname, 'output') // 路径必须为绝对路径，所以通过 path 对象的 join 方法把相对路径 output 进行转换
              //publicPath: 'dist/'  // 注意斜线不能省略
            },
            module: {
              rules: [
                {
                  test: /js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@/babel/preset-env']
                    }
                  }
                },
                {
                  tset: /.css$/,  // 匹配文件规则
                  use: [          // 匹配文件使用的的 loader 插件
                  'style-loader',
                  'css-loader'
                  ]
                },
                //{
                  //test: /.png$/,
                  //use: ['file-loader']
                //}
                {
                  test: /.png$/,
                  use: {
                    loader: 'url-loader',
                    options: {
                      limit: 10 * 1024  // 10kb
                    }
                  }
                },
                {
                  test: /.html$/,
                  use : {
                    loader: 'html-loader',
                    options: {
                      attrs: ['img:src', 'a:href'] // 需要在 html 中转换的属性添加到此处
                    }
                  }
                }
              ]
            },
            plugins: [
              new CleanWebpackPlugin(),
              new HtmlWebpackPlugin({
                title: '我是 html 标题', // html 中修改标题
                meta: {
                  viewport: 'width=device-width' //html 中添加标签
                },
                template: './src/index.html' // 指定生成 html 使用模板
              })
              // 创建多个 html 就增加 多个 HtmlWebpackPlugin 实例对象
              //new HtmlWebpackPlugin({
                //filename: 'about.html'
              //})
            ]
          }
        ```