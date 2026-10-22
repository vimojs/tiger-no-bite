# 帘境 · 原生微信小程序 TypeScript Starter

## 技术栈
- 微信原生小程序
- TypeScript + WXML + WXSS
- 本地模拟商品数据
- `wx.setStorageSync` 保存最近搭配

## 推荐创建方式
优先在微信开发者工具中创建“微信小程序”原生项目，并选择 TypeScript 模板（若当前版本提供该选项），再将本目录的业务文件合并进去。将 `project.config.json` 的 `appid` 改为自己的 AppID。

## 页面
- 首页：`pages/home/index`
- 试搭：`pages/preview/index`
- 商品列表：`pages/products/index`
- 我的：`pages/profile/index`

## 当前范围
试搭页面中的窗户与窗帘为 CSS/WXSS 示意效果；摄像头、自动识别、透视贴合和移动跟踪尚未接入。

## 注意
项目配置文件会随微信开发者工具版本变化。若工具提示 TypeScript 编译配置缺失，请使用开发者工具新建的原生 TypeScript 项目所生成的 `project.config.json` 和编译设置，不要用本文件覆盖它们。
