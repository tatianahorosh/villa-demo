import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 341 // 01: 1–101, 02: 102–201, 03: 202–341 (20 fps)
const SCROLL_LENGTH_VH = 560 // total scroll distance for the whole sequence
const INTRO_FADE_END = 0.035 // intro copy is gone by this progress
const ENTER_FRAME = 52 // the moment the camera crosses into the house
const MID_BEAT_WIDTH = 0.05
const ARRIVAL_START = 0.93 // final "Ваш вид ждёт" beat

// Clip joins, as fractional frame positions between the last frame of one clip and the first of the next.
const SEAMS = [100.5, 200.5]
const SEAM_WINDOW = 7 // frames on each side of a seam affected by the speed-up and blur
const SEAM_MIN_WEIGHT = 0.28 // scroll distance per frame at the seam, relative to normal
const SEAM_MAX_BLUR = 5 // px

const framePath = (i: number) => `frames/frame-${String(i).padStart(4, '0')}.webp`

function ramp(x: number, a: number, b: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
// A symmetric bump that rises then falls back to 0 — for the brief mid-scroll label.
function bump(x: number, center: number, width: number) {
  const t = Math.abs(x - center) / width
  return t >= 1 ? 0 : 1 - t * t * (3 - 2 * t)
}
function seamAmount(frame: number) {
  return Math.max(...SEAMS.map((s) => bump(frame, s, SEAM_WINDOW)))
}

// Cumulative scroll position of every frame. Steps near a seam are shorter,
// so the camera rushes through the join while the overall length stays the same.
const FRAME_POS = (() => {
  const pos = [0]
  for (let i = 0; i < FRAME_COUNT - 1; i++) {
    pos.push(pos[i] + 1 - (1 - SEAM_MIN_WEIGHT) * seamAmount(i + 0.5))
  }
  const total = pos[pos.length - 1]
  return pos.map((p) => p / total)
})()

// Scroll progress (0..1) to a fractional frame index.
function progressToFrame(progress: number) {
  let lo = 0
  let hi = FRAME_COUNT - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (FRAME_POS[mid] <= progress) lo = mid
    else hi = mid
  }
  const span = FRAME_POS[hi] - FRAME_POS[lo]
  return lo + (span > 0 ? Math.min(1, Math.max(0, (progress - FRAME_POS[lo]) / span)) : 0)
}

const MID_BEAT_CENTER = FRAME_POS[ENTER_FRAME]

export default function Scrollymation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const midRef = useRef<HTMLDivElement>(null)
  const arrivalRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<HTMLImageElement[]>([])
  const drawnKeyRef = useRef(-1)
  const frameRef = useRef(0)
  const blurRef = useRef(0)
  const tickingRef = useRef(false)
  const loadedCountRef = useRef(0)

  const [progressPct, setProgressPct] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!section || !stage || !canvas) return
    const ctx = canvas.getContext('2d')!

    let destRect = { dx: 0, dy: 0, dw: 0, dh: 0 }
    let cssW = 0
    let cssH = 0
    let disposed = false

    // Cover-fit: fill the stage, crop the overflow evenly from both sides.
    function computeRect() {
      const img = imagesRef.current[0]
      const ir = img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : 16 / 9
      const cr = cssW / cssH
      if (cr > ir) destRect = { dw: cssW, dh: cssW / ir, dx: 0, dy: (cssH - cssW / ir) / 2 }
      else destRect = { dh: cssH, dw: cssH * ir, dy: 0, dx: (cssW - cssH * ir) / 2 }
    }

    function isDrawable(img?: HTMLImageElement) {
      return !!img && img.complete && img.naturalWidth > 0
    }

    // Draws a fractional frame. Right at a seam the two neighbouring frames are
    // cross-dissolved so the cut between clips never shows as a hard jump.
    function drawFrame(frame: number) {
      const base = Math.floor(frame)
      const frac = frame - base
      const nearSeam = SEAMS.some((s) => Math.abs(base + 0.5 - s) < 0.01)
      const key = nearSeam ? base + Math.round(frac * 20) / 20 : Math.round(frame)
      if (key === drawnKeyRef.current) return

      const a = imagesRef.current[nearSeam ? base : Math.round(frame)]
      if (!isDrawable(a)) return
      const { dx, dy, dw, dh } = destRect
      ctx.globalAlpha = 1
      ctx.drawImage(a, dx, dy, dw, dh)
      const b = imagesRef.current[base + 1]
      if (nearSeam && frac > 0 && isDrawable(b)) {
        ctx.globalAlpha = frac
        ctx.drawImage(b, dx, dy, dw, dh)
        ctx.globalAlpha = 1
      }
      drawnKeyRef.current = key
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      cssW = stage!.clientWidth
      cssH = stage!.clientHeight
      canvas!.width = Math.round(cssW * dpr)
      canvas!.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'medium'
      computeRect()
      drawnKeyRef.current = -1
      drawFrame(frameRef.current)
    }

    function syncSeamEffect(frame: number) {
      const amt = seamAmount(frame)
      const blur = Math.round(amt * SEAM_MAX_BLUR * 10) / 10
      if (blur === blurRef.current) return
      blurRef.current = blur
      // A slight zoom hides the soft edges blur would otherwise leave and adds to the sense of speed.
      canvas!.style.filter = blur > 0 ? `blur(${blur}px)` : ''
      canvas!.style.transform = blur > 0 ? `scale(${1 + amt * 0.05})` : ''
    }

    function syncText(progress: number) {
      if (introRef.current) {
        const fade = 1 - Math.min(1, progress / INTRO_FADE_END)
        introRef.current.style.opacity = String(fade)
        introRef.current.style.transform = `translateY(${(1 - fade) * -20}px)`
        introRef.current.style.pointerEvents = progress > INTRO_FADE_END ? 'none' : 'auto'
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - Math.min(1, progress / 0.015))
      }
      if (midRef.current) {
        midRef.current.style.opacity = String(bump(progress, MID_BEAT_CENTER, MID_BEAT_WIDTH))
      }
      if (arrivalRef.current) {
        arrivalRef.current.style.opacity = String(ramp(progress, ARRIVAL_START, 1))
      }
    }

    function update() {
      tickingRef.current = false
      const rect = section!.getBoundingClientRect()
      const total = rect.height - stage!.clientHeight
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0

      const frame = progressToFrame(progress)
      frameRef.current = frame
      drawFrame(frame)
      syncSeamEffect(frame)
      syncText(progress)
    }

    function onScroll() {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(update)
    }

    // The stage follows the dynamic viewport (mobile toolbars), so re-fit whenever it changes size.
    const ro = new ResizeObserver(() => {
      if (!disposed) resize()
    })

    // ---- Preload every frame, decoding before reveal ----
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      images[i] = img
    }
    imagesRef.current = images

    const progressInterval = window.setInterval(() => {
      setProgressPct(Math.round((loadedCountRef.current / FRAME_COUNT) * 100))
    }, 80)

    Promise.all(
      images.map((img, k) => {
        img.src = framePath(k + 1)
        return img
          .decode()
          .catch(() => new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res() }))
          .then(() => { loadedCountRef.current++ })
      })
    ).then(() => {
      if (disposed) return
      window.clearInterval(progressInterval)
      setProgressPct(100)
      resize()
      update()
      ro.observe(stage)
      setReady(true)
    })

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      disposed = true
      ro.disconnect()
      window.clearInterval(progressInterval)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div ref={sectionRef} id="villa" className="relative w-full" style={{ height: `${SCROLL_LENGTH_VH}vh` }}>
      <section ref={stageRef} className="sticky top-0 h-dvh w-full overflow-hidden bg-[#0a0a08]">
        {/* Preloader */}
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-[#0a0a08] transition-opacity duration-700"
          style={{ opacity: ready ? 0 : 1, pointerEvents: ready ? 'none' : 'auto' }}
        >
          <span
            className="text-white/85 text-[16px] tracking-[0.02em]"
            style={{ fontWeight: 400 }}
          >
            Готовим полёт…
          </span>
          <div className="w-52 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${progressPct}%`, background: '#e9c98f', transition: 'width 0.15s ease' }}
            />
          </div>
          <span className="text-white/40 text-[12px] tabular-nums">{progressPct}%</span>
        </div>

        {/* Scroll-scrubbed frame sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0, willChange: 'filter, transform' }}
        />

        {/* Legibility scrims */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/45 via-transparent to-black/55" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/45 via-black/10 to-transparent md:via-transparent" />

        {/* Intro copy */}
        <div
          ref={introRef}
          className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-16"
          style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
        >
          <div className="max-w-lg">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-[0.2em] uppercase text-white/75"
              style={{ background: 'rgba(20,20,16,0.55)', border: '1px solid rgba(255,255,255,0.12)', fontWeight: 500 }}
            >
              Sochi, Private Villa, Demo Project
            </span>
            <h1
              className="mt-6 text-[clamp(2.9rem,7vw,5rem)] leading-[1.05] tracking-[-0.02em] text-white"
              style={{ fontWeight: 300 }}
            >
              Villa Amber
            </h1>
            <p
              className="mt-4 text-white/85 text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.35] max-w-md text-balance"
              style={{ fontWeight: 300 }}
            >
              Закат, который принадлежит только вам.
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-white/60 text-[11px] tracking-[0.22em] uppercase">Листайте вниз</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/50 animate-bounce">
            <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Mid beat — appears as the camera crosses the threshold into the villa */}
        <div
          ref={midRef}
          className="absolute inset-x-0 bottom-14 z-10 flex justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span
            className="text-white text-[13px] tracking-[0.28em] uppercase px-4 py-2 rounded-full"
            style={{ background: 'rgba(10,10,8,0.5)', border: '1px solid rgba(255,255,255,0.14)', fontWeight: 500 }}
          >
            Войдите
          </span>
        </div>

        {/* Arrival beat — the final terrace reveal */}
        <div
          ref={arrivalRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-end text-center px-6 pb-20 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span
            className="text-[11px] tracking-[0.4em] uppercase text-white/90"
            style={{ fontWeight: 500, textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
          >
            Вы на месте
          </span>
          <h2
            className="mt-4 text-white text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[-0.02em]"
            style={{ fontWeight: 300 }}
          >
            Ваш вид ждёт
          </h2>
        </div>
      </section>
    </div>
  )
}
