# Gulp 构建项目基础流程（ 样式文件：scss ；模板文件：swig） 
+ 项目中安装 `gulp` 为开发依赖。
  项目根目录执行 `yarn add gulp --dev` 。

+ 添加 `gulpfile.js` 文件。

+ 在 `gulpfile.js` 文件中编写整个构建流程
  - 引入 `gulp` 中的方法 。
    ```javascript
      // 引入 gulp 模块中的方法
      const { src, dest, parallel, series, watch } = require('gulp')
    ```
    > + src 用于读取文件。  
    > + dest 用于输出文件。  
    > + parallel 用于异步执行任务。  
    > + series 用于同步执行任务。  
    > + watch 监视一个文件路径通配符，在文件发生变化后来决定执行某一个任务。  

  - 安装 `gulp-load-plugins` 插件，获得 `plugins` 对象。  
    + 安装依赖模块  
      `yarn add gulp-load-plugins --dev`

    + 编写核心处理代码
      ```javascript
        const load_plugins = require('gulp-load-plugins')
        const plugins = load_plugins();
      ```
    > 安装此插件后，用到的 `gulp` 模块可以用 `plugins.xxx` 来使用，不需要单独再 `require` 某一个 `gulp-xxx` 模块。  

  - 编译样式文件
    + 安装依赖模块 
      `yarn add gulp-sass --dev`  

    + 编写核心处理代码
      ```javascript
        const style = () => {
          return src('src/assets/styles/*.scss', { base: 'src' })
            .pipe(plugins.sass({ outputStyle: 'expanded' }))
            .pipe(dest('dist'))
        }
      ```
      > 1. `base` 属性，设置转换时候的基准路基。例如下边示例 `{base: 'src'}` 输出到目标路径为 `dist/assets/styles/xx.css`  
      > 2. 被转换目录中存在 `_` 开头的样式名，为主文件中依赖文件，转换器默认会忽略，不转换。  
      > 3. `{outputStyle: 'expanded'}` 控制转换后文件，结尾 `}` 显示在新的一行。  

  - 编译脚本文件
    + 安装依赖模块 
      - yarn add gulp-babel --dev
      - `yarn add @babel/core --dev` 
      - `yarn add @babel/preset-env --dev`
        > + babel 只是一个平台，需要处理的具体事物，需要加载其具体处理插件来完成。  
        > + @babel/preset-env 为转换 `es6` 特性插件  

    + 编写核心处理代码
    ```javascript
      const script = () => {
        return src('src/assets/scripts/*.js', { base: 'src' })
          .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
          .pipe(dest('dist'))
      }
    ```

  - 编译模板
    + 安装依赖模块  
      `yarn add gulp-swig --dev`

    + 编写核心处理代码
      ```javascript
      // 渲染模板对象
      const data = {
        pkg: require('./package.json'),
        date: new Date()
      }

      const page = () => {
        return src('src/*.html', { base: 'src' })
          .pipe(plugins.swig({ data }))
          .pipe(dest('dist'))
      }
      ```
      > 如果 `src` 的路径需要统配 src 目录下所有html可以写成 `src('src/**/*html')` 。 ** 代表所有目录  

  - 压缩图片
    + 安装依赖模块
    `yarn add gulp-imagemin --dev`

    + 编写核心处理代码
      ```javascript
        const image = () => {
          return src('src/assets/images/**', { base: 'src' })
            .pipe(plugins.imagemin())
            .pipe(dest('dist'))
        }
      ```

  - 打包字体
    + 安装依赖模块  
    同样依赖 `gulp-imagemin` 模块，如果存在svg的字体就会被压缩，如果不存在只会拷贝文件到目标路径。

    + 编写核心处理代码
      ```javascript
        const font = () => {
          return src('src/assets/fonts/**', { base: 'src' })
            .pipe(plugins.imagemin())
            .pipe(dest('dist'))
        }
      ```
  
  - 拷贝其他文件（public目录下）
    + 编写核心处理代码
      ```javascript
        const extra = () => {
          return src('public/**', { base: 'public' })
            .pipe(dest('dist'))
        }pipe(dest('dist'))
        }
      ```
  
  - 删除打包目录（dist目录）
    + 安装依赖模块  
      `yarn add del --dev`
      > `del` 不是 `gulp` 的模块，但是 `del` 操作完成会返回一个 `promise`, 符合 `gulp` 规范, 任务在完成后 `gulp` 可以通过回调标记任务完成。 

    + 编写核心处理代码
      ```javascript
        const del = require('del')

        const clean = () => {
          return del(['dist'])
        }
      ```
  
  - 配置开发服务器
    + 安装依赖模块  
      `yarn add browser-sync --dev`  
    
    + 编写核心处理代码
      ```javascript
        const serve = () => {
          watch('src/assets/styles/*.scss', style)
          watch('src/assets/scripts/*.js', script)
          watch('src/*.html', page)

          watch(
            [
              'src/assets/images/**',
              'src/assets/fonts/**',
              'public/**'
            ], bs.reload
          )

          bs.init(
            {
              server: {
                baseDir: ['dist', 'src', 'public'],
                notify: false,
                files: 'dist/**',
                routes: {
                  '/node_modules': 'node_modules'
                }
              }
            }
          )
        }
      ```
      > - `baseDir` 配置如果为数组，会依次去第一个路径下寻找资源，如果没找到，再去第二个路径找，以此类推。  
      > - `routes` 可配置映射路由地址，如上所示，在 `html` 中引用了 `/node_modules/xx/xx` 路径，运行目录 dist 下并没有这个文件夹，需要将其映射到项目根目录下的 `node_modules` `中。routes` 会优先于 `baseDir` 配置，项目启动后会先去找 `routes` 下的路由配置，如果没有才会去找 `baseDir` 配置 。  
      > - `open` 配置是否启动后自动打开浏览器  
      > - `port` 可指定端口号。  
      > - `notify` 配置是否启动后有通知。  
      > - `files` 监听某路径下文件改变刷新浏览器。  
      > - `serve` 中的 `watch` 方法用来监听文件发生改变执行对应任务。 `image` 、 `font` 、 `public` 三个目录没有对应的 `watch` 方法，而是集中使用了一个`watch` 发生改变后调用 `bs.reload`（重新加载资源文件）,是考虑到开发阶段不需要每次变换都同步一下通篇资源，减少开发阶段的资源消耗，提高开发效率。  

  - 文件引用处理及压缩
    + 安装依赖模块  
      - `yarn add gulp-useref --dev `
      - `yarn add gulp-htmlmin --dev`
      - `yarn add gulp-uglify --dev`
      - `yarn add gulp-clean-css --dev`
      - `yarn add gulp-if --dev`
      > - gulp-useref 把多个 目标目录下不存在的引用文件（例：在 `index.html` 中引用了 `node_modules` 下的一些第三方库）读取后打包成一个 `vendor`文件。  
      > - `gulp-htmlmin` 压缩 `html` 文件。  
      > - `gulp-uglify` 压缩 `js` 文件。  
      > - `gulp-clean-css` 压缩 `css` 文件。  
      > - `gulp-if` 用来在 `gulp` 工作流中做 `if` 判断。  
    
    + 编写核心处理代码
      ```javascript
        const useref = () => {
          return src('temp/*.html', { base: 'temp' })
            .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
            .pipe(plugins.if(/\.js$/, plugins.uglify()))
            .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
            .pipe(plugins.if(/.html$/, plugins.htmlmin(
              {
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true
              }
            )))
            .pipe(dest('dist'))
        }
      ```
      > - `{base: 'temp'}` 可以不写，默认也是基于 `temp` 目录执行操作。
      > - `useref` 处理的是 dist 目录下 `html` 文件，而不是 `src` 下的，因为 `swig` 操作之后的模板，才会生成注释引用，类似下方代码中的注释：  
        >> ```html
        >>  <!-- build:js assets/scripts/vendor.js -->
        >>  <script src="/node_modules/jquery/dist/jquery.js"></script>
        >>  <script src="/node_modules/popper.js/dist/umd/popper.js"></script>
        >>  <script src="/node_modules/bootstrap/dist/js/bootstrap.js"></script>
        >>  <!-- endbuild -->
        >> ```
      > - `uglify` 处理 `js` 代码压缩。
      > - `cleanCss` 处理 `css` 代码压缩。
      > - `htmlmin` 处理 `html` 代码压缩。
      >   + `collapseWhitespace： true` 折叠所有空格。
      >   + `minifyCSS: true` 压缩 `html` 中通过 `style` 标签嵌入到页面的的 `css` 代码
      >   + `minifyJS: true` 压缩 `html` 中通过 `script` 标签嵌入到页面的的 `js` 代码

  - 导出 `gulp` 指令
    + 编写核心处理代码
      ```javascript
        const compile = parallel(style, script, page)

        const build = series(
          clean,
          parallel(
            series(compile, useref),
            image,
            font,
            extra
          )
        )

        const develop = series(compile, serve)

        module.exports = {
          clean,
          develop,
          build
        }
      ```

  - 在 `package.json` 中增加 `script` 命令
    + 编写核心处理代码
      ```javascript
        script: {
          "clean": "gulp clean",
          "build": "gulp build",
          "dev": "gulp develop"
        }
      ```
    > `npm script` 中会自动去找你需要执行的命令在 `node_modules` 中可执行的命令文件，所以直接使用 `yarn clean` 就可以了。