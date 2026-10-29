import { useCallback, useEffect, useState } from 'react'
import { Eyebrow, Heading, Reveal } from './ui'

const shots = [
  { src: 'photos/aerial.jpg', title: 'Вилла на скале', note: 'Вид с высоты на закате', span: 'md:col-span-2 md:row-span-2' },
  { src: 'photos/infinity-pool.jpg', title: 'Бассейн-инфинити', note: 'Вода сливается с морем', span: '' },
  { src: 'photos/facade-sunset.jpg', title: 'Фасад', note: 'Колонны в закатном свете', span: '' },
  { src: 'photos/living-room.jpg', title: 'Гостиная', note: 'Камин и вид на море', span: '' },
  { src: 'photos/kitchen-dining.jpg', title: 'Кухня-гостиная', note: 'Мраморный остров и стол у окна', span: '' },
  { src: 'photos/bedroom.jpg', title: 'Спальня', note: 'Каменная ванна у стеклянной стены', span: '' },
  { src: 'photos/facade-night.jpg', title: 'Ночная терраса', note: 'Подсветка и огни побережья', span: '' },
  { src: 'photos/sea-view.jpg', title: 'Терраса', note: 'Солнце садится в Чёрное море', span: 'md:col-span-2' },
]

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null)

  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + shots.length) % shots.length)),
    []
  )

  useEffect(() => {
    if (open === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, step])

  return (
    <section id="gallery" className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0a0a08]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow>Галерея</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <Heading className="mt-6">Комната за комнатой</Heading>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="text-white/55 text-[15px] leading-[1.7] max-w-sm">
              Дом, который вы только что пролетели, в спокойных кадрах. Нажмите на фото, чтобы открыть его крупнее.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[230px] gap-3 md:gap-4">
          {shots.map((s, i) => (
            <Reveal key={s.src} delay={(i % 4) * 0.06} className={s.span}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full h-full overflow-hidden rounded-2xl bg-white/5 text-left cursor-zoom-in"
              >
                <img
                  src={s.src}
                  alt={s.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute left-4 bottom-4 right-4">
                  <div className="text-white text-[16px] tracking-[-0.01em]" style={{ fontWeight: 400 }}>
                    {s.title}
                  </div>
                  <div className="text-white/60 text-[12.5px] mt-0.5">{s.note}</div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-fade-in"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={shots[open].title}
        >
          <figure className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={shots[open].src} alt={shots[open].title} className="w-full max-h-[78vh] object-contain rounded-xl" />
            <figcaption className="mt-4 flex items-center justify-between text-white/70 text-[13px]">
              <span>
                <span className="text-white" style={{ fontWeight: 400 }}>
                  {shots[open].title}
                </span>
                <span className="mx-2 text-white/30">/</span>
                {shots[open].note}
              </span>
              <span className="tabular-nums text-white/40">
                {open + 1} / {shots.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="Предыдущее фото"
            onClick={(e) => { e.stopPropagation(); step(-1) }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 text-white/80 hover:bg-white/10 flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            aria-label="Следующее фото"
            onClick={(e) => { e.stopPropagation(); step(1) }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 text-white/80 hover:bg-white/10 flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full border border-white/20 text-white/80 hover:bg-white/10 flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </section>
  )
}
