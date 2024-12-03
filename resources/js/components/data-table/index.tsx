import type { ColumnDef, ColumnPinningState, Table } from '@tanstack/react-table';
import { Popconfirm, Spin } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type Ref, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import { EIcon, ETableAlign, ETablePinAlign } from '@/enums';
import { FORMAT_DATE } from '@/utils';
import { CButton } from '../button';
import { CGridVirtualizer } from '../grid-virtualizer';
import { CSearch } from '../search';
import { CSvgIcon } from '../svg-icon';
import { CTooltip } from '../tooltip';
import './index.less';
import type { Props } from './interface';

const Component = <TData,>(
  {
    columns = [],
    data,
    heightCell = 28,
    defaultParams = {},
    rightHeader,
    leftHeader,
    paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
    isSearch = true,
    isLoading = false,
    action,
    isPagination = true,
    onRow,
    filterGlobal,
    style,
    onScroll,
    isExpanded,
    onExpand,
    rowSelection,
    isVirtualized,
    keyId,
    currentId,
  }: Props,
  ref: Ref<{ table: RefObject<{ table: Table<TData> | undefined }> }>,
) => {
  const { t } = useTranslation('locale', { keyPrefix: 'Components' });

  const [state, setState] = useState<{ columns?: ColumnDef<TData>[]; columnPinning?: ColumnPinningState }>();
  useEffect(() => {
    const columnPinning: ColumnPinningState = { left: [], right: [] };
    const orginColumns = columns;

    orginColumns.forEach(item => {
      if (item.tableItem?.fixed && item.name) {
        if (item.tableItem.fixed === ETablePinAlign.Left) columnPinning.left?.push(item.name);
        else if (item.tableItem.fixed === ETablePinAlign.Right) columnPinning.right?.push(item.name);
      }
      if (item?.tableItem?.isDateTime && !item.tableItem?.render) {
        const day = text => dayjs(text).format(FORMAT_DATE + ' HH:mm:ss');
        item.tableItem.render = text => <CTooltip title={day(text)}>{dayjs(text).format(FORMAT_DATE)}</CTooltip>;
      }
    });

    if (action?.label && columns.filter(item => item.title === t('Action')).length === 0) {
      orginColumns.push({
        name: 'action',
        title: t('Action'),
        tableItem: {
          width: action.width ?? 90,
          fixed: action.fixed,
          align: ETableAlign.Center,
          render: (_: string, data) => (
            <div className={'action'}>
              {action?.render?.(data)}
              {!!action.onDisable && (
                <CTooltip
                  title={t(data.isDisable ? 'Disabled' : 'Enabled', {
                    name: action.name(data),
                    label: action.label.toLowerCase(),
                  })}
                >
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t(!data.isDisable ? 'AreYouSureWantDisable' : 'AreYouSureWantEnable', {
                      name: action.name(data),
                      label: action.label.toLowerCase(),
                    })}
                    onConfirm={() => action.onDisable({ id: data.code ?? data.id ?? data, isDisable: !data.isDisable })}
                  >
                    <button
                      title={t(data.isDisable ? 'Disabled' : 'Enabled', {
                        name: action.name(data),
                        label: action.label.toLowerCase(),
                      })}
                    >
                      {data.isDisable ? (
                        <CSvgIcon name={EIcon.Disable} className='warning' />
                      ) : (
                        <CSvgIcon name={EIcon.Check} className='success' />
                      )}
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}

              {!!action.onEdit && (
                <CTooltip title={t('Edit', { name: action.name(data), label: action.label.toLowerCase() })}>
                  <button
                    title={t('Edit', { name: action.name(data), label: action.label.toLowerCase() })}
                    onClick={() => action.onEdit({ id: data.code ?? data.id ?? data, params: defaultParams, data })}
                  >
                    <CSvgIcon name={EIcon.Edit} className='primary' />
                  </button>
                </CTooltip>
              )}

              {!!action.onDelete && (
                <CTooltip title={t('Delete', { name: action.name(data), label: action.label.toLowerCase() })}>
                  <Popconfirm
                    destroyTooltipOnHide={true}
                    title={t('AreYouSureWantDelete', {
                      name: action.name(data),
                      label: action.label.toLowerCase(),
                    })}
                    onConfirm={() => action.onDelete(data.code ?? data.id ?? data)}
                  >
                    <button title={t('Delete', { name: action.name(data), label: action.label.toLowerCase() })}>
                      <CSvgIcon name={EIcon.Trash} className='error' />
                    </button>
                  </Popconfirm>
                </CTooltip>
              )}
            </div>
          ),
        },
      });
    }
    setState({
      columnPinning,
      columns: orginColumns.map(item => ({
        accessorKey: item.name,
        header: item.title,
        size: item.tableItem?.width,
        meta: {
          sorter: item.tableItem?.sorter,
          onCell: item.tableItem?.onCell,
          align: item.tableItem?.align,
          filter: item.tableItem?.filter,
        },
        cell:
          item?.tableItem?.render && item.name
            ? ({ row }) => item.tableItem!.render!(row.original[item.name ?? ''], row.original)
            : undefined,
      })),
    });
  }, [columns]);

  /**
   * Renders the header of the data table.
   *
   * @returns The JSX element representing the header.
   */
  const renderHeader = () =>
    (!!isSearch || !!leftHeader || !!rightHeader) && (
      <div className='top-header'>
        <div className='flex items-center gap-2'>
          {!!action?.onAdd && (
            <CButton
              icon={<CSvgIcon name={EIcon.Plus} size={12} />}
              text={action?.labelAdd}
              onClick={() => action?.onAdd({ data: undefined, isVisible: true })}
            />
          )}
          {rightHeader}
          <Spin spinning={isLoading} />
        </div>

        {(!!isSearch || !!leftHeader) && (
          <div className={'right'}>
            {isSearch ? <CSearch onChange={value => refTable.current?.table?.setGlobalFilter(value)} /> : <div />}
            {leftHeader}
          </div>
        )}
      </div>
    );

  const refTable = useRef<{ table: Table<TData> | undefined }>(null);
  useImperativeHandle(ref, () => ({ table: refTable }));
  return (
    !!data &&
    !!state?.columns && (
      <div className='data-table'>
        {renderHeader()}
        <CGridVirtualizer<TData>
          ref={refTable}
          heightCell={heightCell}
          columnPinning={state.columnPinning}
          data={data}
          paginationDescription={paginationDescription}
          columns={state.columns}
          isPagination={isPagination}
          onRow={onRow}
          filterGlobal={filterGlobal}
          style={style}
          onScroll={onScroll}
          isExpanded={isExpanded}
          onExpand={onExpand}
          rowSelection={rowSelection}
          isVirtualized={isVirtualized}
          keyId={keyId}
          currentId={currentId}
        />
      </div>
    )
  );
};
export const CDataTable = forwardRef(Component) as <TData>(
  props: Props & { ref?: Ref<{ table: RefObject<{ table: Table<TData> | undefined }> }> },
) => ReturnType<typeof Component>;
