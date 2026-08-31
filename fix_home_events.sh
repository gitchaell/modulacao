cat << 'INNER_EOF' > src/components/home/Events.astro
---
import { usePageTranslations,  getLangFromUrl } from '@/utils/i18n';
// src/components/home/Events.astro

import Typography from '@/components/core/Typography.astro';
import Button from '@/components/core/Button.astro';
import { Calendar, MapPin, Clock, ArrowRight } from '@lucide/astro';

interface Props {
  pageDict: Record<string, string>;
}
const { pageDict } = Astro.props;
const lang = getLangFromUrl(Astro.cookies);
const t = usePageTranslations(pageDict, lang);

const events = [
  {
    id: 1,
    date: { day: '15', month: t('home.events.month1') },
    category: t('home.events.cat1'),
    title: t('home.events.event1.title'),
    location: t('home.events.event1.location'),
    time: '16:00',
    type: 'event'
  },
  {
    id: 2,
    date: { day: '22', month: t('home.events.month1') },
    category: t('home.events.cat2'),
    title: t('home.events.event2.title'),
    location: t('home.events.event2.location'),
    time: '15:30',
    type: 'match',
    teams: { home: 'MODULAÇÃO', away: 'FC RIVERA' }
  },
  {
    id: 3,
    date: { day: '05', month: t('home.events.month2') },
    category: t('home.events.cat3'),
    title: t('home.events.event3.title'),
    location: t('home.events.event3.location'),
    time: '09:00',
    type: 'event'
  },
  {
    id: 4,
    date: { day: '18', month: t('home.events.month2') },
    category: t('home.events.cat4'),
    title: t('home.events.event4.title'),
    location: t('home.events.event4.location'),
    time: '14:00',
    type: 'match',
    teams: { home: 'MODULAÇÃO', away: 'ATLÉTICO SUL' }
  }
];
---
<section class="py-24 bg-brand-white dark:bg-[#0a0a0a] border-y border-black/5 dark:border-white/5 relative overflow-hidden">
  <div class="absolute -left-40 top-40 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"></div>

  <div class="container mx-auto px-6 relative z-10 max-w-[1400px]">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
      <div class="max-w-2xl">
        <Typography variant="h6" class="text-brand-gold font-bold text-sm tracking-[0.2em] uppercase mb-3 flex items-center gap-3">
          <span class="h-[2px] w-12 bg-brand-gold"></span>
          {t('home.events.subtitle')}
        </Typography>
        <Typography variant="h2" class="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight text-brand-black dark:text-brand-white">
          {t('home.events.title')}
        </Typography>
      </div>
      <Button as="a" href="/eventos" variant="outline" class="hidden md:flex whitespace-nowrap">
        {t('home.events.btn')}
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map(event => (
        <a href={`/eventos/${event.id}`} class="group flex flex-col sm:flex-row bg-[#FAFAFA] dark:bg-[#111] border border-black/5 dark:border-white/5 hover:border-brand-gold/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
          {/* Date Block */}
          <div class="bg-brand-black dark:bg-[#151515] text-brand-white p-6 sm:w-32 flex flex-row sm:flex-col items-center justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-white/10 group-hover:bg-brand-gold group-hover:text-brand-black transition-colors duration-300">
            <span class="text-sm font-bold tracking-widest uppercase">{event.date.month}</span>
            <span class="text-4xl sm:text-5xl font-display font-bold">{event.date.day}</span>
          </div>

          {/* Content Block */}
          <div class="p-6 sm:p-8 flex-1 flex flex-col justify-center">
            <div class="mb-4">
              <span class="text-xs font-extrabold text-brand-black dark:text-brand-white bg-white/10 px-3 py-1.5 uppercase tracking-[0.2em] rounded-sm border border-black/5 dark:border-white/10 inline-block">
                {event.category}
              </span>
            </div>

            {event.type === 'match' ? (
              <div class="flex items-center gap-4 mb-4">
                <span class="font-display font-bold text-xl text-brand-black dark:text-brand-white">{event.teams?.home}</span>
                <span class="text-brand-gold font-bold text-sm">X</span>
                <span class="font-display font-bold text-xl text-brand-black/60 dark:text-brand-white/60">{event.teams?.away}</span>
              </div>
            ) : (
              <h3 class="font-display font-bold text-2xl text-brand-black dark:text-brand-white mb-4 group-hover:text-brand-gold transition-colors line-clamp-2">
                {event.title}
              </h3>
            )}

            <div class="flex flex-col sm:flex-row gap-4 mt-auto">
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin class="w-4 h-4 text-brand-gold" />
                <span class="truncate">{event.location}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock class="w-4 h-4 text-brand-gold" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div class="hidden sm:flex items-center justify-center px-6 border-l border-black/5 dark:border-white/5 group-hover:border-brand-gold/20 transition-colors">
            <ArrowRight class="w-6 h-6 text-gray-300 dark:text-white/20 group-hover:text-brand-gold group-hover:translate-x-2 transition-all duration-300" />
          </div>
        </a>
      ))}
    </div>

    <Button as="a" href="/eventos" variant="outline" class="w-full mt-8 md:hidden flex justify-center">
      {t('home.events.btn')}
    </Button>
  </div>
</section>
INNER_EOF
