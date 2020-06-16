# Grunt 构建项目基础流程  

+ 项目中安装 `grunt` 开发依赖  
  `yarn add grunt --dev`

+ 安装 `load-grunt-tasks` 减少 `loadNpmTasks` 方法在代码中的使用
  `yarn add load-grunt-tasks --dev`

+ 创建 `gruntfile.js` 添加 `load-grunt-tasks` 依赖  
  ```javascript
    const loadGruntTasks = require('load-grunt-tasks')

    module.exports = grunt => {
      grunt.initConfig({

      })

      loadGruntTasks(grunt)
    }
  ```

+ 编译样式文件
  - 依赖安装  
    + `yarn add grunt-sass --dev`
    + `yarn add sass --dev`

  - 代码
    ```javascript
      const sass = require('sass')

      // 此代码添加到 grunt.initConfig方法的参数对象中
      sass: {
        options: {
          implementation: sass
        },
        main: {
          files: {
            'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
          }
        }
      }
    ```
    > implementation: sass，指定 `sass` 编译模块

+ 编译 `js` 文件
  - 依赖安装
    + `yarn add grunt-babel  --dev`
    + `yarn add @babel/core —dev`
    + `yarn add @babel/preset-env —dev`
  
  - 代码
    ```javascript
      babel: {
        options: {
          presets: ['@babel/preset-env']
        },
        main: {
          files: {
            'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
          }
        }
      }
    ```
    > `presets: ['@babel/preset-env']` 属性指定执行模块， `@babel/preset-env` 为全量 es script 最新特性

+ 添加文件修改监听
  - 安装依赖  
    `yarn add grunt-contrib-watch --dev`
  
  - 代码
    ```javascript
      watch: {
        js: {
          files: ['src/assets/scripts/*.js'],
          tasks: ['babel']
        },
        css: {
          files: ['src/assets/styles/*.scss'],
          tasks: ['sass']
        }
      }
    ```

+ 注册 `grunt` 默认任务
  ```javascript
    grunt.registerTask('default', ['sass', 'babel', 'watch'])
  ````
  > `default` 任务为 `grunt` 默认任务，执行该任务直接输入 `yarn grunt`