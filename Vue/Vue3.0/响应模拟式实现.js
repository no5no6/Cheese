const user = {
  name: '小王',
  age: 18,
  pets: {
    dog: ['tom', 'jerry'],
    cat: ['coco', 'food']
  }
}

const proxyUser = new Proxy(user, {
  get(target, property) {
    return Reflect.get(target, property)
  },

  set(target, property, value) {
    return Reflect.set(target, property, value)
  },

  deleteProperty(target, property) {
    return Reflect.deleteProperty(target, property)
  }
})

// console.log(user.name)
// proxyUser.name = '老刘'
// console.log(user.name)
// proxyUser.gender = '男'
// delete proxyUser.age
// proxyUser.pets.dog[0] = '阿加莎'
// console.log(user)