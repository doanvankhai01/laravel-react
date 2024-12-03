import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { EFormRuleType, EStatusState } from '@/enums';
import type { IForm } from '@/interfaces';
import { SGlobal } from '@/services';
import { LINK } from '@/utils';

/**
 * Represents a page component for the forget password functionality.
 * This component allows users to enter their email and receive an OTP verification code.
 * Users can also navigate back to the login page.
 */
export const Component = () => {
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (sGlobal.status === EStatusState.IsFulfilled) {
      sGlobal.set({ status: EStatusState.Idle });
      navigate({ pathname: `/${sGlobal.language}${LINK.VerifyForotPassword}` });
    }
  }, [sGlobal.status]);

  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Login.ForgetPassword' });
  const columns: IForm[] = [
    {
      name: 'email',
      title: t('RecoveryEmail'),
      formItem: {
        rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Email }],
      },
    },
  ];
  const renderFooter = ({ canSubmit, form }) => (
    <CButton
      isLoading={sGlobal.isLoading}
      text={t('GetOTP')}
      onClick={() => form.handleSubmit()}
      disabled={!canSubmit}
      className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
    />
  );
  return (
    <div className='intro-x'>
      <h1>{t('ForgetPassword')}</h1>
      <h5>{t('PleaseEnterYourEmailAnOTPVerificationCodeWillBeSentToYou')}</h5>
      <CForm
        isEnterSubmit={true}
        isLoading={sGlobal.isLoading}
        columns={columns}
        onSubmit={({ value }) => sGlobal.postForgottenPassword(value)}
        footer={renderFooter}
      />
      <div className='mt-3 text-center'>
        <button
          title={t('GoBackToLogin')}
          onClick={() => navigate({ pathname: `/${sGlobal.language}${LINK.Login}` }, { replace: true })}
        >
          {t('GoBackToLogin')}
        </button>
      </div>
    </div>
  );
};
