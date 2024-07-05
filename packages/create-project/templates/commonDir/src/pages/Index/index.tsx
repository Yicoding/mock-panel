import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useBearStore } from '@/store';
import type { BearState } from '@/store';

import s from './styles.module.less';

const Index = () => {
  const navigate = useNavigate();

  const { bears, increase } = useBearStore((state: BearState) => state);

  const handleClickLink = () => {
    navigate('/home/detail'); // 跳转路由
  };

  return (
    <div className={s.root}>
      <p>index页面</p>
      <Link to="/home">
        <div className={s.link}>
          跳转到home页面
          <span />
        </div>
      </Link>
      <div className={clsx(s.link, s.linkLast)} onClick={handleClickLink}>
        跳转到 home/detail页面
        <span />
      </div>
      <div className={s.link}>
        bears的值为: {bears}
        <button onClick={increase}>increase</button>
      </div>
    </div>
  );
};

export default Index;
