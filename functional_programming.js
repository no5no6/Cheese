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


// const flowRight = (...arg) => {
//   let index = 0;
//   let argRight = arg.reverse();
//   const fuc = (value) => {
//     let result = argRight[index](value);

//     if (index === argRight.length - 1) {
//       return result;
//     } else {
//       index++;
//       return fuc(result);
//     }
//   }
//   return fuc;
// }


// 借助 reduce lodash flowRight 函数
// const flowRight = (...arg) => value => arg.reverse().reduce((memo, item) => item(memo), value);


// const f = flowRight(toUpper, first, reverse);
// console.log(f(['one', 'two', 'three']));


// 组合函数调试
// const _ = require('lodash');

// const trace = _.curry((tag, value) => {
//   console.log(tag, value);
//   return value
// });

// const split = _.curry((rule, str) => _.split(str, rule));
// const join = _.curry((rule, str) => _.join(str, rule));
// const map = _.curry((fn, array) => _.map(array, fn));
// const f = _.flowRight(join('-'), trace('bbb'), map(_.toLower), trace('aaa'), split(' '))
// console.log(f('NEVER SAY DIE'))

// lodash fp 函数
// const fp = require('lodash/fp');
// const f = fp.flowRight(fp.join('-'), fp.map(fp.toLower), fp.split(' '))
// console.log(f('NEVER SAY DIE'));


// //  Container (函子)
// class Container {
//   static of (value) {
//     return new Container(value)
//   }

//   constructor(value) {
//     this._value = value
//   }

//   map (fn) {
//     return Container.of(fn(this._value))
//   }
// }

// let result = Container.of(5)
//   .map(x => x + 2)
//   .map(x => x * x)
//   .map(console.log)


// MayBe 函子
// class MayBe {
//   static of (value) {
//     return new MayBe(value);
//   }

//   constructor(value) {
//     return this._value = value;
//   }

//   isNull () {
//     return this._value === null || this._value === undefined
//   }

//   map (fn) {
//     return this.isNull() ? MayBe.of(null) : MayBe.of(fn(this._value));
//   }
// }

// let result = MayBe.of("hellow")
//   .map(x => x.toUpperCase())
//   .map(x => null)
//   .map(x => x.split(' '))

// console.log(result);


// Either 函子
// class Right {
//   static of (value) {
//     return new Right(value);
//   }

//   constructor(value) {
//     this._value = value
//   }

//   map (fn) {
//     return Right.of(fn(this._value))
//   }
// }

// class Left {
//   static of (value) {
//     return new Left(value)
//   }

//   constructor(value) {
//     this._value = value
//   }

//   map () {
//     return this;
//   }
// }

// const parseJson = (str) => {
//   try {
//     return Right.of(str).map(JSON.parse)
//   } catch (error) {
//     return Left.of({ error: error.message })
//   }
// }

// let result = parseJson('{"name": 123}').map(x => x.name + 1);
// console.log(result);


// IO 函子
// const fp = require('lodash/fp')

// class IO {
//   static of (value) {
//     return new IO(() => {
//       return value
//     })
//   }

//   constructor(fn) {
//     this._value = fn
//   }

//   map (fn) {
//     return IO.of(fp.flowRight(fn, this._value))
//   }
// }

// let result = IO.of(process)
//   .map(p => p.execPath)
// console.log(result._value()());


// 处理函数式变成异步问题，folktale 库 task 函子
// const fs = require('fs')
// const { task } = require('folktale/concurrency/task')
// const { split, find } = require('lodash/fp')

// let readFile = (filename) => {
//   return task(({ reject, resolve }) => {
//     fs.readFile(filename, 'utf-8', (error, data) => {
//       if (error) reject(error)

//       resolve(data);
//     })
//   })
// }

// readFile('package.json')
//   .map(split('\n'))
//   .map(find(x => x.includes('version')))
//   .run()
//   .listen({
//     onRejected: error => {
//       console.log(error);
//     },
//     onResolved: data => {
//       console.log(data);
//     }
//   })


// Monad 函子
// const fp = require('lodash/fp')
// const fs = require('fs')
// class IO {
//   static of (value) {
//     return new IO(() => {
//       return value
//     })
//   }

//   constructor(fn) {
//     this._value = fn
//   }

//   map (fn) {
//     return new IO(fp.flowRight(fn, this._value))
//   }

//   join () {
//     return this._value()
//   }

//   flatMap (fn) {
//     return this.map(fn).join()
//   }
// }

// let readFile = (filename) => {
//   return IO.of(fs.readFileSync(filename, 'utf-8'))
// }

// let print = (x) => {
//   return new IO(() => {
//     console.log(x);
//     return x;
//   });
// }

// readFile('package.json')
//   .map(fp.toUpper)
//   .flatMap(print)
//   .join()

