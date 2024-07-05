// 返回数组，同一个类型的接口可以放在同一个文件中

export default [
  {
    url: '/user/login',
    method: 'get',
    response: ({ query }) => {
      return {
        ret: 0,
        msg: 'success',
        data: 'ok'
      };
    }
  },
  {
    url: '/user/info',
    method: 'post',
    timeout: 2000,
    response: {
      ret: 0,
      msg: 'success',
      data: {
        name: 'vben'
      }
    }
  }
];
