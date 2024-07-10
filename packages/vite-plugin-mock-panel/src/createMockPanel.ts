
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import path from 'path';
// 默认导入MockPanel组件（如果需要渲染它）
import { renderAppToString } from './components/renderer';
// 导入MockPanel类型（如果该文件同时导出了类型）

// 如果MockPanel组件和类型在同一个文件中，并且该文件只导出了类型，
// 那么你可能需要这样导入类型（取决于你的实际文件结构）：
// import type { MockPanel } from './components/mock-panel-types';

/** 配置 */
export type Config = {}

/**
 * 创建一个模拟面板
 *
 * @param html 字符串形式的HTML（注意：此参数在函数内部并未使用）
 * @param config 配置项
 * @returns 无返回值
 */
export function createMockPanel(html: string, {
  config,
  isDev
}: {
  config: Config;
  isDev: boolean;
}) {
  // console.log('createMockPanel', html, config, isDev);
  // 使用MockPanel组件渲染为字符串
  const htmlContent = renderAppToString();
  console.log('htmlContent', htmlContent)
  return {
    html: html.replace('</body>', `<div id="_vite_plugin_ajax_intercept_root">${htmlContent}</div></body>`),
    tags: [
      {
        tag: 'script',
        attrs: {},
        injectTo: 'body',
        children: `
          import React from 'react';
          import ReactDOM from 'react-dom';
          import MyComponent from '/@fs/${path.resolve(__dirname, './components/MyComponent').replace(/\\/g, '/')}';

          ReactDOM.hydrate(
            React.createElement(MyComponent),
            document.getElementById('_vite_plugin_ajax_intercept_root')
          );
        `,
      }
    ]
  };
}