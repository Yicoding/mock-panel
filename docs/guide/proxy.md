---
title: 接口代理
order: 3
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# 接口代理

本地开发接口请求跨域时，可通过 vite 配置代理跨域请求

## 配置

```ts | pure
server: {
  proxy: {
    '/dev_proxy_ops': {
      target: 'http://ops.test.ximalaya.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/dev_proxy_ops/, '')
    }
  }
},
```
