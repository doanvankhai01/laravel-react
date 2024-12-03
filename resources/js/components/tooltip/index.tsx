import { Tooltip } from 'antd';
import type { PropsWithChildren } from 'react';
import type { Props } from './interface';

/**
 * Tooltip component that wraps the provided children with a tooltip.
 */
export const CTooltip = ({ children, title, placement }: PropsWithChildren<Props>) => {
  return (
    <Tooltip title={title} placement={placement} destroyTooltipOnHide={true}>
      {children}
    </Tooltip>
  );
};
