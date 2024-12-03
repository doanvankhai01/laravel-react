import { Modal as AntModal, Spin } from 'antd';
import { forwardRef, useImperativeHandle, type Ref } from 'react';
import { useTranslation } from 'react-i18next';

import { CButton } from '../button';
import './index.less';
import type { Props } from './interface';

/**
 * Represents the configuration options for a modal component.
 */
export const CModal = forwardRef(
  (
    {
      facade,
      keyState = 'isVisible',
      title,
      width = 9999,
      onOk,
      onCancel,
      firstChange = true,
      textSubmit = 'Save',
      textCancel = 'Cancel',
      className = '',
      footerCustom,
      children,
    }: Props,
    ref: Ref<any>,
  ) => {
    useImperativeHandle(ref, () => ({}));
    /**
     * Represents the facade object.
     * @template T - The type of data in the facade object.
     */
    const { data, isLoading } = facade;
    /**
     * Retrieves the translation function from the specified translation namespace.
     *
     * @param {string} namespace - The translation namespace.
     * @param {object} options - The translation options.
     * @param {string} options.keyPrefix - The prefix for translation keys.
     * @returns {TranslationFunction} The translation function.
     */
    const { t } = useTranslation('locale', { keyPrefix: 'Components' });
    const handleCancel = () => {
      onCancel?.();
      facade.set({ [keyState]: false });
    };
    const handleOk = async () => {
      if (onOk) onOk();
      else handleCancel();
    };

    /**
     * Renders the footer of the modal.
     *
     * @param {Function} handleOk - The function to handle the OK button click.
     * @param {Function} handleCancel - The function to handle the Cancel button click.
     * @param {React.ReactNode} footerCustom - The custom footer component.
     * @param {string | React.ReactNode} textCancel - The text or component for the Cancel button.
     * @param {string | React.ReactNode} textSubmit - The text or component for the Submit button.
     * @param {boolean} isLoading - Indicates whether the Submit button is in a loading state.
     * @param {boolean} firstChange - Indicates whether any input field has been changed.
     * @returns {React.ReactNode} The rendered footer component.
     */
    const renderFooter = footerCustom ? (
      footerCustom(handleOk, handleCancel)
    ) : (
      <div className='flex justify-end gap-2'>
        <CButton
          text={typeof textCancel === 'string' ? t(textCancel) : textCancel}
          className='bg-base-100 text-primary'
          onClick={handleCancel}
        />
        <CButton
          isLoading={isLoading}
          text={typeof textCancel === 'string' ? t(textSubmit) : textSubmit}
          disabled={!firstChange}
          onClick={handleOk}
        />
      </div>
    );

    return (
      <AntModal
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        width={width}
        title={title && <h3 className='text-lg font-bold'>{title(data)}</h3>}
        open={facade[keyState]}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={className}
        footer={renderFooter}
      >
        <Spin spinning={isLoading}>{children}</Spin>
      </AntModal>
    );
  },
);
CModal.displayName = 'CModal';
