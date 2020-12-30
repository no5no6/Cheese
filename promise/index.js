const MyPromise = require('./myPromise')

let p1 = new Promise(
    (resolve, reject) => {
      resolve('p1')
})


p1.then(value => console.log('resolve---', value), reason => console.log("reject----", reason))