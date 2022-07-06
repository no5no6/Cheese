# Vue Router

+ ### 安装
  `yarn add vue-router@4`

+ ### 使用
  - 路由主文件 `router/index.ts`

    ```typescript
      import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

      const routes: RouteRecordRaw[] = [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/home/index.vue')
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/login/index.vue')
        }
      ]

      const router = createRouter({
        routes,
        history: createWebHashHistory()
      })

      export default router
    ```

  - 挂载路由 `main.ts`  

    ```typescript
      import { createApp } from 'vue'
      import App from './App.vue'
      import router from './router'

      createApp(App)
        .use(router)
        .mount('#app')
    ```

  - 配置路由渲染入口 `App.vue`  

    ```html
      <template>
        <router-view />
      </template>
    ```