# Nodejs
## 介绍
  + ### 概念
    - Node.js 是一个基于 Chrome V8 引擎的 Javascript 运行环境
    
  + ### 特点
    - 主线程为单线程
      + 增加了线程的安全
      + 减少了线程之间切换时 cpu 开销、内存开销
      + 对于 cpu 密集计算不友好，也无法体现出 cpu 多核。但可以使用集群解决方案处理。
    - 非阻塞 IO  
      `Nodejs` 单线程配合事件驱动架构及 `libuv` 库，实现了非阻塞 IO
      > 除主线程外还有其他对应不同 IO 操作的线程，并且可以更改配置增加线程，但一般不需要。
    - 事件驱动  
      发布者广播消息，其他的订阅者监听到订阅的消息
  + ### 应用场景
    - 适用于 IO 密集型高并发请求，并不适用于复杂的高的逻辑处理 
    - 场景
      + 可使用 nodejs 在服务端和客户端之间做一道中间层
        - 接受客户端 http 请求
        - 格式化数据，渲染 html 界面
        - 合并接口请求
        - 解决跨域
        - 数据缓存
      + 直接操作数据库，搭建高效、轻量的 API 服务 （不关注大量业务逻辑的情况下）
      + 实时聊天程序
      + 前端工程化

  + ### 全局对象
    -  `__filename`  返回正在执行文件绝对路径
    - `__dirname` 返回正在执行文件所在目录
    - `timer` 执行顺序与实践循环的关系
    - `process` 提供与当前进程互动接口
      + 内存信息 `process.memoryUsage()`
      + cpu 信息 `process.cpuUsage()`
      + 当前工作目录 `process.cwd()`
      + 版本信息 `process.version`
      + cpu 架构 `process.arch`
      + 环境
        - 当前环境 `process.env.NODE_ENV`
        - 系统环境变量 `process.env.PATH`
      + 系统平台 `process.platform`
      + 执行参数 `process.argv`
      + 获取 pid `process.pid`
      + 运行时间 `process.uptime()`
      + 监听事件
        - 退出时执行 `process.on('exit', () => {})`
          > `exit` 事件里只能写同步代码
        - 退出前执行 `process.on('beforeExit', () => {})`
      + 退出进程 `process.exit()`
      + 流操作
        - 输出 `process.stdout`
        - 输入 `process.stdin`
    - `require` 加载模块
    - `module`、`exports` 模块导出
    - `path` 文件/目录的路径
      + 路径基础名称 `path.basename()`
      + 获取路径中目录名称 `path.dirname()`
      + 获取目录中扩展名称 `path.extname()`
      + 获取路径是否是绝对路径 `path.isAbsolute()`
      + 拼接多个路径 `path.join()`
      + 返回绝对路径 `resolve()`
      + 解析路径 `path.pasre()`
      + 序列化路径（与解析相反） `path.format()`
      + 规范化路径 `path.normalize()`
    - `Buffer` 缓存区（使用 js 操作二进制数据）
      + `alloc` 创建制定空间大小的 `buffer`
        
        ```js
          const b = Buffer.alloc(10)
        ```
      + `allocUnsafe` 创建制定大小的 `buffer` (不安全)。利用碎片化空间。
        
        ```js
          const b2 = Buffer.allocUnsafe(10)
        ```
      + `from` 接收数据，创建 `buffer`，
        
        ```js
          const b3 = Buffer.from('1')
        ```
      + 实例方法
        - `fill` : 使用数据填充 `buffer`
        - `write` : 向 `buffer` 中写入数据
        - `toString` : 从 `buffer` 中提取数据
        - `slice` : 截取 `buffer`
        - `indexOf` : 在 `buffer` 中查找数据
        - `copy` : 拷贝 `buffer` 中的数据
      + 静态方法
        - `concat` : 将多个 `buffer` 拼接成一个 `buffer`
        - `isBuffer` : 判断当前数据是否为 `buffer`
      + `FS` 文件操作模块
        