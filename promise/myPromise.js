/**
 *  手写实现 Promise 基本功能
 *  1. Promise 为一个类，创建类的同时需要传递一个执行器，执行器会立即执行。
 *  2. Promise 中有三种状态，成功 fulfilled 、失败 rejected 、等待 pending 。  
 *    状态确定后就不能更改
 *    pending --> fulfilled
 *    pending --> rejected
 *  3. resolve 和 reject 函数用来更改 Promise 状态
 *    resolve: fulfilled
 *    reject: rejected
 *  4. then 方法作用就是改变 Promise 状态，如果成功就调用成功函数，如果失败就调用失败函数， then 是被定义在原型对象上的方法
 *  5. then 方法成功回调一个成功参数，失败则回调一个失败原因。
 *  6. 同一个 promise 对象下的 then 方法是可以被调用多次的。
 *  7. then 方法可以被链式调用，后一个 then 的参数是前一个 then 返回的。
 *  8. then 方法内部判断 Promise 状态，如果成功，调用成功回调并传递结果，如果失败调用失败回调并传入失败原因。
 *  9. then 被定义在原型对象上
 *  10. 处理 Promise 异步执行，需先在 then 把成功和失败回调函数存储起来，在使用者调用 resolve 或者 reject 的时候再执行成功和失败回调函数。
 *  11. 处理 同一个 Promise 对象多次调用 then 的情况：
 *    （1）同步情况， then 方法直接根据状态执行成功或者失败函数。
 *    （2）异步情况，需要把成功和失败的函数都储存到数组中，呆状态改变时候调用对应的函数。
 *  12. 实现 then 方法的链式调用
 */
const PENDING = 'pending'  // 等等带
const FULFILLED = 'fulfilled'  // 成功
const REJECTED = 'rejected'  // 失败
class MyPromise {
  constructor(executor) {
    try {
       executor(this.resolve, this.reject)
    } catch (error) {

    }
  }
      
  status= PENDING
  value = undefined  // 成功结果
  reason = undefined  // 失败原因
  successCallback = [] // 成功回调函数
  failCallback = []  // 失败回调函数
  
  resolve = value => {
    if(this.status === PENDING ) {
      this.status = FULFILLED
      this.value = value
      // this.successCallback && this.successCallback()
      while(this.successCallback.length) this.successCallback.shift()(this.value)
    }
  }

  reject = reason => {
    if(this.status === PENDING) {
      this.status === REJECTED
      this.reason = reason
      // this.failCallback && this.failCallback()
      while(this.failCallback.length) this.failCallback.shift()(this.reason)
    }
  }

  then (successCallback, failCallback) {        
    let promise2 =  new MyPromise(resolve => {
       if(this.status === FULFILLED) {
         let returnValue = successCallback(this.value)
         resolve(returnValue)
       }else if (this.status === REJECTED) {
         failCallback(this.reason)
       }else {
         this.successCallback.push(successCallback)
         this.failCallback.push(failCallback) 
       }
    }) 
    return promise2
  }
}

module.exports = MyPromise