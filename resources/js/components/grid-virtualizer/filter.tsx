import type { FilterFns } from '@tanstack/react-table';
import { DatePicker, Dropdown, theme } from 'antd';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EIcon, ETableFilterType } from '@/enums';
import { CButton } from '../button';
import { CEMask, CESelect } from '../form/entry';
import { CSvgIcon } from '../svg-icon';
import type { PropsFilter } from './interface';
import { ETypeFilter } from './util';

export const Filter = ({ column, refFilterTypeCurrent }: PropsFilter) => {
  const { t } = useTranslation('locale', { keyPrefix: 'Components' });
  const typeFilter = {
    text: [
      { value: ETypeFilter.IncludeText, label: t('IncludeInputBelow') },
      { value: ETypeFilter.NotIncludeText, label: t('DoNotIncludeInputBelow') },
      { value: ETypeFilter.StartText, label: t('StartWithInputBelow') },
      { value: ETypeFilter.EndText, label: t('EndWithInputBelow') },
      { value: ETypeFilter.SameText, label: t('SameWithInputBelow') },
    ],
    date: [
      { value: ETypeFilter.SameDate, label: t('DateMakeSame') },
      { value: ETypeFilter.BeforeDate, label: t('DayBeforeInputBelow') },
      { value: ETypeFilter.AfterDate, label: t('DayAfterInputBelow') },
    ],
    number: [
      { value: ETypeFilter.GreaterNumber, label: t('GreaterThanInputBelow') },
      { value: ETypeFilter.GreaterEqualNumber, label: t('GreaterThanOrEqualTo') },
      { value: ETypeFilter.LessNumber, label: t('SmallerThanInputBelow') },
      { value: ETypeFilter.LessEqualNumber, label: t('SmallerThanOrEqualTo') },
      { value: ETypeFilter.EqualNumber, label: t('EqualToBelow') },
      { value: ETypeFilter.NotEqualNumber, label: t('NotEqualToBelow') },
      { value: ETypeFilter.MiddleNumber, label: t('InTheMiddleOfInputBelow') },
      { value: ETypeFilter.NotMiddleNumber, label: t('NotInTheMiddleOfInputBelow') },
    ],
  };

  const [state, setState] = useState<{ value?: keyof FilterFns; isOpen?: boolean }>({
    value: refFilterTypeCurrent.current[column.id],
    isOpen: false,
  });
  const { token } = theme.useToken();
  const columnFilterValue = column.getFilterValue();
  const refValue = useRef(columnFilterValue);
  const refValueEnd = useRef(columnFilterValue);
  const refValueDate = useRef(columnFilterValue);

  const handleReset = () => {
    delete refFilterTypeCurrent.current[column.id];
    column.columnDef.filterFn = undefined;
    column.setFilterValue(undefined);
    setState({ isOpen: false, value: refFilterTypeCurrent.current[column.id] });
  };

  const handleSubmit = () => {
    if (state.value) {
      refFilterTypeCurrent.current[column.id] = state.value;
      column.columnDef.filterFn = state.value;
      let value = refValue.current ?? null;
      if (state.value === ETypeFilter.MiddleNumber || state.value === ETypeFilter.NotMiddleNumber) {
        value = refValue.current && refValueEnd.current ? [refValue.current, refValueEnd.current] : null;
      } else if (column.columnDef.meta?.filter === ETableFilterType.Date) value = refValueDate.current ?? null;
      column.setFilterValue(state.value === ETypeFilter.Blank || state.value === ETypeFilter.NotBlank ? null : value);
    }
    setState({ isOpen: false, value: refFilterTypeCurrent.current[column.id] });
  };

  const renderDropdown = () => (
    <div
      style={{
        borderRadius: token.borderRadiusLG + 'px',
        boxShadow: token.boxShadowSecondary,
      }}
      className={classNames('flex flex-col gap-1 bg-base-100 p-2 text-base-content', {
        'w-56': column?.columnDef?.meta?.filter === ETableFilterType.Text,
        'w-52': column?.columnDef?.meta?.filter !== ETableFilterType.Text,
      })}
    >
      <p>{t('ColumnName')}</p>
      <CEMask disabled={true} placeholder='' value={(column?.columnDef?.header as string) ?? ''} />
      <div className='relative mt-1'>
        <hr className='absolute top-1/2 w-full' />
        <strong className='relative bg-base-100 py-1 pr-1'>{t('ConditionSetting')}</strong>
      </div>
      <p>
        {t('Condition')} ({t(column.columnDef.meta?.filter)})
      </p>
      <CESelect
        className='w-full'
        placeholder=''
        onChange={value => setState(old => ({ ...old, value }))}
        value={refFilterTypeCurrent.current[column.id]}
        list={[
          ...typeFilter[column.columnDef.meta!.filter!],
          { value: ETypeFilter.Blank, label: t('Blank') },
          { value: ETypeFilter.NotBlank, label: t('NotBlank') },
        ]}
      />
      <p>{t('Value')}</p>
      {column.columnDef.meta!.filter !== ETableFilterType.Date && (
        <CEMask
          type={column.columnDef.meta?.filter}
          disabled={!state.value || state.value === ETypeFilter.Blank || state.value === ETypeFilter.NotBlank}
          value={
            typeof columnFilterValue !== 'object'
              ? (columnFilterValue?.toString() ?? '')
              : ((columnFilterValue as [number, number])?.[0]?.toString() ?? '')
          }
          placeholder={
            column.columnDef.meta?.filter !== ETableFilterType.Number
              ? `${t('Search')}... (${column.getFacetedUniqueValues().size})`
              : `${t('Min')} (${column.getFacetedMinMaxValues()?.[0] ?? ''})`
          }
          onChange={e => (refValue.current = e.target.value)}
        />
      )}
      {(state.value === ETypeFilter.MiddleNumber || state.value === ETypeFilter.NotMiddleNumber) && (
        <CEMask
          placeholder={`${t('Max')} (${column.getFacetedMinMaxValues()?.[1] ?? ''})`}
          value={typeof columnFilterValue !== 'object' ? (columnFilterValue as [number, number])?.[1]?.toString() : ''}
          onChange={e => (refValueEnd.current = e.target.value)}
        />
      )}

      {column.columnDef.meta?.filter === ETableFilterType.Date && (
        <DatePicker
          disabled={!state.value || state.value === ETypeFilter.Blank || state.value === ETypeFilter.NotBlank}
          defaultValue={columnFilterValue}
          onChange={e => (refValueDate.current = e)}
        />
      )}
      <div className='mt-1 flex gap-2'>
        <CButton className='out-line w-full' text={t('Reset')} onClick={handleReset}></CButton>
        <CButton className='w-full' text={t('Apply')} onClick={handleSubmit}></CButton>
      </div>
    </div>
  );

  const handleOpenChange = isOpen => setState({ isOpen, value: refFilterTypeCurrent.current[column.id] });

  return (
    column?.columnDef?.meta?.filter && (
      <Dropdown
        trigger={['click']}
        destroyPopupOnHide={true}
        placement='bottomRight'
        arrow={{ pointAtCenter: true }}
        open={state.isOpen}
        onOpenChange={handleOpenChange}
        dropdownRender={renderDropdown}
      >
        <button type='button' className={classNames('filter', { 'opacity-0': columnFilterValue === undefined })}>
          <CSvgIcon name={columnFilterValue === undefined ? EIcon.Filter : EIcon.FilterFill} size={10} />
        </button>
      </Dropdown>
    )
  );
};
