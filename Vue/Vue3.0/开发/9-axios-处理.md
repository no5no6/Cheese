# Axios

+ ### 假设服务端返回数据结构为  

  ```json
    { // axios 包装层
      config: {...}
      data: { // 后端返回数据层
        code: 0,
        msg: '',
        data: { // 真正数据层
           name: '',
           age: 18
        }
      },
      headers: {..}
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

    export default < T=any > (config: AxiosRequestConfig) => {
        return request(config).then(res => res.data.data as T);
      }
  ```