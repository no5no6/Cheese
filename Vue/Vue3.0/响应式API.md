# Vue 3.0 响应式 API 理解
> 参考：
> + https://v3.cn.vuejs.org/api/reactivity-api.html
> + https://v3.cn.vuejs.org/api/basic-reactivity.html#isreactive
> + https://zhuanlan.zhihu.com/p/146097763

+ ## 响应式基础 API
  - ### reactive
    + 重新给 `reactive` 对象赋值，丢失响应式
    + `reactive` 返回对象如果结构，会丢失响应式，但可以用把解构的值再 `toRefs` 一下，就变为响应式对象
  - ### readonly
  - ### isProxy
  - ### isReactive
  - ### isReadonly
  - ### toRaw
  - ### markRaw
  - ### shallowReactive
  - ### shallowReadonly
+ ## Refs
  - ### ref
    + 除了在 `template`  中，使用时需要用 `.value` 操作。
    + 如果给 `ref` 传入对象，其内部会直接调用 `reactive` 方法
    + 重新给 `ref` 对象赋值，`ref`的值依然是响应式的
      ```javascript
        const obj = {
          name: 'jack',
          age: 20
        }

        const refObj = ref(obj)
        console.log(refObj.value) // Proxy {name: "jack", age: 20}

        refObj.value= {name: 'tom', age: 12}
        console.log(refObj.value) // Proxy {name: "tom", age: 12}
      ```
    + 创建响应式对象，其作用是把基础数据类型的值包装为引用类型
      ```javascript
        const count = ref(0)
        console.log(count.value) // 0
        count.value++
        console.log(count.value) // 1
      ```
    + `ref` 本质是对数据的拷贝，与原始数据没有引用关系 (示例2 和 示例3 )
      ```javascript 
        const obj = {
          name: 'jack',
          age: 20
        }

        const name = ref(obj.name)
        name.value = 'jerry'

        console.log(name.value) // jerry
        console.log(obj.name)   // jack
      ```

      ```javascript
        const obj = {
          name: 'jack',
          age: 20
        }

        const name = ref(obj.name)
        obj.name = 'tom'

        console.log(name.value) // jack
        console.log(obj.name)   // tom
      ```
  - ### unref
    + 传入一个值，如果是 ref 包装的值，则返回内部值，也就是 `.value` ，否则其参数本身。
      ```javascript
        const text = ref('hey')
        const obj = 'obj'
        
        console.log(unref(text))  // hey
        console.log(unref(obj))   // obj
        console.log(text)         // RefImpl 包装后的引用对象
        console.log(text.value)   // hey
      ```
  - ### toRef
    + 除了在 `template` 中，使用时需要用 `.value` 操作。
    + 为对象上的某一个属性，创建一个 `ref` ，保持对其属性的响应式连接。
      ```javascript
        const state = reactive({
          foo: 1,
          bar: 2
        })

        const fooRef = toRef(state, 'foo')

        fooRef.value++
        console.log(state.foo) // 2

        state.foo++
        console.log(fooRef.value) // 3
      ```
    + 如果对响应对对象中不存在的属性，使用 `toRef` 其也会返回一个可用的 `ref` (具有响应式的值)
      ```javascript
        const obj = {
            name: 'jack',
            age: 20
          }

        const refObj = toRef(obj, 'hobby')
        refObj.value = 'jump'

        console.log(refObj.value)   // jump
        console.log(obj.hobby)      // jump
      ```
    + toRef的本质是引用，与原始数据有关联
      ```javascript
        const obj = {
          name: 'jack',
          age: 20
        }
      
        const name = toRef(obj, 'name')
        obj.name = 'tom'

        console.log(name.value) // tom
        console.log(obj.name)   // tom
      ```

      ```javascript
        const obj = {
          name: 'jack',
          age: 20
        }
      
        const name = toRef(obj, 'name')
        name.value = 'tom'

        console.log(name.value) // tom
        console.log(obj.name)   // tom
      ```
    + **toRef 数据改变，视图不会自动更新**
      ```html
        <html>
          <head>
            <title>vue3.0</title>
          </head>
          <body>
            <div id="app">
              <div>{{obj.name}}</div>
              <div>{{toRefName}}</div>
              <button @click.native="handleClick">按钮</button>
            </div>
            
            <script type="module">
              import { createApp, toRef } from './node_modules/vue/dist/vue.esm-browser.js'

              const change = () => {
                const obj = {
                    name: 'jack',
                    age: 20
                  }
                
                const toRefName = toRef(obj, 'name')
                
                console.log(toRefName.value) // jack
                console.log(obj.name)   // jack

                const handleClick = () => {
                  obj.value = '我被改变了'
                  console.log(toRefName.value) // 我被改变了
                  // 此处视图不会被更新
                }

                return {
                  toRefName,
                  obj,
                  handleClick
                }
              }

              const app = createApp({
                setup() {          
                  return {
                    ...change()
                  }
                }
              })

              app.mount('#app')
            </script>
          </body>
        </html>
      ```
      > 上面例子，在点击按钮后，虽然 `obj` 的 `name` 属性的值被改变，`toRefName` 响应到了 `obj` 的改变，其值也已改变，但是视图模板不会更新
  - ### toRefs
    + 除了在 `template` 中，使用时需要用 `.value` 操作。
  - ### isRef
  - ### customRef
  - ### shallowRef
  - ### triggerRef

+ ## Computed 和 Watch
  - ### computed
  - ### watchEffect
  - ### watch