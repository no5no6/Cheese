# 组件开发
CDD 开发（ Component Driven Development ）
  > 从组件级别开始，到页面级别结束
## 优势
  + 组件最大程度复用
  + 并行开发
  + 可视化测试
## 组件边界
  > 组件间的数据交换和方法调用
  + ### $root  
    **通过 vue 根实例绑定数据，再通过 $root 获取，获取到的数据为响应式数据。**

      ```javascript
        new Vue({
          render: h => h(App),
          data: {
            title: 'root 节点'
          },
          methods: {
            handle () {
              console.log(this.title)
            }
          }
        }).$mount('#app')
      ```
      在其他 vue 文件中使用  

      ```javascript
        // 其他 vue 文件
        console.log(this.$root.title)  // root 节点
        this.$root.title = '我是 root 节点' 
        console.log(this.$root.handle()) // 我是 root 节点
      ```

  + ### $parent / $children  
    **通过 $parent / $children 为响应式数据**
    - parent  

      ```javascript
      // parent.vue
      <template>
          <div>
            parent
            <child></child>
          </div>
        </template>

        <script>
        import child from './child'
        export default {
          components: {
            child
          },
          data () {
            return {
              title: '获取父组件实例'
            }
          },
          methods: {
            handle () {
              console.log(this.title)
            }
          }
        }
        </script>
      ```
      + 子组件演示  

        ```javascript
          // child.vue
          <template>
            <div> 
              <div>child</div>
              <grandson></grandson>
            </div>
          </template>

          <script>
            import grandson from './grandson'
            export default {
              components: {
                grandson
              }
            }
          </script>
        ```
        ```javascript
          // 子组件中
          this.$parent.title = '子组件获取父组件实例'
          console.logI(this.$parent.handle()) //  子组件获取父组件实例
        ```
      + 孙子组件演示  

        ```javascript
          // grandson.vue
          <template>
            <div> 
              grandson
            </div>
          </template>>
        ```
        ```javascript
          // 孙子组件中
          this.$parent.$parent.title = '孙子组件获取父组件实例'
          console.logI(this.$parent.$parent.handle()) //  孙子组件获取父组件实例
        ```
    + $children  

      ```javascript
        // child.vue
        <template>
          <div>children</div>
        </template>

        <script>
          export default {
            data () {
              return {
                title: '获取子组件 title'
              }
            },
            methods: {
              handle () {
                console.log(this.title)
              }
            }
          }
        </script>
      ```

      ```javascript
        // parent.vue
        <template>
          <div>
            <children></children>
          </div>
        </template>

        <script>
          import children1 from './children'
          export default {
            components: {
              children
          }
        </script>
      ```

      ```javascript
          // 父组件中
         this.$children[0].handle() // 获取子组件 title
      ```
  + ### $ref
    **通过 $ref 获取的数据为响应式数据**
    ```javascript
      // myInput.vue
      <template>
        <div>
          <input v-model="value" type="text" ref="newInput">
        </div>
      </template>

      <script>
        export default {
          data () {
            return {
              value: '请输入'
            }
          },
          methods: {
            focus () {
              this.$refs.newInput.focus()
            }
          }
        }
      </script>
    ```    
    ```javascript
      // parent.vue
      <template>
        <div>
          <my-input ref="myInput"></my-input>
          <button @click="focus">获取焦点</button>
        </div>
      </template>

      <script>
        import myInput from './MyInput'

        export default {
          components: {
            myInput
          },
          methods: {
            focus () {
              this.$refs.myInput.focus()
              this.$refs.myInput.value = '获取焦点'
            }
          }
        }
      </script>
    ```
    > 通过 $ref *既可以获取页面元素*（如 myInput 中的用法），*也可以获取某一个 vue 组件*（如 parent.vue 中的用法)
  + ### 依赖注入( provide / inject )
    依赖注入可以实现父组件与孙子组件的直接通信（或更深的子孙关系组件）  
    **通过依赖注入获取的数据不是响应式数据，不能对其值做改变**

    ```javascript
      // parent.vue
      <template>
        <div>
          parent
          <child></child>
        </div>
      </template>

      <script>
        import child from './child'
        export default {
          components: {
            child
          },
          provide () {
            return {
              title: this.title,
              handle: this.handle
            }
          },
          data () {
            return {
              title: '依赖注入'
            }
          },
          methods: {
            handle () {
              console.log(this.title)
            }
          }
        }
      </script>
    ```

    ```javascript
      // child.vue
      <template>
        <div class="child">
          <grandson></grandson>
        </div>
      </template>

      <script>
        import grandson from './grandson'
        export default {
          components: {
            grandson
          }
        }
      </script>
    ```

    ```javascript
      // grandson.vue
      <template>
        <div class="grandson">
          grandson
        </div>
      </template>

      <script>
        export default {
          inject: ['title', 'handle']
        }
      </script>
    ```

    ```javascript
      console.log(this.title)  // 依赖注入
      console.log(this.handle())  // 依赖注入
    ```