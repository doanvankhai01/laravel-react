import { Checkbox } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EIcon } from '@/enums';
import { CButton } from '../../button';
import { CSvgIcon } from '../../svg-icon';
import CField from '../field';
import { handleCondition } from '../util';
import type { PropsAddable } from './interface';

/**
 * Component description.
 */
const Component = ({
  name = '',
  column = [],
  textAdd = 'Thêm dòng',
  onAdd = () => null,
  form = {},
  isTable = true,
  showRemove = () => true,
  idCheck,
  values = [],
  Field,
}: PropsAddable) => {
  /**
   * Represents the state of the addable input component.
   */
  const [temp, setTemp] = useState<{ indeterminate: boolean; checkAll: boolean; checkedList: any[] }>({
    indeterminate: false,
    checkAll: false,
    checkedList: [],
  });
  /**
   * Handles the change event when the "Check All" checkbox is clicked.
   *
   * @param e - The event object.
   */
  const onCheckAllChange = (e: any) => {
    /**
     * Updates the `array` by setting the value of the `idCheck + 'Checked'` property of each item to the value of `e.target.checked`.
     *
     * @param {any[]} array - The array to be updated.
     * @param {ChangeEvent<HTMLInputElement>} e - The event object containing the checked value.
     * @param {string} idCheck - The identifier used to construct the property name.
     * @returns {any[]} The updated array.
     */
    const array = form.getFieldValue(name).map((item: any) => {
      item[idCheck + 'Checked'] = e.target.checked;
      return item;
    });
    setTemp({
      indeterminate: false,
      checkAll: e.target.checked,
      checkedList: e.target.checked ? array.map((item: any) => item[idCheck]) : [],
    });

    form.setFieldValue(name, array);
  };
  /**
   * Handles the change event for a checkbox.
   *
   * @param e - The event object.
   * @param array - The array containing the checkbox values.
   * @param index - The index of the checkbox in the array.
   */
  const onCheckChange = (e: any, array: any[], index: number) => {
    if (e.target.checked) {
      temp.checkedList.push(array[index][idCheck]);
      setTemp({
        indeterminate: array.length !== temp.checkedList.length,
        checkAll: array.length === temp.checkedList.length,
        checkedList: temp.checkedList,
      });
    } else {
      temp.checkedList.splice(temp.checkedList.indexOf(array[index][idCheck]), 1);
      setTemp({ indeterminate: temp.checkedList.length !== 0, checkAll: false, checkedList: temp.checkedList });
    }
    array[index][idCheck + 'Checked'] = e.target.checked;
    if (form.setFieldValue) {
      form.setFieldValue(name, array);
    }
  };
  /**
   * Retrieves the translation function from the specified locale and sets the key prefix to 'Components'.
   * @returns The translation function.
   */
  const { t } = useTranslation('locale', { keyPrefix: 'Components' });
  /**
   * Renders a table with addable rows.
   *
   * @param fields - The array of fields for each row.
   * @param add - The function to add a new row.
   * @param remove - The function to remove a row.
   */
  const renderTable = ({ field, value }: any) => (
    <>
      <div className={'table w-full border-collapse'} style={{ minWidth: column.length * 150 }}>
        <div className='table-row'>
          {!!idCheck && (
            <div className={'table-cell w-10 p-1 text-center font-bold'}>
              <Checkbox indeterminate={temp.indeterminate} onChange={onCheckAllChange} checked={temp.checkAll} />
            </div>
          )}
          <div className={'table-cell w-10 border bg-gray-300 p-1 text-center font-bold'}>STT</div>
          {column.map((col: any, index: number) => (
            <div
              key={name + index}
              className={classNames('table-cell border bg-gray-300 p-1 text-center font-bold', {
                'w-full': column.length === 1,
                'w-1/2': column.length === 2,
                'w-1/3': column.length === 3,
                'w-1/4': column.length === 4,
                'w-1/5': column.length === 5,
                'w-1/6': column.length === 6,
              })}
            >
              {col.title}
            </div>
          ))}
          <div className={'h-1 w-8'} />
        </div>
        {value?.map((item, i) => (
          <div className='table-row' key={name + i}>
            {!!idCheck && (
              <div className={'table-cell text-center'}>
                <Checkbox
                  onChange={e => onCheckChange(e, field.state?.value, i)}
                  checked={temp.checkedList.indexOf(item[idCheck] ?? '') > -1}
                />
              </div>
            )}
            <div className={'table-cell border bg-base-200 text-center'}>{i + 1}</div>
            {column
              .filter((item, index) => handleCondition({ item, index, values: values[i] }))
              .map((col: any, index: number) => (
                <div className={'relative table-cell border'} key={name + index}>
                  <CField
                    item={col}
                    index={index + '_' + i}
                    isLabel={false}
                    name={`${name}[${i}].${col.name}`}
                    t={t}
                    form={form}
                    values={values[i]}
                    Field={Field}
                  />
                </div>
              ))}
            <div className={'table-cell w-8 align-middle sm:w-8'}>
              {showRemove(item) && (
                <button
                  onClick={() => {
                    field.removeValue(i);
                    onAdd(form.getFieldValue(name));
                  }}
                >
                  <CSvgIcon name={EIcon.Trash} size={32} className='fill-error hover:fill-error/50' />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={'flex justify-end'}>
        <CButton
          onClick={() => {
            field.pushValue({});
            onAdd(form.getFieldValue(name));
          }}
          icon={<CSvgIcon name={EIcon.Plus} size={20} />}
          text={textAdd}
        />
      </div>
    </>
  );

  /**
   * Renders the input fields for the addable component.
   *
   * @param fields - The array of fields to render.
   * @param add - The function to add a new field.
   * @param remove - The function to remove a field.
   */
  const renderInput = ({ field, value }: any) => (
    <>
      {value?.map((item, i) => (
        <div className={'grid grid-cols-12 gap-x-5'} key={name + i}>
          {column
            .filter((item, index) => handleCondition({ item, index, values: values[i] }))
            .map((col: any, index: number) => (
              <div
                className={classNames(
                  col?.formItem?.classItem,
                  'col-span-12',
                  'sm:col-span-' + (col?.formItem?.col ?? 12),
                )}
                key={'addable' + index}
              >
                <CField
                  item={col}
                  index={index + '_' + i}
                  isLabel={false}
                  name={`${name}[${i}].${col.name}`}
                  t={t}
                  form={form}
                  values={values[i]}
                  Field={Field}
                />
              </div>
            ))}
          <div className={'table-cell w-8 align-middle'}>
            {showRemove(item) && (
              <button
                onClick={() => {
                  field.removeValue(i);
                  onAdd(form.getFieldValue(name));
                }}
              >
                <CSvgIcon name={EIcon.Trash} size={32} className='fill-error hover:fill-error/50' />
              </button>
            )}
          </div>
        </div>
      ))}
      <div className={'flex justify-end'}>
        <CButton
          icon={<CSvgIcon name={EIcon.Plus} size={20} />}
          text={textAdd}
          onClick={() => {
            field.pushValue({});
            onAdd(form.getFieldValue(name));
          }}
        />
      </div>
    </>
  );

  return (
    <Field name={name} mode='array'>
      {field =>
        isTable ? renderTable({ field, value: field.state?.value }) : renderInput({ field, value: field.state?.value })
      }
    </Field>
  );
};
export default Component;
