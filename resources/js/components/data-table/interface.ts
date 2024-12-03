import type { FilterFn } from '@tanstack/react-table';
import type { CSSProperties, UIEventHandler } from 'react';

import type { ETablePinAlign } from '@/enums';
import type { IDataTable, IPaginationQuery } from '@/interfaces';

/**
 * Represents the type definition for the DataTable component.
 */
export interface Props {
  columns: IDataTable[];
  data?: any[];
  heightCell?: number;
  defaultParams?: IPaginationQuery;
  rightHeader?: JSX.Element;
  leftHeader?: JSX.Element;
  paginationDescription?: (from: number, to: number, total: number) => string;
  isSearch?: boolean;
  isLoading?: boolean;
  action?: {
    onDisable?: any;
    onEdit?: any;
    onDelete?: any;
    label: any;
    name: any;
    onAdd?: any;
    labelAdd?: any;
    render?: any;
    width?: number;
    fixed?: ETablePinAlign;
  };

  isPagination?: boolean;
  onRow?: (data: any) => { onDoubleClick?: () => void; onClick?: () => void };
  filterGlobal?: FilterFn<any>;
  style?: CSSProperties;
  onScroll?: UIEventHandler<HTMLDivElement>;
  isExpanded?: boolean;
  onExpand?: (row: any) => void;
  rowSelection?: {
    onChange?: (selectedRows: any[]) => void;
    columnWidth?: number;
  };
  isVirtualized?: boolean;
  keyId?: string;
  currentId?: string;
}
