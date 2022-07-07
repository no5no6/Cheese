# Pinia

+ ### 安装  
  `yarn add pinia`

+ ### 使用  
  - 主文件 `store/main.ts`  

  ```typescript
    import { defineStore } from 'pinia'

    export const useMainStore = defineStore('main', {
      state: () => {
        return {
          number: 1,
          value: 'good'
        }
      },
      getters: {
        count: (state) => state.number + 1
      },
      actions: {
        async getValue (id: number) {
          this.value = await get(id)
        }
      }
    })

    // 模拟服务端数据请求
    const get = (id: number):Promise<string> => {
      return new Promise((resolve: Function): void => {
        setTimeout(() => resolve(`用户-${id}`), 2000)
      })
    }
  ```

  - 入口文件 `main.ts`  

    ```typescript
      import { createApp } from 'vue'
      import App from './App.vue'
      import { createPinia } from 'pinia'

      createApp(App)
        .use(createPinia())
        .mount('#app')
    ```

  - 使用 `views/home/index.vue`  

    ```typescript
      <template>
        <div>
          <h1>Home</h1>
          <div>value: {{ name }}</div>
          <div>count: {{ mainStore.count }}</div>
          <button @click="change">
            按钮
          </button>
        </div>
      </template>

      <script setup lang="ts">
        import { useMainStore } from '@/store/main'
        import { storeToRefs } from 'pinia'

        const mainStore = useMainStore()
        const { value: name } = storeToRefs(mainStore)

        const change = () => {
          name.value = '加载中...'
          mainStore.getValue(mainStore.number)
        }
        
      </script>
    ```
