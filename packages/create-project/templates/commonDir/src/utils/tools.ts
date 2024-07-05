/**
 * 获取随机数，min <= x < max
 * @param {number} min
 * @param {number} max
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 隐藏loading
 */
export function hideLoading() {
  const loading = document
    .getElementById('app_loading');
  if (loading) {
    loading
      .classList?.add('app_loading_hidden');
  }
}

/**
 * 异步加载脚本
 * @param url 脚本地址
 * @param callback
 */
export function loadScript(url: string, callback?: () => void): void {
  window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    if (callback) {
      script.onload = callback;
    }
    script.src = url;
    document.body.appendChild(script);
  });
}

/**
 * 获取某个 cookie 中某个字段的值
 * @param name 字段名
 */
export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const [, parts2] = value.split(`; ${name}=`);
  if (parts2) {
    return parts2.split(';').shift();
  }
  return undefined;
}

/** 平台 */
export type Platform =
  | 'iting'
  | 'wechat'
  | 'weibo'
  | 'qq'
  | 'ximalayababy'
  | 'xiaoya'
  | '_default';

/**
 * 获取当前的运行平台
 */
export function getPlatform(): Platform {
  let platform: Platform = 'iting';

  const ua = window.navigator.userAgent;
  const impl = getCookie('impl') || '';
  if (/iting/i.test(ua) || /iting/i.test(impl)) {
    platform = 'iting';
  } else if (/micromessenger/i.test(ua)) {
    platform = 'wechat';
  } else if (/weibo/i.test(ua)) {
    platform = 'weibo';
  } else if (/qq\//i.test(ua)) {
    platform = 'qq';
  } else if (/ximalayababy/i.test(ua)) {
    platform = 'ximalayababy';
  } else if (/xiaoya/i.test(ua)) {
    platform = 'xiaoya';
  } else {
    platform = '_default';
  }

  return platform;
}
