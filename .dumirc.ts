import { defineConfig } from 'dumi';

const logo =
  'https://imagev2.xmcdn.com/storages/f8d2-audiofreehighqps/81/43/GMCoOSYIO18uAAAvaAIdYbXD.png';


const publicPath = process.env.NODE_ENV === 'production' ? `/mock-panel/refs/heads/master/` : '/';

export default defineConfig({
  themeConfig: {
    name: 'mock-panel',
    logo,
  },
  headScripts: [
    { content: `window.publicPath = '/mock-panel/refs/heads/master/';`, charset: 'utf-8' },
  ],
  history: {
    type: 'hash',
  },
  hash: true,
  favicons: [logo],
  publicPath,
  runtimePublicPath: {},
  alias: {
    images: '/docs/images',
  },
  resolve: {
    docDirs: ['docs'],
  },
});
