---
title: SVG滤镜-feDisplacementMap
date: 2023-02-19 11:14:36
tags: [前端,SVG]
categories: 前端
keywords: SVG滤镜,feDisplacementMap,菈妮
description: 用feDisplacementMap实现菈妮的动效海报
thumbnail: /assets/SVG滤镜-feDisplacementMap/thumbnail/ranni.jpg
top_img: /assets/SVG滤镜-feDisplacementMap/thumbnail/ranni.jpg
cover: /assets/SVG滤镜-feDisplacementMap/thumbnail/ranni.jpg
excerpt: 用feDisplacementMap实现菈妮的动效海报，谁会不喜欢会动的老婆呢
---
作为一个爱折腾的前端，看了一堆稀奇古怪的技术，今天就来折腾下svg滤镜比较难理解的feDisplacementMap。当然玩嘛，必须带上俺的老婆-ranni <span class="shy-block">（不知道第几个老婆了）</span>，不多说，开始霍霍。

## Task：用feDisplacementMap实现ranni的动效海报

开始撸代码之前，先介绍下feDisplacementMap滤镜。
<div class="message-container">
    <div class="bubble-container me">
        <div class="avatar">
            <img src="/images/avatar.jpeg" alt="" />
        </div>
        <div class="message">
            <div class="bubble-box">介绍下feDisplacementMap滤镜</div>
        </div>
    </div>
    <div class="bubble-container you">
        <div class="avatar">
            <img src="/images/chatgpt.svg" alt="" />
        </div>
        <div class="message">
            <div class="bubble-box">
feDisplacementMap 是 SVG 的一个滤镜特效，它能够通过图像的亮度值或者颜色值来改变另一张图像的形状。该特效可以用来创建各种视觉效果，比如水波纹、地形图等。

feDisplacementMap 需要两张图像，一张是源图像，另一张是用于扭曲源图像的位移图像。位移图像的每个像素值都会被用于改变源图像的每个像素位置。feDisplacementMap 会根据位移图像中的像素值，将源图像中的像素水平或垂直地扭曲。

feDisplacementMap 可以使用 in 属性来指定源图像输入和 in2 属性来指定位移图像输入。它还可以使用 scale 属性来指定位移图像的缩放比例。 xChannelSelector 和 yChannelSelector 属性用于指定位移图像中哪些颜色通道应该用于水平和垂直位移。xChannelSelector 和 yChannelSelector 可以使用以下属性值之一：R（红色通道）、G（绿色通道）、B（蓝色通道）或 A（透明通道）。

feDisplacementMap对图形进行位置计算有一个映射公式。
公式如下（摘自MDN文档）：
```
P'(x,y) ← P( x + scale * (XC(x,y) - 0.5), y + scale * (YC(x,y) - 0.5))

· P'(x,y)指的是转换之后的x, y坐标。
· x + scale * (XC(x,y) - 0.5), y + scale * (YC(x,y) - 0.5)指的是具体的转换规则。
· XC(x,y)表示当前x,y坐标像素点其X轴方向上设置的对应通道的计算值，范围是0~1。
· YC(x,y)表示当前x,y坐标像素点其Y轴方向上设置的对应通道的计算值，范围是0~1。
· -0.5是偏移值，因此XC(x,y) - 0.5范围是-0.5~0.5，YC(x,y) - 0.5范围也是-0.5~0.5。
· scale表示计算后的偏移值相乘的比例，scale越大，则偏移越大。
```

下面是一个 feDisplacementMap 的示例：
``` html
<svg width="300" height="300">
  <filter id="displacement">
    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" />
    <feDisplacementMap in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
  </filter>
  <circle cx="150" cy="150" r="100" fill="#FFC107" filter="url(#displacement)" />
</svg>
```
在上面的示例中，feTurbulence 用于创建一张噪声图像，它作为位移图像传递给了 feDisplacementMap。 scale 属性设置为 20，表示扭曲的强度，而 xChannelSelector 和 yChannelSelector 属性则分别设置为 R 和 G，表示使用位移图像的红色和绿色通道进行水平和垂直位移。最后，我们将 filter 应用于一个圆形，以展示 feDisplacementMap 的效果。

总体来说，feDisplacementMap 是一个非常有用的 SVG 滤镜特效，它可以创建各种视觉效果，如水波纹、地形图等。它需要使用两张图像，其中一张作为源图像，另一张作为位移图像，用于扭曲源图像的形状。通过调整不同的属性，可以实现不同的扭曲效果。
            </div>
        </div>
    </div>
</div>

扣完素材，开始实战，顺便讲解一下这个滤镜的计算逻辑。
### 1. 先实现眨眼
为了省却定位的操作，所有用于位移的遮罩全都和原图的尺寸一致。第一个眨眼的遮罩长这样，由于眨眼是需要两侧的闭合速度小于中间，
<img src="/assets/SVG滤镜-feDisplacementMap/assets/masks/eye-displaymap.png" width="100%"/>
x通道使用的G，y通道使用的B，由于只需要用两个通道，所以R设置任意的无所谓。由于rgb的值取中间值127为不位移（可见公式中-0.5），小于127往正向偏移（右下）。因此第一步就是从正中间斜向拉一条渐变线（用眼睛中间到两侧），渐变值从中间（127，84，33）往两侧（127，99，77），可见这个幅度是越来越小（与127的间隔越来越小），由于眼球右侧眼睑更多，这个渐变过度可以再平滑一点，显得更自然。

### 2. 实现身体抖动 <span class="shy-block">谁呼吸这么大动静233</span>
帽子和身体的一些常规二维transform，加上一些细节rotate变换。

### 3. 调一下细节，完成！

<svg style="width: 100%; height: 100%" viewBox="0 0 1920 760">
    <g>
        <image href="/assets/SVG滤镜-feDisplacementMap/assets/ranni/face.png" width="2000" x="0" y="50"></image>
        <g>
        <image             filter="url(#filter-eye)"             href="/assets/SVG滤镜-feDisplacementMap/assets/ranni/eye.png"             mask="url(#eye-mask)"             width="2000"             x="0"             y="13"         ></image>
        <image href="/assets/SVG滤镜-feDisplacementMap/assets/ranni/eye.png" mask="url(#eyelid-mask)" width="2000" x="0" y="13"></image>
        </g>
        <animateTransform         attributeName="transform"         attributeType="XML"         dur="8s"         keyTimes="0;0.25;0.5;0.9;1"         repeatCount="indefinite"         type="translate"         values="0 0;2 12;4 16;1 4;0 0"         ></animateTransform>
    </g>
    <image href="/assets/SVG滤镜-feDisplacementMap/assets/ranni/hat.png" width="2000" x="0" y="0">
        <animateTransform         attributeName="transform"         attributeType="XML"         dur="12s"         keyTimes="0;0.2;0.6;0.8;0.95;1"         repeatCount="indefinite"         type="translate"         values="0 0;3 -7;6 -20;3 -7;0 0;0 0"         ></animateTransform>
        <animateTransform         attributeName="transform"         attributeType="XML"         dur="12s"         keyTimes="0;0.6;0.95;1"         repeatCount="indefinite"         type="rotate"         values="0 2000 200; 2 2000 200;0 2000 200;0 2000 200"         ></animateTransform>
    </image>
    <defs>
        <filter id="filter-hair" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
        <feImage height="926" href="/assets/SVG滤镜-feDisplacementMap/assets/masks/hair-displaymap.png" result="pict2" width="2000" x="0" y="0" />
        <feDisplacementMap             in="SourceGraphic"             in2="pict2"             result="mapImage"             scale="0"             xChannelSelector="G"             yChannelSelector="B"         >
            <animate             attributeName="scale"             dur="6s"             repeatCount="indefinite"             values="0;-50;-80;-110;-120;-110;-90;-50;-30;0;"             />
        </feDisplacementMap>
        </filter>
        <filter id="filter-eye" color-interpolation-filters="sRGB">
        <feImage height="926" href="/assets/SVG滤镜-feDisplacementMap/assets/masks/eye-displaymap.png" result="pict" width="2000" x="0" y="13" />
        <feDisplacementMap in="SourceGraphic" in2="pict" scale="0" xChannelSelector="G" yChannelSelector="B">
            <animate             attributeName="scale"             dur="6s"             keyTimes="0;0.02;0.04;0.1;0.12;0.14;1"             repeatCount="indefinite"             values="0;100;0;0;110;0;0"             />
        </feDisplacementMap>
        </filter>
        <mask id="eye-mask">
        <image href="/assets/SVG滤镜-feDisplacementMap/assets/masks/eye-mask.png" width="2000" x="0" y="13"></image>
        </mask>
        <mask id="eyelid-mask">
        <image href="/assets/SVG滤镜-feDisplacementMap/assets/masks/eyelid-mask.png" width="2000" x="0" y="13"></image>
        </mask>
    </defs>
</svg>

## 后记

公式 P'(x,y) ← P( x + scale * (XC(x,y) - 0.5), y + scale * (YC(x,y) - 0.5))可以看出原图的每个点与位移后的点应该是一一对应的，但是见下图，（截图来自[深入理解SVG feDisplacementMap滤镜及实际应用](https://www.zhangxinxu.com/wordpress/2017/12/understand-svg-fedisplacementmap-filter/)）

![截图](/assets/SVG滤镜-feDisplacementMap/test1.png)

原图的美女在通过滤镜偏移后的图像上为什么会有两张嘴（有重复图像）？
