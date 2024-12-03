import { EFormRuleType, EFormType } from '@/enums';
import type { IForm, IFormItemRule, TRuleValidation } from '@/interfaces';
import type { TFunction } from 'i18next';

/**
 * Builds the props object for a form item.
 *
 * @param {Object} options - The options for building the props.
 * @param {IForm} options.item - The form item.
 * @param {number} options.index - The index of the form item.
 * @param {string} [options.name] - The name of the form item.
 * @param {any} options.rules - The validation rules for the form item.
 * @returns {Object} The props object for the form item.
 */
export const buildProps = ({ item, name, rules }: { item: IForm; name?: string; rules: TRuleValidation[] }) => {
  const otherProps: any = {
    label: item.title,
    name: name ?? item.name,
    rules,
  };
  otherProps.required = item.formItem?.rules?.some((rule: any) => rule.type === EFormRuleType.Required);
  delete otherProps.key;
  return otherProps;
};

/**
 * Maps a form item rule to a validation rule.
 *
 * @param {Object} options - The options for mapping the rule.
 * @param {IFormItemRule} options.rule - The form item rule to map.
 * @param {any[]} options.rules - The array of validation rules.
 * @param {IForm} options.item - The form item.
 * @param {TFunction} options.t - The translation function.
 *
 * @returns {IFormItemRule} The mapped form item rule.
 */
export const mapRule = ({
  rule,
  rules,
  item,
  t,
}: {
  rule: IFormItemRule;
  rules: TRuleValidation[];
  item: IForm;
  t: TFunction;
}) => {
  if (item.formItem) {
    switch (rule.type) {
      case EFormRuleType.Required:
        {
          const message = t(
            rule.message ??
              (!item.formItem.type ||
              [
                EFormType.Text,
                EFormType.Number,
                EFormType.Hidden,
                EFormType.Password,
                EFormType.Textarea,
                EFormType.Otp,
              ].includes(item.formItem.type)
                ? 'PleaseEnter'
                : 'PleaseChoose'),
            {
              title: item.title.toLowerCase(),
            },
          );
          rules.push(({ value }) => (value ? '' : message));
        }
        break;
      case EFormRuleType.Email:
        rules.push(({ value }) => {
          // eslint-disable-next-line
          const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
          if (!value || (typeof value === 'string' && regexEmail.test(value.trim()))) return '';
          return t(rule.message ?? 'PleaseEnterAValidEmailAddress');
        });
        break;
      case EFormRuleType.Phone:
        rules.push(({ value }) => {
          if (!value) return '';
          else if (/^\d+$/.test(value)) {
            if (value?.trim().length < 10) return t('PleaseEnterAtLeastCharacters', { min: 10 });
            else if (value?.trim().length > 12) return t('PleaseEnterMaximumCharacters', { max: 12 });
            else return '';
          } else return t('PleaseEnterOnlyNumber');
        });
        break;
      case EFormRuleType.Min:
        generateValidMin({ rule, rules, item, t });
        break;
      case EFormRuleType.Max:
        generateValidMax({ rule, rules, item, t });
        break;
      case EFormRuleType.OnlyText:
        rules.push(({ value }) => {
          if (!value || /^[A-Za-z]+$/.test(value)) return '';
          return t(rule.message ?? 'PleaseEnterOnlyText');
        });
        break;
      case EFormRuleType.OnlyTextSpace:
        rules.push(({ value }) => {
          if (!value || /^[a-zA-Z ]+$/.test(value)) return '';
          return t(rule.message ?? 'PleaseEnterOnlyText');
        });
        break;
      case EFormRuleType.Textarea:
        rules.push(({ value }) => {
          if (value && value?.trim()?.length > 500) {
            return t(rule.message ?? 'PleaseEnterMaximumCharacters', { max: 500 });
          }
          return '';
        });
        break;
      case EFormRuleType.Custom:
        if (rule.validator) rules.push(rule.validator);
        break;
      default:
    }
  }
  return rule;
};

/**
 * Generates a validation rule for minimum value.
 *
 * @param {Object} options - The options for generating the validation rule.
 * @param {IFormItemRule} options.rule - The rule object containing the minimum value.
 * @param {any[]} options.rules - The array of existing validation rules.
 * @param {IForm} options.item - The form item object.
 * @param {TFunction options.t - The translation function.
 * @returns {void}
 */
export const generateValidMin = ({
  rule,
  rules,
  item,
  t,
}: {
  rule: IFormItemRule;
  rules: TRuleValidation[];
  item: IForm;
  t: TFunction;
}) => {
  if (item.formItem?.type === EFormType.Number)
    rules.push(({ value }) => {
      if (!value || (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value) && parseFloat(value) < rule.value)) {
        return t(rule.message ?? 'PleaseEnterMinimumNumber', { min: rule.value });
      }
      return '';
    });
  else {
    let message = rule.message ?? '';
    if (!message) {
      if (item.formItem?.type) {
        message = t('PleaseEnterAtLeastNumberCharacters', { min: rule.value });
      } else {
        message = t('PleaseEnterMinimumNumber', { min: rule.value });
      }
    }
    rules.push(({ value }) => {
      if (!value || value.length < rule.value) return message;
      return '';
    });
  }
};

/**
 * Generates a validation rule for the maximum value of a form item.
 *
 * @param {Object} options - The options for generating the validation rule.
 * @param {IFormItemRule} options.rule - The rule object containing the maximum value.
 * @param {any[]} options.rules - The array of existing validation rules.
 * @param {IForm} options.item - The form item object.
 * @param {TFunction} options.t - The translation function.
 */
export const generateValidMax = ({
  rule,
  rules,
  item,
  t,
}: {
  rule: IFormItemRule;
  rules: TRuleValidation[];
  item: IForm;
  t: TFunction;
}) => {
  if (item.formItem?.type === EFormType.Number)
    rules.push(({ value }) => {
      if (!value || (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value) && parseFloat(value) > rule.value)) {
        return t(rule.message ?? 'PleaseEnterMaximumNumber', { max: rule.value });
      }
      return '';
    });
  else {
    let message = rule.message ?? '';
    if (!message) {
      if (item.formItem?.type === EFormType.OnlyNumber) {
        message = t('PleaseEnterMaximumNumberCharacters', { max: rule.value });
      } else {
        message = t('PleaseEnterMaximumNumber', { max: rule.value });
      }
    }
    rules.push(({ value }) => {
      if (!value || value.length > rule.value) return message;
      return '';
    });
  }
};

/**
 * Evaluates whether a form item should be displayed based on its type and condition.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.item - The form item to evaluate.
 * @param {number} params.index - The index of the form item.
 * @param {Object} params.values - The current values of the form.
 * @returns {boolean} - Returns `true` if the form item should be displayed, otherwise `false`.
 */
export const handleCondition = ({ item, index, values }) =>
  !!item.formItem &&
  item?.formItem?.type !== EFormType.Hidden &&
  (!item?.formItem?.condition || !!item?.formItem?.condition({ value: values[item.name], index, values }));
