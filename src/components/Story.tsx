import { Eyebrow, Heading, Photo, Reveal } from './ui'

export default function Story() {
  return (
    <section id="story" className="relative w-full py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#0a0a08]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-14 lg:gap-20 items-center">
        <div>
          <Reveal>
            <Eyebrow>Вилла</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <Heading className="mt-6">
              Дом на скале
              <br />
              над Чёрным морем
            </Heading>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-white/65 text-[15px] md:text-[16.5px] leading-[1.75] max-w-md">
              Villa Amber стоит на скале над Чёрным морем и встречает вас панорамой, от которой не
              хочется уходить. Мраморная кухня-гостиная, камин и стеклянные стены открываются прямо
              к бассейну-инфинити.
            </p>
            <p className="mt-4 text-white/65 text-[15px] md:text-[16.5px] leading-[1.75] max-w-md">
              Вечером вся терраса освещена тёплым светом, а на горизонте садится солнце. Здесь можно
              просто остановиться и выдохнуть.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-10 border-t border-white/10 pt-6 max-w-md text-[12.5px] leading-[1.6] text-white/45">
              <span className="text-[#e9c98f]/90 uppercase tracking-[0.14em] text-[11px] font-medium">Демо-проект.</span>{' '}
              Villa Amber не существует: вилла, тексты и изображения созданы для демонстрации сайта.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          <Reveal>
            <Photo src="photos/facade-sunset.jpg" alt="Фасад виллы с колоннами в закатном свете" className="aspect-[4/5] md:aspect-[5/4]" />
          </Reveal>
          <Reveal
            delay={0.2}
            className="absolute -bottom-10 -left-6 md:-left-14 w-[46%] hidden sm:block"
          >
            <Photo
              src="photos/living-terrace.jpg"
              alt="Гостиная, открытая на террасу"
              className="aspect-[4/3] ring-8 ring-[#0a0a08]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
