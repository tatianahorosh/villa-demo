import { TELEGRAM_URL } from './links'

const columns = [
  {
    title: 'Где',
    lines: ['Villa Amber', 'Сочи, побережье Чёрного моря', 'Адрес вымышленный'],
  },
  {
    title: 'Связь',
    links: [{ label: 'Telegram: @tatty_lifee', href: TELEGRAM_URL, external: true }],
  },
  {
    title: 'Разделы',
    links: [
      { label: 'Вилла', href: '#story' },
      { label: 'Галерея', href: '#gallery' },
      { label: 'Удобства', href: '#amenities' },
      { label: 'Контакты', href: '#contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative w-full px-6 md:px-12 lg:px-16 pt-16 pb-10 bg-[#0a0a08] border-t border-white/[0.07]">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="text-white text-[19px] tracking-[-0.01em]" style={{ fontWeight: 400 }}>
              Villa Amber
            </span>
            <p className="mt-3 text-white/45 text-[14px] leading-[1.65] max-w-xs">
              Демо-проект. Вилла вымышленная, изображения сгенерированы.
            </p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-[11px] uppercase tracking-[0.18em] text-white/40">{c.title}</h4>
              <ul className="mt-4 space-y-2 text-[14px] text-white/70">
                {c.lines?.map((l) => <li key={l}>{l}</li>)}
                {c.links?.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="hover:text-white transition-colors"
                      {...('external' in l ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row justify-between gap-3 text-[12px] text-white/35">
          <span>© {new Date().getFullYear()} Villa Amber · демо-проект</span>
          <span>Сайт с полётом камеры</span>
        </div>
      </div>
    </footer>
  )
}
