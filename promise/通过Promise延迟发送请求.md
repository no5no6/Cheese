# 通过 Promise 特性，延迟发送请求
+ ### 使用场景
  - 应用中多个请求并发时 `token` 过期，需要执行刷新 `token api` 后，获取新 `token` 再发送所有请求。
+ ### 解决方案
  - 结合 axios 处理
    ```javascript
      import qs from 'qs'
      import axios from 'axios'
      import store from '@/store'

      const request = axios.create({
      })

      function refreshToken () {
        return axios.create()({
          method: 'POST',
          url: '/refreshToken',
          data: qs.stringify({
            // refresh_token 只能使用1次
            refreshToken: store.state.user.refreshToken
          })
        })
      }

      // 响应拦截器
      let isRef = false // 控制刷新 token 的状态
      let requests = [] // 存储因过期刷新 token 期间发过来的请求

      request.interceptors.response.use(function (response) {
        return response
      }, async function (error) {
        if (error.response) { 
            // 刷新 token
            if (!isRef) {
              isRef = true // 开启刷新状态
              // 尝试刷新获取新的 token
              return refreshToken().then(res => {
                if (!res.data.success) {
                  throw new Error('刷新 Token 失败')
                }

                // 刷新 token 成功了
                store.commit('setUser', res.data.content)
                // 把 requests 队列中的请求重新发出去
                requests.forEach(cb => cb())
                // 执行完所有队列中请求后重置 requests 数组
                requests = []
                return request(error.config)
              }).catch(err => {
                console.log(err)
                store.commit('setUser', null)
                redirectLogin()
                return Promise.reject(error)
              }).finally(() => {
                isRef = false // 重置刷新状态
              })
            }

            // 刷新状态下，把请求挂起放到 requests 数组中
            return new Promise(resolve => {
              requests.push(() => {
                resolve(request(error.config))
              })
            })
        } else if (error.request) {
          console.log('请求超时，请刷新重试')
        } else { 
          console.log(`请求失败：${error.message}`)
        }

        // 把请求失败的错误对象继续抛出，扔给上一个调用者
        return Promise.reject(error)
      })

      export default request
    ```
    > + `refreshToken` 方法中的请求不使用 `request` 发送，而是使用 `axios` 新创建一个对象发送，是为了在一些情况下避免死循环调用。重新创建的 `axios` 对象不会受 `request` 拦截器控制。
    > + 通过 `return` 一个 `Promise` 来阻止其他请求执行，把被阻止的请求存储到 `request` 队列中，值为 `resolve(request(error.config))` 方法，其中 `error.config` 就是本次请求的配置信息。待 `token` 刷新完毕后遍历执行 `request` 队列中的所有 `resolve` 方法。最后清空 `request` 队列。