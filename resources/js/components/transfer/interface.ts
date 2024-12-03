export interface Props<TData> {
  className?: string;
  top: TData[];
  titleTop: string;
  bottom?: TData[];
  titleBottom: string;
  getValue?(item: TData): string;
  getLabel?(item: TData): string;
  onChange?(items: { top: TData[]; bottom: TData[] }): void;
  keySelected?: keyof TData;
  isDisabled?: boolean;
}
