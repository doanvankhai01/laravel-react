import type { Dayjs } from 'dayjs';
import type { Key } from 'react';

import type { IDataTable } from '@/interfaces';

export interface Props {
  widthColumnDay?: number;
  widthMonthYear?: number;
  perRow?: number;
  maxHeight?: number;
  data?: any[];
  event?: {
    name: string;
    startDate: Dayjs;
    endDate?: Dayjs;
  }[];
  columns: IDataTable[];
  keyChildren?: string;
  dateStart?: string;
  dateEnd?: string;
  cellRender?: ({
    row,
    iRow,
    kRow,
    column,
    iColumn,
    kColumn,
    setState,
  }: {
    row: any;
    iRow: number;
    kRow: Key;
    column: any;
    iColumn: number;
    kColumn: Key;
    setState: any;
  }) => any;
}
