const { resolve } = require('../../../../Downloads/01-01-study -materials/01-01-codes/01-01-03-01-my-promise/myPromise')
const MyPromise = require('./myPromise')

let p1 = new Promise(
    (resolve, reject) => {
      setTimeout(() => {
        resolve('success')
        // reject('error')
      }, 2000)
})

p1.then(value => {
  console.log('p11111111',  value)
  return '123321'
}).then(value => {
  console.log(value, '--------')
})

//  p1.then(value => console.log('resolve---', value), reason => console.log("reject----", reason))
//p1.then(value => {
//  console.log('111111')
//  console.log('成功--', value)
//}, reason => {
//  console.log('失败--', reason)
//})
//
//
//p1.then(value => {
//  console.log('2222')
//  console.log('成功--', value)
//}, reason => {
//  console.log('失败--', reason)
//})
//
//p1.then(value => {
//  console.log('3333')
//  console.log('成功--', value)
//}, reason => {
//  console.log('失败--', reason)
//})