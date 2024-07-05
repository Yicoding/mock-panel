/** 接口响应结构 */
export type ResponseConstructor<T = any> = {
  ret: number;
  msg: string;
  data: T;
};

/** 业务接口类型 */
/* 登录接口参数类型 */
export interface LoginData {
  username: string;
  password: string;
}

/* 用户信息接口返回值类型 */
export interface UserInfoRes {
  id: string;
  username: string;
  avatar: string;
  description: string;
}
/** 业务类型 */
