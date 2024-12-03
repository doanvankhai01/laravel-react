import { CAvatar } from '@/components/avatar';
import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/interfaces';

/**
 * Represents a hook that returns an array of table or form configurations for a post column.
 *
 * @returns An array of {@link IDataTable} objects representing the table configurations.
 * @returns An array of {@link IForm} objects representing the form configurations.
 */
export default {
  table: ({ t }): IDataTable[] => [
    {
      title: t('NamePost'),
      name: 'name',
      tableItem: {
        filter: ETableFilterType.Text,
        sorter: true,
        render: (text: string, item: any) => <CAvatar src={item.imageUrl} text={text ?? ''} />,
      },
    },
    {
      title: 'Slug',
      name: 'slug',
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
        filter: ETableFilterType.Date,
        sorter: true,
        isDateTime: true,
      },
    },
  ],
  form: ({ t, id }: any): IForm[] => [
    {
      title: t('CreatedAt'),
      name: 'createdAt',
      formItem: {
        col: 6,
        type: EFormType.Date,
        rules: id ? [{ type: EFormRuleType.Required }] : [],
      },
    },
    {
      title: t('Image'),
      name: 'imageUrl',
      formItem: {
        col: 6,
        type: EFormType.Upload,
      },
    },
    {
      name: 'languages',
      title: '',
      formItem: {
        type: EFormType.Tab,
        tab: 'language',
        list: [
          { label: t('English'), value: 'en' },
          { label: t('Vietnamese'), value: 'vi' },
        ],
        column: [
          { title: 'id', name: 'id', formItem: { type: EFormType.Hidden } },
          {
            title: t('NamePost'),
            name: 'name',
            formItem: {
              col: 6,
              rules: [
                { type: EFormRuleType.Required },
                {
                  type: EFormRuleType.CheckExists,
                  api: {
                    name: 'languages.name',
                    label: t('NamePost'),
                    key: 'Post',
                  },
                },
              ],
              // onBlur: ({ value, form, name }) => {
              //   if (value && !form.getFieldValue(['languages', name[0], 'slug'])) {
              //     form.setFieldValue(['languages', name[0], 'slug'], slug(value));
              //   }
              // },
            },
          },
          {
            title: 'Slug',
            name: 'slug',
            formItem: {
              col: 6,
              rules: [
                { type: EFormRuleType.Required },
                { type: EFormRuleType.Max, value: 100 },
                {
                  type: EFormRuleType.CheckExists,
                  api: {
                    name: 'languages.slug',
                    label: 'Slug',
                    key: 'Post',
                  },
                },
              ],
            },
          },
          {
            title: t('Description'),
            name: 'description',
            formItem: {
              type: EFormType.Textarea,
            },
          },
          {
            title: t('Content'),
            name: 'content',
            formItem: {
              type: EFormType.Editor,
            },
          },
        ],
      },
    },
  ],
};
