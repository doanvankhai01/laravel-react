import i18next from 'i18next';
import i18nextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { LANGUAGE } from './utils';

export default () => {
  localStorage.setItem('i18nextLng', LANGUAGE);
  document.querySelector('html')?.setAttribute('lang', LANGUAGE);

  i18next
    .use(i18nextHttpBackend)
    .use(initReactI18next)
    .init({
      ns: 'locale',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      fallbackLng: LANGUAGE,
      interpolation: {
        escapeValue: false,
      },
    });
};
