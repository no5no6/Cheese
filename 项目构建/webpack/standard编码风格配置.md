# standard 编码风格

## VS Code 配置
+ VS Code 安装 插件。
  - `JavaScript Standard Style` 校验预发格式。
  - `JavaScript standardjs styled snippets` standard 风格代码补全（可选）。  

  > 或通过 Prettier 配置 Standard 风格。  
  > 代码补全也可选择安装 vue 、react 相关插件。

+ 在项目中安装 `JavaScript Standard Style` 插件依赖模块。
  - 核心模块 `yarn add standard --dev` 。
  - 检测 `Vue` 文件模块 `yarn add eslint-plugin-html --dev` 。
   
  > 上述模块也可安装到全局依赖中。

+ 修改 VS Code `settings.json` 配置文件。
  ```json
    {
      "javascript.validate.enable": false,  // 关闭原本的 javascript 校验。
      "standard.autoFixOnSave": true,       // 保存代码自动修复。
      "standard.validate": [
        "javascript",
        "javascriptreact",  // 验证新语言
        {
          "language": "html",
          "autoFix": true   // 自动修复新语言
        }
      ],
      "standard.options": {
        // 定义项目中的全局变量
        "globals": [      
          "__webpack_public_path__",
          "sessionStorage",
          "localStorage"
        ],
        // 忽略检查目录与文件
        "ignore": [
          "node_modules/**",
          "dist/**"
        ],
        // 语法解析器
        "parser": "babel-eslint",
        // 插件 eslint-plugin-html
        "plugins": [
          "html"
        ]
      },
      // 将 vue 文件关联为 html，用于 eslint-plugin-html 校验。
      "files.associations": {
        "*.vue": "html"
      },
    }
  ```

## 执行 `git commit` 命令时，使用 `lint` 检查 `Standard` 规范的配置。
+ 配置 Git Hook 保证项目 `git commit` 执行 `lint` 检查。
  - 安装依赖模块
    + `yarn add husky --dev` 。
    + `yarn add lint-staged --dev` 。
  - 创建 `.huskyrc` 文件。
    ```json
      {
        "hooks": {
          "pre-commit": "lint-staged"
        }
      }
    ```
    > 如果想保留外侧手动可以 lint 检查，可以将 `pre-commit` 的值配置为 `package.json` 中 `script` 对应的命令。如： `npm run precommit-lint` 。
  - `package.json` 中增加 `lint-staged` 配置。
    ```json
      "lint-staged": {
        "src/**/*.{js,vue}": [
          "yarn lint",
          "git add"
        ]
      }, 
    ```
    > 执行 `lint` 命令的时候，注意使用的工具是否安装，可以使用 `vue-cli-service lint`、 `npm lint` 等等。
+ 配置 es-lint 
  - 安装依赖模块。
    + `yarn add eslint-config-standard --dev`。
    + `yarn add eslint-config-vue-standard --dev`。 （可选。用于 vue 文件校验）
  - 创建 `.eslintrc.js` 文件。
    ```json
      module.exports = {
        "root": true,  // 限制 eslint 查找配置文件，加上此选项， eslint 一旦找到 root 为 true 的配置文件，便会停止继续虚招
        "env": {
          "node": true  // 运行环境。对应环境枚举配置 https://eslint.org/docs/user-guide/configuring#specifying-environments
        },
        "globals": {
          "echarts": true // 全局变量
        },
        "extends": ["vue-standard"], // 继承的风格，继承一些共享配置
        "ignorePatterns": ["node_modules/**", "dist/**"], // 需排除的文件
        // 规则
        "rules": {
          "no-console": "off",
          "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
          "no-control-regex": "off",
          "no-undef": "off",
        },
        // 语法解析
        "parserOptions": {
          "parser": "babel-eslint"
        }
      }
    ```
    > 可使用 `yarn --init` 初始化此文件。

  