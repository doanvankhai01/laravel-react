import classNames from 'classnames';
import { OTPInput, type SlotProps } from 'input-otp';
import { useRef } from 'react';
import type { PropsOtp } from './interface';

const Slot = (props: SlotProps) => (
  <div className={classNames('input', { active: props.isActive })}>
    <div className='group-has-[input[data-input-otp-placeholder-shown]]:opacity-20'>
      {props.char ?? props.placeholderChar}
    </div>
    {props.hasFakeCaret && <FakeCaret />}
  </div>
);

// You can emulate a fake textbox caret!
const FakeCaret = () => (
  <div className='fake-caret'>
    <div />
  </div>
);

// Inspired by Stripe's MFA input.
const FakeDash = () => (
  <div className='fake-dash'>
    <div />
  </div>
);
const Component = ({ onChange }: PropsOtp) => {
  const refFirstLoad = useRef(false);
  setTimeout(() => {
    refFirstLoad.current = true;
  }, 100);
  return (
    <OTPInput
      maxLength={6}
      containerClassName='c-otp'
      onChange={event => refFirstLoad && onChange?.(event)}
      render={({ slots }) => (
        <>
          <div className='flex'>
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={'idx' + idx} {...slot} />
            ))}
          </div>

          <FakeDash />

          <div className='flex'>
            {slots.slice(3).map((slot, idx) => (
              <Slot key={'idx' + idx} {...slot} />
            ))}
          </div>
        </>
      )}
    />
  );
};
export default Component;
