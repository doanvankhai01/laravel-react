import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { EFormRuleType, EFormType, EStatusState } from '@/enums';
import type { IForm } from '@/interfaces';
import { SGlobal } from '@/services';
import { LINK } from '@/utils';

/**
 * Represents the login page component.
 *
 * This component displays a login form for users to enter their username and password.
 * It also includes functionality for handling form submission, navigation, and displaying error messages.
 */
export const Component = () => {
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (sGlobal.status === EStatusState.IsFulfilled && sGlobal.user && Object.keys(sGlobal.user).length > 0) {
      sGlobal.set({ status: EStatusState.Idle });
      navigate({ pathname: `/${sGlobal.language}${LINK.Dashboard}` }, { replace: true });
    }
  }, [sGlobal.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Login' });
  const columns: IForm[] = [
    {
      name: 'email',
      title: t('Username'),
      formItem: {
        rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Email }],
      },
    },
    {
      name: 'password',
      title: t('Password'),
      formItem: {
        type: EFormType.Password,
        notDefaultValid: true,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
  ];
  const renderFooter = ({ canSubmit, form }) => (
    <>
      <div className='-mt-2 text-right'>
        <button
          className='text-base-content/60'
          type='button'
          onClick={() => navigate({ pathname: `/${sGlobal.language}${LINK.ForgetPassword}` })}
          title={t('LinkForgotPassword')}
        >
          {t('LinkForgotPassword')}
        </button>
      </div>
      <CButton
        isLoading={sGlobal.isLoading}
        text={t('LogIn')}
        onClick={() => form.handleSubmit()}
        disabled={!canSubmit}
        className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
      />
    </>
  );
  return (
    <div className='intro-x'>
      <h1>{t('SignIn')}</h1>
      <h5>{t('EnterYourDetailsToLoginToYourAccount')}</h5>
      <CForm
        isEnterSubmit={true}
        isLoading={sGlobal.isLoading}
        columns={columns}
        onSubmit={({ value }) => sGlobal.postLogin(value)}
        footer={renderFooter}
      />
    </div>
  );
};
