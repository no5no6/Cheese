
# vite 中的 TypeScript
  ### Vite 仅执行 `.ts` 文件的转译工作，并不执行任何类型检查；Vite 使用 `esbuild` 将 TypeScript 转译到 JavaScript

  - ### 编译器选项
    1. 在 ts 配置文件中设置 `"isolatedModules": true` , 因为 `esbuild` 只执行没有类型信息的转译，它并不支持某些特性，如 `const` `enum` 和隐式类型导入
    2. 然而，一些库（如：vue）不能很好地与 `"isolatedModules": true` 共同工作。你可以在上游仓库修复好之前暂时使用 `"skipLibCheck": true` 来缓解这个错误

    > 参考：https://cn.vitejs.dev/guide/features.html#typescript-compiler-options

  - ### 客户端选项 （类型补充）
    1. Vite 默认的类型定义是写给它的 Node.js API 的。要将其补充到一个 Vite 应用的客户端代码环境中，请添加一个 d.ts 声明文件：  

        ``` html
          /// <reference types="vite/client" />
        ``` 

    2. 同时，你也可以将 vite/client 添加到 tsconfig 中的 compilerOptions.types 下：

        ```json
          {
            "compilerOptions": {
              "types": ["vite/client"]
            }
          }

    > 作用：补充环境变量， 热更新 api ，引入 svg 等类型问题。参考： https://cn.vitejs.dev/guide/features.html#client-types