import { ConfigProvider, message as noti } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import { useEffect } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import { SGlobal } from './services';
import { LANGUAGE } from './utils';
export let message: MessageInstance;

export const App = () => {
  const [api, contextHolder] = noti.useMessage({ duration: 4, maxCount: 2 });
  const sGlobal = SGlobal();
  useEffect(() => {
    // set function call message ant design vue to global variable message
    message = api;
    // set default language by router
    sGlobal.setLanguage(LANGUAGE);
  }, []);

  // setup slim progress bars when change route
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === 'loading') NProgress.start();
    else if (navigation.state === 'idle') NProgress.done();
  }, [navigation.state]);

  // config theme ant design vue
  const theme = {
    token: {
      // config style font
      fontSize: 13,
      lineHeight: 1.847,
      fontFamily:
        'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      // config style data entry
      controlHeight: 32,
    },
  };

  return (
    <ConfigProvider theme={theme} locale={sGlobal.locale}>
      {/* render message ant design vue  */}
      {contextHolder}

      {/* render router */}
      <Outlet />
    </ConfigProvider>
  );
};
