import type { CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import styled from 'styled-components';
import {
  addImageUrlColumns,
  expandImageUrl,
  isSupportAddImageField,
  isSupportWebp,
} from '../_utils/tools';

/** 图片公共样式 */
const StyledCommonImage = styled.img`
  width: 100%;
  transition: opacity 0.5s ease-in-out;
  display: block;
`;

/** 懒加载容器样式 */
const StyleLazyLoad = styled(LazyLoad)`
  display: inline-block;
  position: relative;
  overflow: hidden;
`;

/** 模糊图样式 */
const SryledBlurImage = styled(StyledCommonImage) <{
  /** 模糊值 */
  blur?: string | number;
}>`
  filter: blur(${(props) => props.blur});
`;

/** 原图样式 */
const SryledOriginImage = styled(StyledCommonImage)`
  position: absolute;
  top: 0;
  left: 0;
`;

/** 图片外层容器样式 */
const StyledContainer = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
`;

type BaseImageProps = {
  /** 图片地址 */
  src: string;
  /** 模糊图裁切宽度，默认 50 */
  columns?: number;
  /** 模糊值 */
  blur?: string | undefined;
  /** 默认图 */
  defaultSrc?: string;
};

/** 图片组件类型 */
export type ImageProps = BaseImageProps & {
  /** 是否使用图片懒加载，默认使用 */
  useLazy?: boolean;
  /** 是否使用渐进式加载，默认使用 */
  useBlur?: boolean;
  /** 是否使用webp，默认使用 */
  useWebp?: boolean;
  /** class样式 */
  className?: string | undefined;
  /** style样式 */
  style?: CSSProperties | undefined;
};

/** 渲染主体 */
const ImageBody: FC<BaseImageProps> = ({
  src,
  columns = 50,
  blur = '10px',
  defaultSrc,
  ...resProps
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  // 图片加载完成
  const handleImageLoad = () => setLoaded(true);

  if (defaultSrc) {
    return (
      <>
        {!loaded && <SryledOriginImage src={defaultSrc} />}
        <SryledBlurImage src={src} {...resProps} onLoad={handleImageLoad} />
      </>
    );
  }

  return (
    <>
      <SryledBlurImage
        src={addImageUrlColumns(src, `columns=${columns}`)}
        style={{
          opacity: loaded ? 0 : 1,
        }}
        blur={blur}
      />
      <SryledOriginImage
        src={src}
        style={{
          opacity: loaded ? 1 : 0,
        }}
        {...resProps}
        onLoad={handleImageLoad}
      />
    </>
  );
};

const ProImage: FC<ImageProps> = (props) => {
  const {
    useLazy = true,
    useBlur = true,
    useWebp = true,
    className,
    style,
    src,
    defaultSrc,
    ...resProps
  } = props;

  /** 是否使用webp */
  const isUseWebp = isSupportWebp(src) && useWebp;

  const url = isUseWebp ? expandImageUrl(src, 'xmagick=webp') : src;

  /** 是否使用渐进式效果 */
  const isUseBlur =
    !defaultSrc && isSupportAddImageField(src) && useBlur;

  // 不使用懒加载、渐进式效果
  if (!useLazy && !isUseBlur) {
    if (defaultSrc) {
      return (
        <StyledContainer className={className} style={style}>
          <ImageBody src={url} defaultSrc={defaultSrc} {...resProps} />
        </StyledContainer>
      );
    }
    return <img src={url} style={style} className={className} {...resProps} />;
  }

  // 不使用懒加载，但是使用渐进式
  if (!useLazy) {
    return (
      <StyledContainer className={className} style={style}>
        <ImageBody defaultSrc={defaultSrc} src={url} {...resProps} />
      </StyledContainer>
    );
  }

  // 不使用渐进式，但是使用懒加载
  if (!isUseBlur) {
    if (defaultSrc) {
      return (
        <StyleLazyLoad className={className} style={style}>
          <ImageBody defaultSrc={defaultSrc} src={url} {...resProps} />
        </StyleLazyLoad>
      );
    }
    return (
      <StyleLazyLoad className={className} style={style}>
        <StyledCommonImage src={url} {...resProps} />
      </StyleLazyLoad>
    );
  }

  // 使用懒加载+渐进式效果
  return (
    <StyleLazyLoad className={className} style={style}>
      <ImageBody defaultSrc={defaultSrc} src={url} {...resProps} />
    </StyleLazyLoad>
  );
};

export default ProImage;
