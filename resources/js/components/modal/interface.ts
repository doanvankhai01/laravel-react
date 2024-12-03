import type { ReactNode } from 'react';

/**
 * @property {any} facade - The facade object.
 * @property {string} [keyState] - The key state.
 * @property {(data: any) => string} [title] - The function that returns the title of the modal.
 * @property {number} [widthModal] - The width of the modal.
 * @property {() => any} [onOk] - The function to be called when the OK button is clicked.
 * @property {() => void} [onCancel] - The function to be called when the Cancel button is clicked.
 * @property {boolean} [firstChange] - Indicates if it is the first change.
 * @property {string} [textSubmit] - The text for the submit button.
 * @property {string} [textCancel] - The text for the cancel button.
 * @property {string} [className] - The CSS class name.
 * @property {(handleOk: () => Promise<void>, handleCancel: () => void) => JSX.Element[] | JSX.Element} [footerCustom] - The function that returns custom footer elements.
 * @property {string} [name] - The name.
 * @property {ReactNode} [children] - The children elements.
 */
export interface Props {
  facade: any;
  keyState?: string;
  title?: (data: any) => string;
  width?: number;
  firstChange?: boolean;
  textSubmit?: string;
  textCancel?: string;
  className?: string;
  footerCustom?: (handleOk: () => Promise<void>, handleCancel: () => void) => JSX.Element[] | JSX.Element;
  onOk?: () => any;
  onCancel?: () => void;
  children?: ReactNode;
}
