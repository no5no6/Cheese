# Axios

+ ### 假设服务端返回数据结构为  

  ```json
    { // axios 包装层
      config: {...}
      data: { // 后端返回数据层
        code: 0,
        msg: '',
        data: { // 真正数据层
           person_name: '张三',
           person_age: 18,
           hobby: ['足球', '篮球', '羽毛球']
        }
      },
      headers: {..}
    }
  ```

+ ### 因服务端数据命名为下划线，并不符合 `standard` 的驼峰命名规范，所以需要重写下 `api` 目录下 `eslint` 规范, 保证 `api` 目录下的所有文件，不校验变量命名。打开 `.eslintrc.js` 文件，添加如下配置：

  ```javascript
    module.exports = {
      // 其他配置...
      overrides: [
        {
          files: ['src/api/**/*.ts'],
          rules: {
            'camelcase': 'off'
          }
        }
      ]
    }
  ```

+ ### `utils/request.ts` 配置  

  ```typescript
    import axios， { AxiosRequestConfig } from 'axios'

    const request = axios.create({
      baseURL: 'https://api.example.com'
    });

    // Add a request interceptor
    request.interceptors.request.use(function (config) {
        // Do something before request is sent
        return config;
      }, function (error) {
        // Do something with request error
        return Promise.reject(error);
      });

    // Add a response interceptor
    request.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      });

    export default <T=any> (config: AxiosRequestConfig) => {
      return request(config).then(res => res.data.data as T);
    }
  ```
+ ### `api/types/person.ts` 创建服务端返回数据的类型

  ```typescript
    export interface IPerson {
      person_name: string;
      person_age: number;
      hobby: string[];
    }
  ```

+ ### `api/person.ts` 创建接口

  ```typescript
    import request from '@/utils/request'
    import { IPerson } from './types/person'

    export const getPerson = () => {
      return request<IPerson>({
        url: '/person',
        method: 'get'
      });
    }
  ```

+ ### `user/index.vue` 创建组件

  ```html
    <template>
      <div>{{ hobby }}</div>
    </template>

    <script lang='ts' setup>
      import { getPerson } from '@/api/person'
      import type { IPerson } from '@/api/types/person'
      import { onMounted, ref } from '@vue/runtime-core'

      const hobby = ref<IPerson['hobby']>([])

      onMounted(() => {
        getPerson().then(data => {
          hobby.value = data.hobby
        })
      })
    </script>
  ```

  > 因为使用了 `setup` 语法糖，语法糖默认所有内容都是值类型，会导致引入 `typescript` 类型文件报错，所以在 `import` 后添加了 `type` 关键字，指定了其不是值类型，而是类型文件。