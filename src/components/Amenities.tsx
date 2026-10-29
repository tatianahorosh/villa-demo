import { Eyebrow, Heading, Photo, Reveal } from './ui'

const features = [
  {
    photo: 'photos/kitchen.jpg',
    title: 'Кухня-гостиная',
    text: 'Одно большое пространство для готовки, ужинов и отдыха: мраморный остров, длинный стол у стеклянной стены и камин в гостиной.',
    items: ['Мраморный остров', 'Стол на 10 гостей', 'Камин'],
  },
  {
    photo: 'photos/covered-terrace.jpg',
    title: 'Терраса',
    text: 'Под навесом стоит обеденный стол и мягкий лаунж, а вокруг растут оливы и кипарисы. Вечером всё освещено тёплым светом.',
    items: ['Обеденная зона', 'Лаунж', 'Вид на закат'],
  },
]

const included = [
  'Бассейн-инфинити с видом на море',
  'Панорамное остекление от пола до потолка',
  'Гостиная с камином',
  'Кухня-столовая с мраморным островом на 10 гостей',
  'Крытая терраса с обеденной зоной и лаунжем',
  'Приватный сад с оливами и кипарисами',
]

export default function Amenities() {
  return (
    <section id="amenities" className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-[#0e0e0b]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Удобства</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <Heading className="mt-6">Всё уже здесь</Heading>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-white/60 text-[15px] md:text-[16px] leading-[1.7] max-w-lg">
              Дом устроен так, чтобы из любой комнаты было видно море, а до воды оставалось несколько шагов.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              <Reveal>
                <Photo src={f.photo} alt={f.title} className="aspect-[4/3]" />
              </Reveal>
              <Reveal delay={0.1}>
                <span className="text-[12px] tabular-nums tracking-[0.2em] text-[#e9c98f]/80">0{i + 1}</span>
                <h3
                  className="mt-3 text-white text-[24px] md:text-[30px] leading-[1.15] tracking-[-0.01em]"
                  style={{ fontWeight: 400 }}
                >
                  {f.title}
                </h3>
                <p className="mt-4 text-white/60 text-[15px] leading-[1.75] max-w-md">{f.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {f.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-full px-3.5 py-1.5 text-[12.5px] text-white/75"
                      style={{ border: '1px solid rgba(255,255,255,0.14)' }}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal className="mt-24">
          <div className="rounded-3xl p-8 md:p-12" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h3 className="text-white text-[21px] md:text-[24px] tracking-[-0.01em]" style={{ fontWeight: 400 }}>
                Что есть на вилле
              </h3>
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/45">Стоимость</span>
                <span className="text-[#e9c98f] text-[20px] md:text-[24px] leading-none tracking-[-0.01em]" style={{ fontWeight: 400 }}>
                  по запросу
                </span>
              </div>
            </div>
            <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {included.map((it) => (
                <li key={it} className="flex items-start gap-3 text-white/70 text-[14.5px] leading-[1.5]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                    <path d="M3 8.5 6.5 12 13 4.5" stroke="#e9c98f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
