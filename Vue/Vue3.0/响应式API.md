# Vue 3.0 响应式 API 整理
+ ## 响应式数据
  - 响应式数据，就是当数据对象改变时（ `set` ），所有引用该数据的地方，都会自动执行响应的逻辑（副作用）。比如 `effect/computed/watch` 等， `js api` 用到数据对象，则执行对应的回调函数。而视图 `view` 用到数据对象时，则重新 `vnode diff`，最后自动进行dom更新（即视图更新）。  
  - Vue3响应式源码跟 `Vue2.x` 源码流程基本一致，依然是利用在使用响应式数据时，执行数据的 `get` 方法，收集相关的依赖（依赖可以是回调函数，如 `effect/computed` ，也可以是视图自动更新）；在数据进行变化的时候，执行数据的 `set` 方法，把收集的依赖都依次执行。
+ ## 响应式基础 API
  - ### reactive
    + 重新给 `reactive` 对象赋值，丢失响应式
    + `reactive` 返回对象如果解构，会丢失响应式，但可以将需要解构的对象再 `toRefs` 一下，解构后的值就可以变为响应式对象
  - ### readonly
    + 当需要提供给用户只读数据的时候，可以使用此方法。只读是深层的，任何被嵌套的属性同样也为只读
      ```javascript
        const original = reactive({ count: 0 })
        const copy = readonly(original)

        watchEffect(() => {
          // 用于响应性追踪
          console.log(copy.count)
        })

        // 变更 original 会触发依赖于副本的侦听器
        original.count++

        // 变更副本将失败并导致警告
        copy.count++ // 警告!
      ```
      > 当 `readonly` 被引用的对象发生改变的时候，`readonly` 对象也会随之改变，同时 `watchEffect` 追踪的 `copy.count` 函数也会执行，如果主动改变 `readonly`对象的值，系统会发出警告。
  - ### isProxy
    + 检查对象是否由 `reactive` 或 `readonly` 创建的 `proxy` 。
      > 上述 2 种方式创建的变量，都是使用了 es6 的 `proxy` ，都会被 `proxy` 对象包裹
  - ### isReactive
    + 检查对象是否是由 reactive 创建的响应式代理。
      ```javascript
        const dataReactive = reactive({count: 0})
        const dataReadOnly = readonly({count: 1})

        console.log(isReactive(dataReactive)) // true
        console.log(isReactive(dataReadOnly)) // false
      ```
    + 如果对象是由 `readonly` 创建，但包裹了由 `reactive`创建的另一个对象，他也会返回 `true`
      ```javascript
        const dataReactive = reactive({count: 0})
        const dataReadonly = readonly(dataReactive)
        
        console.log(isReactive(dataReactive)) // true
        console.log(isReactive(dataReadonly)) // true
      ```

  - ### isReadonly
    + 检查对象是否是 `readonly` 创建的只读代理

  - ### toRaw
    + 获取代理对象的原始对象的引用
      ```javascript
        const obj = {count: 0}
        const dataReactive = reactive(obj)
        const rawData = toRaw(dataReactive)

        console.log(rawData === dataReactive) // false
        console.log(rawData === obj)          // true
      ```
    + `toRaw` 的对象会失去响应式
    + 因为获取的是对象的引用，如果被引用的对象发生改变，`toRaw` 的对象也会随之改变
      ```html
        <div id="app">
          <div>rawData: {{rawData.count}}</div>
          <div>dataReactive: {{ dataReactive.count }}</div>
          <button @click.native="handleClick">按钮</button>
        </div>
      ```
      ```javascript
        import { createApp, reactive, toRaw } from './node_modules/vue/dist/vue.esm-browser.js'

        const useChange = () => {
          const obj = {count: 0}
          const dataReactive = reactive(obj)
          const rawData = toRaw(dataReactive)

          const handleClick = () => {
            dataReactive.count = Math.floor(Math.random() * 10)
            console.log(dataReactive.count)
          }

          return {
            handleClick,
            rawData,
            dataReactive
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
      ```

  - ### markRaw
    + 让数据永远不会被代理（ `proxy` ），返回对象本身。实际上就是在数据对象上定义 __v_skip 属性，从而跳过代理

      ```javascript
        const foo = markRaw({})
        console.log(isReactive(reactive(foo))) // false

        // 嵌套在其他响应式对象中时也可以使用
        const bar = reactive({ foo })
        console.log(isReactive(bar.foo)) // false
      ```
      > 一般用于：
      > + 一些应该为响应式的第三方类实例
      > + 渲染数据不可变的大表格
    + 需小心**同一性风险**，即执行一个依赖于对象本身的操作，但同时使用同一对象的原始版本和被代理后的版本
    
      ```javascript
        const foo = markRaw({
          nested: {}
        })

        const bar = reactive({
          // 虽然 `foo` 被标记为原始，但 foo.nested 不是。
          nested: foo.nested
        })

        console.log(foo.nested === bar.nested) // false
      ```
      > 如果将嵌套在内的、未标记的原始对象添加进响应式对象，然后再次访问该响应式对象，就会得到原始对象被代理后的版本。这可能会导致同一性风险。
  - ### shallowReactive
    + 创建一个浅层的响应式代理，只有其第一层属性为响应式，任何嵌套的对象都会暴露为原始值。
      ```javascript
        const state = shallowReactive({
          foo: 1,
          nested: {
            bar: 2
          }
        })

        // 改变 state 本身的性质是响应式的
        state.foo++
        // ...但是不转换嵌套对象
        isReactive(state.nested) // false
        state.nested.bar++ // 非响应式
      ```
  - ### shallowReadonly
    + 创建一个浅层的代理，只有其第一层属性为只读，任何嵌套的对象都会暴露为原始值。
      ```javascript
        const state = shallowReadonly({
          foo: 1,
          nested: {
            bar: 2
          }
        })

        // 改变 state 本身的 property 将失败
        state.foo++
        // ...但适用于嵌套对象
        isReadonly(state.nested) // false
        state.nested.bar++ // 适用
      ```

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
        <div id="app">
          <div>{{obj.name}}</div>
          <div>{{toRefName}}</div>
          <button @click.native="handleClick">按钮</button>
        </div>
      ```
      ```javascript    
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
        <div id="app">
          <div>{{obj.name}}</div>
          <div>{{refsObj.name.value}}</div>
          <button @click.native="handleClick">按钮</button>
        </div>
      ```
      ```javascript
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
      ```
      
  - ### isRef
    + 检查一个值是否是 `ref`，根据 `__v_isRef` 属性值来确定

  - ### customRef
    + 创建一个自定义 `ref`，用户手动操作 `track` 和 `trigger`
      ```html
        <input v-model="text" />
      ```
      ```javascript
        function useDebouncedRef(value, delay = 200) {
          let timeout
          return customRef((track, trigger) => {
            return {
              get() {
                track()
                return value
              },
              set(newValue) {
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                  value = newValue
                  trigger()
                }, delay)
              }
            }
          })
        }

        export default {
          setup() {
            return {
              text: useDebouncedRef('hello')
            }
          }
        }
      ```
    + 常见使用场景，防抖操作
    + 通过 `track` 函数记录需要追踪的依赖， 通过 `trigger` 函数通知依赖更新。（详见下方 `track 和 trigger` 内容）

  - ### shallowRef
    + 创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的。

      ```html
        <div id="app">
          <div>age: {{obj.age}}</div>
          <button @click.native="handleClick">按钮</button>
        </div> 
      ```
      ```javascript
        import { createApp, shallowRef, watchEffect } from './node_modules/vue/dist/vue.esm-browser.js'

        const useChange = () => {
          const obj = shallowRef({age: 1})

          watchEffect(() => {
            console.log(obj.value, 'watchEffect obj') // 不会打印
          })

          const handleClick = () => {
            // 只有这样赋值才能触发响应
            // obj.value = {age: 100}

            obj.value.age = 100
            console.log(obj.value.age, 'handleClick obj') // 100
          }

          return {
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
      ```
      > + 例子中 `obj` 为浅层响应式对象， 只有对 `obj.value` 直接赋值，才会触发响应
      > + 点击按钮，更改 `age` 的值为 `100` , 此次更改不会被响应到页面上，页面上 `age` 的值还是 `1`
      > + `watchEffect` 中的 `console.log` 不会被打印，因为 `age` 属性的改变不是是响应式，所以 `watchEffect` 无法收集到依赖

  - ### triggerRef
    + 手动执行与 `shallowRef` 关联的任何副作用
      >  上面列子 `handleClick` 里增加 `triggerRef(obj)` 即可让页面和 `watchEffect` 响应到值的变化

+ ## Computed 和 Watch
  - ### computed
    + 使用时需要用 `.value` 操作
    + 计算属性具有缓存特性
    + 在调用 `computed` 时，程序首先会判断依赖的值是否改变，如果未改变，直接返回缓存的值，而 `methods` 只要是调用就会执行
    + `computed` 实际为 `lazy` 的 `effect` 语法糖
    + 只有 `getter` 方式
      ```html
        <div id="app">
          <div>age: {{countAge}}</div>
          <button @click.native="handleClick">按钮</button>
        </div>
      ```
      ```javascript
        import { createApp, reactive, computed } from './node_modules/vue/dist/vue.esm-browser.js'

        const useChange = () => {
          const obj = reactive({age: 1})
          const countAge = computed(() => obj.age + 1)
          const handleClick = () => {
            obj.age = 5
          }
          return {
            handleClick,
            countAge
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
      ```
    + `getter` 和 `setter` 方式

      ```html
        <div id="app">
          <div>age: {{countAge}}</div>
          <button @click.native="handleClick">按钮</button>
        </div>
      ```
      ```javascript
        import { createApp, reactive, computed } from './node_modules/vue/dist/vue.esm-browser.js'

        const useChange = () => {
          const obj = reactive({age: 1})
          const countAge = computed({
            get: () => {
              return obj.age + 1
            },
            set: value => {
              obj.age = value - 2
            }
          })
          const handleClick = () => {
            countAge.value = 5
          }

          return {
            handleClick,
            countAge
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

      ```
  - ### watchEffect
    + 跟踪响应式依赖项时立即执行一次函数（副作用），并在依赖项发生改变时，再次执行此函数
      ```html
        <div id="app">
          <div>age: {{obj.age}}</div>
          <button @click.native="handleClick">按钮</button>
        </div>
      ```
      ```javascript
        import { createApp, reactive, watchEffect } from './node_modules/vue/dist/vue.esm-browser.js'

        const useChange = () => {
          const obj = reactive({age: 1})
          watchEffect(() => {
            console.log(obj.age)
          })

          const handleClick = () => {
            obj.age = 5
          }

          return {
            handleClick,
            obj
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
      ```
    + 侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。也可以显示停止
      ```javascript
        const stop = watchEffect(() => {
          // 代码内容
        })

        stop()
      ```
    
    + 侦听器执行异步操作时，有时需要取消副作用，即副作用完成之前数据已改变。侦听副作用传入的函数可以接收一个 `onInvalidate` 函数作为参数，用来注册清理失效时的回调
      ```html
        <div id="app">
          <div>data: {{ data }}</div>
          <button @click.native="handleClick">按钮</button>
        </div>
      ```
      ```javascript
        import { createApp, ref, watchEffect } from './node_modules/vue/dist/vue.esm-browser.js'

        const useChange = () => {
          let id = ref(0)
          let data = ref(0)

          const getData = id => {
            return new Promise((resolve) =>{
              setTimeout(() => {
                resolve(id)
              }, 1000)
            })
          }

          watchEffect(async onInvalidate => {
            let status = true
            onInvalidate(() => status = false)

            if(status)
            data = await getData(id.value)

            if(status) {
              // 正常逻辑
              console.log(data, '成功')
            }else {
              // 此次操作已经无效
              console.log('无效')
            }
          })
          
          const handleClick = () => {
            id.value = Math.floor(Math.random() * 10)
            console.log(id.value, 'click')
          }

          return {
            handleClick,
            data
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
      ```

    + 侦听器是异步执行的，其副作用是在所有组件 `updated` 生命周期前执行。如果想在 `updated` 之后执行，需要增加 `flush` 属性，设置为 `post`。
      > `flush` 属性默认值为 `pre` ，还可以设置为 `sync` 同步触发（不建议），这样强制效果始终同步触发
      ```javascript
        // 在组件更新后触发，这样你就可以访问更新的 DOM。
        // 注意：这也将推迟副作用的初始运行，直到组件的首次渲染完成。
        watchEffect(
          () => {
            // 内容
          },
          {
            flush: 'post'
          }
        )
      ```

    + 侦听器调试
      - `onTrack` 将在响应式 `property` 或 `ref` 作为依赖项被追踪时被调用。
      - `onTrigger` 将在依赖项变更导致副作用被触发时被调用。
      ```javascript
        watchEffect(
          () => {
            /* 副作用 */
          },
          {
            onTrigger(e) {
              debugger
            }
          }
        )
      ```
  - ### watch
    + 惰性执行副作用，跟 `watchEffect` 不同，跟踪响应式依赖项时不会立即执行函数，只有依赖项发生改变时，才会执行。
    + 侦听器数据源可以是具有返回值的 `getter` 函数，也可以是 `ref` 。
      > 如果需要侦听一个对象的某一个属性，需要使用 `getter` 方式侦听
      ```html
        <div id="app">
          <div>data: {{ dataRef }}</div>
          <div>dataReactive: {{dataReactive.count}}</div>
          <div>numbers: {{numbers}}</div>
          <button @click.native="handleClick">按钮</button>
        </div>
      ```
      ```javascript
        import { createApp, ref, reactive, watch } from './node_modules/vue/dist/vue.esm-browser.js'

        const useChange = () => {
          let dataRef = ref(0)
          const dataReactive = reactive({count: 0})
          const numbers = reactive([1, 2, 3, 4])

          watch(dataRef, () => {
            console.log(dataRef.value, 'dateRef change')
          })

          watch(() => dataReactive.count, () => {
            console.log(dataReactive.count, 'dataReactive change')
          })

          watch(() => [...numbers], () => {
            console.log(dataReactive.count, 'dataReactive change')
          })
          
          const handleClick = () => {
            dataRef.value = Math.floor(Math.random() * 10)
            dataReactive.count= Math.floor(Math.random() * 10)
          }

          return {
            handleClick,
            dataRef,
            dataReactive,
            numbers 
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
    + 侦听器还可以使用数组同时侦听多个源
      ```javascript
        watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
          /* 副作用 */
        })
      ```
    + 副作用函数中注入了新值与旧值。
      ```javascript
        watch([firstName, lastName], (newValues, prevValues) => {
          console.log(newValues, prevValues);
        })
      ``` 
    + 与 watchEffect 相同，拥有与他的 `onInvalidate`、 `flush timing ` 、`debugging` 相同的行为。 
    + 如果源为深层嵌套，需要使用 `deep` 属性,且值为 `true`
    
      ```javascript
        const state = reactive({ 
          id: 1, 
          attributes: { 
            name: "",
          },
        });

        watch(
          () => state,
          (state, prevState) => {
            console.log(
              "not deep ",
              state.attributes.name,
              prevState.attributes.name
            );
          }
        );

        watch(
          () => state,
          (state, prevState) => {
            console.log(
              "deep ",
              state.attributes.name,
              prevState.attributes.name
            );
          },
          { deep: true }
        );

        state.attributes.name = "Alex";
      ```


+ ## track 和 trigger
    - `track` 函数用来跟踪收集依赖 `deps`（一般有 `effect` 、 `computed` 、 `watch` 的回调函数）
    - `trigger` 函数用来通知 `deps` , 通知依赖此状态的对象更新
    - 示例：  
      执行流程：`effect/computed` 函数执行 -> 代码响应式数据，调用到get,依赖收集 -> 当有 `set` 时，依赖集更新  

      ```javascript 
        const count = reactive({ num: 0 })
        // watchEffect 默认没带lazy参数，先会执行effect
        watchEffect(() => {
          // watchEffect 用到对应响应式数据时，count.num get就已经收集好了该effect依赖
          // computed api 同理，
          console.log(count.num)
        })
        // computed依赖于count.num,也意味着该computed是count.num的依赖项
        const computedNum = computed(() => 2 * count.num)
        count.num = 7
      ```
      > 使用 `watchEffect` 或 `computed api` 时，里面使用了 `count.num` ，意味着这个 `watchEffect` 依赖于 `count.num` 。当 `count.num set` 改变值时，需要通知该 `watchEffect` 去执行。创建 `watchEffect` 的回调函数时进行依赖��。如果回调函数中用到响应式数据（意味着会去执行 `get` 函数），则同步这个 `watchEffect` 到响应式数据（这里是 `count.num` ）的依赖集中

> 参考：
> + https://v3.cn.vuejs.org/api/reactivity-api.html
> + https://zhuanlan.zhihu.com/p/146097763
> + https://lq782655835.github.io/blogs/vue/vue3-code-2.reactive.html