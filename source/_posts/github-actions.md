---
title: 自动化方案之Github Actions
date: 2023-02-20 11:14:36
tags: 
 - github-actions
categories: 自动化
keywords: 自动化,Github Actions
description: 脚本部署太麻烦？试试github actions，免费的自动化流程部署。
thumbnail: /assets/github-actions/thumbnail/GitHubActions.png
top_img: /assets/github-actions/thumbnail/GitHubActions.png
cover: /assets/github-actions/thumbnail/GitHubActions.png
excerpt: 脚本部署太麻烦？试试github actions，免费的自动化流程部署。
---
撸了一天blog，有点嫌弃这个部署效率，都3202年了，居然还要我去服务器上运行个部署脚本，自动化搞上 <span class="shy-block">顺便让我水一篇</span>

老惯例，先让工具人说两句。

<div class="message-container">
    <div class="bubble-container me">
        <div class="avatar">
            <img src="/images/avatar.png" alt="" />
        </div>
        <div class="message">
            <div class="bubble-box">详细介绍下github actions</div>
        </div>
    </div>
    <div class="bubble-container you">
        <div class="avatar">
            <img src="/images/chatgpt.svg" alt="" />
        </div>
        <div class="message">
            <div class="bubble-box">
GitHub Actions 是 GitHub 提供的一项持续集成/持续部署（CI/CD）服务，可让开发者自动化软件工作流程。通过在存储库中编写和组织一系列任务（例如编译代码、运行测试、构建应用程序、部署到服务器等），GitHub Actions 可以在存储库发生特定事件时（例如推送代码、创建拉取请求、发布新版本等）自动执行这些任务，以加快开发者的开发流程。
以下是一些 GitHub Actions 的特点和优点：

· 集成在 GitHub 平台中，可方便使用，不需要额外的注册和配置。
· 支持多种编程语言和框架，如 JavaScript、Python、Java、Ruby、Docker 等。
· 支持定时任务、事件触发任务等多种触发方式。
· 支持在多个操作系统和环境中执行任务。
· 可以使用预定义的操作，例如构建、测试、部署等，也可以编写自定义的操作。
· 提供了丰富的日志和报告，以方便开发者监控任务执行情况。

使用 GitHub Actions，开发者可以通过自动化流程，快速、高效地构建、测试和部署应用程序，从而提高开发效率和质量。</div>
        </div>
    </div>
</div>

好，鼓掌👏👏👏。下面还是实战记录讲解下配置流程。

## Task: 自动化blog部署

目前github-actions有很多配置项，详细请参考[官方文档](https://docs.github.com/zh/actions/quickstart)。

github会提供机器用于actions，但是需要[收费](https://docs.github.com/zh/billing/managing-billing-for-github-actions/about-billing-for-github-actions)，而且咱的静态资源在服务器上，图方便肯定是在服务器上打包，对于自托管的运行器，gitHub[有相应的说明](https://docs.github.com/zh/actions/hosting-your-own-runners/about-self-hosted-runners)。比如自托管运行器与 GitHub Actions 未连接超过 14 天，将被自动从 GitHub 中删除等等的一些规范。

### 添加自托管的运行器到仓库

在repo页面，单击 “设置”，左侧栏找到Actions/Runners，根据服务器的类型选下可以看到部署脚本，下面解释脚本的意思，建议不要复制下面的脚本使用，以防脚本更新，主要还是按照github提供的脚本来。

``` bash
# 创建目录（找个合适的地方存放runner）
mkdir actions-runner && cd actions-runner
# 下载最新的runner（注意比较github页面上的脚本）
curl -o actions-runner-linux-x64-2.301.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.301.1/actions-runner-linux-x64-2.301.1.tar.gz
# 可选：验证下载文件的hash，防止下载文件有问题
echo "3ee9c3b83de642f919912e0594ee2601835518827da785d034c1163f8efdf907  actions-runner-linux-x64-2.301.1.tar.gz" | shasum -a 256 -c
# 解压
tar xzf ./actions-runner-linux-x64-2.301.1.tar.gz
# 配置token，这一步可能会出现Must not run with sudo的报错，就是不让你使用root用户执行（安全考虑）。可以在前面加个RUNNER_ALLOW_RUNASROOT="1"，如下
RUNNER_ALLOW_RUNASROOT="1"  ./config.sh --url {替换你的url} --token {替换你的token}
```

如果上一步出现了什么missing依赖的执行sudo ./bin/installdependencies.sh，具体的报错里会有提示<span class="shy-block">什么叫专业，看看人家做的脚本多么银杏</span>。执行完显示

``` bash
--------------------------------------------------------------------------------
|        ____ _ _   _   _       _          _        _   _                      |
|       / ___(_) |_| | | |_   _| |__      / \   ___| |_(_) ___  _ __  ___      |
|      | |  _| | __| |_| | | | | '_ \    / _ \ / __| __| |/ _ \| '_ \/ __|     |
|      | |_| | | |_|  _  | |_| | |_) |  / ___ \ (__| |_| | (_) | | | \__ \     |
|       \____|_|\__|_| |_|\__,_|_.__/  /_/   \_\___|\__|_|\___/|_| |_|___/     |
|                                                                              |
|                       Self-hosted runner registration                        |
|                                                                              |
--------------------------------------------------------------------------------
```

之后是配置runner的信息，一路回车到结束。刷新下github的runner页面，这时已经能看到刚刚添加的runner了。
最后一步让你./run.sh，这肯定不行啊。<span class="shy-block">艹，上面做的那么好，最后拉了裤</span>以linux为例，写个守护进程

``` bash
vi /etc/systemd/system/actions-runner.service
# 把下面的粘贴进去，需要学习systemd.service的，可以看这个http://www.jinbuguo.com/systemd/systemd.service.html

[Unit]
Description=actions-runner
# 在网络初始化之后启动
After=network.target

[Service]
Type=simple
Restart=always
User=root

# 环境变量
Environment=RUNNER_ALLOW_RUNASROOT=1
# 启动命令，替换run.sh的绝对位置
ExecStart=/bin/bash /root/github/actions-runner/run.sh
[Install]
# 当系统以多用户方式启动时，这个服务需要被自动运行
WantedBy=multi-user.target
```

保存service后，添加到开机启动

``` bash
systemctl enable actions-runner.service
```

启动

``` bash
systemctl start actions-runner.service
```

查看状态

``` bash
systemctl status actions-runner.service
```

看到active是running就搞定了

``` bash
● actions-runner.service - actions-runner
   Loaded: loaded (/etc/systemd/system/actions-runner.service; disabled; vendor preset: disabled)
   Active: active (running) since Mon 2023-02-20 15:03:34 CST; 2s ago
 Main PID: 13705 (bash)
    Tasks: 18
   Memory: 32.4M
   CGroup: /system.slice/actions-runner.service
           ├─13705 /bin/bash /root/github/actions-runner/run.sh
           ├─13710 /bin/bash /root/github/actions-runner/run-helper.sh
           └─13715 /root/github/actions-runner/bin/Runner.Listener run

Feb 20 15:03:34 fine-idea-1.localdomain systemd[1]: Started actions-runner.
Feb 20 15:03:36 fine-idea-1.localdomain bash[13705]: √ Connected to GitHub
```

### wrokflow编写

刚刚配置完，刷新下github的runner页面，可见服务器的状态变成Idle了。下面就开始搞workflow，可以在github上查看[具体参数](https://docs.github.com/zh/actions/learn-github-actions/understanding-github-actions)。

下面是我的workflow，比较简单

``` yml
name: deploy this blog
run-name: ${{ github.actor }} is deploying 🚀
on:
  push:
    tags:
      - v* # push v开头的 tag触发workflow
jobs:
  deploy:
    runs-on: self-hosted
    defaults:
      run:
        working-directory: /root/github/HumbleShack
    steps:
      - name: Check out repository code # 我的项目已经在runner上提前clone好了
        run: git pull
      - name: Install dependencies # 安装依赖
        run: yarn
        shell: bash
      - name: rebuild all static resource # 重新build静态资源，供nginx使用
        run: npx hexo clean && yarn build
        shell: bash
```

配置完push代码，本地修改完直接打个tag，推到github触发workflow。<span class="shy-block">兴奋的抓手手</span>

``` bash
git tag v1.0.0 && git push origin v1.0.0
```

到actions页面也是能看到执行日志，大功告成。

![deploy](/assets/github-actions/deploy.png)
