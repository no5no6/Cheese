# CSS 预处理器

+ ### 安装
  `yarn add -D sass`

+ ### 使用
  - 创建文件  
    + 全局公共样式文件 styles/common.scss 、 全局 mixin 文件 styles/mixin.scss , 全局变量文件 styles/variables.scss , 全局过渡样式文件 styles/transition.scss  

  - 创建入口文件 `styles/index.scss`  

    ```scss
      // 全局 Sass 变量
      @import './variables.scss';
      // 全局 mixin 
      @import './mixin.scss';
      // 全局公共样式
      @import './common.scss';
      // 全局过渡样式
      @import './transition.scss';
    ```

  - 在 `src/main.ts` 中添加引用  

    ```typescript
      import './styles/index.scss'
    ```

  - 在 `vite.config.ts` 中，为单文件页面注入变量（其他 mixin 等都可以通过此方法注入）

    ```typescript
      import { defineConfig } from 'vite'

      export default defineConfig({
        // ...省略
        
        css: {
          preprocessorOptions: {
            scss: {
              // 配置后，就无需每个文件单独引用，可直接使用全局变量。 注：路径 @ 是配置的路径别名，可用 src 代替
              additionalData: '@import "@/styles/variables.scss";'
            }
          }
        }
      })
    ```