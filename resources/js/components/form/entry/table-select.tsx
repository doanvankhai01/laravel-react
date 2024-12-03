import { Dropdown, theme } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { API, C_API, KEY_DATA } from '@/utils';
import { CDataTable } from '../../data-table';
import type { PropsTableSelect } from './interface';
import Mask from './mask';

/**
 * Represents the properties for the `SelectTable` component.
 */

const Component = ({ isMultiple, onChange, placeholder, disabled, get, value }: PropsTableSelect) => {
  /**
   * Represents an array of data.
   */
  let current: any = [];
  if (get?.data() && get?.format) {
    current = isMultiple ? get.data().map(get.format) : [get.format(get.data())];
  }

  /**
   * Represents the SelectTable component.
   * @component
   */
  const [state, setState] = useState<{ current: any; list: any[]; isLoading: boolean; isOpen: boolean }>({
    current: current,
    isOpen: false,
    list: !get?.keyApi
      ? []
      : JSON.parse(localStorage.getItem(KEY_DATA[get.keyApi]) ?? '{}').data.filter(item => !item.isDelete),
    isLoading: false,
  });

  /**
   * Handles the onBlur event for the select-table component.
   * It sets the isOpen state to false after a 200ms delay.
   */
  const onBlur = () => {
    setTimeout(() => setState(previousState => ({ ...previousState, isOpen: false })), 140);
  };

  useEffect(() => {
    if (state.isOpen) document.addEventListener('click', onBlur);
    else document.removeEventListener('click', onBlur);
  }, [state.isOpen]);
  /**
   * Handles the onFocus event for the select-table component.
   */
  const onFocus = () => loadData();

  /**
   * Loads data for the select table.
   *
   * @returns {Promise<void>} - A promise that resolves when the data is loaded.
   */
  const loadData = async () => {
    if (get?.keyApi) {
      const params = { latestUpdated: '' };
      const local = JSON.parse(localStorage.getItem(KEY_DATA[get.keyApi]) ?? '{}');
      if (!local.isLatest) {
        try {
          setState(pre => ({ ...pre, isLoading: true }));
          params.latestUpdated = local.data?.[0]?.updatedAt;

          const result = await API.get<any>({ url: `${C_API[get.keyApi]}`, params });
          local.data = [...result.data, ...local.data];
          localStorage.setItem(KEY_DATA[get.keyApi], JSON.stringify({ data: local.data, isLatest: true }));
        } catch (e) {
          console.log(e);
        }
        setState(pre => ({
          ...pre,
          list: local.data.filter((item: any) => !item.isDelete),
          isLoading: false,
          isOpen: true,
        }));
        setTimeout(() => {
          refTable.current.table.current.table.setGlobalFilter(refInput.current?.input.value);
        }, 150);
      } else setState(pre => ({ ...pre, isOpen: true }));
    }
  };

  /**
   * Ref object for the input element.
   */
  const refInput = useRef<{ input: HTMLInputElement }>(null);
  /**
   * Handles the row click event for the select table.
   *
   * @param {Event} e - The click event.
   * @returns {Object} - An object containing the onClick function.
   */
  const handleRow = e => ({
    onClick: () => {
      if (get?.format) {
        const { label, value } = get.format(e);
        onChange(value);
        if (refInput.current?.input && typeof label === 'string') {
          refInput.current.input.value = label;
        }
      }
      setState(old => ({ ...old, isOpen: false }));
    },
  });

  const { token } = theme.useToken();
  const refDropdown = useRef<HTMLDivElement>(null);
  const refTable = useRef<any>();
  /**
   * Renders a dropdown component.
   *
   * @returns The rendered dropdown component.
   */
  const renderDropdown = () => (
    <div
      ref={refDropdown}
      style={{
        borderRadius: token.borderRadiusLG + 'px',
        boxShadow: token.boxShadowSecondary,
      }}
      className={'overflow-hidden bg-base-100'}
    >
      <CDataTable
        ref={refTable}
        isSearch={false}
        isPagination={false}
        filterGlobal={(row, columnId, value) => row.original[columnId].includes(value)}
        data={state.list}
        isLoading={state.isLoading}
        onRow={handleRow}
        columns={get?.column || []}
      />
    </div>
  );

  /**
   * Renders an SVG icon based on the current state of the component.
   *
   * @returns The SVG icon element.
   */
  const renderIcon = () => (
    <svg
      viewBox='64 64 896 896'
      focusable='false'
      data-icon='down'
      width='1em'
      height='1em'
      fill='currentColor'
      aria-hidden='true'
    >
      {!state.isOpen ? (
        <path d='M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z'></path>
      ) : (
        <path d='M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z'></path>
      )}
    </svg>
  );
  return (
    <Dropdown
      overlayStyle={{ width: '70vw' }}
      trigger={['click']}
      destroyPopupOnHide={true}
      open={state.isOpen}
      dropdownRender={renderDropdown}
    >
      <div>
        <Mask
          ref={refInput}
          value={state.current.length > 0 ? state.current[0].label?.toString() : (state?.current?.label ?? value)}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={onFocus}
          onChange={e => refTable.current.table.current.table.setGlobalFilter(e.target.value)}
          addonAfter={renderIcon}
        />
      </div>
    </Dropdown>
  );
};
export default Component;
