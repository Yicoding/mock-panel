// 编译环境
export const { VITE_BUILD_ENV } = import.meta.env;
// 是否为开发环境
export const isDev: boolean = VITE_BUILD_ENV === 'development';
// 是否为mock环境
export const isMock: boolean = VITE_BUILD_ENV === 'mock';
// 是否为本地环境
export const isLocal: boolean = isDev || isMock;
// 是否为测试环境
export const isTest: boolean = VITE_BUILD_ENV === 'test';
// 是否为 UAT 环境
export const isUat: boolean = VITE_BUILD_ENV === 'uat';
// 是否为生产环境
export const isProd: boolean = VITE_BUILD_ENV === 'production';
