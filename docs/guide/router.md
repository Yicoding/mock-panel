---
title: 路由配置
order: 1
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# 路由配置

## 配置项

```ts | pure
/*
 * react-router-dom 官方文档
 * https://reactrouter.com/en/main
 */
import Suspenselazy from '@/components/Suspenselazy';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';

const Index = Suspenselazy(
  () => import(/* webpackChunkName:"index" */ '@/view/Index')
);
const Home = Suspenselazy(
  () => import(/* webpackChunkName:"" */ '@/view/Home')
);
const HomeOne = Suspenselazy(
  () => import(/* webpackChunkName:"homeOne" */ '@/view/Home/HomeOne')
);
const HomeTwo = Suspenselazy(
  () => import(/* webpackChunkName:"homeTwo" */ '@/view/Home/HomeTwo')
);
const Empty = Suspenselazy(
  () => import(/* webpackChunkName:"empty" */ '@/view/Empty')
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="index" /> // 重定向
  },
  {
    path: 'index',
    element: Index
  },
  {
    path: 'home',
    element: Home,
    children: [
      // 嵌套路由
      {
        path: 'one',
        element: HomeOne
      },
      {
        path: 'two',
        element: HomeTwo
      }
      
    ]
  },
  {
    path: 'empty',
    element: Empty
  },
  // 未匹配到页面
  {
    path: '*',
    element: Empty
  }
];

const { MODE, VITE_BASE_ROUTE_NAME } = import.meta.env;

const router = createBrowserRouter(routes, {
  // 区分本地和线上
  basename: MODE === 'development' ? '/' : VITE_BASE_ROUTE_NAME
});

export default router;
```

:::info{title=注意事项}
需要根据项目自行更改 basename
:::

## 使用

```tsx | pure
import router from '@/router';
import { RouterProvider } from 'react-router-dom';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```
