import slug from 'slug';

import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/interfaces';

/**
 * Represents a hook that returns an array of table or form configurations for a code column.
 *
 * @returns An array of {@link IDataTable} objects representing the table configurations.
 * @returns An array of {@link IForm} objects representing the form configurations.
 */
export default {
  table: ({ t }: any): IDataTable[] => [
    {
      title: t('Code'),
      name: 'code',
      tableItem: {
        width: 100,
        filter: ETableFilterType.Text,
        sorter: true,
      },
    },
    {
      title: t('NameCode'),
      name: 'name',
      tableItem: {
        filter: ETableFilterType.Text,
        sorter: true,
      },
    },
    {
      title: t('CreatedAt'),
      name: 'createdAt',
      tableItem: {
        width: 120,
        filter: ETableFilterType.Text,
        sorter: true,
        isDateTime: true,
      },
    },
  ],
  form: ({ t }: any): IForm[] => [
    {
      title: t('NameCode'),
      name: 'name',
      formItem: {
        rules: [{ type: EFormRuleType.Required }],
        onBlur: ({ value, form }) => {
          if (value && !form.getFieldValue('code')) {
            form.setFieldValue('code', slug(value).toUpperCase());
            form.validateField('code', 'change');
          }
        },
      },
    },
    {
      title: t('Code'),
      name: 'code',
      formItem: {
        condition: ({ values }) => !values?.id,
        rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Max, value: 100 }],
      },
    },
    {
      title: t('DescriptionCode'),
      name: 'description',
      formItem: {
        type: EFormType.Textarea,
      },
    },
  ],
};
