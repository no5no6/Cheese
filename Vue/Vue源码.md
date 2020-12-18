+ ## Vue 首次渲染的过程。
  1. vue 初始化，实例成员，静态成员。
  2. 调用 vue 的构造函数 （new Vue()）。
    - 在 Vue 构造函数中调用 _init() （方法）。
      + 调用 $mount() （方法） 把模板编译成 render 函数。
        - 判断用户是否有传入 render 函数。
        - 如果没有，调用 template 属性的值座位模板，- 如果 template 也没有，会将 el 中的值作为模板。
        - 通过 compileToFunctions() 把模板编译成 render 函数。
        - 把 render 函数存到 options.render 中。
      + 调用平台的 $mount()
        - 重新获取 $el。
        - 调用 mountComponent()。
          + 判断是否有 render 选项，如果没有但是春如了模板，并且当前是开发环境的话发送警告。
          + 触发 beforeMount 钩子函数。
          + 定义 updateComponent 方法（只定义，未运行）。
            - 调用 _render() 渲染虚拟 dom。
            - 调用 _update() 将虚拟 dom 转换为真实 dom。
          + 创建 Watcher 实例。
            - 传入 updateComponent 函数。
            - 调用 get()
              + 创建完 Watcher 会立刻调用一次 get()。
                - 调用 updateComponent()
                  + 调用 render() 创建 VNode
                    - 执行用户传入的 render 函数或者模板生成的 render 函数。
                    - 最终返回创建的虚拟 dom（VNode）。
                  + 调用 _update()
                    - 调用 __patch__ 方法挂载真实 dom。
                    - 记录 $el。
          + 触发 mounted 钩子。
          + 返回 Vue 实例。


+ ## Vue 响应式原理。
  - 调用 Vue 实例中的 init 方法
    + 调用 initState() 初始化 Vue 实例状态。
      - 调用 initData() 把 data 属性注入 Vue 实例上。
        + 调用 observe(value) 把 data 对象转换成响应式对象（ observe 响应式入口）
          - 判断传入 value 是否是对象，如果不是直接返回。
          - 判断 value 对象是否有 __ob__ 属性，如果有说明已经是响应式对象，直接返回
          - 如果没有此属性，为这个对象创建 observer 对象。
            + 给 value 对象定义不可枚举的 __ob __ 属性，记录当前 observer 对象到 ob 中。
            + 数组的响应式处理
              - 设置数组的特殊方法( push, pop,sort,splice 等等)
              - 数组变化的时候发送通知。
                + 找到数组对象对应的 ob 属性（ Observe 对象），再找到该对象中的 dep 属性。
                + 调用 dep 的 notify 方法。
                + 遍历数组中的每一个成员，在调用该成员的 observe 。
                + 如果成员是对象，也会把对象转换成响应式对象。
            + 对象的响应式处理
              - 调用 walk 方法
                + 遍历成员所有属性
                + 对每个属性调用 defineReactive 方法。
                  - 为每一个属性创建 dep 对象。
                  - 如果当前属性的值是对象，调用 observe （如果属性是对象也要转换成响应式对象）
                  - 定义 getter
                    + 收集依赖 （包括子对象）。
                      - 执行 watcher 对象的 get 方法。
                        + 执行 pushTarget 
                        + 记录 Dep.target 属性。
                        + 访问 data 中的成员的时候手机依赖。
                        + 触发 defineReactive 的 getter 中收集依赖。
                        + 将属性对应的 watcher 添加到 dep 的 subs 数组中。
                        + 如果属性值也是对象，创建 childOb 对象，为子对象收集依赖，子对象发生变化，发送通知。


                    + 返回属性值。
                  - 定会 setter
                    + 保存新值。
                    + 如果新值是对象，调用 observe。
                    +派发更新（发送通知），调用 dep 的 notify 方法。
          
            + 
          - 返回 observer 对象。
    + 数据变化时，触发 dep 的 notify 方法。
      - 调用 watcher 对象的 update 方法。
        + 调用 queueWatcher 函数
          - 判断 watcher 是否被处理。
            + 如果在 queue 队列中没有被处理过，调用 flushSchedulerQueue 方法。
              - 触发 beforeUpdate 钩子函数。
              - 调用 watcher.run 方法（数据更新到视图上）。
              - 清空上一次的依赖，重置 watcher 中的状态。
              - 触发 actived 钩子函数。
              - 触发 updated 钩子函数。
              
              
+ ## 虚拟 DOM 中 Key 的作用。

+ ## Vue 中模板编译的过程。