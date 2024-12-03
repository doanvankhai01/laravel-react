import type { EIcon } from '@/enums';

/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export interface Props {
  name: EIcon; // Name of the icon ==> Required
  size?: number; // Size of the icon ==> Not required
  className?: string;
}
