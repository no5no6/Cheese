// 非纯函数
// let standard = 18;

// let getResult = age => {
//   return age > standard;
// }

// console.log(getResult(20));

// 纯函数
// let getResult = (age, standard) => {
//   return age > standard;
// }

// console.log(getResult(20, 18));
// console.log(getResult(20, 22));

// curry（柯里化） 函数
// let getResultCurry = (standard) => (age => age > standard);
// let standard18 = getResultCurry(18);
// let standard22 = getResultCurry(22);

// console.log(standard18(20));
// console.log(standard22(25));

// 通过 lodash curry 函数实现柯里化
// const _ = require('lodash');

// let getResult = (a, b, c) => {
//   return a + b + c;
// }

// let getCurry = _.curry(getResult);
// console.log(getCurry(1)(2)(3));
// console.log(getCurry(1, 2)(3));
// let fuc = getCurry(1, 2);
// console.log(fuc(3));


// 实现 lodash cuurry 函数
// let getResult = (a, b, c) => {
//   return a + b + c;
// }

// const curry = (fn) => {
//   const fuc = (...arg) => {
//     if (arg.length < fn.length) {
//       return (...arg_2) => {
//         return fuc(...arg.concat(arg_2));
//       }
//     }

//     return fn(...arg);
//   }
//   return fuc;
// }


// const curryGetResult = curry(getResult);
// console.log(curryGetResult(1, 2, 3));
// console.log(curryGetResult(1)(2)(3));
// console.log(curryGetResult(1, 2)(3));


// 缓存函数
// let getResult = (r) => {
//   console.log('--enter--');
//   return Math.PI * r * r;
// }

// let memoize = (fn) => {
//   let cache = {};
//   return (...arg) => {
//     let key = JSON.stringify(arg);
//     cache[key] = cache[key] || fn.apply(fn, arg);
//     return cache[key];
//   }
// }

// let getResultMemory = memoize(getResult);
// console.log(getResultMemory(2));
// console.log(getResultMemory(2));
// console.log(getResultMemory(4));

// 使用 lodash 缓存函数
// const _ = require('lodash');
// let getResultMemory = _.memoize(getResult);
// console.log(getResultMemory(2));
// console.log(getResultMemory(2));
// console.log(getResultMemory(4));

// 实现 lodash flowRight 函数
// const _ = require('lodash');

// const reverse = arr => arr.reverse();
// const first = arr => arr[0];
// const toUpper = s => s.toUpperCase();

// const f = _.flowRight(toUpper, first, reverse);
// console.log(f(['one', 'two', 'three']));


const flowRight = (...arg) => {
  let index = 0;
  let argRight = arg.reverse();
  const fuc = (value) => {
    let result = argRight[index](value);

    if (index === argRight.length - 1) {
      return result;
    } else {
      index++;
      return fuc(result);
    }
  }
  return fuc;
}


// 借助 reduce lodash flowRight 函数
const flowRight = (...arg) => value => arg.reverse().reduce((memo, item) => item(memo), value);


const f = flowRight(toUpper, first, reverse);
console.log(f(['one', 'two', 'three']));

