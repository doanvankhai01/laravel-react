import dayjs from 'dayjs';

import { EFormType } from '@/enums';
import type { IForm } from '@/interfaces';
import { sortObject } from '@/utils';

/**
 * Converts form values based on the provided columns and values.
 * @param columns - The array of form columns.
 * @param values - The object containing form values.
 * @param exportData - Optional. Indicates whether to export the converted data. Default is true.
 * @returns The object containing the converted form values.
 */
export const convertFormValue = (columns: IForm[], values: { [selector: string]: any }, exportData = true) => {
  const newValue = {};

  const select = ({ item, values, exportData }) => {
    if (!exportData && item?.formItem?.isMultiple && values[item.name])
      values[item.name] = values[item.name].map((item: any) => (item.id ? item.id : item));
  };
  const tab = ({ item, values, exportData }) => {
    if (!exportData) {
      item?.formItem?.list?.sort((left, right) => sortObject({ left, right, name: item?.formItem?.tab }));
      values[item.name] = item?.formItem?.list?.map((subItem, i) => {
        if (item?.formItem?.tab) {
          const result: { [selector: string]: any } = {
            [item.formItem.tab]: values[item.name] ? values[item.name][i][item.formItem.tab] : subItem.value,
          };
          item?.formItem?.column
            ?.filter(col => !!col.formItem)
            .forEach(col => {
              if (col?.formItem?.type === 'upload') {
                result[col.name] =
                  values[item.name]?.length && values[item.name] ? values[item.name][i][col.name] || null : null;
              } else {
                result[col.name] =
                  values[item.name]?.length && values[item.name] ? values[item.name][i][col.name] || '' : '';
              }
            });
          return result;
        }
        return subItem;
      });
      if (values[item.name]?.length) {
        values[item.name]?.sort((left, right) => sortObject({ left, right, name: item?.formItem?.tab }));
      }
    }
  };
  const textarea = ({ item, values, exportData }) => {
    if (!exportData && !values[item.name]) values[item.name] = '';
  };
  const treeSelect = ({ item, values, exportData }) => {
    if (values[item.name]) values[item.name] = exportData ? values[item.name].value : { value: values[item.name] };
  };
  const switchs = ({ item, values }) => {
    if (typeof values[item.name] === 'undefined') values[item.name] = false;
  };
  const number = ({ item, values, exportData }) => {
    if (!exportData && values && (values[item.name] || values[item.name] === 0))
      values[item.name] = values[item.name].toString();
    if (exportData) values[item.name] = parseFloat(values[item.name]);
  };
  const date = ({ item, values, exportData }) => {
    if (values[item.name]) {
      if (exportData) {
        values[item.name] = (values[item.name].format ? values[item.name] : dayjs(values[item.name])).format(
          'YYYY-MM-DD HH:mm:ss',
        );
      } else values[item.name] = dayjs(values[item.name]);
    }
  };
  const dateRange = ({ item, values, exportData }) => {
    if (!!values[item.name] || typeof item.name === 'object') {
      if (exportData) {
        values[item.name] = [
          (values[item.name][0].format ? values[item.name][0] : dayjs(values[item.name][0]))
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
          (values[item.name][1].format ? values[item.name][1] : dayjs(values[item.name][1]))
            .endOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
        ];
      } else values[item.name] = [dayjs(values[item.name][0]), dayjs(values[item.name][1])];
    }
  };
  const upload = ({ item, values, exportData }) => {
    if (exportData && values[item.name] && typeof values[item.name] === 'object') {
      if (values[item.name].length > 0) {
        values[item.name] = !item.formItem?.isMultiple
          ? values[item.name][0].path
          : values[item.name].filter((_item: any) => _item.status === 'done' || !_item.status);
      } else if (values[item.name].length == 0 && !item.formItem?.isMultiple) {
        values[item.name] = null;
      }
    }
  };
  const listFormat = {
    [EFormType.Select]: select,
    [EFormType.SelectTable]: select,
    [EFormType.Tab]: tab,
    [EFormType.Textarea]: textarea,
    [EFormType.TreeSelect]: treeSelect,
    [EFormType.Switch]: switchs,
    [EFormType.Number]: number,
    [EFormType.Date]: date,
    [EFormType.DateRange]: dateRange,
    [EFormType.Upload]: upload,
  };

  columns
    .filter(
      (item, index) =>
        !!item.formItem &&
        (!item?.formItem?.condition || !!item?.formItem?.condition({ value: values[item.name], index, values })),
    )
    .forEach(item => {
      if (item?.formItem?.convert) {
        newValue[item.name] = item.formItem.convert({ value: values[item.name], values, dayjs });
      } else {
        if (item.formItem?.type && listFormat[item.formItem.type])
          listFormat[item.formItem.type]({ item, values, exportData });
        else if (!item?.formItem?.text?.mask && typeof values[item.name] === 'string') {
          values[item.name] = values[item.name].trim();
        } else if (
          values[item.name] &&
          !!item?.formItem?.text?.mask &&
          item?.formItem?.text?.mask?.alias === 'numeric' &&
          item?.formItem?.text?.mask?.groupSeparator &&
          item?.formItem?.text?.mask?.radixPoint &&
          item?.formItem?.text?.mask?.onBeforePaste
        ) {
          values[item.name] = values[item.name]
            .trim()
            .replaceAll(item.formItem.text?.mask.groupSeparator, '')
            .replaceAll(item.formItem.text?.mask.radixPoint, '.');
        }
        newValue[item.name] = values[item.name];
      }
    });
  return newValue;
};
