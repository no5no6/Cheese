## 性能优化、函数式编程练习题
 1. 描述引用计数的工作原理和缺点。
    + 工作原理
      - 内存中每个对象拥有一个计数器，每被外部引用一次，计数器增加 1 。
      - GC 通过内存中对象的计数器是否为 0 来判断是否是可回收的垃圾。
     - 外部对象每次引用改变，都会触发 GC 检查。
    + 优点
      - 可以及时回收垃圾。
      - 没有暂停时间，不需要 GC 现成专门处理，业务现成自己就搞定了。
    + 缺点
      - 在程序每次赋值操作的时候都需要大量计算。
      - 无法处理循环引用。
    
2. 描述标记整理算法的工作流程。
    + 标记（同标记清除算法一样）
      - 从根结点出发遍历对象，对访问过的对象打上标记，表示该对象可达。
    + 整理
      - 在遍历结束后, 对于标记过的对象, 把它们从内存开始的区域按顺序依次摆好,中间不留缝隙. 在摆放完最后一个标记对象后, 把之后的内存区域直接回收

3. 描述 V8 中新生代存储区垃圾回收的流程。
    + 概念
      - 新生代存放的是 存活时间比较短的变量，会频繁发生垃圾回收。
      - 新生代存储区被等分为两个区域，分别是 from（对象区域） 和 to（空闲区域）。
      - 新加入的对象会放到对象区域，当对象区域快被写满时，就会触发垃圾清理操作。
      - 新生代存储区为了执行效率问题，控件会被设置的比较小。
      - JavaScript 引擎采用了对象晋升策略。
        + 经过两次垃圾回收依然还存活的对象，会被移动到老生代空间中。
        + 如果复制一个对象到 To 空间时，To 空间占用超过了 25%，则这个对象会被直接晋升到老生代空间中。
    + 清理过程
      - 对对象区域中的垃圾标记。
      - 把存活对象复制到 to(空闲区域中)，同时会将对象有序的排列（相当复制过程中做了整理操作，避免内存碎片化问题）。
      - 释放 from(对象区域) 内存空间。
      - 翻转对象 from（对象区域）和 to（空闲区域）。也就是说原来的 from 变为 to，原来的to变为 from 。


4. 描述增量标记算法在何时使用及工作原理。
    - 何时使用
      + 需要整理的内存空间较大的时候，不适应全停顿的行为。
    - 执行原理
      + 为了降低全堆垃圾回收带来的停顿时间，V8 在标记时采用增量标记，即将标记拆分为许多小步进行，每一个步完成时，就让js逻辑执行一小会。垃圾回收和逻辑执行交替进行，直到标记阶段完成。后续的清理和整理也分别采用延迟清理和增量整理。

5. 基于以下代码完成下面四个练习。
```javascript
  const fp = require('lodash/fp')

  // 数据
  // horsepower 马力，dollar_value 价格，in_stock 库存
  const cars = [
    {name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true},
    {name: 'Spyker c12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false},
    {name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false},
    {name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false},
    {name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true},
    {name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false}
  ]
```  
  + 练习1： 使用函数组合 `fp.flowRight()` 重新实现下面这个函数
    ```javascript
      let isLastInStock = function(cars) {
        // 获取最后一条数据
        let last_car = fp.last(cars)
        // 获取最后一条数据的 in_stock 属性值
        return fp.prop('in_stock', last_car)
      }
    ```
    实现：
    ```javascript
      let get_last_car = fp.last
      let get_in_stock = fp.prop('in_stock')

      let flowMethod = fp.flowRight(get_in_stock, get_last_car)
      let result = flowMethod(cars)
      console.log(result)
    ```  
  + 练习2： 使用 `fp.flowRight()`、`fp.prop()` 和 `fp.first()` 获取第一个 `car` 的 `name`。  

    实现：  
    ```javascript
      let get_last_car = fp.first
      let get_in_stock = fp.prop('name')

      let flowMethod = fp.flowRight(get_in_stock, get_last_car)
      let result = flowMethod(cars)
      console.log(result)
    ```
  + 练习3：使用帮助函数 `_average` 重构 `averageDollarValue`， 实现函数组合的实现方式。
    ```javascript
      let _average = function (xs) {
        return fp.reduce(fp.add, 0, xs) / xs.length
      }
      // <- 无须改动
      let averageDollarValue = function(cars) {
        let dollar_values = fp.map(function(car) {
          return car.dollar_value 
        }, car)

        return _average(dollar_values)
      }
    ```
    实现：
    ```javascript
      let _average = function (xs) {
        return fp.reduce(fp.add, 0, xs) / xs.length
      }
      // <- 无须改动
      let get_all_price = fp.map('dollar_value')

      let flowMethod = fp.flowRight(_average, get_all_price)
      let result = flowMethod(cars)
      console.log(result)
    ```
  - 练习4： 使用 `flowRight` 写一个 `sanitizeNames()` 函数，返回一个下划线连接的小写字符串，把数组中的 `name` 转换为这种形式：例如： `sanitizeNames(["Hellow World"]) => ["hello_world"]`
    ```javascript
      let _underscore = fp.replace(/\W+/g, '_')
      // <- 无须改动，并在 sanitizeNames 中使用它
    ```
    实现：
    ```javascript
      let _underscore = fp.replace(/\W+/g, '_')
      let get_name = fp.props('name')
      let set_lowerCase = fp.lowerCase

      let flowMethod = fp.flowRight(_underscore, fp.map(fp.flowRight(set_lowerCase, get_name)))
      let result = flowMethod(cars)
      console.log(result)
    ```

  6. 基于下面提供的代码，完成后续的四个练习。
  ```javascript
    // support.js
    class Container {
      static of (value) {
        return new Container(value)
      }

      constructor(value) {
        this._value = value
      }

      map (fn) {
        return Container.of(fn(this._value))
      }
    }

    class Maybe {
      static of (x) {
        return new Maybe(x)
      }

      constructor(value) {
        this._value = value
      }

      isNothing () {
        return this._value === undefined || this._value === null
      }

      map (fn) {
        return this.isNothing() ? this : Maybe.of(fn(this._value))
      }
    }

    module.exports = {
      Maybe,
      Container
    }
  ```  
  - 练习1：使用 `fp.add(x, y)` 和 `fp.map(f, x)` 创建一个能让 functor 里的值增加的函数 `ex1`
    ```javascript
      const fp = require('lodash/fp')
      const { Maybe, Container } = require('./support')

      let maybe = Maybe.of([5,6,1])
      let ex1 = // ... 你需要实现的代码
    ```
    实现：
    ```javascript
      // 没明白这题什么意思... 如果让函子里的值增加fp.map不就可以么？为什么必须用上fp.add?
      let ex1 = maybe.map(fp.map(x => fp.add(1, x)))
      console.log(ex1);
    ```
  - 练习2：实现一个函数 `ex2`，能够使用 `fp.first` 获取列表的第一个元素
    ```javascript
      const fp = require('lodash/fp')
      const { Maybe, Container } = require('./support')
      
      let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
      let ex2 = // ... 你需要实现的代码
    ```
    实现：
    ```javascript
      let ex1 = xs.map(fp.first)
      console.log(ex1);
    ```
  - 练习3： 实现一个函数 `ex3`, 使用 `safeProp` 和 `fp.first` 找到 `user` 的名字的首字母。
    ```javascript
      const fp = require('lodash/fp')
      const { Maybe, Container } = require('./support')

      let safeProp = fp.curry(function(x, o) {
        return Maybe.of(o[x])
      })
      let user = {id: 2, name: 'Albert'}
      let ex3 =  // ... 你需要实现的代码
    ```
    实现：
    ```javascript
      let ex3 = Maybe.of(user)
        .map(safeProp('name'))
        .map(x => x._value)
        .map(fp.first)

      console.log(ex3);
    ```
  - 练习4：使用 `Maybe` 重写 `ex4` ， 不要有 `if` 语句。
    ```javascript
      const fp = require('lodash/fp')
      const { Maybe, Container } = require('./support')

      let ex4 = function (n) {
        if (n) { return parseInt(n) }
      }
    ```
    实现：
    ```javascript
      let ex4 = Maybe.of(['1', 2, null, '4', 6])
        .map(fp.map(x => parseInt(x)))

      console.log(ex4);
    ```