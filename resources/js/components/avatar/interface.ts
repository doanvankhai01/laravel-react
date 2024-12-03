/**
 * Represents the properties for the Avatar component.
 */
export interface Props {
  src: string;
  text?: string | { [selector: string]: string }[];
  size?: number;
  showName?: boolean;
  index?: number;
}
/**
 * Represents an object of type TypeObject.
 */
export interface PropsObject extends Props {
  keySrc?: string;
  keyName?: string;
  maxCount?: number;
}
