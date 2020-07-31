// 模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化
let _Vue = null
export default class VueRouter {

  /**
   *  属性
   *  1，options 记录路由规则 routes 对象。
   *  2. data 对象中 current 属性，用于记录当前地址，且为响应式对象（通过 observable 方法）、
   *  3. routeMap 记录组件和地址的映射关系等。
   */


  // 1. Constructor 构造函数。
  constructor(options) {
    // 判断组件是否初始化。
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable(
      {
        current: '/#/',
        path: '/',
        query: ''
      }
    )

    this.init()
  }

  // 2. 静态 install 方法，vue 插件机制。
  static install(Vue) {
    // 判断当前插件是否被安装
    if(!VueRouter.install.installed) {
      VueRouter.install.installed = true

      // 把 Vue 记录到全局
      _Vue = Vue

      // 把 router 对象注入 Vue 实例
      _Vue.mixin( {
        beforeCreate() {
          if(this.$options.router) {
            _Vue.prototype.$router = this.$options.router
          }
        }
      })
    }
  }

  // 3. initEvent 监听浏览器地址变化，hashchange事件。
  initEvent() {
    window.addEventListener('hashchange', () => {
      let reg = location.hash.includes('?') ? /^\#(.*)\?(.*)/ : /^\#(.*)/
      reg.test(location.hash)

      this.data.path = RegExp.$1
      this.data.query = RegExp.$2
      this.data.current = location.hash
    })
  }

  // 4. createRouteMap 初始化 routeMap 属性，把路由规则转换成键值对形式，存储到 routeMap 里，键路由地址，值对应组件。
  createRouteMap() {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  // 5. initComponents 创建 <router-view> 和 <router-link> 组件。 
  initComponents() {
    _Vue.component('router-link', {
      props: {
        to: String | Object,
      },
      render(h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickRouter
          }
        }, [this.$slots.default])
      },
      methods: {
        clickRouter(event) {
          let path = ''
          let query = ''

          // 解析 to 参数 是字符串还是对象
          if(this.to && this.to.path) {
            path = this.to.path
            query = this.to.query || query
          }else{
            path = this.to || path
          }
          
          const queryStr = this.getUrlParameters(query)
          let hashPath = `/#${path}`
    
          if(queryStr) hashPath += `?${queryStr}`
          console.log(hashPath, 'hashPathhashPathhashPath', queryStr)

          history.pushState({}, '', hashPath)

          this.$router.data.current = hashPath
          this.$router.data.path = path
          this.$router.data.query = query

          // 阻止事件冒泡，解决点击页面刷新问题
          event.preventDefault()
        },
        getUrlParameters(queryObject) {
          const keyArray = Object.keys(queryObject) 
          console.log(keyArray, 'ksksksksksksksks')
          return keyArray.reduce((memo, key, index) => {
            if(index !== 0) memo += '&'
            memo += `${key}=${queryObject[key]}`
            return memo
          }, '')
        }
      }
    })

    let _this = this

    _Vue.component('router-view', {
      render(h) {
        let component = _this.routeMap[_this.data.path]
        return h(component)
      }
    })
  }

  // 初始化
  init() {
    this.initEvent()
    this.createRouteMap()
    this.initComponents()
  }
}