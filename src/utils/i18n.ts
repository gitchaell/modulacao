import { ui, defaultLang } from '@/i18n/ui';

export function getLangFromUrl(urlOrCookies: URL | any) {
  if (urlOrCookies instanceof URL) {
    const [, lang] = urlOrCookies.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
  }

  if (urlOrCookies && urlOrCookies.has && urlOrCookies.has('lang')) {
    const lang = urlOrCookies.get('lang')?.value;
    if (lang && lang in ui) return lang as keyof typeof ui;
  }

  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
    // @ts-ignore
    return ui[lang]?.[key] || ui[defaultLang]?.[key] || key;
  }
}
