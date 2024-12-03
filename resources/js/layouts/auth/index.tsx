import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { APP_NAME, KEY_DATA } from '@/utils';
import './index.less';

/**
 * Represents the layout component for the authentication pages.
 */
export const Component = () => {
  useEffect(() => {
    if (window.Echo) {
      window.Echo.leaveAllChannels();
      window.Echo = undefined;
    }
    Object.keys(KEY_DATA).forEach(value => {
      localStorage.setItem(KEY_DATA[value], JSON.stringify({ data: [], isLatest: false }));
    });
  }, []);

  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Login' });
  return (
    <div className='l-login'>
      <div className='wrapper'>
        <div className='t-head -intro-x'>
          <div className='block-grap-1'>
            <CSvgIcon name={EIcon.Logo} size={24} className='fill-primary' />
            <h4>{APP_NAME}</h4>
          </div>
          <h5 className='uppercase'>{t('EnterpriseManagementSystem')}</h5>
        </div>
        <div className='content intro-x'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
