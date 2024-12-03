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
 * Represents the `Page` component.
 * This component is responsible for rendering the "Verify Forgot Password" page.
 * It displays a form where the user can enter the OTP code sent to their email.
 * If the OTP code is valid, the user is redirected to the "Set Password" page.
 * If the OTP code is not valid or the email is not provided, the user is redirected back to the "Forget Password" page.
 */
export const Component = () => {
  const navigate = useNavigate();
  const sGlobal = SGlobal();

  useEffect(() => {
    if (sGlobal.status === EStatusState.IsFulfilled) {
      sGlobal.set({ status: EStatusState.Idle });
      navigate({ pathname: `/${sGlobal.language}${LINK.SetPassword}` }, { replace: true });
    }
  }, [sGlobal.status]);

  useEffect(() => {
    if (!sGlobal.data?.email) navigate({ pathname: `/${sGlobal.language}${LINK.ForgetPassword}` }, { replace: true });
  }, []);

  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Login.ForgetPassword.VerifyForgotPassword' });
  const columns: IForm[] = [
    {
      name: 'otp',
      title: t('CodeOTP'),
      formItem: {
        type: EFormType.Otp,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: '',
      name: 'email',
      formItem: {
        type: EFormType.Hidden,
      },
    },
  ];
  const renderFooter = ({ canSubmit, form }) => (
    <CButton
      isLoading={sGlobal.isLoading}
      text={t('SendCode')}
      onClick={() => form.handleSubmit()}
      disabled={!canSubmit}
      className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
    />
  );
  return (
    <div className='intro-x'>
      <h1>{t('ForgetPassword')}</h1>
      <h5>{t('PleaseEnterTheOTPCodeThatHasBeenSentToYourEmail')}</h5>
      <CForm
        isEnterSubmit={true}
        isLoading={sGlobal.isLoading}
        columns={columns}
        onSubmit={({ value }) => sGlobal.postOtpConfirmation(value)}
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
