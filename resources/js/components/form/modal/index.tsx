import { forwardRef, useImperativeHandle, useRef, type Ref } from 'react';

import { CForm } from '@/components/form';
import { convertFormValue } from '@/components/form/convert';
import type { FormApi } from '@tanstack/react-form';
import { CModal } from '../../modal';
import type { Props } from './interface';

/**
 * Represents the configuration for a modal form.
 */

export const CModalForm = forwardRef(
  (
    {
      title,
      width = 1200,
      columns,
      textSubmit,
      textCancel,
      className = '',
      footerCustom,
      facade,
      keyState = 'isVisible',
      keyData = 'data',
      keyIsLoading = 'isLoading',
      onClose,
      onSubmit,
    }: Props,
    ref: Ref<any>,
  ) => {
    useImperativeHandle(ref, () => ({})); // form

    const refForm = useRef<FormApi<any, any>>();
    return (
      <CModal
        facade={facade}
        keyState={keyState}
        width={width}
        textSubmit={textSubmit}
        textCancel={textCancel}
        className={className}
        footerCustom={footerCustom}
        title={() => title(facade[keyData])}
        onOk={() => refForm.current?.handleSubmit()}
        onCancel={onClose && (() => onClose(facade[keyData]))}
      >
        <CForm
          ref={refForm}
          values={{ ...facade[keyData] }}
          columns={columns}
          isLoading={facade[keyIsLoading]}
          onSubmit={({ value }) => onSubmit(convertFormValue(columns, value))}
        />
      </CModal>
    );
  },
);
CModalForm.displayName = 'CModalForm';
