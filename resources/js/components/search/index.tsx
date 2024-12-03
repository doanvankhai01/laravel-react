import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EIcon } from '@/enums';
import { CEMask } from '../form/entry';
import { CSvgIcon } from '../svg-icon';
import './index.less';
import type { Props } from './interface';

/**
 * Component for rendering a search input in a data table.
 */
export const CSearch = ({ value, onChange }: Props) => {
  /**
   * Handles the press of the Enter key in the search input field.
   * Retrieves the value from the search input field, trims it, and passes it to the handleTableChange function along with the current filters.
   */
  const handlePressEnter = () => {
    const value = input.current?.input?.value.trim();
    onChange(value);
    setState({ value });
  };

  /**
   * Handles the change event for the search input.
   * Clears the current timeout and sets a new timeout to trigger the handlePressEnter function after 500 milliseconds.
   */
  const timeoutSearch = useRef<ReturnType<typeof setTimeout>>();
  const handleChange = () => {
    if (timeoutSearch.current) clearTimeout(timeoutSearch.current);
    timeoutSearch.current = setTimeout(() => handlePressEnter(), 500);
  };

  /**
   * Clears the search input and triggers a table change event.
   */
  const handClick = () => {
    if (state.value) {
      setState({ value: undefined });
      onChange(undefined);
    } else handlePressEnter();
  };
  const [state, setState] = useState({ value });
  const { t } = useTranslation('locale', { keyPrefix: 'Components' });

  /**
   * Ref object for the input element.
   */
  const input = useRef<{ input: HTMLInputElement }>(null);
  return (
    <div className='c-search'>
      <CEMask
        ref={input}
        value={state.value}
        placeholder={t('Search')}
        onChange={handleChange}
        onPressEnter={handlePressEnter}
      />
      <button onClick={handClick}>
        <CSvgIcon name={state.value ? EIcon.Times : EIcon.Search} />
      </button>
    </div>
  );
};
