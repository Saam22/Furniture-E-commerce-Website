import { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/OptimizedImage.css';

const CDN_DOMAINS = ['images.unsplash.com', 'unsplash.com'];
const BREAKPOINTS = [320, 640, 960, 1280, 1920];
const QUALITY_MAP = { high: 85, medium: 75, low: 60, eco: 30 };

function isCdnUrl(src) {
  if (!src) return false;
  return CDN_DOMAINS.some(d => src.includes(d));
}

function buildCdnUrl(src, { width, format, quality }) {
  try {
    const url = new URL(src, 'https://placeholder.invalid');
    if (width) url.searchParams.set('w', String(width));
    if (format) url.searchParams.set('fm', format);
    if (quality) url.searchParams.set('q', String(quality));
    url.searchParams.set('auto', 'format');
    if (!url.searchParams.has('fit')) url.searchParams.set('fit', 'crop');
    return url.toString();
  } catch {
    return src;
  }
}

function buildSrcSet(src, format, quality) {
  if (!isCdnUrl(src)) return undefined;
  return BREAKPOINTS
    .map(w => `${buildCdnUrl(src, { width: w, format, quality })} ${w}w`)
    .filter(Boolean)
    .join(', ');
}

const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  priority = false,
  placeholder = 'skeleton',
  aspectRatio,
  className = '',
  style,
  sizes,
  quality = 'medium',
  objectFit = 'cover',
  fill,
  loading: loadingProp,
  decoding,
  onClick,
}) => {
  const [state, setState] = useState('loading');
  const [inView, setInView] = useState(priority);
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);

  const q = typeof quality === 'number' ? quality : (QUALITY_MAP[quality] || 75);
  const cdn = isCdnUrl(src);
  const aspectRatioValue = aspectRatio || (width && height ? width / height : undefined);

  const defaultSizes = useMemo(() => {
    if (sizes) return sizes;
    if (fill) return '100vw';
    if (width && width <= 100) return `${width}px`;
    if (width && width <= 300) return '(max-width: 480px) 100vw, 50vw';
    return '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
  }, [sizes, fill, width]);

  useEffect(() => {
    if (priority || !wrapperRef.current || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const imgSrc = cdn ? buildCdnUrl(src, { quality: q }) : src;
  const imgSrcSet = cdn ? buildSrcSet(src, null, q) : undefined;
  const avifSrcSet = cdn ? buildSrcSet(src, 'avif', q) : undefined;
  const webpSrcSet = cdn ? buildSrcSet(src, 'webp', q) : undefined;

  const handleLoad = () => setState('loaded');
  const handleError = () => {
    if (state === 'loading') setState('error');
  };

  if (!src) {
    return (
      <div
        ref={wrapperRef}
        className={`optimized-image-wrapper optimized-image-error ${className}`}
        style={{
          width: width ? `${width}px` : '100%',
          maxWidth: '100%',
          aspectRatio: aspectRatioValue,
          ...style,
        }}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
        <span>لا توجد صورة</span>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`optimized-image-wrapper ${className} ${state === 'loading' ? 'is-loading' : ''} ${fill ? 'fill' : ''}`}
      style={{
        width: fill ? undefined : (width ? `${width}px` : '100%'),
        maxWidth: '100%',
        aspectRatio: fill ? undefined : aspectRatioValue,
        ...style,
      }}
      onClick={onClick}
    >
      {state === 'loading' && placeholder === 'skeleton' && (
        <div className="optimized-image-placeholder optimized-image-skeleton" aria-hidden="true" />
      )}

      {inView && state !== 'error' && (
        <picture>
          {avifSrcSet && (
            <source srcSet={avifSrcSet} sizes={defaultSizes} type="image/avif" />
          )}
          {webpSrcSet && (
            <source srcSet={webpSrcSet} sizes={defaultSizes} type="image/webp" />
          )}
          <img
            ref={imgRef}
            src={imgSrc}
            srcSet={imgSrcSet}
            sizes={imgSrcSet ? defaultSizes : undefined}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            loading={priority ? 'eager' : (loadingProp || 'lazy')}
            fetchpriority={priority ? 'high' : undefined}
            decoding={decoding || (priority ? 'sync' : 'async')}
            onLoad={handleLoad}
            onError={handleError}
            className={`optimized-image ${state === 'loaded' ? 'loaded' : ''}`}
            style={{
              objectFit: fill ? objectFit : undefined,
              opacity: state === 'loaded' ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        </picture>
      )}

      {state === 'error' && (
        <div className="optimized-image-error-state" role="img" aria-label={alt}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
          <span>تعذر تحميل الصورة</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
