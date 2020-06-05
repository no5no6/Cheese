## javascript基础、typescript练习题
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
&nbsp;&nbsp;&nbsp;&nbsp;是一种基本数据类型 （primitive data type）。Symbol()函数会返回symbol类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的symbol注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法："new Symbol()"。每个从Symbol()返回的symbol值都是唯一的。一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的。在ES5中，对象属性名都是字符串容易造成属性名冲突。为了避免这种情况的发生，ES6引入了一种新的原始数据类型Symbol，表示独一无二的值  


7. 说说什么是浅拷贝，什么是深拷贝？  
答：  
&nbsp;&nbsp;&nbsp;&nbsp;浅拷贝：复制一层对象的属性，并不包括对象里面的为引用类型的数据，当改变拷贝的对象里面的引用类型时，源对象也会改变。  
&nbsp;&nbsp;&nbsp;&nbsp;深拷贝：重新开辟一个内存空间，需要递归拷贝对象里的引用，直到子属性都为基本类型。两个对象对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性。  

8. 谈谈你是如何理解JS异步编程的， Event Loop 是做什么的，什么是宏任务，什么是微任务？  
答：  
&nbsp;&nbsp;&nbsp;&nbsp;(1).JavaScript异步编程：异步(async)是相对于同步(sync)而言的，同步就是一件事一件事的执行。只有前一个任务执行完毕，才能执行后一个任务。而异步是不用等待前一个任务执行完成也能够执行。  
&nbsp;&nbsp;&nbsp;&nbsp;(2). Event Loop：即事件循环，是指浏览器或Node的一种解决javaScript单线程运行时不会阻塞的一种机制，也就是我们经常使用异步的原理。浏览器中的Event Loop指的是Javascript 有一个 main thread 主线程和 call-stack 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。  
&nbsp;&nbsp;&nbsp;&nbsp;(3). 宏任务（MacroTask）：可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行），指script全部代码、setTimeout、setInterval、setImmediate（浏览器暂时不支持，只有IE10支持，具体可见MDN）、I/O、UI Rendering。  
&nbsp;&nbsp;&nbsp;&nbsp;(4). 微任务（MicroTask）：可以理解是在当前 task 执行结束后立即执行的任务。也就是说，在当前task任务后，下一个task之前，在渲染之前，指Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver。

9. 将下面异步代码使用 Promise 改进？
```javascript
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
```javascript
  let process = str => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(str)
      }, 10);
    });
  }
  
  let main = async () => {
    let tasks = ['hellow', 'lagou', 'I ❤ U'].map(str => process(str))
    
    let array = await Promise.all(tasks);
    console.log(array.join(''));
  }
  
  main();
```  

10. 请简述 `TypeScript` 与 `JavaScript` 之间关系？  
答：`TypeScript` 是 `JavaScript` 超集。 `TypeScript` 等于 `JavaScript` + `Flow` + ES6+  

11. 请谈谈你所认为的 `TypeScript` 优缺点?  
答：  
&nbsp;&nbsp;&nbsp;&nbsp;优点：完全兼 `js`、添加类型注解后，IDE 能够提供更好的代码提示、编译阶段发现错误，特别是在对代码进行重构时，更有把握、 社区丰富、 通过类型注解增加代码可读与维护性。  
&nbsp;&nbsp;&nbsp;&nbsp;缺点：多了一些新概念需要学习成本、小项目应用会增加编码负担、有些库没有生命文件，需要手动声明再使用。





















