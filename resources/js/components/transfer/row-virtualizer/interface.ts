export interface Props {
  className?: string;
  data?: any[];
  render?: (msg: any, i: number) => any;
  firstItem?: any;
  heightCell?: number;
}
