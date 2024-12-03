import enUS from 'antd/lib/locale/en_US';
import jaJP from 'antd/lib/locale/ja_JP';
import viVN from 'antd/lib/locale/vi_VN';
import dayjs from 'dayjs';

import { EStatusState } from '@/enums';
import { KEY_USER } from '@/utils';
import { enLocale, jaLocale, viLocale } from './locale';
import type { GlobalState } from './reducer';

/**
 * Represents the global state of the application.
 */
export interface StateGlobal extends GlobalState {
  language?: string;
  locale?: typeof viVN | typeof enUS | typeof jaJP;
  localeDate?: typeof enLocale | typeof viLocale;
  isCollapseMenu?: boolean;
}

/**
 * Checks the language and sets the locale and localeDate accordingly.
 * @param language - The language to be checked.
 * @returns An object containing the language, locale, and localeDate.
 */
export const checkLanguage = (language: string) => {
  let locale;
  let localeDate;
  switch (language) {
    case 'en':
      locale = enUS;
      localeDate = enLocale;
      break;
    case 'vi':
      locale = viVN;
      localeDate = viLocale;
      break;
    case 'ja':
      locale = jaJP;
      localeDate = jaLocale;
      break;
  }
  dayjs.locale(language);
  localStorage.setItem('i18nextLng', language);
  document.querySelector('html')?.setAttribute('lang', language);
  const user = JSON.parse(localStorage.getItem(KEY_USER) ?? '{}');
  return { language, locale, localeDate, user };
};

/**
 * Represents the initial state for the global module.
 */
export const initialStateGlobal: StateGlobal = {
  isLoading: false,
  status: EStatusState.Idle,
  // ...checkLanguage(lang ?? 'vi'),
};
