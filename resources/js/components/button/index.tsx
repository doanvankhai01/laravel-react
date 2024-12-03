import { Spin } from 'antd';
import classNames from 'classnames';

import './index.less';
import type { Props } from './interface';

export const CButton = ({
  text = '',
  icon,
  title,
  className,
  disabled,
  isLoading = false,
  isTiny = false,
  type = 'button',
  onClick,
  onPaste,
}: Props) => {
  const classButton = classNames('btn', className, {
    'h-8 px-3': !isTiny,
    'h-6 px-2': isTiny,
  });
  const render = () => (
    <>
      {isLoading && <Spin size='small' />}
      {!isLoading && icon}
      {text}
    </>
  );
  return (
    <button
      type={type}
      disabled={disabled}
      title={title ?? text}
      className={classButton}
      onClick={onClick}
      onPaste={onPaste}
    >
      {render()}
    </button>
  );
};
