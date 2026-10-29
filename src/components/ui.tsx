import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

// Fades its children up the first time they scroll into view.
export function Reveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'is-shown' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-[0.2em] uppercase text-white/60"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 500 }}
    >
      {children}
    </span>
  )
}

export function Heading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-white ${className}`}
      style={{ fontWeight: 300 }}
    >
      {children}
    </h2>
  )
}

// Photo with a slow zoom on hover; parent controls the size.
export function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 group ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
    </div>
  )
}
