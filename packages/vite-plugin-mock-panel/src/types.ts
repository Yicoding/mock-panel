import { IncomingMessage, ServerResponse } from 'http'

export interface ViteMockOptions {
  mockPath?: string
}

export interface RespThisType {
  req: IncomingMessage
  res: ServerResponse
  parseJson: () => any
}

export type MethodType = 'get' | 'post' | 'put' | 'delete' | 'patch'

export type Recordable<T = any> = Record<string, T>

export declare interface MockMethod {
  url: string
  method?: MethodType
  timeout?: number
  statusCode?: number
  response?:
  | ((
    this: RespThisType,
    opt: { url: Recordable; body: Recordable; query: Recordable; headers: Recordable },
  ) => any)
  | any
  rawResponse?: (this: RespThisType, req: IncomingMessage, res: ServerResponse) => void
}

export interface MockConfig {
  env: Record<string, any>
  mode: string
  command: 'build' | 'serve'
}
