import { useForm } from '@tanstack/react-form';
import { Spin } from 'antd';
import classNames from 'classnames';
import { Fragment, forwardRef, useEffect, useImperativeHandle, type Ref } from 'react';
import { useTranslation } from 'react-i18next';

import { convertFormValue } from './convert';
import CField from './field';
import './index.less';
import type { Props } from './interface';
import { handleCondition } from './util';

/**
 * A custom form component.
 */
export const CForm = forwardRef(
  ({ className, columns, values = {}, isLoading = false, onSubmit, footer, isEnterSubmit }: Props, ref: Ref<any>) => {
    const form = useForm({
      defaultValues: convertFormValue(columns, values, false),
      onSubmit: ({ value, formApi }) => onSubmit?.({ value: convertFormValue(columns, value, true), formApi }),
    });
    useImperativeHandle(ref, () => form);

    useEffect(() => {
      // form.reset();
      form.update({ ...form.options, defaultValues: convertFormValue(columns, values, false) });
    }, [values]);

    const handleSubmit = e => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    };

    const { t } = useTranslation('locale', { keyPrefix: 'Components' });
    return (
      <>
        <Spin spinning={isLoading}>
          <form className={classNames('c-form', className)} onSubmit={handleSubmit}>
            {isEnterSubmit && <input type='submit' hidden />}
            {columns
              .filter((item, index) => handleCondition({ item, index, values }))
              .map((item, index) => (
                <Fragment key={index + item.name}>
                  <CField
                    item={item}
                    index={index}
                    name={item.name}
                    t={t}
                    form={form}
                    values={values}
                    Field={form.Field}
                  />
                </Fragment>
              ))}
          </form>
        </Spin>
        <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => footer?.({ canSubmit, isSubmitting, form })}
        </form.Subscribe>
      </>
    );
  },
);
