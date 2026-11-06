import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Spinner() {
  return <span className="spinner" aria-hidden="true"/>;
}

export function BusyLabel({ active, pending, children }: { active: boolean; pending: string; children: ReactNode }) {
  return <>{active ? <><Spinner/>{pending}</> : children}</>;
}

export function StudioLoading() {
  return <section className="studio-loading" aria-busy="true">
    <p className="loading-message" role="status"><Spinner/>Preparando el estudio…</p>
    <div className="skeleton skeleton-title"/>
    <div className="skeleton skeleton-line"/>
    <div className="skeleton-fields" aria-hidden="true">{[0, 1, 2, 3].map(n => <div key={n} className="skeleton"/>)}</div>
  </section>;
}

export function LoadedImage({ src, alt }: { src: string; alt: string }) {
  // The inner component resets its state for every new image URL.
  return <ImageRequest key={src} src={src} alt={alt}/>;
}

function ImageRequest({ src, alt }: { src: string; alt: string }) {
  const image = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (image.current?.complete) setState(image.current.naturalWidth ? 'ready' : 'error');
  }, [attempt]);
  return <div className={`loaded-image ${state}`} aria-busy={state === 'loading'}>
    <img ref={image} src={attempt ? `${src}?retry=${attempt}` : src} alt={alt} onLoad={() => setState('ready')} onError={() => setState('error')}/>
    {state === 'loading' && <span className="image-loading" role="status"><Spinner/><span>Cargando imagen…</span></span>}
    {state === 'error' && <div className="image-loading" role="alert"><span>No se pudo cargar la imagen.</span><button className="text-button" onClick={() => { setState('loading'); setAttempt(n => n + 1); }}>Reintentar carga</button></div>}
  </div>;
}
