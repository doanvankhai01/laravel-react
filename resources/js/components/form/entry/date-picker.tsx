import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import { SGlobal } from '@/services';
import { FORMAT_DATE } from '@/utils';
import { useRef } from 'react';
import type { PropsDatePicker } from './interface';

/**
 * Renders a date picker component.
 */
const Component = ({ value, name, placeholder, onChange, format, disabledDate, picker, disabled }: PropsDatePicker) => {
  /**
   * Represents the global state of the application.
   */
  const sGlobal = SGlobal();
  const parentRef = useRef<any>(null);
  const refValue = useRef<any>(value && dayjs(value));

  /**
   * Handles the open change event for the date picker.
   *
   * @param {Event} e - The event object.
   * @returns {void}
   */
  const handleOpenChange = e => {
    if (!e) {
      const { value }: any = parentRef.current.getElementsByTagName('input')[0];
      const selectDate = dayjs(value, format ?? FORMAT_DATE);
      if (selectDate.isValid() && onChange && name) {
        refValue.current = selectDate;
        onChange(selectDate, value);
      }
    }
    setTimeout(() => parentRef.current.getElementsByTagName('input')[0]?.focus());
  };
  return (
    <div ref={parentRef}>
      <DatePicker
        defaultValue={refValue.current}
        value={refValue.current}
        format={format}
        disabledDate={disabledDate}
        picker={picker}
        locale={sGlobal.localeDate}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
};
export default Component;
