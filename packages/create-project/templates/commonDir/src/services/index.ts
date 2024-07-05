import { http } from './request';
import type { LoginData, UserInfoRes } from './types';

const { VITE_ORIGIN } = import.meta.env;

export function login() {
  return http.get<LoginData>(`${VITE_ORIGIN}/user/login`);
}

export function getUserInfo() {
  return http.post<UserInfoRes>(`${VITE_ORIGIN}/user/info`);
}
