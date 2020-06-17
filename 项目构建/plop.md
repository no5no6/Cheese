# `Plop` 
### 小而美的脚手架工具，类似 `Yeoman` 的 `Sub Generator`  

+ 项目中安装 `Plop` 为开发依赖。  
  `yarn add plop --dev`

+ 项目根目录创建 `plopfile.js` 文件。  
  ```javascript
    module.exports = polp => {
      polp.setGenerator('basic', {
        description: 'create a basic vue file',
        prompts: [
          {
            type: 'input',
            name: 'name',
            message: 'your file name?',
            default: 'test'
          },
          {
            type: 'input',
            name: 'path',
            message: 'your file path?',
            default: 'src/components'
          }
        ],
        actions: [
          {
            type: 'add',
            path: '{{path}}/{{name}}.vue',
            templateFile: 'plop_template/views/basic.hbs'
          }
        ]
      })
    } 
  ```  

+ 创建模板文件
  ```html
    <template>
      <div class="layout">
        <h1>{{name}}</h1>
      </div>
    </template>

    <script>
      export default {
        name: '{{name}}',
        compontents: {},
        computed: {},
        data() {
          return {

          }
        },
        methods: {
          initParams() { },
          initConfig() { },
          async initData() { }
        },
        created() {
          this.initParams()
        },
        mounted() {
          this.initConfig()
          this.initData()
        }
      }
    </script>

    <style lang="scss" scoped>
      .layout {
        margin: 20px;
      }
    </style>
  ```

+ 执行构建命令 (`yarn` 会自动去 `node_modules` 里的 `bin` 目录中取找可执行命令)  
`yarn plop basic`