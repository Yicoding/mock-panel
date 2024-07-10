; (async () => {
  try {
    await import('mockjs')
  } catch (e) {
    throw new Error('vite-plugin-mock-panel requires mockjs to be present in the dependency tree.')
  }
})()

import path from 'node:path'
import fs from 'node:fs'
import type { ViteMockOptions } from './types'
import type { Plugin } from 'vite'
import { ResolvedConfig } from 'vite'
import { createMockServer, requestMiddleware } from './createMockServer'
import { createMockPanel } from './createMockPanel'

export function viteMockPanel(opt: ViteMockOptions = {}): Plugin {
  let config: ResolvedConfig
  let isDev = false

  return {
    name: 'vite-plugin-mock-panel',
    enforce: 'pre' as const,
    configResolved(resolvedConfig) {
      // 在这添加可视化界面代码
      console.log('configResolved启动了')
      config = resolvedConfig
      isDev = resolvedConfig.command === 'serve'
    },
    configureServer: async ({ middlewares }) => {
      // 在这添加node服务代码
      console.log('configureServer启动了')
      const middleware = await requestMiddleware(opt)
      middlewares.use(middleware)
    },
    transformIndexHtml(html) {
      const res = createMockPanel(html, {
        config,
        isDev,
      });
      console.log('res', res)
      return {
        html: res.html,
        tags: [
          {
            tag: 'script',
            injectTo: 'body',
            children: `
              import React from 'react';
              import ReactDOM from 'react-dom';
              import MyComponent from '${path.resolve(__dirname, './components/mock-panel').replace(/\\/g, '/')}';

          ReactDOM.hydrate(
            React.createElement(MyComponent),
            document.getElementById('_vite_plugin_ajax_intercept_root')
          );
            `
          }
        ]
      };
    },
  }
}

export * from './types'
