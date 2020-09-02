// // 1. proxy 头条（2018 ）
// const main = {
//   name: 'jscode',
//   age: 22
// }

// const proxy = new Proxy(main, {
//   get(target, key) {
//     return target[key] || new Error(`Property "${key}" does not exist`)
//   }
// })

// console.log(proxy.name)
// console.log(proxy.age)
// console.log(proxy.location)




// 2. 红灯3秒亮一次，绿灯1秒亮一次，黄灯2秒亮一次，用 promise 实现一个函数，让3个灯不断交替亮。
// function red () {
//   console.log('red')
// }

// function yellow () {
//   console.log('yellow')
// }

// function green () {
//   console.log('green')
// }

// const data = [
//   {fuc: red, time: 3000},
//   {fuc: yellow, time: 2000},
//   {fuc: green, time: 1000}
// ]

// const touchLight =(({fuc, time}) => {
//   return new Promise((reslove) => {
//     setTimeout(() => {
//       fuc()
//       reslove()
//     }, time)
//   })
// })

// const main = async data => {
//   const tasks = data.map(item => touchLight(item))
//   await Promise.all(tasks)

//   main(data)
// }

// main(data)


// // 3. 控制台结果
// const User = {
//   count: 1,
//   getCountPlus: function () {
//       return this.count;
//   },
//   action: {
//       getCount: function () {
//           return this.count;
//       }
//   }
// }

// const getCount = User.action.getCount;

// setTimeout(() => {
//   console.log('result 1', User.action.getCount());    
//   console.log('reuslt 3', User.getCountPlus());
// });

// console.log('result 2', getCount());


// 4.1 typescript 和 javascript 区别
// 答： 
// 1、typescript 是 javascript 的超集。
// 2、javascript是一门动态语言，而typescript添加了可选的静态类型。
// 3、typescript有编译时类型检查，这为程序的编写带来了极大的方便。

// 4.2 typescript 你都用过哪些类型。
// 答：
// 1、原始类型（number，string，boolean，Array，Enum，Object）。
// 2、特殊类型（null，undefined，Any）
// 3、泛型

// 4.3 type 和 interface 区别。
// 答：
// 1. type 可以创建类型别称，interface 在不是原始类型时也可以。
// 2. interface 可以扩展类。



// 5、 async 和 await 的理解，内部原理分析
// 答：
// 1、 async 和 await 是 Generator 函数的语法糖。
// 2、 async 和 await 就是 co 库的官方实现。
// 3、 async 将 generator 函数变成自启动执行器，使用条件是 generator 函数的 yield 命令后面，只能是 thunk 函数或 Promise 对象，async 函数执行完返回一个 Promise 对象。


// 7
// 答：
// 一、过程
// 1、 主线程运行的时候会生成堆（heap）和栈（stack）
// 2、 js从上到下解析方法，将其中的同步任务按照执行顺序排列到执行栈中
// 3、 当程序调用外部的API时，比如ajax、setTimeout等，会将此类异步任务挂起，继续执行执行栈中的任务，等异步任务返回结果后，再按照执行顺序排列到事件队列中
// 4、 主线程先将执行栈中的同步任务清空，然后检查事件队列中是否有任务，如果有，就将第一个事件对应的回调推到执行栈中执行，若在执行过程中遇到异步任务，则继续将这个异步任务排列到事件队列中。主线程每次将执行栈清空后，就去事件队列中检查是否有任务，如果有，就每次取出一个推到执行栈中执行。
// 5、 重复上述

// 二、 promise 传入函数在 poll 阶段执行。

// 8 函数防抖
// 答：
// 解释： 函数防抖，就是指触发事件后在规定时间内函数只能执行一次，如果在 规定时间内又触发了事件，则会重新计算函数执行时间
// 实现：
// const decounce = (fn, delay)=> {
//   let timer = null
//   return (...args) => {
//     clearTimeout(timer) 
//     timer = setTimeout(() => {
//       fn.apply(this, args)
//     }, delay)
//   }
// }


// v8 垃圾回收机制
// 一、 概念
// 1、新生代存放的是 存活时间比较短的变量，会频繁发生垃圾回收。
// 2、 新生代存储区被等分为两个区域，分别是 from（对象区域） 和 to（空闲区域）。
// 3、 新加入的对象会放到对象区域，当对象区域快被写满时，就会触发垃圾清理操作。
// 4、 新生代存储区为了执行效率问题，控件会被设置的比较小。
// 5、 JavaScript 引擎采用了对象晋升策略。
//   5.1、 经过两次垃圾回收依然还存活的对象，会被移动到老生代空间中。
//   5.2、 如果复制一个对象到 To 空间时，To 空间占用超过了 25%，则这个对象会被直接晋升到老生代空间中。
// 二、清理过程
// 1、 对对象区域中的垃圾标记。
// 2、 把存活对象复制到 to(空闲区域中)，同时会将对象有序的排列（相当复制过程中做了整理操作，避免内存碎片化问题）。
// 3、 释放 from(对象区域) 内存空间。
// 4、 翻转对象 from（对象区域）和 to（空闲区域）。也就是说原来的 from 变为 to，原来的to变为 from 。




// 12、观察者模式和发布订阅区别
// 发布订阅：在发布订阅模式里，发布者，并不会直接通知订阅者，发布者和订阅者，彼此互不相识，通过第三方经纪人（Broker）进行通信。
// 观察者：观察者和目标直接进行交互，不需要第三方。


// 13 gulp 流程
// 1、项目中安装 `gulp` 为开发依赖
// 2、添加 `gulpfile.js` 文件
// 3、引入 `gulp` 中的 src, dest, parallel, series, watch 方法。
// 4、安装 gulp-load-plugins 插件，用此插件不用单独再require每一个模块。
// 5、安装 gulp-sass 编译 sass 文件。
// 6、安装 gulp-babel 、@babel/core、 @babel/preset-env 编译 es6 文件。
// 7、安装 gulp-imagemin 压缩图片。
// 8、安装 gulp-imagemin 打包字体。
// 9、通过 src 和 pipe 方法，将 index.html 等一些静态文件拷贝到 dist 目录。
// 10、导出编写的 gulp 指令。

// 15、webpack 常用配置
// 1、css-loader 用于打包css文件。
// 2、style-loader 用于将打包完的 css ，用 style 标签的方式加载到 html 中。
// 3、大的资源文件使用 file-loader 打包。
// 4、小的资源文件使用 url-loader 打包。
// 5、babel-loader、 @/babel/core --dev、@/babel/preset-env，es6 代码转换成 es5 代码。
// 6、html-loader 转换 html 中的资源文件。
// 7、clean-webpack-plugin 清除打包目录。
// 8、copy-webpack-plugin 复制静态文件。
// 9、用于本地启动服务 dev-server，热部署，自动刷新。

// 16 webpack css-loader 作用和原理
// 答：用于打包css文件，一般配合 style-loader 一起使用，可将打包后的css 添加到 html 标签的 style属性上。原理：css-loader 会把匹配到的 css 模块加载到 js 代码中、

// 17 loader 和 plugin 差别
// 答：Loader的作用是让webpack拥有了加载和解析非JavaScript文件的能力，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果

// 18 babel.config.js 和 .babelrc  区别
// 答 .babelrc 是针对文件夹的，即该配置文件所在的文件夹包括子文件夹都会应用此配置文件的设置，而且下层配置文件会覆盖上层配置文件，通过此种方式可以给不同的目录设置不同的规则。babel.config.js 是针对项目配置。

// 19 webpack tree shake 作用和原理
// 答： 去除不影响执行结果的代码，包括不会执行到的代码和未使用的变量等。Tree shaking的本质是消除无用的JavaScript代码。因为ES6模块的出现，ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是Tree shaking的基础。

// 20 eventbus 原理
// 原理：通过一个vue实例作为中枢，将所有引入该对象的 vue 文件联系到一起（互相访问、调用方法）。
// 实现：
// // event-bus.js
// import Vue from 'vue'
// export const EventBus = new Vue()

// // 发送事件
// import { EventBus } from "../event-bus.js"
// EventBus.$emit("aMsg", '来自A页面的消息')

// // 接收事件
// import { EventBus } from "../event-bus.js"
// EventBus.$on("aMsg", (msg) => {
//   // 发送来的消息
// });


// 21 vue-loader 实现原理
// 1、允许为 Vue 组件的每个部分使用其它的 webpack loader，例如在 <style> 的部分使用 Sass 和在 <template> 的部分使用 Pug；
// 2、允许在一个 .vue 文件中使用自定义块，并对其运用自定义的 loader 链；
// 3、使用 webpack loader 将 <style> 和 <template> 中引用的资源当作模块依赖来处理；
// 4、为每个组件模拟出 scoped CSS；
// 5、在开发过程中使用热重载来保持状态