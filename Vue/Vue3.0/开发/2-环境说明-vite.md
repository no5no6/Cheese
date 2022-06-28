1. Vite 仅执行 `.ts` 文件的转译工作，并 不 执行任何类型检查
2. Vite 使用 `esbuild` 将 TypeScript 转译到 JavaScript
3. 在 ts 配置文件中设置 `"isolatedModules": true` , 因为 `esbuild` 只执行没有类型信息的转译，它并不支持某些特性，如 `const` `enum` 和隐式类型导入
4. 然而，一些库（如：vue）不能很好地与 `"isolatedModules": true` 共同工作。你可以在上游仓库修复好之前暂时使用 `"skipLibCheck": true` 来缓解这个错误

> 参考：https://cn.vitejs.dev/guide/features.html#typescript