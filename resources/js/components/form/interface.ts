import type { IForm, IFormItem } from '@/interfaces';
import type { FieldApi, FormApi } from '@tanstack/react-form';

/**
 * @param {string} props.className - The CSS class name for the form.
 * @param {Array} props.columns - The array of form columns.
 * @param {Object} props.values - The initial values for the form fields.
 * @param {boolean} props.isLoading - Flag to indicate if the form is in a loading state.
 */
export interface Props {
  className?: string;
  columns: IForm[];
  values?: any;
  isLoading?: boolean;
  isEnterSubmit?: boolean;
  onSubmit?: (props: { value: any; formApi: FormApi<any, any> }) => any;
  footer?: (_props: { canSubmit: boolean; isSubmitting: boolean; form: FormApi<any, any> }) => JSX.Element;
}

/**
 * @param item - The configuration object for the form item.
 * @param index - The index of the form item.
 * @param name - The name of the form item.
 * @param values - The values for the form.
 * @param form - The form instance.
 */
export interface PropsField {
  item: IForm;
  index: any;
  name: string;
  values: any;
  form: any;
  isLabel?: boolean;
  t: any;
  Field: any;
}

export interface PropsInfo {
  field: FieldApi<any, any, any, any>;
  formItem: IFormItem;
  t: any;
  form: FormApi<any, any>;
  meta: any;
  title: string;
  value?: any;
  Field: any;
}
