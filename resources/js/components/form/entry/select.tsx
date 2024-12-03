import { Select } from 'antd';
import { useState } from 'react';

import { API, C_API, KEY_DATA, arrayUnique } from '@/utils';
import type { PropsSelect } from './interface';

/**
 * Represents the properties for the Select component.
 */

const Component = ({
  value,
  showSearch = true,
  maxTagCount,
  placeholder,
  disabled,
  get,
  list = [],
  isMultiple,
  className = '',
  allowClear = true,
  onChange,
  onBlur,
}: PropsSelect) => {
  /**
   * Represents an array of data.
   */
  let current: any = [];
  if (get?.data() && get?.format) {
    current = isMultiple ? get.data().map(get.format) : [get.format(get.data())];
  }
  /**
   * Represents a select input component.
   */
  const [state, setState] = useState<{ current: any[]; list: any[]; isLoading: boolean }>({
    current,
    list: !get?.keyApi
      ? list
      : JSON.parse(localStorage.getItem(KEY_DATA[get.keyApi]) ?? '{}')
          .data.filter(item => !item.isDelete)
          .map((e: any) => (get?.format ? get.format(e) : e)),
    isLoading: false,
  });

  /**
   * Loads data for the select input.
   *
   * @param fullTextSearch - The full text search string.
   */
  const loadData = async (fullTextSearch: string) => {
    if (get?.keyApi) {
      const params = { latestUpdated: '' };
      const local = JSON.parse(localStorage.getItem(KEY_DATA[get.keyApi]) ?? '{}');
      if (!local.isLatest)
        try {
          setState(pre => ({ ...pre, isLoading: true }));
          params.latestUpdated = local.data?.[0]?.updatedAt;

          const result = await API.get<any>({ url: `${C_API[get.keyApi]}`, params });
          local.data = [...result.data, ...local.data];
          localStorage.setItem(KEY_DATA[get.keyApi], JSON.stringify({ data: local.data, isLatest: true }));
        } catch (e) {
          console.log(e);
        }
      setState(pre => ({
        ...pre,
        list: local.data
          .map((e: any) => (get?.format ? get.format(e) : e))
          .filter(
            (item: any) =>
              !item.isDelete &&
              !!item.value &&
              !!item.label &&
              item.label.toUpperCase()?.indexOf?.(fullTextSearch.toUpperCase()) > -1,
          ),
        isLoading: false,
      }));
    } else if (list) {
      setState(pre => ({
        ...pre,
        list: list.filter(
          (item: any) =>
            !item?.label?.toUpperCase || item?.label?.toUpperCase().indexOf(fullTextSearch.toUpperCase()) > -1,
        ),
      }));
    }
  };

  return (
    <Select
      className={className}
      maxTagCount={maxTagCount}
      placeholder={placeholder}
      disabled={disabled}
      listHeight={200}
      filterOption={false}
      showSearch={true}
      loading={state.isLoading}
      allowClear={allowClear}
      defaultValue={value}
      maxTagPlaceholder={array => '+' + array.length}
      mode={isMultiple ? 'multiple' : undefined}
      optionFilterProp='label'
      onSearch={value => showSearch && loadData(value)}
      onChange={onChange}
      onBlur={onBlur}
      onDropdownVisibleChange={open => open && !state.isLoading && loadData('')}
    >
      {arrayUnique([...state.current, ...state.list], 'value')?.map((item: any, index: number) => (
        <Select.Option key={`${item.value}${index}`} value={item.value} disabled={item.disabled}>
          <span dangerouslySetInnerHTML={{ __html: item.label }} />
        </Select.Option>
      ))}
    </Select>
  );
};

export default Component;
