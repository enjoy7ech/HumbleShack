---
title: 一文了解PWA，渐进式的开发理念
date: 1977-03-10 09:49:36
tags: 
 - 前端
 - PWA
 - Service Worker
categories: 前端
keywords: 前端,pwa,Service Worker
description: PWA应用，Service Worker的运作原理，来构建具有原生应用程序功能的应用程序吧。
thumbnail: /assets/pwa/PWA.jpg
top_img: /assets/pwa/PWA.jpg
cover: /assets/pwa/PWA.jpg
excerpt: PWA应用，Service Worker的运作原理，来构建具有原生应用程序功能的应用程序吧。
---

PWA（Progressive Web App）是一种在移动设备和桌面浏览器上提供原生应用体验的渐进式Web应用程序，是一种比较好的离线化方案，同样也是一种缓存方案。由于平常接触的比较少，写一篇来记录下。还是先让人工具人来说两句，<i class="fa-solid fa-hands-clapping"></i><i class="fa-solid fa-hands-clapping"></i><i class="fa-solid fa-hands-clapping"></i>。

<div class="message-container">
    <div class="bubble-container me">
        <div class="avatar">
            <img src="/images/avatar.png" alt="" />
        </div>
        <div class="message">
            <div class="bubble-box">PWA简介</div>
        </div>
    </div>
    <div class="bubble-container you">
        <div class="avatar">
            <img src="/images/chatgpt.svg" alt="" />
        </div>
        <div class="message">
            <div class="bubble-box">
PWA（Progressive Web App）是一种渐进式的Web应用程序，它使用现代的Web技术来创建具有原生应用程序的体验。PWA可以像网页一样在浏览器中访问，但它们具有类似原生应用程序的交互性和响应性。PWA可以像原生应用程序一样运行在用户的设备上，并可以在离线或网络较差的情况下工作。

PWA具有以下几个关键特点：

1. 渐进式增强：PWA应用程序可以在所有设备和浏览器上使用，并提供了一种逐步增强的体验，使其适应性更强。
2. 可安装性：PWA应用程序可以通过添加到设备主屏幕上来安装，使得用户可以像打开原生应用程序一样访问它们。
3. 离线工作：PWA应用程序可以在离线状态下工作，通过使用服务工作线程缓存应用程序所需的资源来实现。
4. 快速加载：PWA应用程序可以快速加载，因为它们使用的技术（如Web Workers和Service Workers）可以在后台预加载资源。

总之，PWA应用程序提供了更好的性能和用户体验，同时也提供了更好的开发效率，因为可以使用现有的Web技术来创建具有原生应用程序功能的应用程序。
            </div>
        </div>
    </div>
</div>

## PWA的前世今生

它的历史可以追溯到2015年。当时，Google的工程师Alex Russell和Frances Berriman在一篇博客文章中首次提出了这个概念。

在当时，原生应用程序仍然是移动应用程序的主要开发方式，但是原生应用程序需要用户下载和安装，这使得应用程序的获取和使用变得相对麻烦。PWA技术的出现，可以让Web应用程序获得更好的性能和用户体验，同时避免了下载和安装的麻烦。

PWA技术结合了Web应用程序和原生应用程序的优点，可以让Web应用程序具有类似原生应用程序的功能和体验，例如可以离线使用、推送通知、访问硬件设备等等。此外，PWA技术还可以让Web应用程序具有更快的加载速度和更好的性能，这是由于PWA技术可以利用浏览器的缓存技术和其他技术来实现。

随着PWA技术的发展，越来越多的公司和开发者开始使用PWA技术来开发移动应用程序。目前，PWA技术已经被广泛应用于各种领域，例如电子商务、新闻媒体、社交媒体等等。在chrome浏览器中可以访问 **chrome://apps** 快捷的查看已经安装的PWA。

## PWA中的技术

PWA里有很多的技术，主要都围绕这如何高效的进行应用的呈现，也就是说，所有能提升页面性能的技术方案都可以融入PWA的构建中。

### service work

![Service Worker流程图](/assets/pwa/Working_Mechanism_of_PWA.png)

2014年，W3C公布过Service Worker的相关草案，但是其在生产环境被Chrome支持是在2015年。其作为PWA的核心技术，给web资源提供了缓存的基础。

Service Worker是一种Web Worker，它是在Web应用程序和浏览器之间运行的JavaScript文件。web worker是独立于浏览器主线程之外的线程(不懂浏览器里的线程的可以看我另一篇文章<i class="fa-regular fa-hand-point-right"></i>[浏览器渲染原理](https://blog.dzx-tunnel.quest/2023/02/27/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/))，这就意味着其不能干主线程才能干的事情（dom操作之类的）。与此同时，线程之间的通信也能推断出Service Worker是一种事件驱动的工作模型。

Service Worker提供了一种在浏览器后台运行脚本的方式，可以控制和处理Web应用程序的网络请求和响应。它可以在没有打开网页的情况下运行，并可以与网页进行通信。下面稍微讲讲细节。

#### 生命周期

Service Worker具有自己的生命周期，当它被注册并安装到浏览器中时，它将在后台运行，即使用户已经关闭了Web应用程序的所有实例。生命周期分为下面三个部分：

1. 注册：通过JavaScript代码调用navigator.serviceWorker.register()方法来注册Service Worker。在注册期间，浏览器会下载Service Worker脚本并在后台安装它。在安装期间，可以进行一些初始化操作，例如缓存Web应用程序所需的资源。
2. 安装：当Service Worker被安装后，它会开始缓存指定的资源。这些资源可以是静态文件，也可以是动态生成的内容。如果安装过程中发生任何错误，Service Worker将不会被激活。
3. 激活：当Service Worker已经安装并且没有任何其他版本的Service Worker在控制同一范围内的客户端时，它将被激活。在激活期间，Service Worker可以控制网页的请求，并且可以使用缓存来提供响应。

#### 核心代码

Service Worker中的核心逻辑还是需要使用者自己编写的，比如只缓存特定的路由下的资源，这里让工具人写段代码稍微了解下:

``` javascript
// 定义要缓存的文件列表
const cacheFiles = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/images/logo.png'
];

// 监听安装事件
self.addEventListener('install', event => {
  // 缓存指定的文件
  event.waitUntil(
    caches.open('myCache').then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

// 监听激活事件
self.addEventListener('activate', event => {
  // 删除旧缓存
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== 'myCache')
        .map(key => caches.delete(key))
      );
    })
  );
});

// 监听请求事件
self.addEventListener('fetch', event => {
  // 从缓存中获取响应
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      // 如果缓存中没有响应，则从网络获取
      return fetch(event.request);
    })
  );
});

```

可以看出来代码的需要实现的逻辑还是比较多的，还需要配合cache API。当遇到复杂的项目的时候，一堆hash的逻辑肯定难以维护。PWA发展这么久可想而知，规范化的方案在PWA发展了这么久之后肯定是已经出现了。

**Workbox**是Google Chrome团队推出的一套PWA的解决方案，这套解决方案当中包含了核心库和构建工具，因此我们可以利用Workbox实现Service Worker的快速开发。在迭代了很多版本后，也是成为了现在Service Worker的主流方案。这里不详细展开了，留个文档：[https://developer.chrome.com/docs/workbox/the-ways-of-workbox](https://developer.chrome.com/docs/workbox/the-ways-of-workbox)

#### cache API

Service Worker具有自己的缓存API，可以将资源缓存在浏览器中，以便在离线时使用。这些缓存资源可以是静态文件，也可以是动态生成的内容。具体可以参考[https://developer.mozilla.org/zh-CN/docs/Web/API/Cache](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)

#### 线程通信

上文已经说过了Service Worker是使用web worker创建的独立线程，可以使用postMessage()方法与Web应用程序通信，以便在不同的线程中交换信息。这可以用于向Service Worker发送命令，例如更新缓存或清除缓存。

#### 安全

由于Service Worker可以拦截和修改网络请求和响应，因此必须通过HTTPS来使用它。这是为了确保通信的安全性和完整性。想使用这项技术的朋友要稍微注意下。

### Web App Manifest

这是一个JSON文件，描述了应用程序的名称、图标、主题颜色、启动URL等。它允许您在主屏幕上安装PWA，并使其看起来和感觉像本地应用程序。

### 响应式设计

由于PWA可以运行在多端上，如果考虑在移动端使用，响应式的设计是必要的，以适应各种屏幕尺寸和设备类型。随着2018年safari对Service Worker的支持，PWA已经可以在ios上使用了。

### Web Push

是一种通过浏览器推送通知的技术，使应用程序可以在用户不活跃时发送消息。后面单独写一篇实战篇。

### Background Sync

Background Sync是一项Web API技术，可以在用户离线时仍然保持数据同步。它允许Web应用程序在用户离线时将数据存储在后台，并在恢复网络连接时将数据提交到服务器。
以下是Background Sync的工作流程：

1. 注册一个Service Worker：使用Service Worker可以在浏览器后台运行代码。在Service Worker注册成功后，可以使用Background Sync API。
2. 将需要同步的数据存储在后台：当应用程序需要保存数据时，它可以使用IndexedDB或其他客户端存储机制将数据存储在本地。然后，使用Background Sync API将请求添加到队列中。
3. 在网络连接恢复时发送数据：当网络连接恢复时，Service Worker会接收到“sync”事件。在事件处理程序中，可以使用Background Sync API将队列中的请求发送到服务器。如果请求成功，则可以从队列中删除请求。如果请求失败，则会在下一次“sync”事件时重新尝试。

使用Background Sync的好处是，即使在网络连接中断时，Web应用程序也可以在后台继续工作，并在网络连接恢复时同步数据。这对于需要保持数据同步的在线应用程序非常有用，例如社交媒体、电子邮件和即时消息应用程序等。顺便一提，在上文提到的**Workbox**已经集成了相关的功能。

## PWA现状

PWA从提出至今已经发展了很长的时间了，明明有着比较强的资源策略，却是不温不火。对于移动设备来说，前有本地 App，后有移动小程序，想要浏览器切入到移动端是相当困难的一件事，因为浏览器的运行性能是低于本地 App 的，并且 Google 也没有类似微信或者 Facebook 这种体量的用户群体。

但是作为一个前端开发，我能感觉PWA这种技术理念是更成熟的，一处编写到处使用不正是各家大厂努力的方向，其背后降本增效的思想永不过时。其次，对于现在琳琅满目的APP市场，与其说web与app相比缺少一级入口，我倒是觉得app缺少了门户的入口，对于一套生态的站点，web应用可以通过同域做到共享，而app只能一个个下载注册登录实在是太累。未来的PWA可以是一个门户的入口，一处登录，各处使用，对于企业的技术架构甚至是项目架构都会有更多的高效灵活的变化。

我不觉得PWA是web app，它是一种凝练的web开发的理念，web技术发展至今仍在不断发展，你时刻都可以在PWA中加入这些新的技术增加你的站点体验，想想为了网站性能优化做的各种webpack analyze，chunk策略都可以是PWA的一部分，我想这也是他叫渐进式的原因，就像你在不断打磨一个雕塑的过程，更更合理的io策略、更完善的技术架构永远是下一个目标，这种思想下诞生的应用注定是越来越好的。

最后，敬每一个登峰造极的前端开发人。
![](/assets/pwa/014254525.jpg)
