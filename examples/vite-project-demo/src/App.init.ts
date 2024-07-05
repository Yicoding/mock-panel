import { VITE_BUILD_ENV } from '@/utils/env';
import * as Sentry from '@sentry/react';
import { apm, start } from '@xmly/xmrep';
import { name as projectName, version } from '../package.json';

// Sentry Project ☞ Client Keys DSN
// https://websentry.ximalaya.com/settings/xmly/projects/
// 一般在创建云效应用时，会看到自动创建 Sentry Project，可以看到 Client Keys DSN（否则，从上方链接去查找，若未创建可手动创建）
const CLIENT_KEY = '';

/**
 * Sentry
 *  - test/uat/production 均上报，方便提早发现问题。
 *  - Sentry React: https://docs.sentry.io/platforms/javascript/guides/react/
 */
Sentry.init({
  dsn: CLIENT_KEY, // Client Keys DSN
  environment: VITE_BUILD_ENV, // 区分上报环境
  sampleRate: 0.1,
  release: `${projectName}@${version}`
});

// 初始化埋点，请替换为正确的businessId
start({
  b: '1', // bussinessId (接入需要申请，@弓永峰)，请自行修改
  c: {}, // 自定义common部分  key-value  // 1.2.5版本以上支持

});

/**
 * APM 性能监控
 *  - https://thoughts.ximalaya.com/workspaces/5d679697f30f8700018aa32f/docs/5eddded3f4c0000001da3558
 */
apm.init({
  name: projectName // 云效项目名（通常应当与项目名称相同，如不一致，需修改）
});
