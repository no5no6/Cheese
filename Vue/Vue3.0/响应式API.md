# Vue 3.0 响应式 API 理解
+ ## 响应式基础 API
  - ### reactive
    + 重新给 `reactive` 对象赋值，丢失响应式
    + `reactive` 返回对象如果解构，会丢失响应式，但可以将需要解构的对象再 `toRefs` 一下，解构后的值就可以变为响应式对象
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
    + **`toRef` 数据改变，视图不会自动更新**
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

              const useChange = () => {
                const obj = {
                    name: 'jack',
                    age: 20
                  }
                
                const toRefName = toRef(obj, 'name')
                
                console.log(toRefName.value) // jack
                console.log(obj.name)   // jack

                const handleClick = () => {
                  obj.name = '我被改变了'
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
                    ...useChange()
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
    + 使用时需要用 `.value` 操作
    + `toRefs` 参数必须为一个 `reactive` 对象
    + 遍历对象的每个 `key` 进行 `toRef` 处理，并保证处理后的每一个 `property` 对原对象 `property` 的引用关系。(参数可以是普通对象)
    
      ```javascript
        const state = reactive({
          foo: 1,
          bar: 2
        })

        const stateAsRefs = toRefs(state)

        // ref 和原始 property 已经“链接”起来了
        state.foo++
        console.log(stateAsRefs.foo.value) // 2

        stateAsRefs.foo.value++
        console.log(state.foo) // 3
      ```
    + **同 `toRef` 一样，数据改变，视图不会自动更新**
      ```html
        <html>
          <head>
            <title>vue3.0</title>
          </head>
          <body>
            <div id="app">
              <div>{{obj.name}}</div>
              <div>{{refsObj.name.value}}</div>
              <button @click.native="handleClick">按钮</button>
            </div>
            
            <script type="module">
              import { createApp, toRefs } from './node_modules/vue/dist/vue.esm-browser.js'

              const useChange = () => {
                const obj = {
                    name: 'jack',
                    age: 20
                  }
                
                const refsObj = toRefs(obj)
                
                console.log(refsObj.name.value) // jack
                console.log(obj.name)   // jack

                const handleClick = () => {
                  obj.name = '我被改变了'
                  console.log(obj.name)
                  console.log(refsObj.name.value) // 我被改变了
                  // 此处视图不会被更新
                }

                return {
                  refsObj,
                  obj,
                  handleClick
                }
              }

              const app = createApp({
                setup() {          
                  return {
                    ...useChange()
                  }
                }
              })

              app.mount('#app')
            </script>
          </body>
        </html>
      ```
  - ### isRef
    + 检查一个值是否是 `ref`，根据 `__v_isRef` 属性值来确定

  - ### customRef
    + 创建一个自定义 `ref`，用户手动操作 `track` 和 `trigger`
      - `track` 函数用来跟踪收集依赖 `deps`（一般有 `effect` 、 `computed` 、 `watch` 的回调函数）
      - `trigger` 函数用来通知 `deps` , 通知依赖此状态的对象更新
        -  执行流程：`effect/computed` 函数执行 -> 代码响应式数据，调用到get,依赖收集 -> 当有 `set` 时，依赖集更新
        ```javascript 
          const count = reactive({ num: 0 })
          // effect默认没带lazy参数，先会执行effect
          effect(() => {
            // effect用到对应响应式数据时，count.num get就已经收集好了该effect依赖
            // 同理，使用computed api时，
            console.log(count.num)
          })
          // computed依赖于count.num,也意味着该computed是count.num的依赖项
          const computedNum = computed(() => 2 * count.num)
          count.num = 7
        ```
  - ### shallowRef
  - ### triggerRef

+ ## Computed 和 Watch
  - ### computed
  - ### watchEffect
  - ### watch

> 参考：
> + https://v3.cn.vuejs.org/api/reactivity-api.html
> + https://lq782655835.github.io/blogs/vue/vue3-code-2.reactive.html#_3-track-trigger
> + https://zhuanlan.zhihu.com/p/146097763