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
答：结果为10。因为i作用域的问题。需要把 `i` 声明方式改为 `let` 或循环内部改为闭包形式。    

2. 请说出最终执行结果，并解释为什么？
```javascript
var tmp = 123;
if(true) {
  console.log(tmp);
  let tmp;
}
```  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：结果为语法错误。原因：  
&nbsp;&nbsp;&nbsp;&nbsp;(1). `console` 作用域在 `if` 里, 该作用域里已经用 `let` 声明了 `tmp` 变量，此时该变量存在在暂时性死区中，所以不会读取 `var` 的声明。  
&nbsp;&nbsp;&nbsp;&nbsp;(2). `let` 声明的变量不会像 `var` 一样有变量提升。  

3. 结合ES6语法，用最简单的方式找出数组中最小的值？  
```javascript
  var arr = [12, 34, 32, 89, 4];
```  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：  
  ```javascript
  const minValue = Math.min(...arr);
  console.log(`最小值为：${minValue}`);
  ```  

4. 请详细说明 `var`, `let`, `const` 三种声明变量的方式之间的具体差别。  
答：  
&nbsp;&nbsp;&nbsp;&nbsp;(1). `var` 会作用域提升， `let` ， `const` 不会。  
&nbsp;&nbsp;&nbsp;&nbsp;(2). `const` 内存指针地址不能修改， `var` ,  `let` 可以。  
&nbsp;&nbsp;&nbsp;&nbsp;(3). `let` ， `const` 受作用域 `{}` 限制， `var` 为全局声明。  
&nbsp;&nbsp;&nbsp;&nbsp;(4). `let` ， `const` 同一作用域下只能声明一次, `var` 可以声明多次。  

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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：结果为20，原因  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1). `obj`对象调用的 `fn()` 方法，此时 `this` 为 `obj` 对象。  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2). 因为 `fn()` 方法中 `setTimeout` 使用了箭头函数，所以在 `setTimeout` 中 `this` 还是 `obj` 对象。  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3). `obj.a` 为 20。  

6. 简述 `Symbol` 类型的用途？  
答：  
&nbsp;&nbsp;&nbsp;&nbsp;(1). 限制对象 `key` 重复。  
&nbsp;&nbsp;&nbsp;&nbsp;(2). 私有化对象或类成员中的属性。  

7. 说说什么是浅拷贝，什么是深拷贝？  
答：  
&nbsp;&nbsp;&nbsp;&nbsp;对象：A ， 对象：B ， A = B  
&nbsp;&nbsp;&nbsp;&nbsp;浅拷贝：内存中 `A` 对象的指针指向 `B` 对象引用的值，如果 `B` 的引用地址的值改变， `A` 也会随之改变。  
&nbsp;&nbsp;&nbsp;&nbsp;深拷贝：内存中 将 `B` 指针引用的值复制一份，创建新的内存地址存储，将 `A` 指向新的内存地址。如果 `B` 的引用地址的值改变， `A` 不会改变。  

8. 谈谈你是如何理解JS异步变成的， Event Loop 是做什么的，什么是宏任务，什么是微任务？  
答：  
&nbsp;&nbsp;&nbsp;&nbsp;(1).`javascript` 为单线程语言，指的是执行 `js` 代码只有一个线程，`web worker` 可以创建多个线程，但子线程完全由主线程控制，且不能操作dom。  
&nbsp;&nbsp;&nbsp;&nbsp;(2). 浏览器为多线程，分别有 `js` 引擎线程、 ui 渲染线程、 浏览器事件触发线程、 http请求线程、 定时触发器线程、 事件轮询处理线程、。  
&nbsp;&nbsp;&nbsp;&nbsp;(3). `javascript` 单线程执行代码，异步编程是为了解决代码阻塞问题，让需要耗时的任务执行后挂起，继续执行下边的代码。挂起的任务通过 Event Loop 管理，等待耗时任务执行完毕后，将结果返回给 `javascript` 主线程， 主线程调用事先定义的回调函数，完成整个操作。  
&nbsp;&nbsp;&nbsp;&nbsp;(4). 宏任务和微任务都是都是管理异步回调任务，宏任务管理异步任务有setTimeout、setInterval、setImmediate (Node独有)、requestAnimationFrame (浏览器独有)、I/O、UI rendering (浏览器独有)。微任务管理异步任务有 process.nextTick (Node独有)、Promise、Object.observe、MutationObserver  

9. 将下面异步代码使用 Promise 改进？
```
setTimeout(function () {
  var a = "hello";
  setTimeout(function () {
    var b = "lagou";
    setTimeout(function () {
      var c = "I ❤ U";
      console.log(a + b + c);
    }, 10);
  }, 10);
}, 10);
```  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答：  
```
  let process = str => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(str)
      }, 10);
    });
  }
  
  
  let main = async () => {
    let tasks = [
      process('hellow'),
      process('lagou'),
      process('"I ❤ U')
    ]
    
    let array = await Promise.all(tasks);
    console.log(array.join(''));
  }
  
  main();
```  

10. 请简述 `TypeScript` 与 `JavaScript` 之间关系？  
答：`TypeScript` 是 `JavaScript` 超集。 `TypeScript` 等于 `JavaScript` + `Flow` + ES6+  

11. 请谈谈你所认为的 `TypeScript` 优缺点?  
答：  
&nbsp;&nbsp;&nbsp;&nbsp;优点：完全兼容 `js`、 社区丰富、 通过类型注解增加代码可读与维护性。  
&nbsp;&nbsp;&nbsp;&nbsp;缺点：多了一些新概念需要学习成本、小项目应用会增加编码负担、有些库没有生命文件，需要手动声明再使用。





















