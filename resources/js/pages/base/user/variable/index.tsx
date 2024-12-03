import { CAvatar } from '@/components/avatar';
import { EFormRuleType, EFormType, ETableFilterType } from '@/enums';
import type { IDataTable, IForm } from '@/interfaces';
import { FULL_TEXT_SEARCH } from '@/utils';

/**
 * Represents a hook that returns an array of table or form configurations for a user column.
 *
 * @returns An array of {@link IDataTable} objects representing the table configurations.
 * @returns An array of {@link IForm} objects representing the form configurations.
 */
export default {
  table: ({ t }): IDataTable[] => [
    {
      title: t('FullName'),
      name: 'name',
      tableItem: {
        filter: ETableFilterType.Text,
        width: 210,
        sorter: true,
        render: (text: string, item: any) => text && <CAvatar src={item.avatarUrl} text={text} />,
      },
    },
    {
      title: t('Position'),
      name: 'positionCode',
      tableItem: {
        width: 200,
        filter: ETableFilterType.Text,
        sorter: true,
        render: (_, data) => data?.position?.name,
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {
        filter: ETableFilterType.Text,
        sorter: true,
      },
    },
    {
      title: t('PhoneNumber'),
      name: 'phoneNumber',
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
  form: ({ position, t }: any): IForm[] => [
    {
      title: t('FullName'),
      name: 'name',
      formItem: {
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: 'Email',
      name: 'email',
      formItem: {
        rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Email }, { type: EFormRuleType.Min, value: 6 }],
      },
    },
    {
      title: t('Password'),
      name: 'password',
      formItem: {
        type: EFormType.Password,
        condition: ({ values }) => !values?.id,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: t('ConfirmPassword'),
      name: 'passwordConfirmation',
      formItem: {
        type: EFormType.Password,
        condition: ({ values }) => !values?.id,
        rules: [
          { type: EFormRuleType.Required },
          {
            type: EFormRuleType.Custom,
            validator: ({ value, form }) => {
              if (!value || form.getFieldValue('password') === value) return '';
              return t('TwoPasswordsThatYouEnterIsInconsistent');
            },
          },
        ],
      },
    },
    {
      title: t('PhoneNumber'),
      name: 'phoneNumber',
      formItem: {
        rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Phone, min: 10, max: 15 }],
      },
    },
    {
      title: t('DateOfBirth'),
      name: 'birthday',
      formItem: {
        type: EFormType.Date,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: t('Position'),
      name: 'positionCode',
      formItem: {
        type: EFormType.Select,
        rules: [{ type: EFormRuleType.Required }],
        api: {
          keyApi: 'Code',
          params: ({ fullTextSearch, value }) => ({
            [FULL_TEXT_SEARCH]: fullTextSearch,
            typeCode: 'position',
            extend: value && [['code', value]],
          }),
          format: item => ({
            label: item.name,
            value: item.code,
          }),
          data: () => position,
          column: [
            {
              title: t('Code'),
              name: 'code',
              tableItem: {
                width: 100,
              },
            },
            {
              title: t('NameCode'),
              name: 'name',
              tableItem: {},
            },
          ],
        },
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
      title: t('UploadAvatar'),
      name: 'avatarUrl',
      formItem: {
        type: EFormType.Upload,
      },
    },
  ],
};
