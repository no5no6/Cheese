# 搭配 TypeScript 使用 Vue#


### 1. 使用 defineComponent() 定义组件, 正确导出组件选项内的类型 （未结合 `<script setup>` 时）
  ```ts
    import { defineComponent } from 'vue'

    export default defineComponent({
      // 启用了类型推导
      props: {
        message: String
      },
      setup(props) {
        props.message // 类型：string | undefined
      }
    })  
  ```

### 2. `<script>` 标签上加上 `lang="ts"` 属性，所有的模板内表达式都将享受到更严格的类型检查
```vue
  <script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    data() {
      return {
        count: 1
      }
    }
  })
  </script>

  <template>
    <!-- 启用了类型检查和自动补全 -->
    {{ count.toFixed(2) }}
  </template>
```

### 3. 联合类型会遇到的问题
```vue
  <script setup lang="ts">
  let x: string | number = 1
  </script>

  <template>
    <!-- 出错，因为 x 可能是字符串 -->
    {{ x.toFixed(2) }}
  </template>
```









> 参考：https://staging-cn.vuejs.org/guide/typescript/overview.html#using-vue-with-typescript