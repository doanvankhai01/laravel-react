import type { Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';

import type { IForm, ITableGet, ITableItemFilterList } from '@/interfaces';

/**
 * @param {Object} props - The component props.
 * @param {string} props.name - The name prop.
 * @param {Array} props.column - The column prop.
 * @param {string} props.textAdd - The textAdd prop.
 * @param {Function} props.onAdd - The onAdd prop.
 * @param {Function} props.generateForm - The generateForm prop.
 * @param {Object} props.form - The form prop.
 * @param {boolean} props.isTable - The isTable prop.
 * @param {Function} props.showRemove - The showRemove prop.
 * @param {string} props.idCheck - The idCheck prop.
 */
export interface PropsAddable {
  form: any;
  name?: string;
  column?: IForm[];
  textAdd?: string;
  onAdd?: (values: any) => void;
  isTable?: boolean;
  showRemove: (values: any) => boolean;
  idCheck: any;
  values?: any;
  Field: any;
}
/**
 * @param {string} props.name - The name of the date picker.
 * @param {string} [props.id] - The ID of the date picker.
 * @param {Function} props.onChange - The function to be called when the value of the date picker changes.
 * @param {string} [props.format] - The format of the date to be displayed.
 * @param {Function} [props.disabledDate] - The function to determine if a date should be disabled.
 * @param {boolean} [props.showTime] - Whether to show the time picker.
 * @param {string} [props.picker] - The type of the date picker to be rendered.
 * @param {boolean} [props.disabled] - Whether the date picker is disabled.
 */
export interface PropsDatePicker {
  value?: Dayjs;
  name?: string;
  placeholder?: string;
  onChange: (selectDate: any, value: any) => void;
  format?: string;
  disabledDate: (current: any) => boolean;
  picker: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined;
  disabled?: boolean;
}
/**
 * @param {Object} props - The component props.
 * @param {string} props.value - The current value of the input.
 * @param {string} props.placeholder - The placeholder text for the input.
 * @param {boolean} props.disabled - Determines if the input is disabled.
 * @param {Function} props.onChange - The callback function triggered when the input value changes.
 */
export interface PropsEditor {
  value?: string;
  placeholder: string;
  disabled?: boolean;
  onChange?: (values: string) => void;
  onBlur?: (e: any) => any;
}

export interface PropsMask {
  mask?: any;
  value?: string;
  addonBefore?: () => JSX.Element;
  addonAfter?: () => JSX.Element;
  disabled?: boolean;
  placeholder: string;
  height?: number;
  width?: number;
  type?: string;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  onChange?: (e: any) => void;
  onPressEnter?: (e: any) => void;
}
export interface PropsOtp {
  onChange?: (e: string) => any;
}
/**
 * @param {Object} props - The component props.
 * @param {string} props.value - The current value of the input.
 * @param {string} props.placeholder - The placeholder text for the input.
 * @param {boolean} props.disabled - Determines if the input is disabled.
 * @param {Function} props.onChange - The callback function triggered when the input value changes.
 */
export interface PropsPassword {
  value?: string;
  placeholder: string;
  disabled?: boolean;
  onChange?: (_e: ChangeEvent<HTMLInputElement>) => any;
  onBlur?: (_e: ChangeEvent<HTMLInputElement>) => any;
}
/**
 * @property {FormInstance} [form] - The form instance.
 * @property {*} [value] - The value of the select.
 * @property {boolean} [showSearch] - Determines whether to show the search input.
 * @property {number | 'responsive'} [maxTagCount] - The maximum number of tags to display.
 * @property {(e: any) => any} onChange - The callback function for when the select value changes.
 * @property {(e: any) => any} [onBlur] - The callback function for when the select loses focus.
 * @property {string} [placeholder] - The placeholder text for the select input.
 * @property {string} [className] - The CSS class name for the select component.
 * @property {boolean} [disabled] - Determines whether the select is disabled.
 * @property {ITableGet} [get] - The table get object.
 * @property {ITableItemFilterList[]} [list] - The list of table item filter objects.
 * @property {boolean} [isMultiple] - Determines whether multiple options can be selected.
 * @property {boolean} [allowClear] - Determines whether to show the clear button.
 */
export interface PropsSelect {
  value?: any;
  showSearch?: boolean;
  maxTagCount?: number | 'responsive';
  onChange: (e: any) => any;
  onBlur?: (e: any) => any;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  get?: ITableGet;
  list?: ITableItemFilterList[];
  isMultiple?: boolean;
  allowClear?: boolean;
}
/**
 * @param {string} props.name - The name of the component.
 * @param {IForm[]} [props.column=[]] - The array of form columns.
 * @param {any} props.generateForm - The function to generate the form.
 * @param {any} props.list - The list of items.
 */
export interface PropsTab {
  name: string;
  column?: IForm[];
  list: any;
  form: any;
  values: any;
  Field: any;
}
/**
 * @property {FormInstance} [form] - The form instance.
 * @property {boolean} [isMultiple] - Indicates whether multiple options can be selected.
 * @property {(e: any) => any} onChange - The callback function triggered when the selection changes.
 * @property {string} placeholder - The placeholder text for the select input.
 * @property {boolean} [disabled] - Indicates whether the select input is disabled.
 * @property {ITableGet} [get] - The table get object.
 */
export interface PropsTableSelect {
  isMultiple?: boolean;
  onChange: (e: any) => any;
  placeholder: string;
  disabled?: boolean;
  get?: ITableGet;
  value?: any;
}
/**
 * @param {FormItem} props.formItem - The form item configuration.
 * @param {string} props.placeholder - The placeholder text.
 * @param {Function} props.onChange - The change event handler.
 * @param {any[]} props.value - The selected value(s).
 * @param {boolean} props.disabled - Specifies if the component is disabled.
 */
export interface PropsTreeSelect {
  list?: any[];
  isMultiple?: boolean;
  placeholder: string;
  onChange?: (e: any) => any;
  value?: any;
  disabled?: boolean;
}
export interface PropsUpload {
  value?: any;
  onChange?: (values: any[]) => any;
  deleteFile?: any;
  showBtnDelete?: (file: any) => boolean;
  method?: string;
  maxSize?: number;
  isMultiple?: boolean;
  action?: string | ((file: any, config: any) => any);
  keyImage?: string;
  accept?: string;
  validation?: (file: any, listFiles: any) => Promise<boolean>;
}
