import { useState } from 'react';

import { EIcon } from '@/enums';
import { CSvgIcon } from '../../svg-icon';
import type { PropsPassword } from './interface';

/**
 * Renders a password input component.
 */
const Component = ({ value, placeholder, disabled, onChange, onBlur }: PropsPassword) => {
  /**
   * Toggles the visibility of the password input.
   */
  const [toggle, setToggle] = useState(true);

  return (
    <div className='relative'>
      <input
        autoComplete='on'
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        type={toggle ? 'password' : 'text'}
        className='ant-input pr-9'
        onChange={event => onChange?.(event)}
        onBlur={event => onBlur?.(event)}
      />
      <button type='button' className='icon' onClick={() => setToggle(!toggle)}>
        <CSvgIcon name={toggle ? EIcon.EyeSlash : EIcon.Eye} />
      </button>
    </div>
  );
};
export default Component;
