import type { IForm } from '@/interfaces';

/**
 * Represents the configuration for a drawer component.
 *
 * @property {any} facade - The facade object.
 * @property {'large' | undefined} [size] - The size of the drawer. Defaults to undefined.
 * @property {string | undefined} [keyState] - The key state.
 * @property {string | undefined} [keyIsLoading] - The key for loading state.
 * @property {string | undefined} [keyData] - The key for data.
 * @property {string} title - The title of the drawer.
 * @property {IForm[]} columns - The columns of the drawer.
 * @property {any} [textSubmit] - The text for the submit button. Defaults to undefined.
 * @property {any} [textCancel] - The text for the cancel button. Defaults to undefined.
 * @property {boolean} [checkHidden] - Indicates if the drawer is hidden. Defaults to false.
 * @property {(value: any) => void} onSubmit - The submit event handler.
 */
export interface Props {
  facade: any;
  size?: 'large';
  keyState?: string;
  keyIsLoading?: string;
  keyData?: string;
  title: string;
  columns: IForm[];
  textSubmit?: any;
  textCancel?: any;
  onClose?: (value: any) => void;
  onSubmit: (value: any) => void;
}
