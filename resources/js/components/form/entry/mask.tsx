import classNames from 'classnames';
import { forwardRef, useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import type { PropsMask } from './interface';

const Component = forwardRef(
  (
    {
      mask,
      value,
      addonBefore,
      addonAfter,
      disabled,
      placeholder,
      height,
      width,
      type,
      onBlur,
      onFocus,
      onChange,
      onPressEnter,
    }: PropsMask,
    ref: Ref<{ input: HTMLInputElement | null }>,
  ) => {
    useImperativeHandle(ref, () => ({ input: input.current }));
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (input.current) {
        input.current.value = value ?? '';
        // eslint-disable-next-line sonarjs/new-cap
      } else setTimeout(() => !!mask && !!input.current && Inputmask(mask).mask(input.current));
    }, [value]);

    /**
     * Generates the className for the input element.
     *
     * @param addonBefore - Whether there is an addon before the input.
     * @param addonAfter - Whether there is an addon after the input.
     * @param disabled - Whether the input is disabled.
     * @returns The generated className.
     */
    const className = classNames('ant-input', { before: !!addonBefore, after: !!addonAfter, disabled: disabled });

    return (
      <div className={'relative'}>
        {!!addonBefore && <span className='before'>{addonBefore()}</span>}
        <input
          ref={input}
          type={type}
          className={className}
          readOnly={disabled}
          defaultValue={value}
          placeholder={placeholder}
          style={{ height, width }}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          onKeyUp={e => e.key === 'Enter' && onPressEnter?.(e)}
        />
        {!!addonAfter && <span className='after'>{addonAfter()}</span>}
      </div>
    );
  },
);
Component.displayName = 'Mask Input';
export default Component;
