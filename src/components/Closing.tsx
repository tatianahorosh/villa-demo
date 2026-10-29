import { AUTHOR_NOTE, AUTHOR_URL, CTA_LABEL } from './links'

export default function Closing() {
  return (
    <section id="contact" className="relative w-full py-28 md:py-36 px-6 bg-[#0a0a08]">
      <div className="max-w-2xl mx-auto text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-[0.2em] uppercase text-[#e9c98f]"
          style={{ background: 'rgba(233,201,143,0.08)', border: '1px solid rgba(233,201,143,0.3)', fontWeight: 500 }}
        >
          Демо-проект
        </span>

        <h2
          className="mt-6 text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-white"
          style={{ fontWeight: 300 }}
        >
          Скролл закончился.
          <br />
          Хотите такой же сайт?
        </h2>

        <p className="mt-5 text-white/60 text-[15px] md:text-[16px] leading-[1.7] max-w-md mx-auto" style={{ fontWeight: 400 }}>
          Villa Amber вымышленная: это демонстрация сайта с полётом камеры. Сделаю такой же для
          вашей виллы, отеля или апартаментов.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={AUTHOR_NOTE}
            className="inline-flex items-center px-7 py-3.5 rounded-full text-[14px] font-medium text-[#0a0a08] transition-all duration-200 hover:brightness-105"
            style={{ background: '#e9c98f', boxShadow: '0 10px 28px -10px rgba(233,201,143,0.45)' }}
          >
            {CTA_LABEL}
          </a>
          <a
            href="#villa"
            className="inline-flex items-center px-7 py-3.5 rounded-full text-[14px] font-medium text-white transition-all duration-200 hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.22)' }}
          >
            Пролистать наверх
          </a>
        </div>
        <p className="mt-3 text-[12px] text-white/45">«{CTA_LABEL}» — {AUTHOR_NOTE.toLowerCase()}</p>
      </div>
    </section>
  )
}
