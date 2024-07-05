/** types */
<% if (platform === 'mobile') { %>
/** 设备类型 */
export type Device = 'android' | 'ios';

/** 平台 */
export type Platform =
  | 'iting'
  | 'wechat'
  | 'weibo'
  | 'qq'
  | 'ximalayababy'
  | 'xiaoya'
  | '_default';
<% } %>
