# 添加组件库 element-plus

+ ### 安装

  ```bash 
    yarn add element-plus
  ```
+ ### 使用
  - 创建 `/src/plugins/element-plus.ts` 文件， 添加如下代码：
    ```typescript
      import ElementPlus from 'element-plus'
      import 'element-plus/dist/index.css'
      import { App } from 'vue'

      export default {
        install (app: App) {
          app.use(ElementPlus)
        }
      }
    ```

    > `app` 对象为 `Vue` 初始化时传入的实例对象， 使用 `app.use()` 直接挂载组件库。
  
  - 在 `/src/main.ts` 文件中挂载自定义插件 `elementPlus`
    ```typescript
      import { createApp } from 'vue'
      import App from './App.vue'
      import router from './router'
      import { createPinia } from 'pinia'
      import './styles/index.scss'
      import elementPlus from './plugins/element-plus'

      createApp(App)
        .use(createPinia())
        .use(router)
        .use(elementPlus)  // 添加此行代码
        .mount('#app')
    ```

