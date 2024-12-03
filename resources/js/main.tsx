import { Spin } from 'antd';
import 'dayjs/locale/vi';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import i18next from '@/i18next';
import { setupStore } from '@/services';
import { router } from './router';
import './style.less';
import { KEY_DATA } from './utils';

/**
 * Listener event DOM content loaded
 */
document.addEventListener(
  'DOMContentLoaded',
  () => {
    // Setup language
    i18next();

    // Setup store.
    const store = setupStore();

    // Setup theme
    localStorage.getItem('theme');
    document.querySelector('html')?.setAttribute('data-theme', localStorage.getItem('theme') ?? 'light');

    // Call api to update data in local storage by set false key name isLatest
    Object.keys(KEY_DATA).forEach(value => {
      const local = JSON.parse(localStorage.getItem(KEY_DATA[value]) ?? '{}');
      if (!local.data) local.data = [];
      localStorage.setItem(KEY_DATA[value], JSON.stringify({ ...local, isLatest: false }));
    });

    const root = createRoot(document.getElementById('app') as HTMLElement);
    root.render(
      <Suspense fallback={<Spin size={'large'} className='flex h-screen w-screen items-center justify-center' />}>
        {/* Provider store */}
        <Provider store={store}>
          {/* Setup router */}
          <RouterProvider router={router} />
        </Provider>
      </Suspense>,
    );
  },
  { passive: true },
);
