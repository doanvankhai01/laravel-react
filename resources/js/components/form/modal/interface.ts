import type { IForm } from '@/interfaces';

/**
 * @property {Function} title - A function that returns the title of the modal form.
 * @property {number} [width] - The width of the modal form (optional).
 * @property {IForm[]} columns - An array of form columns.
 * @property {string} [textSubmit] - The text for the submit button (optional).
 * @property {string} [textCancel] - The text for the cancel button (optional).
 * @property {string} [className] - The CSS class name for the modal form (optional).
 * @property {Function} [footerCustom] - A function that returns custom footer elements for the modal form (optional).
 * @property {any} [facade] - The facade object for the modal form (optional).
 * @property {string} [keyState] - The key for the state object (optional).
 * @property {string} [keyData] - The key for the data object (optional).
 * @property {string} [keyIsLoading] - The key for the check loading data (optional).
 * @property {(value: any) => void} onSubmit - The submit event handler.
 * @property {(value: any) => void} onClose - The close modal event handler.
 */
export interface Props {
  title: (data: any) => string;
  width?: number;
  columns: IForm[];
  textSubmit?: string;
  textCancel?: string;
  className?: string;
  footerCustom?: (handleOk: () => Promise<any>, handleCancel: () => void) => JSX.Element[] | JSX.Element;
  facade?: any;
  keyState?: string;
  keyData?: string;
  keyIsLoading?: string;
  onSubmit: (value: any) => void;
  onClose?: (value: any) => void;
}
