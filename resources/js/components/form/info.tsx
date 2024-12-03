import { Checkbox, DatePicker, Radio, Spin, Switch, TimePicker } from 'antd';
import classNames from 'classnames';

import { EFormType, EIcon } from '@/enums';
import { API, FORMAT_DATE } from '@/utils';
import { CSvgIcon } from '../svg-icon';
import {
  CEAddable,
  CEDatePicker,
  CEEditor,
  CEMask,
  CEOtp,
  CEPassword,
  CESelect,
  CETab,
  CETableSelect,
  CETreeSelect,
  CEUpload,
} from './entry';
import type { PropsInfo } from './interface';

/**
 * Represents the configuration options for the form component.
 */

export const Info = ({ field, formItem, t, form, meta, title, value, Field }: PropsInfo) => {
  const { name, handleBlur, handleChange } = field;

  const hidden = ({ value }) => <input value={value} type={'hidden'} name={name} tabIndex={-1} />;
  const date = ({ value }) => (
    <CEDatePicker
      format={FORMAT_DATE}
      value={value}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
      disabledDate={current => (formItem.date?.disabledDate ? formItem.date?.disabledDate({ current }) : false)}
      picker={formItem.date?.picker ?? 'date'}
      disabled={formItem.disabled?.({ value })}
      name={name}
      placeholder={t(formItem.placeholder ?? 'Choose', { title: title.toLowerCase() })}
    />
  );
  const editor = ({ value }) => (
    <CEEditor
      value={value}
      onBlur={value => {
        formItem.onBlur?.({ value, form, name, api: API });
        handleBlur();
        handleChange(value);
      }}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
      placeholder={t(formItem.placeholder ?? 'Enter', { title: title.toLowerCase() })}
    />
  );
  const mask = ({ value }) => (
    <CEMask
      value={value}
      mask={formItem.text?.mask}
      addonBefore={formItem.text?.addonBefore}
      addonAfter={formItem.text?.addonAfter}
      placeholder={t(formItem.placeholder ?? 'Enter', { title: title.toLowerCase() })}
      onBlur={e => {
        formItem.onBlur?.({ value: e.target.value, form, name, api: API });
        handleBlur();
      }}
      onChange={e => {
        formItem.onChange?.({ value: e.target.value });
        handleChange(e.target.value);
      }}
      disabled={formItem.disabled?.({ value })}
    />
  );
  const password = ({ value }) => (
    <CEPassword
      value={value}
      placeholder={t(formItem.placeholder ?? 'Enter', { title: title.toLowerCase() })}
      disabled={formItem.disabled?.({ value })}
      onBlur={e => {
        formItem.onBlur?.({ value: e.target.value, form, name, api: API });
        handleBlur();
      }}
      onChange={e => {
        formItem.onChange?.({ value: e.target.value });
        handleChange(e.target.value);
      }}
    />
  );
  const select = ({ value }) => (
    <CESelect
      maxTagCount={'responsive'}
      value={value}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value ?? '');
      }}
      placeholder={t(formItem.placeholder ?? 'Choose', { title: title.toLowerCase() })}
      disabled={formItem.disabled?.({ value })}
      get={formItem.api}
      list={formItem.list}
      isMultiple={formItem.isMultiple}
    />
  );
  const tab = ({ value }) => (
    <CETab name={name} form={form} column={formItem.column} list={formItem.list} values={value} Field={Field} />
  );
  const upload = ({ value }) => (
    <CEUpload
      isMultiple={formItem.isMultiple}
      value={value}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
    />
  );
  const otp = () => (
    <CEOtp
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
    />
  );

  const textarea = ({ value }) => (
    <textarea
      disabled={formItem.disabled?.({ value })}
      className={classNames('ant-input', { disabled: formItem.disabled?.({ value }) })}
      rows={4}
      maxLength={1000}
      placeholder={t(formItem.placeholder ?? 'Enter', { title: title.toLowerCase() })}
      value={value}
      onBlur={e => {
        formItem.onBlur?.({ value: e.target.value, name, api: API, form });
        handleBlur();
      }}
      onChange={e => {
        formItem.onChange?.({ value: e.target.value });
        handleChange(e.target.value);
      }}
    />
  );
  const switchs = ({ value }) => (
    <Switch
      checkedChildren={<CSvgIcon name={EIcon.Check} size={20} className='fill-white' />}
      unCheckedChildren={<CSvgIcon name={EIcon.Times} size={20} className='fill-white' />}
      checked={!!value && value === 1}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
    />
  );
  const radio = ({ value }) => (
    <Radio.Group
      options={formItem.list}
      optionType={'button'}
      disabled={formItem.disabled?.({ value })}
      value={value}
      onChange={({ target }) => {
        formItem.onChange?.({ value: target.value });
        handleChange(target.value);
      }}
    />
  );
  const checkbox = ({ value }) => (
    <Checkbox.Group
      options={formItem.list}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
      disabled={formItem.disabled?.({ value })}
      defaultValue={value}
    />
  );

  const onCalendarChange = date => {
    form.setFieldValue(
      name,
      date?.filter(i => !!i),
    );
    formItem?.onChange?.({ value: date?.filter(i => !!i) });
  };
  const dateRange = ({ value }) => (
    <DatePicker.RangePicker
      onCalendarChange={onCalendarChange}
      format={FORMAT_DATE}
      disabledDate={current => (formItem.date?.disabledDate ? formItem.date?.disabledDate({ current }) : false)}
      disabled={formItem.disabled?.({ value })}
      defaultValue={value}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
    />
  );
  const time = ({ value }) => (
    <TimePicker
      defaultValue={value}
      minuteStep={10}
      format={'HH:mm'}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
      disabledDate={current => (formItem.date?.disabledDate ? formItem.date?.disabledDate({ current }) : false)}
      disabled={formItem.disabled?.({ value })}
      name={name}
      placeholder={t(formItem.placeholder ?? 'Choose', { title: title.toLowerCase() })}
    />
  );
  const timeRange = ({ value }) => (
    <TimePicker.RangePicker
      minuteStep={10}
      onCalendarChange={onCalendarChange}
      format={'HH:mm'}
      disabledDate={current => (formItem.date?.disabledDate ? formItem.date?.disabledDate({ current }) : false)}
      disabled={formItem.disabled?.({ value })}
      defaultValue={value}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
    />
  );

  const treeSelect = ({ value }) => (
    <CETreeSelect
      list={formItem.list}
      isMultiple={formItem.isMultiple}
      disabled={formItem.disabled?.({ value })}
      placeholder={t(formItem.placeholder ?? 'Choose', { title: title.toLowerCase() })}
      value={value}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
    />
  );
  const selectTable = ({ value }) => (
    <CETableSelect
      placeholder={t(formItem.placeholder ?? 'Choose', { title: title.toLowerCase() })}
      disabled={formItem.disabled?.({ value })}
      isMultiple={formItem.isMultiple}
      get={formItem.api}
      value={value}
      onChange={value => {
        formItem.onChange?.({ value });
        handleChange(value);
      }}
    />
  );
  const addable = ({ value }) => (
    <CEAddable
      form={form}
      name={name}
      column={formItem.column}
      textAdd={formItem.addable?.textAdd}
      onAdd={formItem.addable?.onAdd}
      isTable={formItem.addable?.isTable}
      showRemove={formItem.addable?.showRemove}
      idCheck={formItem.addable?.idCheck}
      values={value}
      Field={Field}
    />
  );

  const listInput = {
    [EFormType.Hidden]: hidden,
    [EFormType.Date]: date,
    [EFormType.Editor]: editor,
    [EFormType.Text]: mask,
    [EFormType.Number]: mask,
    [EFormType.Password]: password,
    [EFormType.Select]: select,
    [EFormType.Tab]: tab,
    [EFormType.Upload]: upload,
    [EFormType.Otp]: otp,
    [EFormType.Textarea]: textarea,
    [EFormType.Switch]: switchs,
    [EFormType.Radio]: radio,
    [EFormType.Checkbox]: checkbox,
    [EFormType.DateRange]: dateRange,
    [EFormType.Time]: time,
    [EFormType.TimeRange]: timeRange,

    [EFormType.TreeSelect]: treeSelect,
    [EFormType.SelectTable]: selectTable,
    [EFormType.Addable]: addable,
  };
  const isError = (meta.isTouched && meta.errors.length) || meta.isValidating;
  const renderMessage = (
    <div className='feedback'>
      {meta.isTouched && meta?.errors?.length > 0
        ? meta.errors.join(',')
        : meta.isValidating && (
            <>
              {t('Validating')} <Spin size='small' />
            </>
          )}
      {isError ? '' : '|'}
    </div>
  );

  return (
    <>
      {(formItem.type ? listInput[formItem.type] : mask)({ value })}
      {renderMessage}
      {isError && <CSvgIcon name={EIcon.Warning} />}
    </>
  );
};
