# 配置 TSX

+ ### 安装插件
  `yarn add -D @vitejs/plugin-vue-jsx`

+ ### 配置
  `vite.config.js` 文件中添加
  ```js
    import vueJsx from '@vitejs/plugin-vue-jsx'

    export default {
      plugins: [
        vueJsx({
          // options are passed on to @vue/babel-plugin-jsx
        })
      ]
    }
  ```

+ ### 示例
  - `bar.tsx` 

    ```tsx
      import { defineComponent, ref } from 'vue'

      interface PropsType {
        msg: String
      }

      export default defineComponent({
        props: {
          msg: {
            type: String,
            required: true
          }
        },
        setup () {
          const count = ref(10)

          return (props: PropsType) => (
            <div>
              <div>{props.msg}</div>
              <div>{count.value}</div>
            </div>
          )
        }
      })
    ```
  - `app.vue`  

    ```html
      <script setup lang="tsx">
        import Bar from './bar'
      </script>

      <template>
        <Bar msg="TSX template" />
      </template>
    ```