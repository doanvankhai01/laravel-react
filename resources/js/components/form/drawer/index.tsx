import type { FormApi } from '@tanstack/react-form';
import { Drawer } from 'antd';
import { forwardRef, useImperativeHandle, useRef, type Ref } from 'react';
import { useTranslation } from 'react-i18next';

import { CForm } from '..';
import { CButton } from '../../button';
import { convertFormValue } from '../convert';
import './index.less';
import type { Props } from './interface';

/**
 * Represents the configuration for a drawer component.
 */
export const CDrawerForm = forwardRef(
  (
    {
      size,
      title,
      columns,
      textSubmit = 'Save',
      textCancel = 'Cancel',
      facade,
      keyState = 'isVisible',
      keyIsLoading = 'isLoading',
      keyData = 'data',
      onClose,
      onSubmit,
    }: Props,
    ref: Ref<any>,
  ) => {
    const { t } = useTranslation('locale', { keyPrefix: 'Components' });
    /**
     * Renders the footer component for the drawer.
     *
     * @returns The JSX element representing the footer component.
     */
    const renderFooter = () => (
      <div className={'mt-2 flex items-center justify-end gap-3 sm:flex-row'}>
        <CButton
          isLoading={facade[keyIsLoading]}
          text={typeof textCancel === 'string' ? t(textCancel) : textCancel}
          className={'out-line sm:w-auto sm:min-w-36'}
          onClick={onClose ?? (() => facade.set({ [keyData]: undefined, [keyState]: false }))}
        />
        <CButton
          isLoading={facade[keyIsLoading]}
          text={typeof textSubmit === 'string' ? t(textSubmit) : textSubmit}
          onClick={() => refForm.current?.handleSubmit()}
          disabled={facade[keyIsLoading]}
          className={'w-full sm:w-auto sm:min-w-48'}
        />
      </div>
    );

    const refForm = useRef<FormApi<any, any>>();
    useImperativeHandle(ref, () => ({ form: refForm.current }));

    return (
      <Drawer
        keyboard={false}
        destroyOnClose={true}
        size={size}
        footer={renderFooter()}
        title={<h3>{title}</h3>}
        open={facade[keyState]}
        onClose={onClose ?? (() => facade.set({ [keyData]: undefined, [keyState]: false }))}
        closeIcon={null}
      >
        <div className='scrollbar intro-x'>
          <CForm
            ref={refForm}
            values={{ ...facade[keyData] }}
            columns={columns}
            isLoading={facade[keyIsLoading]}
            onSubmit={({ value }) => onSubmit(convertFormValue(columns, value))}
          />
        </div>
      </Drawer>
    );
  },
);
