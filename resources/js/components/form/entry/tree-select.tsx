import { TreeSelect } from 'antd';
import { useEffect } from 'react';

import { EIcon } from '@/enums';
import { CButton } from '../../button';
import { CSvgIcon } from '../../svg-icon';
import type { PropsTreeSelect } from './interface';

/**
 * Renders a TreeSelect component.
 */
const Component = ({ list = [], isMultiple, placeholder, onChange, value, disabled }: PropsTreeSelect) => {
  /**
   * Initializes the function.
   *
   * This function checks if the value is an object, has a length greater than 0, and does not contain any nested objects.
   * If the conditions are met, it calls the onChange function with a modified value array.
   * It also updates the 'checkAll' property of the 'state' state based on the length of the value array.
   */
  useEffect(() => {
    if (
      typeof value === 'object' &&
      value.length > 0 &&
      !value?.filter((item: any) => typeof item === 'object')?.length
    ) {
      onChange?.(value.map((item: any) => ({ value: item, label: item })));
    }
  }, [value]);

  /**
   * Filters an array based on a given valueTag.
   * @param array - The array to filter.
   * @param valueTag - The valueTag to use for filtering.
   * @returns The filtered array.
   */
  const handleGetData = (array: any, valueTag: any) => {
    return array.filter((item: any) => handleFindId(item, valueTag));
  };

  /**
   * Checks if the given item has a value that matches the specified valueTag.
   * @param item - The item to check.
   * @param valueTag - The value to compare against.
   * @returns True if the item's value matches the valueTag, or if any of its children have a matching value; otherwise, undefined.
   */
  const handleFindId = (item: any, valueTag: any) => {
    if (item.value === valueTag) {
      return true;
    } else if (item?.children?.length) {
      return handleGetData(item.children, valueTag)?.length;
    }
  };

  /**
   * Calculates the total number of children in a tree-like structure.
   *
   * @param obj - The object representing a node in the tree.
   * @param length - The current length of the children.
   * @param arrayValue - An array of values to check against.
   * @returns The total number of children in the tree.
   */
  const totalChildren = (obj: any, length: number, arrayValue: any[]) => {
    if (obj.value.indexOf('__') === -1 && arrayValue.indexOf(obj.value) > -1) {
      length += 1;
    }
    if (obj?.children?.length) {
      length = [...obj.children].reduce((previousValue, currentValue) => {
        return totalChildren(currentValue, previousValue, arrayValue);
      }, length);
    }
    return length;
  };

  /**
   * Removes a specific tag from the given value recursively.
   *
   * @param object - The object to check for tag removal.
   * @param value - The value to remove the tag from.
   * @returns The updated value with the tag removed.
   */
  const clearTag = (object: any, value: any) => {
    value = value.filter((item: any) => item.value !== object.value);
    if (object?.children?.length > 0) {
      object?.children?.map((item: any) => {
        value = clearTag(item, value);
        return item;
      });
    }
    return value;
  };

  /**
   * Renders a custom tag for the TreeSelect component.
   *
   * @param props - The props object containing the value of the tag.
   * @returns The JSX element representing the custom tag.
   */
  const tagRender = props => {
    const item = handleGetData(list, props.value);
    const arrayValue = value.map((item: any) => item.value);
    if (
      arrayValue.indexOf(props.value) > -1 &&
      !!item.length &&
      (arrayValue.indexOf(item[0].value) === -1 ||
        arrayValue.indexOf(item[0].value) === arrayValue.indexOf(props.value))
    ) {
      const arraySlice = arrayValue.slice(0, arrayValue.indexOf(props.value));
      let checkShow = true;
      if (!!arraySlice.length && arrayValue.indexOf(item[0]?.value) === -1) {
        arraySlice.map((valueSlide: any) => {
          if (checkShow) {
            const itemSlice = handleGetData(list, valueSlide);
            if (!!itemSlice.length && item[0].value === itemSlice[0].value) {
              checkShow = false;
            }
          }
          return valueSlide;
        });
      }
      return (
        checkShow && (
          <div className='relative -left-2.5 mr-2.5 rounded-xl bg-primary/20 px-2 py-1'>
            <CButton
              icon={<CSvgIcon name={EIcon.Times} size={20} className='fill-error' />}
              className='absolute -right-2 -top-1 z-10 rounded-full !bg-error/20 leading-none !text-error'
              onClick={() => onChange?.(clearTag(item[0], value))}
              disabled={disabled}
            />
            {item[0].title} ({totalChildren(item[0], 0, arrayValue)})
          </div>
        )
      );
    }
    return <></>;
  };

  return (
    <TreeSelect
      treeNodeFilterProp={'title'}
      listHeight={200}
      allowClear={true}
      showSearch={true}
      onChange={onChange}
      treeDefaultExpandAll={!!list}
      labelInValue={true}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      treeCheckable={isMultiple}
      treeData={list}
      tagRender={tagRender}
      placement={'bottomLeft'}
      showCheckedStrategy={TreeSelect.SHOW_ALL}
    />
  );
};

export default Component;
