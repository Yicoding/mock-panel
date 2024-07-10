import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MockPanel from './mock-panel';

/**
 * 渲染页面
 * @param page 页面信息
 * @returns 渲染结果
 */
export function renderAppToString() {
  const html = ReactDOMServer.renderToString(<MockPanel />);
  return html
}