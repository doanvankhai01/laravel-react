import type { CSSProperties } from 'react';

/**
 * @param option - The chart configuration options.
 * @param style - The style object to customize the height of the chart.
 * @param colorPalette - An array of colors to be used in the chart.
 */
export interface Props {
  option: any;
  style?: CSSProperties;
  color?: string[];
}
