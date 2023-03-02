---
title: VSCode美化之集成live2d
date: 2023-02-20 11:14:36
tags: 
 - vscode美化
categories: vscode
keywords: vscode美化,live2d,看板娘
description: vscode美化教程之把会动的看板娘集成到vscode
thumbnail: /assets/live2d-in-vscode/1.jng
top_img: /assets/live2d-in-vscode/1.jng
cover: /assets/live2d-in-vscode/1.jng
excerpt: vscode美化教程之把会动的看板娘集成到vscode，让你的撸代码的时候不再无聊。
---

今天闲来无事来搞点花的，live2d想必大家已经见怪不怪了，各种手游啊，各类网站啊，只要是点了能动的<span class="shy-block">点了会让二刺螈无脑氪金的</span>二次元动态人物基本都是基于live2d开发的，闲来无事看到vscode插件商店里有个background的插件居然有那么多star，那把live2d集成进vscode那不得起飞咯。

## Task：集成live2d到vscode

作为一个前端，只要我找到了能让我运行JavaScript的地方，啥都好办。总所周知，vscode是基于electron开发的，electron又是基于chromium开发的（也就是chrome的开发版），那这不是相当好办吗，先天的浏览器环境。废话不多说，直接开整。

### 找到vscode的入口文件

electron都有个入口html文件的，就像web服务器都要有个index.html一样。在vscode的菜单栏点击Help->Toggle Developer Tools（中文应该是打开开发人员工具吧），熟悉的devTools就出现了。
接下来按Ctrl+Shift+p打开命令窗口，输入reload可以看见Developer:Reload Window（中文应该是重启窗口吧），点击重新刷一下vscode，此时看回DevTools的Network，看到第一个请求就是入口文件了。大概是这个样子![2](/assets/live2d-in-vscode/2.png)看到请求的url地址可以看到入口文件在安装目录下的
/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html

### 魔改入口文件

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

下面来下载我的脚本 {% btn 'https://butterfly.js.org/',vscode-live2d.zip,far fa-hand-point-right,outline green %}
