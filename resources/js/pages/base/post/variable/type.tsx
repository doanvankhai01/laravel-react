import slug from 'slug';

import { EFormRuleType, EFormType } from '@/enums';
import type { IForm } from '@/interfaces';

/**
 * Represents a hook that returns an array of form configurations for a post column.
 *
 * @returns An array of {@link IForm} objects representing the form configurations.
 */
export default {
  form: ({ t, id, list }): IForm[] => [
    ...[
      {
        title: t('NameType'),
        name: 'name',
        formItem: {
          rules: [{ type: EFormRuleType.Required }],
          onBlur: ({ value, form }) => {
            if (value && !form.getFieldValue('code')) form.setFieldValue('code', slug(value).toUpperCase());
          },
        },
      },
    ],
    ...(id
      ? [
          {
            title: t('CodeType'),
            name: 'code',
            formItem: {
              rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Max, value: 100 }],
              type: EFormType.Text,
            },
          },
          {
            title: t('Subtype'),
            name: 'post_type_id',
            formItem: {
              type: EFormType.TreeSelect,
              list,
            },
          },
        ]
      : []),
  ],
};
