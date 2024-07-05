/** 浏览器是否支持webp */
export const isBrowserSupportWebp =
  document
    .createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;

/**
 * 图片添加后缀方法
 * @param url 图片链接
 * @param fix 图片后缀
 */
export function expandImageUrl(url: string, fix: string) {
  if (!url || typeof url !== 'string' || url.indexOf(fix) > -1) return url;
  let newUrl = url;
  const originUrl = `${url.split('!')[0].split('?')[0]}`;
  if (url.indexOf('!') === -1) {
    const restUrl = url.slice(originUrl.length);
    newUrl = `${originUrl}!${fix}${restUrl}`;
  } else {
    // 有 ! 符号
    const warningIndex = url.indexOf('!');
    newUrl = `${url.slice(0, warningIndex)}${fix}&${url.slice(warningIndex)}`;
  }
  return newUrl;
}

/**
 * 添加columns参数
 */
export function addImageUrlColumns(url: string, fix: string) {
  if (!url || typeof url !== 'string') return url;
  const newUrl = `${url.split('!')[0].split('?')[0]}!${fix}`;
  return newUrl;
}

/** 可以添加参数的图片域名 */
const originWhiteList = [
  'https://imagev2.test.ximalaya.com/',
  'https://imagev2.uat.xmcdn.com/',
  'https://imagev2.xmcdn.com/',
  'https://amimage.test.ximalaya.com/',
  'https://amimage.uat.xmcdn.com/',
  'https://amimage.xmcdn.com/',
];

/** 判断图片是否支持添加参数 */
export function isSupportAddImageField(url: string) {
  if (!url) return false;
  return !!originWhiteList.find((item) => url.indexOf(item) > -1);
}

/**
 * 判断图片是否支持添加webp
 * 浏览器和域名都支持才可以
 * @param url 图链
 */
export function isSupportWebp(url: string) {
  if (!url) return false;
  return isSupportAddImageField(url) && isBrowserSupportWebp;
}

/** 判断图片是否存在缓存 */
export function isImageCache(url: string) {
  if (!url) return false;
  const image = new Image();
  image.src = url;
  return !!image.complete;
}
