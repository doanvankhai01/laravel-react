import type { CellContext, ColumnDef, Table } from '@tanstack/react-table';
import { Checkbox } from 'antd';
import classNames from 'classnames';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from 'react';
import { useTranslation } from 'react-i18next';

import { EIcon } from '@/enums';
import { CSvgIcon } from '../svg-icon';
import './index.less';
import type { Props } from './interface';
import { ForwardedTanstack } from './tanstack';
import { getSizePageByHeight } from './util';

const CGridVirtualizer = <TData,>(
  {
    columns,
    data,
    widthCell = 28,
    heightCell = 28,
    columnPinning = { left: [], right: [] },
    isResizing = true,
    isExpanded,
    onExpand,
    isPagination = true,
    rowSelection,
    onScroll,
    firstItem,
    paginationDescription,
    filterGlobal,
    onRow,
    style,
    className,
    isVirtualized,
    keyId,
    currentId,
  }: Props<TData>,
  ref: Ref<{ table: Table<TData> | undefined }>,
) => {
  const { i18n } = useTranslation('locale', { keyPrefix: 'Components' });
  const parentRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ columns?: ColumnDef<TData>[] }>({});
  const renderExpandedColumn = ({ row, getValue }: CellContext<any, any>) => (
    <>
      {row.getCanExpand() && (
        <button
          type='button'
          onClick={() => {
            row.toggleExpanded();
            onExpand?.(row.original);
          }}
        >
          <CSvgIcon name={EIcon.Arrow} size={13} className={classNames({ 'rotate-90': row.getIsExpanded() })} />
        </button>
      )}
      <span>{getValue()}</span>
    </>
  );
  useEffect(() => {
    setTimeout(() => {
      if (parentRef.current) {
        const orginColumns = columns;
        if (isExpanded && columns.length > 0) {
          orginColumns[0].cell = renderExpandedColumn;
          if (!orginColumns[0].meta) orginColumns[0].meta = {};
          orginColumns[0].meta.cellStyle = ({ row }: CellContext<any, any>) => ({
            paddingLeft: `${row.depth * 1.5}rem`,
          });
        }
        if (rowSelection) {
          const header = ({ table }) => (
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          );
          const cell = ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          );
          orginColumns.unshift({
            accessorKey: 'rowSelection',
            size: rowSelection.columnWidth ?? 30,
            header,
            cell,
          });
        }

        const arrayWidthColumn = orginColumns.map(column => column.size ?? 0);
        const totalWidthColumns = arrayWidthColumn.reduce((prve, next) => prve + next, 0);
        const widthCell =
          (parentRef.current.getBoundingClientRect().width - totalWidthColumns) /
          arrayWidthColumn.filter(size => !size).length;
        const newColumns = columns.map(column => ({ ...column, size: column.size ?? widthCell }));
        newColumns[newColumns.length - 1].size = newColumns[newColumns.length - 1].size - 1;
        if (JSON.stringify(state.columns) !== JSON.stringify(newColumns)) setState({ columns: newColumns });
      }
    }, 140);
  }, [i18n.language, columns]);
  const refTable = useRef<Table<TData>>();
  useImperativeHandle(ref, () => ({ table: refTable.current }));
  return useMemo(
    () => (
      <div ref={parentRef}>
        {state.columns && (
          <ForwardedTanstack<TData>
            ref={refTable}
            data={JSON.parse(JSON.stringify(data))}
            widthCell={widthCell}
            heightCell={heightCell}
            parentRef={parentRef}
            columns={state.columns}
            rowSelection={rowSelection}
            columnPinning={columnPinning}
            isResizing={isResizing}
            isExpanded={isExpanded}
            pageSize={getSizePageByHeight({ height: heightCell, element: parentRef.current })}
            isPagination={isPagination}
            isFilter={columns.some(obj => obj.meta && Object.keys(obj.meta).includes('filter'))}
            onScroll={onScroll}
            firstItem={firstItem}
            paginationDescription={paginationDescription}
            filterGlobal={filterGlobal}
            onRow={onRow}
            style={style}
            className={className}
            isVirtualized={isVirtualized}
            keyId={keyId}
            currentId={currentId}
          />
        )}
      </div>
    ),
    [data, state],
  );
};
const ForwardedCGridVirtualizer = forwardRef(CGridVirtualizer) as <TData>(
  props: Props<TData> & { ref?: Ref<{ table: Table<TData> | undefined }> },
) => ReturnType<typeof CGridVirtualizer>;

export { ForwardedCGridVirtualizer as CGridVirtualizer };
