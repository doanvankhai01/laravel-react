import classNames from 'classnames';

import { EFormRuleType, EFormType } from '@/enums';
import type { TRuleValidation } from '@/interfaces';
import { API, C_API, KEY_DATA } from '@/utils';
import { Info } from './info';
import type { PropsField } from './interface';
import { buildProps, mapRule } from './util';

/**
 * Generates a form based on the provided configuration.
 */
const Field = ({ item, index, name, values, form, t, isLabel = true, Field }: PropsField): any => {
  const rules: TRuleValidation[] = [];

  if (item.formItem?.rules) {
    item.formItem.rules.filter(item => !!item).forEach(rule => mapRule({ rule, rules, item, t }));
  }
  if (!item.formItem?.notDefaultValid)
    switch (item.formItem?.type) {
      case EFormType.Number:
        rules.push(({ value }) => {
          // eslint-disable-next-line
          if (!value || (/^-?[1-9]*\d+(\.\d{1,2})?$/.test(value) && parseInt(value) < 1000000000)) return '';
          return t('PleaseEnterOnlyNumber');
        });
        break;
      case EFormType.Password:
        rules.push(({ value }) => {
          if (
            !value ||
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%)(_^&*+-])[A-Za-z\d#?!@$%)(_^&*+-]{8,20}$/.test(value)
          ) {
            return '';
          } else return t('PasswordNeedsToHaveAtLeast8Characters');
        });
        break;
      case EFormType.OnlyNumber:
        rules.push(({ value }) => {
          if (!value || /^\d+$/.test(value)) return '';
          return t('PleaseEnterOnlyNumber');
        });
        break;
      case EFormType.Otp:
        rules.push(({ value }) => {
          const maxLength = 6;
          if (value && value.length < maxLength) return t('PleaseEnterAtLeastCharacters', { min: maxLength });
          return '';
        });
        break;
      default:
    }

  /**
   * Generates the otherProps object for the form component.
   *
   * @param item - The item object.
   * @param name - The name of the item.
   * @param rules - The validation rules for the item.
   * @returns The otherProps object.
   */
  const otherProps = buildProps({ item, name, rules });
  const ruleApi = item.formItem?.rules?.find(rule => rule.type === EFormRuleType.Api);
  const ruleCheckExists = item.formItem?.rules?.find(rule => rule.type === EFormRuleType.CheckExists);

  delete otherProps.key;
  const validators = {
    onChange: ({ value }) => {
      let message = '';
      otherProps.rules.forEach((rule: any) => {
        if (!message) message = rule({ value, form });
      });
      return message;
    },
    onChangeAsyncDebounceMs: 800,
    onBlurAsync:
      ruleApi?.api?.key || ruleCheckExists?.api?.key
        ? async ({ value }) => {
            if (ruleApi) {
              const res: any = await API.get({
                url: `${C_API[ruleApi.api!.key]}/${ruleApi.api!.url}`,
                params: { type: ruleApi.api!.name, value, id: ruleApi.api!.id },
              });
              if (res?.data?.exists === true) {
                return t('IsAlreadyTaken', { label: ruleApi.api!.label, value });
              }
            } else if (ruleCheckExists) {
              const local = JSON.parse(localStorage.getItem(KEY_DATA[ruleCheckExists.api!.key]) ?? '{}');
              if (!local.isLatest)
                try {
                  const result = await API.get<any>({
                    url: `${C_API[ruleCheckExists.api!.key]}`,
                    params: { latestUpdated: local.data?.[0]?.updatedAt },
                  });
                  local.data = [...result.data, ...local.data];
                  localStorage.setItem(
                    KEY_DATA[ruleCheckExists.api!.key],
                    JSON.stringify({ data: local.data, isLatest: true }),
                  );
                } catch (e) {
                  console.log(e);
                }

              if (local.data.length && ruleCheckExists.api?.name) {
                const arrayList = ruleCheckExists.api?.name.split('.');
                let isCheckExists = false;
                local.data.forEach(element => {
                  if (!isCheckExists && arrayList.length === 1) {
                    isCheckExists = element[arrayList[0]] === value;
                  } else if (!isCheckExists && arrayList.length > 1) {
                    element[arrayList[0]].forEach(item => {
                      if (!isCheckExists && arrayList.length === 2)
                        isCheckExists = item[arrayList[1]] === value && item.id !== values.id;
                    });
                  }
                });
                if (isCheckExists) return t('IsAlreadyTaken', { label: ruleCheckExists.api.label, value });
              }
            }
          }
        : null,
  };

  const classField = (meta: any) =>
    classNames(
      'item type-' + (item?.formItem?.type ?? EFormType.Text),
      'sm:col-span-' + (item?.formItem?.col ?? 12),
      'col-span-12',
      { error: meta.errors.length || meta.isValidating },
    );

  const renderLabel = isLabel && (
    <label title={otherProps.label} className='text-base-content' htmlFor={otherProps.name}>
      {otherProps.label}
      {otherProps.required && <span className='text-error'> *</span>}
    </label>
  );

  const renderField = ({ field }) =>
    !item?.formItem?.render ? (
      <>
        {renderLabel}
        {item.formItem && (
          <Info
            field={field}
            formItem={item.formItem}
            t={t}
            form={form}
            meta={field.state.meta}
            title={item.title}
            value={field?.state?.value}
            Field={Field}
          />
        )}
      </>
    ) : (
      item?.formItem?.render({ values, index })
    );

  return (
    <Field name={otherProps.name} validators={validators}>
      {field => <div className={classField(field.state.meta)}>{renderField({ field })}</div>}
    </Field>
  );
};
export default Field;
