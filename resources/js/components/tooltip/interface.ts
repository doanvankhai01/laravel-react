import type { RenderFunction } from 'antd/lib/_util/getRenderPropValue';
import type { TooltipPlacement } from 'antd/lib/tooltip';
/**
 * @param {React.ReactNode | RenderFunction} title - The content of the tooltip.
 * @param {TooltipPlacement} [placement] - The placement of the tooltip. Defaults to "top".
 */
export interface Props {
  title: React.ReactNode | RenderFunction;
  placement?: TooltipPlacement;
}
