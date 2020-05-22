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
(1). `console` 作用域在 `if` 里, 该作用域里已经用 `let` 声明了 `tmp` 变量，此时该变量存在在暂时性死区中，所以不会读取 `var` 的声明。  
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

4. 请详细说明 `var`, `let`, `const` 三种声明变量的方式之间的具体差别.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：  
(1). `var` 会作用域提升， `let` ， `const` 不会。  
(2). `const` 内存指针地址不能修改， `var` ,  `let` 可以。  
(3). `let` ， `const` 受作用域 `{}` 限制， `var` 为全局声明。  
(4). `let` ， `const` 同一作用域下只能声明一次, `var` 可以声明多次。  

5. 请说出下列代码最终输出结果，并解释为什么？  
```javascript
var a = 10;
var obj = {
  a: 20,
  fn () {
    setTimeout(() => {
      console.log(this.a);
    });
  }
}
obj.fn();
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：
结果为20，原因  
(1). `obj`对象调用的 `fn()` 方法，此时 `this` 为 `obj` 对象。  
(2). 因为 `fn()` 方法中 `setTimeout` 使用了箭头函数，所以在 `setTimeout` 中 `this` 还是 `obj` 对象。  
(3). `obj.a` 为 20。  

6. 简述 `Symbol` 类型的用途？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：
(1). 限制对象 `key` 重复。  
(2). 私有化对象或类成员中的属性。  

7.说说什么是浅拷贝，什么是深拷贝？
对象：A
对象：B
A = B

浅拷贝：内存中 `A` 对象的指针指向 `B` 对象引用的值，如果 `B` 的引用地址的值改变， `A` 也会随之改变。
深拷贝：内存中 将 `B` 指针引用的值复制一份，创建新的内存地址存储，将 `A` 指向新的内存地址。如果 `B` 的引用地址的值改变， `A` 不会改变。











