---
title: ProImage
nav:
  title: 快速上手
  path: /components
---

# ProImage

## 安装

```bash
yarn add @xmly/vite-plugin-mock-panel
```

## 使用方式

和 `img` 标签用法一致，在 `img` 标签的基础上额外扩展了一些控制效果的属性

## 基本用法

<code src="./demos/Basic.tsx"></code>

## 不使用懒加载

保留 `渐进式效果` 和 `webp格式`

<code src="./demos/UnLazy.tsx"></code>

## 不使用渐进式效果

保留 `懒加载` 和 `webp格式`

<code src="./demos/UnBlur.tsx"></code>

## 不使用 webp

保留 `懒加载` 和 `渐进式效果`

<code src="./demos/UnWebp.tsx"></code>

## 不使用懒加载、渐进式效果、webp

<code src="./demos/UnAll.tsx"></code>

## 使用默认占位图

`渐进式`效果将`不再生效`

<code src="./demos/InDefault.tsx"></code>

## API

| 属性       | 说明                                                         | 类型                         | 默认值 |
| ---------- | ------------------------------------------------------------ | ---------------------------- | ------ |
| src        | 图片地址                                                     | `string`                     | -      |
| defaultSrc | 默认占位图（设置 `defaultSrc` 时，`渐进式`效果将`不再生效`） | `string`                     | -      |
| useLazy    | 是否使用图片懒加载                                           | `boolean`                    | `true` |
| useBlur    | 是否使用渐进式加载（如果`图片本身很小`，建议设置为 `false`） | `boolean`                    | `true` |
| useWebp    | 是否使用 webp 格式                                           | `boolean`                    | `true` |
| columns    | 模糊图裁切宽度                                               | `number`                     | `50`   |
| className  | 根节点 class 样式                                            | `string \| undefined`        | -      |
| style      | 根节点 style 样式                                            | `CSSProperties \| undefined` | -      |
| blur       | 模糊值                                                       | `string \| undefined`        | `10px` |

## 说明

- `只有` 以下图片域名支持 `渐进式效果` 和 `webp格式`：

  - `https://imagev2.test.ximalaya.com`
  - `https://imagev2.uat.xmcdn.com`
  - `https://imagev2.xmcdn.com`
  - `https://amimage.test.ximalaya.com`
  - `https://amimage.uat.xmcdn.com`
  - `https://amimage.xmcdn.com`

- 浏览器`存在`图片`缓存`时，将`不`再`显示`渐进式效果（用户体验优化）。如果需要测试渐进式效果，可以采用以下方式：

  - 打开控制台，勾选 `Disable cache`，并一直保持控制台打开（注：`关闭控制台后，浏览器将再次恢复使用默认的缓存行为加载页面`），然后正常刷新页面

- 依赖项（请确保使用组件的项目安装了以下依赖）：

  - `"react": ">=16.8.0"`
  - `"react-dom": ">=16.8.0"`
  - `"styled-components": ">=5.0.0"`

- 如果`图片本身很小`，建议`不使用渐进式效果`（适用图片比较大时，更快的出现视觉效果）

- `默认占位图`的路径请选择`本地`或 `base64` 格式（默认图需要第一时间加载，在线图片需要发起请求，导致加载变慢）；设置默认图后，渐进式效果将不再生效，因为占位图一般和原图视觉效果相差很大，同时需要尽快加载
