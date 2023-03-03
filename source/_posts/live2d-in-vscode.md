---
title: VSCode美化之集成live2d
date: 2023-02-20 11:14:36
tags: 
 - vscode美化
categories: vscode
keywords: vscode美化,live2d,看板娘
description: vscode美化教程之把会动的看板娘集成到vscode
thumbnail: /assets/live2d-in-vscode/1.png
top_img: /assets/live2d-in-vscode/1.png
cover: /assets/live2d-in-vscode/1.png
excerpt: vscode美化教程之把会动的看板娘集成到vscode，让你的撸代码的时候不再无聊。
---

今天闲来无事来搞点花的，live2d想必大家已经见怪不怪了，各种手游啊，各类网站啊，只要是点了能动的<span class="shy-block">点了会让二刺螈无脑氪金的</span>二次元动态人物基本都是基于live2d开发的，闲来无事看到vscode插件商店里有个background的插件居然有那么多star，那把live2d集成进vscode那不得起飞咯。

## Task：集成live2d到vscode

作为一个前端，只要我找到了能让我运行JavaScript的地方，啥都好办。总所周知，vscode是基于electron开发的，electron又是基于chromium开发的（也就是chrome的开发版），那这不是相当好办吗，先天的浏览器环境。废话不多说，直接开整。

### 找到vscode的入口文件

electron都有个入口html文件的，就像web服务器都要有个index.html一样。在vscode的菜单栏点击Help->Toggle Developer Tools（中文应该是打开开发人员工具吧），熟悉的devTools就出现了。
接下来按Ctrl+Shift+p打开命令窗口，输入reload可以看见Developer:Reload Window（中文应该是重启窗口吧），点击重新刷一下vscode，此时看回DevTools的Network，看到第一个请求就是入口文件了。大概是这个样子![入口文件](/assets/live2d-in-vscode/2.png)看到请求的url地址可以看到入口文件在安装目录下的
/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html

### 魔改入口文件

#### 取消CSP安全策略

打开入口文件，其实没多少代码，但是映入眼帘的一大堆csp策略也是让我很头疼，这使得我难以注入我的脚本。这应该是vscode为了插件生态做了很多安全策略。想到这我不禁开始考虑要不要写插件，权衡了一下决定还是直接改文件<span class="shy-block">别问，问就是懒</span>，两行csp都给注释了，就是下面这个，删了也无所谓。

``` html
    <!-- <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src 'self' https: data: blob: vscode-remote-resource:; media-src 'self'; frame-src 'self' vscode-webview:; object-src 'self'; script-src 'self' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' https: ws:; font-src 'self' https: vscode-remote-resource:;"
    /> -->
    <!-- <meta
      http-equiv="Content-Security-Policy"
      content="require-trusted-types-for 'script'; trusted-types amdLoader cellRendererEditorText defaultWorkerFactory diffEditorWidget stickyScrollViewLayer editorGhostText domLineBreaksComputer editorViewLayer diffReview dompurify notebookRenderer safeInnerHtml standaloneColorizer tokenizeToString;"
    /> -->
```

#### 添加脚本

下面来下载我的脚本 {% btn '/assets/live2d-in-vscode/vscode-live2d.zip',vscode-live2d.zip,far fa-hand-point-right,outline green %}，我也是从github上找到的sdk，加上了自己的一部分代码。
把脚本解压后放到\workbench目录，和入口文件平级。继续修改入口文件，如下加入两个脚本链接。

``` javascript
  <!-- Startup (do not modify order of script tags!) -->
  <script src="workbench.js"></script>
  <!-- 加上下面两行 -->
  <script src="L2Dwidget.min.js"></script>
  <script src="initL2DWidget.js"></script>
```

保存，关掉vscode，重新打开就可以看到右下角的小埋了。下面讲下脚本配置，比较关键，比如关掉交互，换其他纸片人啊。
打开initL2DWidget.js文件，看到最后的函数调用。

``` initL2DWidget.js
...
initL2DWidget(
  {
    model: {
      jsonPath: "packages/小埋/13.json", // 这是模型路径，需要增加其他模型的扔到packages里面改下路径就行
      scale: 0.6, // 缩放，按照需求自行调节
    },
    dialog: { // 点击出现对话框
      enable: true,
      script: {
        "tap body": "Coding!!!",
        "tap face": "你在认真写代码吗？",
      },
    },
    display: { // 模型渲染尺寸
      width: 200,
      height: 200,
      // vOffset: 20,
    },
  }, // 其他一些参数可以参考我找的sdk，https://l2dwidget.js.org/docs/class/src/index.js~L2Dwidget.html
  "#workbench\\.parts\\.editor", // 模型插入dom位置，这个按需求调，默认是放在body里fixed布局，因为比较遮挡下面的调试窗口我给挪了个位置
  {
    position: "absolute",
    "z-index": 1,
    width: "200px",
    height: "200px",
    right: 0,
    bottom: 0,
    "pointer-events": "none", // 不需要模型交互的加上这行，小心在办公室撸代码的时候不小心点到，然后外放个社死语音
  }, // 包裹模型canvas的容器样式，按需求调
  {
    width: "100%",
    height: "100%",
  }, // 模型canvas的样式，按需求调
  {  // 对话框的样式
    top: "-50px",
  }
);
```

纸片人模型到哪找，相信各位路子应该都有。我这里提供一个repo，[https://github.com/Eikanya/Live2d-model](https://github.com/Eikanya/Live2d-model)。然后live2d 3.0的集成我其实也做了，但是这个网页性能着实太低，都影响我撸代码了，这里也就不提供教程了，感兴趣的可以去我的repo里看<span class="shy-block">顺便点个star吧(*^__^*)</span>[https://github.com/enjoy7ech/vscode-live2d-dev/tree/master/live2d_3](https://github.com/enjoy7ech/vscode-live2d-dev/tree/master/live2d_3)。
有任何问题或者优化需要pr的可以到这个仓库<i class="far fa-hand-point-right"></i>[https://github.com/enjoy7ech/vscode-live2d](https://github.com/enjoy7ech/vscode-live2d)

最后附个修改模型后的截图。![](/assets/live2d-in-vscode/2.gif)
