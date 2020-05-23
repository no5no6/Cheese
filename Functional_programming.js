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


// once
// reduce