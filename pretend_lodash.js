/**
 * 实现 forEach 函数
 * @param {*} array 
 * @param {*} fn 
 */
const forEach = (array, fn) => {
  for (let index = 0; index < array.length; index++) {
    fn(array[index], index);
  }
}

// 测试
// let arr = [1, 4, 3, 5, 7];
// forEach(arr, (value, index) => console.log(`第${index + 1}个结果为：${value}`));


/**
 * 实现 map 函数
 * @param {*} array 
 * @param {*} fn 
 */
const map = (array, fn) => {
  let result = [];
  for (let index = 0; index < array.length; index++) {
    result.push(fn(array[index], index));
  }
  return result;
}

// 测试
// let arr = [1, 4, 3, 5, 7];
// let newArray = map(arr, (item, index) => item + index);
// console.log(newArray);


/**
 * 实现 filter 函数
 * @param {*} array 
 * @param {*} fn 
 */
const filter = (array, fn) => {
  let result = [];
  for (let index = 0; index < array.length; index++) {
    const item = array[index];
    if (fn(item, index)) {
      result.push(item);
    }
  }
  return result;
}

// 测试
// let arr = [1, 4, 3, 5, 7];
// let result = filter(arr, (item, index) => item % 2 === 1);
// console.log(result);


/**
 * 实现 some 函数
 * @param {*} array 
 * @param {*} fn 
 */
const some = (array, fn) => {
  let result = true;
  for (let index = 0; index < array.length; index++) {
    console.log(index);
    result = fn(array[index]);
    if (result) break;
  }
  return result;
}

// 测试
// let arr = [1, 4, 3, 5, 7];
// let result = some(arr, (item, index) => item === 7);
// console.log(result);


/**
 * 实现 every 函数
 * @param {*} array 
 * @param {*} fn 
 */
const every = (array, fn) => {
  let result = true;
  for (let index = 0; index < array.length; index++) {
    result = fn(array[index], index);
    if (!result) break;
  }
  return result;
}

// 测试
// let arr = [1, 9, 3, 5, 7];
// let result = every(arr, (item, index) => item % 2 === 1);
// console.log(result);


// 重点：箭头函数没有子集的 this 和 arguments 如果想用当前的 arguments 必须使用剩余参数表示法
/**
 * 实现 once 函数
 * @param {} fn 
 */
const once = (fn) => {
  let status = true;
  return (...args) => {
    if (status) {
      status = false;
      return fn.apply(this, args);
    }
  }
}

// 测试
// let pay = once((money) => {
//   console.log(money, 'money');
//   console.log(`共计${money}RMB`);
// });

// pay(5);
// pay(5);
// pay(5);
// pay(5);


// reduce
const reduce = (array, fn, memo) => {
  let result = memo;
  for (let index = 0; index < array.length; index++) {
    result = fn(result, array[index], index);
  }
  return result;
}

// 测试
// let arr = [1, 3, 5, 2, 6, 7];
// let result = reduce(arr, (memo, item, index) => {
//   memo.push(item + 1);
//   return memo;
// }, []);
// console.log(result);


// slice
const slice = (array, start = 0, end = array.length) => {
  let result = [];
  let startNumber = +start;
  let endNumber = +end;

  startNumber = isNaN(startNumber) ? 0 : startNumber;
  endNumber = isNaN(endNumber) ? 0 : endNumber;

  let length = startNumber > endNumber ? 0 : array.length;

  for (let index = 0; index < length; index++) {
    if (index === endNumber) {
      break;
    } else if (index >= startNumber) {
      result.push(array[index]);
    }
  }
  return result;
}


// 测试
// let arr = [1, 2, 3, 4, 5, 6, 8, 0];
// let result = slice(arr, 3, 5);
// console.log(result)


/**
 * 实现 chunk 函数
 * @param {*} array 
 * @param {*} number 
 * @param {*} fn 
 */
const chunk = (array, size = 1) => {
  size = isNaN(+size) ? 0 : size;
  const length = Array.isArray(array) ? array.length : 0;
  if (length === 0) return [];

  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));
  while (index < length) {
    result[resIndex++] = slice(array, index, index += size);
  }

  return result;
}

// 测试
let arr = [1, 2, 3, 5, 2, 7, 5];
let result = chunk(arr, 1);
console.log(result);



// compact
// difference
// drop
// fill
// findIndex
// flatten
// indexOf
// intersection
// join
// pull
// slice
// reverse
// remove
// uniq
// union
// without
// take
// tail
// zip