; (async () => {
  try {
    await import('mockjs')
  } catch (e) {
    throw new Error('vite-plugin-vue-mock requires mockjs to be present in the dependency tree.')
  }
})()

import type { ViteMockOptions } from './types'
import type { Plugin } from 'vite'
import { ResolvedConfig } from 'vite'
import { createMockServer, requestMiddleware } from './createMockServer'

export function viteMockPanel(opt: ViteMockOptions = {}): Plugin {
  let isDev = false
  let config: ResolvedConfig

  return {
    name: 'vite-plugin-mock-panel',
    enforce: 'pre' as const,
    configResolved(resolvedConfig) {
      console.log('vite-plugin-mock-panel启动了', opt)
      config = resolvedConfig
      createMockServer(opt, config)
    },

    configureServer: async ({ middlewares }) => {
      const middleware = await requestMiddleware(opt)
      middlewares.use(middleware)
    },
  }
}

export * from './types'
