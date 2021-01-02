/**
 *  模拟 uex 基础功能V
 *  1. 定义插件的 install 方法。
 *    (1) 缓存 Vue 对象
 *    (2) 跟模拟 vueRouter 类似。如果让每个文件都能 this.$store 可以访问，需要混入 beforeCreate 尚明周期
 *    (3) 如果 options 中存在 store ，则将 store 绑定到原型上。
 *  2. 定义 store 类。
 *    (1) 构造函数中结构 options 属性（state, getter, mutations, actions） 
 *    (2) state 转换成响应式
 *    (3) 把用户传来的 getter 方法，注册到 Vuex getter 中
 *    (4) mutations 和 actions 方法注册到 Vuex 对应属性中
 *    (5) 实现 commit 和 dispatch 方法
 */
let _Vue = null

class Store {
  construction(options) {
    const {
      state = {},
      getters = {},
      mutations = {},
      actions = {}
    } = options

    this.state = _Vue.observable(state)
    this.getters = Object.create(null)
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get() => getters[key](state)
      })
    })
    this._mutations = mutations
    this._actions = actions
  }

  commit(type, payload) {
    this._mutations[type](this.state, payload)
  }

  dispatch(type, payload) {
    this._actions[type](this, payload)
  }
}

function install (vue) {
  _Vue = vue
  _Vue.mixin({
    beforeCreate() {
      if(this.$options.store) {
        _Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {
  Store,
  install
}