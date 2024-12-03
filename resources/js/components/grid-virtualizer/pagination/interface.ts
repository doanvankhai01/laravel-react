import type { Table } from '@tanstack/react-table';

/**
 * @property {number} total - The total number of items.
 * @property {number} page - The current page number.
 * @property {number} perPage - The number of items per page.
 * @property {number[]} pageSizeOptions - The available page size options.
 * @property {(from: number, to: number, total: number) => string} paginationDescription - A function that generates the pagination description.
 * @property {(props: { perPage: number; page: number }) => void} queryParams - A function that handles the query parameters.
 */
export interface Props {
  total: number;
  page: number;
  perPage: number;
  table: Table<any>;
  paginationDescription?: (from: number, to: number, total: number) => string;
  queryParams?: (props: { perPage: number; page: number }) => void;
}
