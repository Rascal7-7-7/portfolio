'use client'

import { useEffect, useState, type ReactNode } from 'react'

/** 画像が読み込めたか。読み込めるまでは false（ファイルが無いサンプル写真では、割れた画像を出さずに代わりの表示のままにする） */
function useLoaded(src: string | undefined): boolean {
  const [loaded, setLoaded] = useState<string | null>(null)
  useEffect(() => {
    if (!src) return
    let alive = true
    const img = new Image()
    img.onload = () => alive && setLoaded(src)
    img.onerror = () => alive && setLoaded(null)
    img.src = src
    return () => {
      alive = false
    }
  }, [src])
  return !!src && loaded === src
}

interface PhotoProps {
  src: string | undefined
  alt: string
  /** 写真の枠（比率・角・幅）。写真のときだけ使う */
  className: string
  /** 写真が無い・読み込めないときに出すもの（今の線画など）。無ければ何も出さない */
  fallback?: ReactNode
}

/** 写真があれば写真、無ければ fallback。サーバーには何も送らない（src はサンプルの静的ファイルか object URL） */
export default function Photo({ src, alt, className, fallback = null }: PhotoProps) {
  const loaded = useLoaded(src)
  if (!loaded) return <>{fallback}</>
  // eslint-disable-next-line @next/next/no-img-element -- object URL も扱うので next/image は使わない
  return <img src={src} alt={alt} className={`${className} object-cover`} />
}

/** 写真が出るかどうかでレイアウトを変えるテンプレート用 */
export { useLoaded as usePhotoLoaded }
