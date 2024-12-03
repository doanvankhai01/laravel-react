import { Menu } from 'antd';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { SGlobal } from '@/services';
import { APP_NAME, KEY_ROLE, LINK } from '@/utils';
import type { IMenu } from './interface';

const Component = () => {
  const { t } = useTranslation('locale', { keyPrefix: 'Menu' });
  const sGlobal = SGlobal();
  const checkResponsive = () => {
    if (innerWidth < 1280 && !sGlobal.isCollapseMenu) {
      sGlobal.set({ isCollapseMenu: true });
    }
  };
  useEffect(() => {
    checkResponsive();
    window.addEventListener('resize', checkResponsive, { passive: true });
    return () => {
      window.removeEventListener('resize', checkResponsive);
    };
  }, []);

  const list: IMenu[] = [
    {
      key: `/${sGlobal.language}${LINK.Dashboard}`,
      icon: <CSvgIcon name={EIcon.Calendar} size={24} />,
      label: 'Dashboard',
    },
    {
      key: `/${sGlobal.language}${LINK.User}`,
      icon: <CSvgIcon name={EIcon.UserCircle} size={24} />,
      label: 'User',
      permission: KEY_ROLE.P_USER_INDEX,
      queryparams: { roleCode: 'SUPER-ADMIN' },
    },
    {
      key: `/${sGlobal.language}${LINK.Setting}`,
      icon: <CSvgIcon name={EIcon.Cog} size={24} />,
      label: 'Setting',
      children: [
        {
          key: `/${sGlobal.language}${LINK.Code}`,
          label: 'Code',
          permission: KEY_ROLE.P_CODE_INDEX,
          queryparams: { typeCode: 'POSITION' },
        },
        {
          key: `/${sGlobal.language}${LINK.Content}`,
          label: 'Content',
          permission: KEY_ROLE.P_CONTENT_INDEX,
          queryparams: { typeCode: 'VALUES' },
        },
        {
          key: `/${sGlobal.language}${LINK.Post}`,
          label: 'Post',
          permission: KEY_ROLE.P_POST_INDEX,
          queryparams: { typeCode: 'NEWS' },
        },
        {
          key: `/${sGlobal.language}${LINK.Parameter}`,
          label: 'Parameter',
          permission: KEY_ROLE.P_PARAMETER_INDEX,
          queryparams: { code: 'ADDRESS' },
        },
      ],
    },
  ];

  const listMenu = list
    .filter(item => {
      return (
        !item.permission ||
        (!item.children && item.permission && sGlobal.user?.role?.permissions?.includes(item.permission)) ||
        (item.children &&
          item.children.filter(
            subItem => !subItem.permission || sGlobal.user?.role?.permissions?.includes(subItem.permission),
          ).length > 0)
      );
    })
    .map(item => ({
      ...item,
      label: t(item.label ?? ''),
      children: item.children?.map(subItem => ({ ...subItem, label: t(subItem.label ?? '') })),
    }));

  /**
   * Finds a menu item by its key in the given array of menus.
   *
   * @param menus - The array of menus to search in.
   * @param key - The key of the menu item to find.
   * @returns The found menu item, or undefined if not found.
   */
  const findMenu = (menus: IMenu[], key: string): IMenu | undefined => {
    let menuCurrent: IMenu | undefined;
    const forEachMenu = (menu: IMenu) => {
      if (menu.key === key) {
        menuCurrent = menu;
      } else if (menu.children) {
        menu.children.forEach(forEachMenu);
      }
    };
    menus.forEach(forEachMenu);
    return menuCurrent;
  };

  const navigate = useNavigate();
  const onSelect = ({ key }) => {
    const menu = findMenu(listMenu, key);
    if (menu) {
      navigate({
        pathname: menu.key,
        search: `?${createSearchParams(menu.queryparams)}`,
      });
    }
  };

  const location = useLocation();
  return (
    <>
      <div className={classNames('overload', { active: !sGlobal.isCollapseMenu })}></div>
      <aside className={classNames({ active: sGlobal.isCollapseMenu })}>
        <button
          onClick={() => navigate({ pathname: `/${sGlobal.language}${LINK.Dashboard}` })}
          className={classNames('logo', { active: sGlobal.isCollapseMenu })}
        >
          <CSvgIcon name={EIcon.Logo} />
          <h1 className={classNames({ active: sGlobal.isCollapseMenu })}>{APP_NAME}</h1>
        </button>
        <div className='scrollbar'>
          <Menu
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['/' + location.pathname.substring(1).split('/').slice(0, 2).join('/')]}
            mode='inline'
            inlineCollapsed={sGlobal.isCollapseMenu}
            items={listMenu as any}
            onSelect={onSelect}
          />
        </div>
      </aside>
    </>
  );
};
export default Component;
