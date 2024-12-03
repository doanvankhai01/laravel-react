import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type TableOptions,
} from '@tanstack/react-table';
import dayjs from 'dayjs';

export enum ETypeFilter {
  IncludeText = 'includeText',
  NotIncludeText = 'notIncludeText',
  StartText = 'startText',
  EndText = 'endText',
  SameText = 'sameText',
  SameDate = 'sameDate',
  BeforeDate = 'beforeDate',
  AfterDate = 'afterDate',
  GreaterNumber = 'greaterNumber',
  GreaterEqualNumber = 'greaterEqualNumber',
  LessNumber = 'lessNumber',
  LessEqualNumber = 'lessEqualNumber',
  EqualNumber = 'equalNumber',
  NotEqualNumber = 'notEqualNumber',
  MiddleNumber = 'middleNumber',
  NotMiddleNumber = 'notMiddleNumber',
  Blank = 'blank',
  NotBlank = 'notBlank',
}
/**
 * Calculates the number of pages based on the height of the document body.
 *
 * @param height - The height of each page in pixels. Default is 39.
 * @param minusNumber - The number to subtract from the calculated page count. Default is 2.
 * @returns The number of pages based on the height of the document body.
 */
export const getSizePageByHeight = ({
  height = 28,
  minusNumber = 4,
  element = document.getElementsByTagName('tbody')[0],
}: any) =>
  Math.floor((document.body.getBoundingClientRect().height - element.getBoundingClientRect().top) / height) -
  minusNumber;

export const generateOption = <TData>({
  data,
  widthCell,
  parentRef,
  columns,
  columnPinning = {},
  isResizing,
  isExpanded,
  isPagination,
  isFilter,
  filterGlobal,
  rowSelection,
  keyId = 'id',
  state,
  setState,
}) => {
  const option: TableOptions<TData> = {
    filterFns: {
      //define as a filter function that can be used in column definitions
      global: (row, columnId, value, addMeta) => !filterGlobal || filterGlobal(row, columnId, value, addMeta),
      blank: (row, columnId) => !row.original[columnId] || row.original[columnId]?.trim().length === 0,
      notBlank: (row, columnId) => row.original[columnId] && row.original[columnId]?.trim().length > 0,
      includeText: (row, columnId, value) => !value || row.original[columnId].includes(value),
      notIncludeText: (row, columnId, value) => !value || !row.original[columnId].includes(value),
      startText: (row, columnId, value) => !value || row.original[columnId].startsWith(value),
      endText: (row, columnId, value) => !value || row.original[columnId].endsWith(value),
      sameText: (row, columnId, value) => !value || row.original[columnId] === value,
      sameDate: (row, columnId, value) =>
        !value || !row.original[columnId] || dayjs(value).isSame(dayjs(row.original[columnId]), 'day'),
      beforeDate: (row, columnId, value) =>
        !value || !row.original[columnId] || dayjs(row.original[columnId]).isBefore(dayjs(value), 'day'),
      afterDate: (row, columnId, value) =>
        !value || !row.original[columnId] || dayjs(row.original[columnId]).isAfter(dayjs(value), 'day'),
      greaterNumber: (row, columnId, value) => value === undefined || row.original[columnId] > parseFloat(value),
      greaterEqualNumber: (row, columnId, value) => value === undefined || row.original[columnId] >= parseFloat(value),
      lessNumber: (row, columnId, value) => value === undefined || row.original[columnId] < parseFloat(value),
      lessEqualNumber: (row, columnId, value) => value === undefined || row.original[columnId] <= parseFloat(value),
      equalNumber: (row, columnId, value) => value === undefined || row.original[columnId] === parseFloat(value),
      notEqualNumber: (row, columnId, value) => value === undefined || row.original[columnId] !== parseFloat(value),
      middleNumber: (row, columnId, value) =>
        !value ||
        value.length !== 2 ||
        (row.original[columnId] >= parseFloat(value[0]) && row.original[columnId] <= parseFloat(value[1])),
      notMiddleNumber: (row, columnId, value) =>
        !value ||
        value.length !== 2 ||
        row.original[columnId] < parseFloat(value[0]) ||
        row.original[columnId] > parseFloat(value[1]),
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state,
    initialState: {
      columnPinning,
    },
    onColumnVisibilityChange: updaterOrValue =>
      setState(old => ({
        ...old,
        columnVisibility:
          typeof updaterOrValue === 'function' ? updaterOrValue(state.columnVisibility) : updaterOrValue,
      })),
    globalFilterFn: 'global',
    enableColumnFilters: isFilter,
    getRowId: (row: any) => row[keyId],
  };

  if (isFilter && option.state) {
    option.onColumnFiltersChange = updaterOrValue =>
      setState(old => ({
        ...old,
        columnFilters: typeof updaterOrValue === 'function' ? updaterOrValue(state.columnFilters) : updaterOrValue,
      }));
    option.onGlobalFilterChange = updaterOrValue =>
      setState(old => ({
        ...old,
        globalFilter: typeof updaterOrValue === 'function' ? updaterOrValue(state.globalFilter) : updaterOrValue,
      }));
    option.getFilteredRowModel = getFilteredRowModel(); //client-side filtering
    option.getFacetedRowModel = getFacetedRowModel(); // client-side faceting
    option.getFacetedUniqueValues = getFacetedUniqueValues(); // generate unique values for select filter/autocomplete
    option.getFacetedMinMaxValues = getFacetedMinMaxValues(); // generate min/max values for range filter
  }

  if (isResizing) {
    option.columnResizeMode = 'onChange';
    option.defaultColumn = {
      minSize: widthCell,
      maxSize: parentRef?.current?.getBoundingClientRect().width ?? 1200,
    };
  }

  if (isPagination && option.state) {
    option.onPaginationChange = updaterOrValue =>
      setState(old => ({
        ...old,
        pagination: typeof updaterOrValue === 'function' ? updaterOrValue(state.pagination) : updaterOrValue,
      }));
    option.getPaginationRowModel = getPaginationRowModel();
  }

  if (rowSelection && option.state) {
    option.onRowSelectionChange = updaterOrValue =>
      setState(old => ({
        ...old,
        rowSelections: typeof updaterOrValue === 'function' ? updaterOrValue(state.rowSelections) : updaterOrValue,
      }));
    option.enableRowSelection = true;
    //option.enableRowSelection = row => row.original.age > 18, // or enable row selection conditionally per row
  }

  if (isExpanded && option.state) {
    option.getSubRows = (row: any) => row.children;
    option.onExpandedChange = updaterOrValue =>
      setState(old => ({
        ...old,
        expanded: typeof updaterOrValue === 'function' ? updaterOrValue(state.expanded) : updaterOrValue,
      }));
    option.getExpandedRowModel = getExpandedRowModel();
    if (isFilter) option.filterFromLeafRows = true;
    if (isPagination) option.paginateExpandedRows = false;
  }

  return isSort({ option, columns, state, setState });
};
const isSort = ({ option, columns, state, setState }) => {
  const isSorter = columns.length && columns.some(obj => obj.meta && Object.keys(obj.meta).includes('sorter'));
  if (isSorter && option.state) {
    option.onSortingChange = updaterOrValue =>
      setState(old => ({
        ...old,
        sorting: typeof updaterOrValue === 'function' ? updaterOrValue(state.sorting) : updaterOrValue,
      }));
    option.getSortedRowModel = getSortedRowModel();
  }
  return option;
};
