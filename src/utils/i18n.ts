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

// Function to load page-specific translations
export async function getPageTranslations(page: string, lang: keyof typeof ui = defaultLang) {
  try {
    const defaultPageTranslations = await import(`../i18n/pages/${page}/pt.json`);

    if (lang === defaultLang) {
      return defaultPageTranslations.default;
    }

    try {
      const pageTranslations = await import(`../i18n/pages/${page}/${lang}.json`);
      return { ...defaultPageTranslations.default, ...pageTranslations.default };
    } catch (e) {
      return defaultPageTranslations.default;
    }
  } catch (e) {
    return {};
  }
}

export function usePageTranslations(pageDict: Record<string, string>, lang: keyof typeof ui = defaultLang) {
  const globalT = useTranslations(lang);
  return function t(key: string) {
    return pageDict[key] || globalT(key);
  }
}
