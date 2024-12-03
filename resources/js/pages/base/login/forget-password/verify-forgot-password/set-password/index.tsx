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
 * Represents the SetPassword page component.
 * This component is responsible for rendering the UI for resetting the password.
 * It retrieves the email and code from the URL search parameters and displays a form for setting a new password.
 * The form includes fields for entering the new password and confirming it.
 * It also includes validation rules for the password fields.
 * When the form is submitted, it calls the `patchResetPassword` function from the `sGlobal` object to update the password.
 * The page also handles navigation based on the status of the `sGlobal` object.
 */
export const Component = () => {
  const sGlobal = SGlobal();
  const navigate = useNavigate();
  useEffect(() => {
    if (sGlobal.status === EStatusState.IsFulfilled) {
      sGlobal.set({ status: EStatusState.Idle });
      navigate({ pathname: `/${sGlobal.language}${LINK.Login}` }, { replace: true });
    }
  }, [sGlobal.status]);

  useEffect(() => {
    if (!sGlobal.data?.email) navigate({ pathname: `/${sGlobal.language}${LINK.ForgetPassword}` }, { replace: true });
  }, []);

  const { t } = useTranslation('locale', {
    keyPrefix: 'Pages.Base.Login.ForgetPassword.VerifyForgotPassword.ResetPassword',
  });
  const columns: IForm[] = [
    {
      name: 'otp',
      title: '',
      formItem: {
        type: EFormType.Hidden,
      },
    },
    {
      title: '',
      name: 'email',
      formItem: {
        type: EFormType.Hidden,
      },
    },
    {
      name: 'password',
      title: t('Password'),
      formItem: {
        type: EFormType.Password,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      name: 'passwordConfirmation',
      title: t('ConfirmPassword'),
      formItem: {
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
  const renderFooter = ({ canSubmit, form }) => (
    <CButton
      isLoading={sGlobal.isLoading}
      text={t('Submit')}
      onClick={() => form.handleSubmit()}
      disabled={!canSubmit}
      className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
    />
  );
  return (
    <div className='intro-x'>
      <h1>{t('ResetPassword')}</h1>
      <h5>{t('PasswordRequires8CharactersOrMoreWithAtLeast1UppercaseLetter')}</h5>
      <CForm
        isEnterSubmit={true}
        isLoading={sGlobal.isLoading}
        columns={columns}
        onSubmit={({ value }) => sGlobal.postResetPassword({ ...value })}
        footer={renderFooter}
      />
    </div>
  );
};
