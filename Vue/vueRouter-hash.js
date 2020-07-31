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
      const {path, query, hashPath} = getHashParameters()
      this.data.path = path
      this.data.current = hashPath
      this.data.query = query
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
        to: String,
        query: String
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
          const hashPath = `/#${this.to}`
          history.pushState({}, '', `/#${this.to}`)
          console.log(' this.options',  this.options)

          this.$router.data.current = hashPath
          this.$router.data.path = this.to
          this.$router.data.query = this.query || ''

          // 阻止事件冒泡，解决点击页面刷新问题
          event.preventDefault()
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

  // 获取 url hash 值和参数。
  getHashParameters() {
    /^\#(.*)\?(.*)/.test(location.hash)
    return {path: RegExp.$1, query: RegExp.$2, hashPath: location.hash}
  }
}