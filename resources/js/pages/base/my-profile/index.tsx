import { Tabs } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { CSvgIcon } from '@/components/svg-icon';
import { EFormRuleType, EFormType, EIcon } from '@/enums';
import type { IForm } from '@/interfaces';
import { SGlobal } from '@/services';
import { FULL_TEXT_SEARCH, useRoute } from '@/utils';
import './style.less';

/**
 * Represents the My Profile page component.
 * This component displays the user's profile information and allows them to change their password.
 * It includes a tab navigation system to switch between the "My Profile" and "Change Password" sections.
 *
 * @returns The rendered My Profile page component.
 */
export const Component = () => {
  const sGlobal = SGlobal();
  useEffect(() => {
    sGlobal.getProfile();
  }, []);

  const columnsSide: IForm[] = [
    {
      title: '',
      name: 'avatarUrl',
      formItem: {
        type: EFormType.Upload,
      },
    },
    {
      title: 'routes.admin.user.Full name',
      name: 'name',
      formItem: {
        render: ({ values }) => (
          <>
            <h2 className='text-center'>{values.name}</h2>
            <div className='line'></div>
            <div className='wrapper-flex'>
              <CSvgIcon name={EIcon.UserCircle} size={20} />
              <h3>{sGlobal.user?.role?.name}</h3>
            </div>
          </>
        ),
      },
    },
  ];
  const Side = (
    <div className='card'>
      <div className='body'>
        <CForm values={{ ...sGlobal.data }} columns={columnsSide} />
      </div>
    </div>
  );

  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.MyProfile' });
  const columnsMyProfile: IForm[] = [
    {
      title: t('FullName'),
      name: 'name',
      formItem: {
        col: 12,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: 'Email',
      name: 'email',
      formItem: {
        col: 6,
        rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Email }, { type: EFormRuleType.Min, value: 6 }],
      },
    },
    {
      title: t('PhoneNumber'),
      name: 'phoneNumber',
      formItem: {
        col: 6,
        rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Phone, min: 10, max: 15 }],
      },
    },
    {
      title: t('DateOfBirth'),
      name: 'birthday',
      formItem: {
        col: 6,
        type: EFormType.Date,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: t('Position'),
      name: 'positionCode',
      formItem: {
        col: 6,
        type: EFormType.Select,
        rules: [{ type: EFormRuleType.Required }],
        api: {
          keyApi: 'Code',
          params: ({ fullTextSearch, value }) => ({
            [FULL_TEXT_SEARCH]: fullTextSearch,
            typeCode: 'position',
            extend: value['positionCode'],
          }),
          format: item => ({
            label: item?.name,
            value: item?.code,
          }),
          data: () => sGlobal.data?.position,
          column: [
            {
              title: t('Code'),
              name: 'code',
              tableItem: {
                width: 100,
              },
            },
            {
              title: t('NameCode'),
              name: 'name',
              tableItem: {},
            },
          ],
        },
      },
    },
    {
      title: t('Description'),
      name: 'description',
      formItem: {
        type: EFormType.Textarea,
      },
    },
  ];
  const renderFooterMyProfile = ({ canSubmit, form }) => (
    <CButton
      text={t('Save')}
      onClick={() => form.handleSubmit()}
      disabled={!canSubmit}
      className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
    />
  );
  const formProfile = (
    <CForm
      isLoading={sGlobal.isLoading}
      values={{ ...sGlobal.data }}
      columns={columnsMyProfile}
      onSubmit={({ value }) => sGlobal.putProfile({ ...value })}
      footer={renderFooterMyProfile}
    />
  );

  const columnsChangePassword: IForm[] = [
    {
      title: t('Password'),
      name: 'passwordOld',
      formItem: {
        notDefaultValid: true,
        col: 12,
        type: EFormType.Password,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: t('NewPassword'),
      name: 'password',
      formItem: {
        col: 12,
        type: EFormType.Password,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: t('ConfirmPassword'),
      name: 'passwordConfirmation',
      formItem: {
        notDefaultValid: true,
        col: 12,
        type: EFormType.Password,
        rules: [
          { type: EFormRuleType.Required },
          {
            type: EFormRuleType.Custom,
            validator: ({ value, form }) => {
              if (!value || form.getFieldValue('password') === value) return '';
              return t('TwoPasswordsThatYouEnterIsInconsistent');
            },
          },
        ],
      },
    },
  ];
  const renderFooterChangePassword = ({ canSubmit, form }) => (
    <CButton
      text={t('ChangePassword')}
      onClick={() => form.handleSubmit()}
      disabled={!canSubmit}
      className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
    />
  );

  const formChangePassword = (
    <CForm
      isLoading={sGlobal.isLoading}
      values={{ ...sGlobal.data }}
      columns={columnsChangePassword}
      onSubmit={({ value }) => sGlobal.putProfile({ ...value })}
      footer={renderFooterChangePassword}
    />
  );

  const route = useRoute();
  const activeKey = useRef<string>((route.query?.tab as string) ?? 'MyProfile');

  const navigate = useNavigate();
  const onChangeTab = (tab: string) => {
    activeKey.current = tab;
    navigate({ pathname: route.pathname, search: `?${createSearchParams({ tab })}` });
  };

  const items = [
    {
      key: 'MyProfile',
      label: t('MyProfile'),
      children: formProfile,
    },
    {
      key: 'ChangePassword',
      label: t('ChangePassword'),
      children: formChangePassword,
    },
  ];

  return (
    <>
      <CBreadcrumbs title={t('MyProfile')} list={[t('MyProfile')]} />
      <div className='wrapper-grid profile'>
        <div className='-intro-x left'>{Side}</div>
        <div className='intro-x right'>
          <div className='card'>
            <div className='body'>
              <Tabs
                className='-mt-3'
                onTabClick={(key: string) => onChangeTab(key)}
                activeKey={activeKey.current}
                size='large'
                items={items}
              ></Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
