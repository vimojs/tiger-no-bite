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
试搭页使用 XR-Frame / VisionKit 启动 AR 相机并检测垂直平面。页面会本地搜索矩形窗框候选；用户轻触窗户区域后，将带有褶皱起伏的窗帘网格锚定到空间平面，移动手机时由 AR 跟踪保持位置。窗帘宽高、材质纹理和模拟光线可调整。

窗框候选检测目前是矩形边缘启发式方法，不是训练好的窗户语义模型；它可能误检，真机上的 AR 平面识别也受微信版本和设备支持影响。候选检测后需要用户轻触窗户中部完成空间放置。

## 注意
项目配置文件会随微信开发者工具版本变化。若工具提示 TypeScript 编译配置缺失，请使用开发者工具新建的原生 TypeScript 项目所生成的 `project.config.json` 和编译设置，不要用本文件覆盖它们。
