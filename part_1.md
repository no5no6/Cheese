## 一. 简单题
1. 请说出下列最终的执行结果，并解释为什么？
```javascript
var a = [];
for(var i = 0; i<10; i++) {
  a[i] = function() {
    console.log(i);
  }
}
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：
结果为10。因为i作用域的问题。需要把 `i` 声明方式改为 `let` 或循环内部改为闭包形式。    

2. 请说出最终执行结果，并解释为什么？
```javascript
var tmp = 123;
if(true) {
  console.log(tmp);
  let tmp;
}
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答:结果为语法错误。原因：  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
(1). `console` 作用域在 `if` 里, 该作用域里已经用 `let` 声明了 `tmp` 变量，所以不会读取 `var` 的声明。  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
(2). `let` 声明的变量不会像 `var` 一样有变量提升。  

3. 结合ES6语法，用最简单的方式找出数组中最小的值？  
```javascript
  var arr = [12, 34, 32, 89, 4];
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：

  ```javascript
  const minValue = Math.min(...arr);
  console.log(`最小值为：${minValue}`);
  ```
