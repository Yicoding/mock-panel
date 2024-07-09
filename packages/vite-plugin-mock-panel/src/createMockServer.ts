import type { ViteMockOptions, MockMethod, Recordable, RespThisType } from './types'

import path from 'node:path'
import fs from 'node:fs'
import chokidar from 'chokidar'
import colors from 'picocolors'
import url from 'url'
import fg from 'fast-glob'
import Mock from 'mockjs'
import { pathToRegexp, match } from 'path-to-regexp'
import { isArray, isFunction, sleep, isRegExp, isAbsPath } from './utils'
import { IncomingMessage, NextHandleFunction } from 'connect'
import { bundleRequire, GetOutputFile, JS_EXT_RE } from 'bundle-require'
import type { ResolvedConfig } from 'vite'

export let mockData: MockMethod[] = []
const mockPath = 'mock-panel'

export async function createMockServer(
  opt: ViteMockOptions = { mockPath },
  config: ResolvedConfig,
) {
  opt = {
    mockPath,
    ...opt,
  }

  if (mockData.length > 0) return
  mockData = await getMockConfig(opt, config)
  await createWatch(opt, config)
}

// request match
export async function requestMiddleware(opt: ViteMockOptions) {
  const middleware: NextHandleFunction = async (req, res, next) => {
    let queryParams: {
      query?: {
        [key: string]: any
      }
      pathname?: string | null
    } = {}

    if (req.url) {
      queryParams = url.parse(req.url, true)
    }

    const reqUrl = queryParams.pathname

    const matchRequest = mockData.find((item) => {
      if (!reqUrl || !item || !item.url) {
        return false
      }
      if (item.method && item.method.toUpperCase() !== req.method) {
        return false
      }
      return pathToRegexp(item.url).test(reqUrl)
    })

    if (matchRequest) {
      const isGet = req.method && req.method.toUpperCase() === 'GET'
      const { response, rawResponse, timeout, statusCode, url } = matchRequest

      if (timeout) {
        await sleep(timeout)
      }

      const urlMatch = match(url, { decode: decodeURIComponent })

      let query = queryParams.query as any
      if (reqUrl) {
        if ((isGet && JSON.stringify(query) === '{}') || !isGet) {
          const params = (urlMatch(reqUrl) as any).params
          if (JSON.stringify(params) !== '{}') {
            query = (urlMatch(reqUrl) as any).params || {}
          } else {
            query = queryParams.query || {}
          }
        }
      }

      const self: RespThisType = { req, res, parseJson: parseJson.bind(null, req) }
      if (isFunction(rawResponse)) {
        await rawResponse.bind(self)(req, res)
      } else {
        const body = await parseJson(req)
        res.setHeader('Content-Type', 'application/json')
        if (opt) {
          // @ts-ignore
          res.setHeader('Access-Control-Allow-Credentials', true)
          res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
        }
        res.statusCode = statusCode || 200
        const mockResponse = isFunction(response)
          ? response.bind(self)({ url: req.url as any, body, query, headers: req.headers })
          : response
        res.end(JSON.stringify(Mock.mock(mockResponse)))
      }

      return
    }
    next()
  }
  return middleware
}

// create watch mock
function createWatch(opt: ViteMockOptions, config: ResolvedConfig) {

  const { absMockPath } = getPath(opt)

  if (process.env.VITE_DISABLED_WATCH_MOCK === 'true') {
    return
  }

  const watchDir = [];
  watchDir.push(absMockPath)

  const watcher = chokidar.watch(watchDir, {
    ignoreInitial: true,
    // ignore files generated by `bundle require`
    ignored: '**/_*.bundled_*.(mjs|cjs)',
  })

  watcher.on('all', async (event, file) => {
    mockData = await getMockConfig(opt, config)
  })
}

// clear cache
function cleanRequireCache(opt: ViteMockOptions) {
  if (typeof require === 'undefined' || !require.cache) {
    return
  }
  const { absMockPath } = getPath(opt)
  Object.keys(require.cache).forEach((file) => {
    if (file.indexOf(absMockPath) > -1) {
      delete require.cache[file]
    }
  })
}

function parseJson(req: IncomingMessage): Promise<Recordable> {
  return new Promise((resolve) => {
    let jsonStr: Recordable = {}
    let str = ''
    req.on('data', function (chunk) {
      str += chunk
    })
    req.on('end', () => {
      try {
        // json
        jsonStr = JSON.parse(str)
      } catch (e) {
        // x-www-form-urlencoded
        const params = new URLSearchParams(str)
        const body: Recordable = {}
        params.forEach((value, key) => {
          body[key] = value
        })
        jsonStr = body
      }
      resolve(jsonStr)
      return
    })
  })
}
// load mock .ts files and watch
async function getMockConfig(opt: ViteMockOptions, config: ResolvedConfig) {
  const { absMockPath } = getPath(opt)

  let ret: MockMethod[] = []

  const mockFiles = fg
    .sync(`**/*.{ts,mjs,js}`, {
      cwd: absMockPath,
    })

  try {
    ret = []
    const resolveModulePromiseList = []

    for (let index = 0; index < mockFiles.length; index++) {
      const mockFile = mockFiles[index]
      resolveModulePromiseList.push(resolveModule(path.join(absMockPath, mockFile), config))
    }

    const loadAllResult = await Promise.all(resolveModulePromiseList)
    for (const resultModule of loadAllResult) {
      let mod = resultModule
      if (!isArray(mod)) {
        mod = [mod]
      }
      ret = [...ret, ...mod]
    }
  } catch (error: any) {
    loggerOutput(`mock reload error`, error)
    ret = []
  }
  return ret
}

// fixed file generation format
// use a random path to avoid import cache
const getOutputFile: GetOutputFile = (filepath, format) => {
  const dirname = path.dirname(filepath)
  const basename = path.basename(filepath)
  const randomname = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  return path.resolve(
    dirname,
    `_${basename.replace(JS_EXT_RE, `.bundled_${randomname}.${format === 'esm' ? 'mjs' : 'cjs'}`)}`,
  )
}

// Inspired by vite
// support mock .ts files
async function resolveModule(p: string, config: ResolvedConfig): Promise<any> {
  const mockData = await bundleRequire({
    filepath: p,
    getOutputFile,
  })

  let mod = mockData.mod.default || mockData.mod
  if (isFunction(mod)) {
    mod = await mod({ env: config.env, mode: config.mode, command: config.command })
  }
  return mod
}

// get custom config file path and mock dir path
function getPath(opt: ViteMockOptions) {
  const { mockPath } = opt
  const cwd = process.cwd()
  const absMockPath = isAbsPath(mockPath) ? mockPath! : path.join(cwd, mockPath || '')
  return {
    absMockPath,
  }
}

function loggerOutput(title: string, msg: string, type: 'info' | 'error' = 'info') {
  const tag = type === 'info' ? colors.cyan(`[vite:mock]`) : colors.red(`[vite:mock-server]`)
  return console.log(
    `${colors.dim(new Date().toLocaleTimeString())} ${tag} ${colors.green(title)} ${colors.dim(
      msg,
    )}`,
  )
}
