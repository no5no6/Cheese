# SPA（单页面应用） 网站 SEO ( Search Engine Optimization ) 提升
## 研发
  + ### HEAD 优化
    - 每个页面个性化的标题、描述信息
      + 增加关键字  
        `<meta name="keywords" content="收视率,关注度,明星,等等...">`
        > **网上查了一些资料表明，由于keywords的特性方便搜索器搜索，也会导致搜索排行的变化（越多关键词越容易上排行前列），所以现在一部分搜索引擎不再将keywords考虑进搜索算法中**。
      
      + 增加网站内容描述息
      `<meta name="description" content="xxxxxxx">`

      > 注意：标签结束的时候不要写 `/>` 而是直接写 `>`
    
    - 增加 OG 标签 
      + OG 标签是什么  
        - `Open Graph Protocol`（开放图谱协议）， 解决社交媒体转发时候的标题、文字、图片等内容的设置。百度、微博、微信、人人网等等头部企业都支持此协议
      
      + 对 SEO 的用处
        - **我们可以针对用户分享的链接定制一套特殊的分享图片、标题、描述，最大限度的吸引被分享者访问的可能性**。
        - 丰富的 OG 标签对 SEO 是有加持的作用
      
      + OG 标签有哪些
        ```html
          <meta property="og:title" content="What is Open Graph?"/>
          <meta property="og:description" content="Computer dictionary definition for what Open Graph means including related links, information, and terms."/>
          <meta property="og:type" content="article"/>
          <meta property="og:image" content="facebook.gif"/>
        ```
    - html 标签优化
      + 标签语义化
        + 尽量多使用有含义的标签，如 `article`、 `section`、`aside` 等
      + 其他优化
        - 文档类型统一使用HTML5 doctype `<!DOCTYPE HTML>`
        - img标签加上alt关键字
        - logo处加h1标签，搜索引擎默认h1标签这个标题是网页中最重要的信息，所以应该把最重要信息加入到 `<H1>` 标签内

    - 同构 ssr 渲染
      + 为什么使用同构 ssr 渲染？
        - 因为 `spa` 网站是客户端渲染页面，蜘蛛当访问到当前网站时，不会等待 `js` 执行，所以导致蜘蛛抓取的页面是个空壳子，没有数据的页面。
      + 同构 ssr 渲染是什么？
        - 通过服务器渲染需要 `SEO` 的数据（如首屏内容或详情页面等），将网页初始化加载的内容变为静态内容
        - 首次加载完后的页面其他操作交给前端 `js` 来执行（如筛选后更新数据等）

          > + 即提高了 `SEO` ，并且也可以在用户操作时体验页面无刷新( `ajax` )更新数据
          > + 同构 `ssr` 渲染方案在大用户量访问的情况下，会对服务器的承载量有一定压力，需认真评估后，才可使用此方案
          > + 有一些团队的做法是只给蜘蛛走 `ssr` 页面，用户还是访问的前端渲染的普通 `SPA` 应用，当然这样也增加了维护成本
      
    - 添加 Sitemap 网站地图
      > 给蜘蛛指明网站路径，便于蜘蛛的爬取和内容的收录

    - 添加 robots.txt 文件
      > 告诉蜘蛛那些页面不去爬取，增加蜘蛛效率。

    - 通过监测工具优化 SEO 策略
      > 网站流量分析从 SEO 结果上指导下一步的 SEO 策略，同时对网站的用户体验优化也有很大的意义。

## 产品
  + ### 网站扁平化
    > 扁平化并不是简单的把所有内容的一级入口都放到首页。
    - 网站扁平化节省搜索引擎蜘蛛的爬取时间
    - 潜在用户在访问网站时，也能更快的获取到需要的信息。
  + ### 更好的网页内容聚合
    > 增加页面权重，页面内部链接越多，其PageRank（权重）就越高
    + 将同类内容页面进行聚合，蜘蛛和用户都能更好的理解网站内容。
    + 更多的站内反向链接可突出某些页面的重要性，增加权重。
      > 一定避免大量的内部链接，链接到了并不重要的页面

## 市场
  + ### 增加曝光 (外链)
    - 多在头部媒体曝光，贴吧、知乎、微薄等等，多发网站的链接地址。
    - 和友商、合作伙伴交换友情链接。
    
## 其他（黑魔法）
  > 以下内容摘自 [维基百科](https://zh.wikipedia.org/wiki/%E6%90%9C%E5%B0%8B%E5%BC%95%E6%93%8E%E6%9C%80%E4%BD%B3%E5%8C%96)
  + 垃圾索引（Spamdexing）意指透过欺骗技术和滥用搜索算法来推销毫不相关、主要以商业为着眼的网页。许多搜索引擎管理员认为任何搜索引擎优化的形式，其目的用来改进网站的页排名者，都是垃圾索引。然而，随时间流逝，业界内公众舆论发展出哪些是哪些不是可接受的、促进某站的搜索引擎排名与流量结果的手段。
  + 斗蓬法（cloaking）简单来讲就是网站站长用了两版不同的网页来达到优化的效果。一个版本只给搜索引擎看，一个版本给人看。搜索引擎说这种做法是不正规，如发现，该网站会永远从搜索引擎名单中被剔除。但是对于如AJAX所撰写的动态网页，Google也有提出名为HTML Snapshot的作法，以方便搜索引擎进行收录
  + 关键字隐密字 （hidden text with keyword stuffing）是另外一欺骗搜索引擎的做法。通常是指设置关键字的颜色和网页背景颜色一样，或透过 css hidden attribute （隐密特性） 来达到优化效果。这种做法一旦被Google发现，遭遇也会是该网站从Google的数据库中除名
  + 桥页（doorway pages）也叫门页，是通常是用软件自动生成大量包含关键词的网页，然后从这些网页做自动转向到主页。目的是希望这些以不同关键词为目标的桥页在搜索引擎中得到好的排名。当用户点击搜索结果的时候，会自动转到主页。有的时候是在桥页上放上一个通往主页的链接，而不自动转向主页。
  + 付费链接（paid link）　是利用支付费用方式要求其他网站提供链接至自身网站，借此伪装高信任网站来欺骗搜索引擎，付费链接类型多为锚点文字（Anchor Text）类型，Google的质量方针也明确指出以金钱交换的链接将可能对网站造成负面影响
  + 链接农场（link farm）　是故意在一些低质量，内容跟自己内容无关的网站上获取大量链接，藉以提高排名