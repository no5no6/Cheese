import { init } from './node_modules/snabbdom/build/package/init.js'
import { classModule } from './node_modules/snabbdom/build/package/modules/class.js'
import { propsModule } from './node_modules/snabbdom/build/package/modules/props.js'
import { styleModule } from './node_modules/snabbdom/build/package/modules/style.js'
import { eventListenersModule } from './node_modules/snabbdom/build/package/modules/eventlisteners.js'
import { h } from './node_modules/snabbdom/build/package/h.js' // helper function for creating vnodes
// import abc from './node_modules/snabbdom/build/'

let patch = init([ // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
])

let count = 11

let vnode = null

const originalData = [
  { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'},
  { rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'},
  { rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.'},
  { rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.'},
  { rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'},
  { rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.' },
  { rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.' },
  { rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.'},
  { rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.'},
  { rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...'},
]

// 克隆原始数组到页面渲染数据集合中
let renderData = JSON.parse(JSON.stringify(originalData))

// 排序
const sortList = key => {
  renderData.sort((a, b) => {
    if(a[key] > b[key]) {
      return 1
    }else if(a[key] < b[key]) {
      return -1
    }else {
      return 0
    }
  })

  vnode = patch(vnode, render(renderData))
}

// 删除
const remove = number => {
  renderData = renderData.filter(({rank}) => rank !== number)
  vnode = patch(vnode, render(renderData))
}

// 新增
const add = () => {
  const {rank, title, desc} = originalData[Math.floor(Math.random() * 10)]
  let newNode = { rank: count++, title, desc }
  renderData.push(newNode)

  vnode = patch(vnode, render(renderData))
}

// 渲染列表行数据
const renderList = lineData => {
  return h('div.line-row', [
    h('span.number', lineData.rank),
    h('span.title', lineData.title),
    h('span.description', lineData.desc),
    h('button.remove-button', { on: { click: [remove, lineData.rank] } }, '删除'),
  ])
}

// 渲染整个页面
const render = data => {
  return h('div', [
    h('h1', 'snabbdom-demo'),
    h('div.button-group', [
      h('button',{
        style: {'margin-right': '20px'},
        on: { click: [add] } 
      },'新增'),
      h('button', {
        style: {'margin-right': '20px'},
        on: { click: [sortList, 'rank'] } 
      }, '序号排序'),
      h('button', {
        on: { click: [sortList, 'title'] } 
      }, '标题排序')
    ]),
    h('div.list', data.map(renderList))
  ])
}

// 页面加载事件
window.addEventListener('DOMContentLoaded', () => {
  let container = document.getElementById('container')
  vnode = patch(container, render(renderData))
})
