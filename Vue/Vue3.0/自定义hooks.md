# 自定义 `Hooks`
+ ### 定义
  在 `Vue 3` 中自定义 `Hooks` 是一种可用于代码封装和逻辑复用的模式。 其功能类似 `Vue 2` 中的 `mixin`，但较于 `mixin` 来说， `Hooks` 有更强的追溯性，代码的后期维护与易读性上有很大的提升。

+ ### 模板
  - 定义
  ```javascript
    // useCustomHook.js 文件
    export function useCustomHook() {
      // 在这里定义你的逻辑

      // 返回一个对象，通常包括可供组件使用的属性和方法
      return {
        // 属性或状态
        data: /* 初始化的数据 */,

        // 方法
        method: function() {
          // 执行逻辑
        },
      };
    }

  ```
  - 使用

  ``
    <script setup>
      import { useCustomHook } from './useCustomHook';

      const customHookData = useCustomHook();

      // 可以访问 customHookData 中的属性和方法
      const someValue = customHookData.data;
      const someMethod = customHookData.method;

    </script>

    <template>
      <div>
        <p>Data: {{ someValue }}</p>
        <button @click="someMethod">Do Something</button>
      </div>
    </template>
  ```

+ ### 例子
  实现一个 `axios` 的 `hooks` 

  ```typescript 
    //  hooks/useRequest.ts 文件

    import axios from "axios"
    import { onMounted, ref } from "vue"

    export default function <T>(url: string){

      const loading = ref(true)
      const data = ref<T | null>(null)
      const error = ref<string | null>(null)

      const fetchData = async () => {
        try {
          const response = await axios.get(url) 
          data.value = response.data
          error.value = null;
        } catch (e) {
          error.value = (e as Error).message
        } finally {
          loading.value = false;
        }
      }

      // 在组件挂载时触发请求
      onMounted(() => {
        console.log('挂载hook...')
        fetchData();
      });

      return {
        loading,
        data,
        error
      }
    }
  ```

  ```html
    <script setup lang="ts">
      import useRequest from './hooks/useRequest';

      interface IAddress {
        id: number
        address: string
        phone: number
      }

      interface Iproducts {
        id: string
        title: string
        price: number
      }

      /** 返回数据
       * {
          "id": 1,
          "address": "北京市丰台区木樨园",
          "phone": 1232321323
        }
       */
      const {data: d1} = useRequest<IAddress>('/data/address.json')
      
      /** 
       * [
          {
            "id": "008",
            "title": "手机",
            "price": 2000
          },
          {
            "id": "009",
            "title": "平板",
            "price": 3500
          }
        ]
       */
      const {data: d2} = useRequest<Iproducts[]>('./data/products.json')

    </script>

    <template>
      <h1>返回对象：</h1>
      <template v-if="d1">
        <div>序号：{{ d1.id }}</div>
        <div>地址：{{ d1.address }}</div>
        <div>电话：{{ d1.phone }}</div>
      </template>
      <hr/>
      <template v-if="d2">
        <div v-for="item in d2" :key="item.id">
          <div>序号：{{ item.id }}</div>
          <div>名称：{{ item.title }}</div>
          <div>价格：{{ item.price }}</div>
        </div>
      </template>
    </template>
  ```