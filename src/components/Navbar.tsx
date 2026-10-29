import { useEffect, useState } from 'react'
import { AUTHOR_NOTE, AUTHOR_URL, CTA_LABEL } from './links'

const navLinks = [
  { label: 'Вилла', href: '#story' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Удобства', href: '#amenities' },
  { label: 'Контакты', href: '#contact' },
]

function Mark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 20 12 4l9 16" stroke="#f4f2ec" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 20v-6.5l4-2.2 4 2.2V20" stroke="#f4f2ec" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export default function Navbar() {
  // Over the frame sequence the header stays transparent; past it, it gets a solid backdrop so it never sits on top of content.
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    function onScroll() {
      const villa = document.getElementById('villa')
      setSolid(!!villa && villa.getBoundingClientRect().bottom <= 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${solid ? 'bg-[#0a0a08]/85 backdrop-blur-md border-b border-white/[0.06]' : ''}`}
    >
      {!solid && <div className="absolute inset-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />}

      {/* Demo notice — always visible at the top of the page */}
      <div
        className="relative flex items-center justify-center gap-2 px-4 py-1.5 text-center text-[11.5px] md:text-[12px] leading-[1.35] text-[#0a0a08]"
        style={{ background: '#e9c98f', fontWeight: 500 }}
      >
        <span className="uppercase tracking-[0.14em] font-medium whitespace-nowrap">Демо-проект</span>
        <span className="opacity-60">·</span>
        <span className="whitespace-nowrap">
          вилла вымышленная<span className="hidden sm:inline">, изображения сгенерированы</span>
        </span>
      </div>

      <nav
        className="animate-fade-down relative flex items-center justify-between gap-4 px-5 md:px-10 py-4 md:py-5"
        style={{ animationDelay: '0.15s' }}
      >
        <a href="#villa" className="flex items-center gap-2.5 shrink-0">
          <Mark />
          <span
            className="text-white text-[17px] tracking-[-0.01em]"
            style={{ fontWeight: 400 }}
          >
            Villa Amber
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={AUTHOR_NOTE}
            className="inline-flex items-center px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[12.5px] md:text-[13px] font-medium text-[#0a0a08] whitespace-nowrap transition-all duration-200 hover:brightness-105"
            style={{ background: '#e9c98f' }}
          >
            {CTA_LABEL}
          </a>
          <span className="text-[10px] leading-none text-white/50 whitespace-nowrap">{AUTHOR_NOTE}</span>
        </div>
      </nav>
    </header>
  )
}
