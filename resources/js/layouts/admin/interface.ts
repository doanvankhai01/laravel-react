import type { KEY_ROLE } from '@/utils';
import type { URLSearchParamsInit } from 'react-router';

/**
 * Represents a menu item in the admin layout.
 */
export interface IMenu {
  key?: string;
  label?: string;
  icon?: React.JSX.Element;
  permission?: KEY_ROLE;
  queryparams?: URLSearchParamsInit;
  children?: IMenu[];
}
