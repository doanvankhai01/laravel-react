import { CAvatar } from '@/components/avatar';
import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/interfaces';

/**
 * Represents a hook that returns an array of table or form configurations for a content column.
 *
 * @returns An array of {@link IDataTable} objects representing the table configurations.
 * @returns An array of {@link IForm} objects representing the form configurations.
 */
export default {
  table: ({ t }): IDataTable[] => [
    {
      title: t('NameContent'),
      name: 'name',
      tableItem: {
        filter: ETableFilterType.Text,
        sorter: true,
        render: (text: string, item: any) => <CAvatar src={item.imageUrl} text={text ?? ''} />,
      },
    },
    {
      title: t('Order'),
      name: 'order',
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
  form: ({ type, t }: { type?: string; t: any }): IForm[] => [
    {
      title: t('NameContent'),
      name: 'name',
      formItem: type === 'partner' || type === 'tech' ? {} : undefined,
    },
    {
      title: t('Order'),
      name: 'order',
      formItem: {
        col: type === 'partner' || type === 'tech' ? 12 : 6,
        type: EFormType.Number,
      },
    },
    {
      title: t('Image'),
      name: 'imageUrl',
      formItem: {
        col: type === 'partner' || type === 'tech' ? 12 : 6,
        type: EFormType.Upload,
      },
    },
    {
      name: 'languages',
      title: '',
      formItem:
        type === 'partner' || type === 'tech'
          ? undefined
          : {
              type: EFormType.Tab,
              tab: 'language',
              list: [
                { label: t('English'), value: 'en' },
                { label: t('Vietnamese'), value: 'vi' },
              ],
              column: [
                { title: 'id', name: 'id', formItem: { type: EFormType.Hidden } },
                {
                  title: t('Name'),
                  name: 'name',
                  formItem: {
                    col: type === 'member' ? 6 : 12,
                    rules: [{ type: EFormRuleType.Required }],
                  },
                },

                {
                  title: t('Position'),
                  name: 'position',
                  formItem:
                    type === 'member'
                      ? {
                          col: 6,
                        }
                      : undefined,
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
                  formItem:
                    type === 'member'
                      ? {
                          type: EFormType.Editor,
                        }
                      : undefined,
                },
              ],
            },
    },
  ],
};
