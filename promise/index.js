const MyPromise = require('./myPromise')

let p1 = () {
  return new Promise(
    (resolve, reject) => {
      resolve('p1')
    }
  )
}

p1.then(value => console.log('resolve---', value))