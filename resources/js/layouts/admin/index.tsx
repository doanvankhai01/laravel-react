import { Dropdown } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useNavigation } from 'react-router';
import { createSearchParams, type URLSearchParamsInit } from 'react-router-dom';

import { CAvatar } from '@/components/avatar';
import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { SCrud, SGlobal } from '@/services';
import { KEY_TOKEN, LINK, useRoute } from '@/utils';
import './index.less';
import CSide from './side';

export const Component = () => {
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (localStorage.getItem(KEY_TOKEN)) sGlobal.getProfile();
    else navigate({ pathname: `/${sGlobal.language}${LINK.Login}` }, { replace: true });
  }, []);

  const navigation = useNavigation();
  const sCrud = SCrud('');
  useEffect(() => {
    if (navigation.state === 'loading') sCrud.reset();
  }, [navigation.state]);

  const changeTheme = () => {
    const html = document.querySelector('html');
    const dataTheme = html?.getAttribute('data-theme');
    const theme = dataTheme === 'light' ? 'dark' : 'light';
    html?.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const route = useRoute();
  const changeLanguage = lang => {
    const pathname = route.pathname.replace(/^\/[a-z]{2}/, `/${lang}`);
    sGlobal.setLanguage(lang);
    navigate({ pathname, search: `?${createSearchParams(route.query as URLSearchParamsInit)}` }, { replace: true });
  };
  const listLanguage = [
    {
      key: 'en',
      label: (
        <button>
          <CSvgIcon name={EIcon.En} size={24} className='rounded-lg' />
          English
        </button>
      ),
      onClick: () => changeLanguage('en'),
    },
    {
      key: 'vi',
      label: (
        <button>
          <CSvgIcon name={EIcon.Vi} size={24} className='rounded-lg' />
          Tiếng Việt
        </button>
      ),
      onClick: () => changeLanguage('vi'),
    },
  ].filter(item => item.key !== sGlobal.language);

  const changePage = (link: string, query?: any) =>
    navigate({ pathname: `/${sGlobal.language}${link}`, search: `?${createSearchParams(query)}` });
  const { t } = useTranslation('locale', { keyPrefix: 'Layouts' });
  const listMyProfile: ItemType[] = [
    {
      key: 'MyProfile',
      label: (
        <button>
          <CSvgIcon name={EIcon.UserCircle} size={20} />
          {t('MyProfile')}
        </button>
      ),
      onClick: () => changePage(`${LINK.MyProfile}`, { tab: 'MyProfile' }),
    },
    {
      key: 'ChangePassword',
      label: (
        <button>
          <CSvgIcon name={EIcon.Key} size={20} />
          {t('ChangePassword')}
        </button>
      ),
      onClick: () => changePage(`${LINK.MyProfile}`, { tab: 'ChangePassword' }),
    },
    {
      type: 'divider',
    },
    {
      key: 'SignOut',
      label: (
        <button>
          <CSvgIcon name={EIcon.Out} size={20} />
          {t('SignOut')}
        </button>
      ),
      onClick: () => changePage(LINK.Login),
    },
  ];

  const renderRightHeader = (
    <div className='right'>
      <Dropdown trigger={['click']} menu={{ items: listLanguage }}>
        <button>
          <CSvgIcon name={sGlobal.language as any} size={24} className='rounded-lg' />
        </button>
      </Dropdown>
      <button onClick={changeTheme}>
        <CSvgIcon name={EIcon.DayNight} size={24} />
      </button>
      <Dropdown trigger={['click']} menu={{ items: listMyProfile }} placement='bottomRight'>
        <div id='dropdown-profile' className='flex cursor-pointer gap-1.5'>
          <CAvatar src={sGlobal.user?.avatarUrl ?? ''} size={30} />
          <div className='leading-none'>
            <p className='text-sm font-semibold'>{sGlobal.user?.name}</p>
            <span className='text-xs text-gray-500'>{sGlobal.user?.email}</span>
          </div>
        </div>
      </Dropdown>
    </div>
  );
  return (
    <div className='l-admin'>
      <CSide />
      <section>
        <header>
          <button
            className={classNames('hamburger', { active: sGlobal.isCollapseMenu })}
            onClick={() => sGlobal.set({ isCollapseMenu: !sGlobal.isCollapseMenu })}
          >
            <span className='line' />
            <span className='line' />
            <span className='line' />
          </button>

          {renderRightHeader}
        </header>
        <div className='scrollbar'>
          {sGlobal.data && (
            <main>
              <Outlet />
            </main>
          )}
        </div>
        <footer>{t('Footer', { year: new Date().getFullYear() })}</footer>
      </section>
    </div>
  );
};
