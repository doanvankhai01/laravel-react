import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { EIcon } from '@/enums';
import { CESelect } from '../../form/entry';
import { CSvgIcon } from '../../svg-icon';
import './index.less';
import type { Props } from './interface';

/**
 * Represents the pagination configuration.
 */

export const CPagination = ({
  total = 4,
  page = 1,
  perPage = 10,
  table,
  paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  queryParams = () => null,
}: Props) => {
  const pageSizeOptions = useRef([perPage, perPage * 2, perPage * 3, perPage * 4, perPage * 5]);
  /**
   * Represents a reference to a list of page items.
   * @typedef {Object} ListOfPageItemRef
   * @property {boolean} disabled - Indicates if the page item is disabled.
   * @property {string} type - The type of the page item.
   * @property {number} index - The index of the page item.
   */
  const listOfPageItem = useRef<{ disabled: boolean; type: string; index: number }[]>([]);
  /**
   * Sets the temporary ranges for pagination.
   *
   * @param ranges - The ranges to set.
   */
  const [temp, setTemp] = useState<{ ranges: [number, number] }>({
    ranges: [(page - 1) * perPage + 1, Math.min(page * perPage, total)],
  });
  /**
   * The reference to the last number.
   */
  const lastNumber = useRef(0);

  /**
   * Calculates the last index based on the total number of items and the page size.
   *
   * @param total - The total number of items.
   * @param pageSize - The number of items per page.
   * @returns The last index.
   */
  const getLastIndex = (total: number, pageSize: number) => {
    return Math.ceil(total / pageSize);
  };

  /**
   * Handles the change of page size.
   *
   * @param perPage - The number of items per page.
   */
  const onPageSizeChange = (size: number) => {
    queryParams({ perPage: size, page });
    table.setPageSize(size);
    buildIndexes();
  };

  /**
   * Handles the change of the page index.
   *
   * @param {Object} options - The options for the page index change.
   * @param {string} options.type - The type of the page index change.
   * @param {number} options.index - The new index for the page.
   */
  const onPageIndexChange = ({ type, index }: { type: string; index: number }) => {
    switch (type) {
      case 'prev':
        index = page - 1;
        break;
      case 'prev_10':
        index = page - 10;
        break;
      case 'next':
        index = page + 1;
        break;
      case 'next_10':
        index = page + 10;
        break;
      default:
    }
    queryParams({ perPage, page: index });
    table.setPageIndex(index - 1);
    buildIndexes();
  };

  /**
   * Generates a list of page items for pagination.
   *
   * @param pageIndex - The current page index.
   * @param lastIndex - The index of the last page.
   * @returns An array of page items with their index, type, and disabled status.
   */
  const getListOfPageItem = (pageIndex: number, lastIndex: number) => {
    /**
     * Concatenates the given list of pages with previous and next items.
     *
     * @param listOfPage - The list of pages to concatenate.
     * @returns The concatenated list of pages with previous and next items.
     */
    const concatWithPrevNext = (listOfPage: { index: number; type: string; disabled: boolean }[]) => {
      /**
       * Represents the previous 10 item in the pagination.
       * @property {string} type - The type of the item ('prev_10').
       * @property {number} index - The index of the item (-1).
       * @property {boolean} disabled - Indicates if the item is disabled based on the current page.
       */
      const prev10Item = {
        type: 'prev_10',
        index: -1,
        disabled: page - 10 < 0,
      };
      /**
       * Represents the previous item in the pagination.
       * @typedef {Object} PrevItem
       * @property {string} type - The type of the item (always 'prev').
       * @property {number} index - The index of the item (-1 for previous item).
       * @property {boolean} disabled - Indicates if the item is disabled (true if pageIndex is 1, false otherwise).
       */
      const prevItem = {
        type: 'prev',
        index: -1,
        disabled: pageIndex === 1,
      };
      /**
       * Represents the next item in the pagination.
       * @property {string} type - The type of the item (always 'next').
       * @property {number} index - The index of the item (-1 for the next item).
       * @property {boolean} disabled - Indicates whether the next item is disabled or not.
       */
      const nextItem = {
        type: 'next',
        index: -1,
        disabled: pageIndex === lastIndex,
      };
      /**
       * Represents the next 10 item in the pagination.
       * @property {string} type - The type of the item.
       * @property {number} index - The index of the item.
       * @property {boolean} disabled - Indicates if the item is disabled.
       */
      const next10Item = {
        type: 'next_10',
        index: -1,
        disabled: page + 10 > lastIndex,
      };
      lastNumber.current = listOfPage.length;
      return [prev10Item, prevItem, ...listOfPage, nextItem, next10Item];
    };
    /**
     * Generates a list of pages with index, type, and disabled properties.
     *
     * @param start - The starting index of the page.
     * @param end - The ending index of the page.
     * @returns An array of objects representing the pages.
     */
    const generatePage = (start: number, end: number) => {
      const list: { index: number; type: string; disabled: boolean }[] = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page_' + i,
          disabled: false,
        });
      }
      return list;
    };

    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      /**
       * Generates a range of items for pagination.
       *
       * @param selected - The currently selected item.
       * @param last - The last item in the range.
       * @returns An array of range items.
       */
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange: { index: number; type: string; disabled: boolean }[];
        /**
         * Represents the previous five item in the pagination.
         */
        const prevFiveItem = {
          type: 'prev_5',
          index: -1,
          disabled: false,
        };
        /**
         * Represents the next five item.
         * @type {Object}
         * @property {string} type - The type of the item ('next_5').
         * @property {number} index - The index of the item (-1).
         * @property {boolean} disabled - Indicates if the item is disabled (false).
         */
        const nextFiveItem = {
          type: 'next_5',
          index: -1,
          disabled: false,
        };
        /**
         * Generates the first page item.
         *
         * @param {number} pageNumber - The page number.
         * @param {number} totalPages - The total number of pages.
         * @returns {PageItem} The generated page item.
         */
        const firstPageItem = generatePage(1, 1);
        /**
         * Generates a page item for the last page.
         *
         * @param {number} lastIndex - The index of the last page.
         * @returns {PageItem} - The generated page item.
         */
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 4), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 1, selected + 1), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 3, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  };

  /**
   * Renders an icon for the previous item.
   *
   * @param item - The item to render the icon for.
   * @returns The rendered icon component.
   */
  const renderIconPrev = item => item.type === 'prev' && <CSvgIcon name={EIcon.Arrow} className={'rotate-180'} />;
  /**
   * Renders an icon for the next item.
   *
   * @param item - The item to render the icon for.
   * @returns The rendered icon element.
   */
  const renderIconNext = item => item.type === 'next' && <CSvgIcon name={EIcon.Arrow} />;
  /**
   * Renders an icon for the previous 10 items.
   *
   * @param item - The item to render the icon for.
   * @returns The rendered icon component.
   */
  const renderIconPrev10 = item =>
    item.type === 'prev_10' && <CSvgIcon name={EIcon.DoubleArrow} className={'rotate-180'} />;
  /**
   * Renders an icon for the next 10 items.
   *
   * @param item - The item to check for the type 'next_10'.
   * @returns The SVG icon component if the item type is 'next_10', otherwise null.
   */
  const renderIconNext10 = item => item.type === 'next_10' && <CSvgIcon name={EIcon.DoubleArrow} />;
  /**
   * Renders a number page.
   *
   * @param item - The item to render.
   * @returns The index of the item if it is a page type, otherwise undefined.
   */
  const renderNumberPage = item => item.type.indexOf('page') === 0 && <span>{item?.index}</span>;
  /**
   * Renders three dots if the item type is 'prev_5' or 'next_5'.
   *
   * @param item - The item to check the type of.
   * @returns The three dots if the item type is 'prev_5' or 'next_5', otherwise undefined.
   */
  const renderThreeDots = item => (item.type === 'prev_5' || item.type === 'next_5') && <span>...</span>;

  /**
   * Builds the indexes for pagination.
   *
   * This function calculates the last index, generates a list of page items, and updates the temporary state.
   *
   * @returns void
   */
  const buildIndexes = () => {
    const lastIndex = getLastIndex(total, perPage);
    listOfPageItem.current = getListOfPageItem(page, lastIndex);
    setTemp(pre => ({ ...pre, ranges: [(page - 1) * perPage + 1, Math.min(page * perPage, total)] }));
  };

  useEffect(() => {
    buildIndexes();
  }, [total, perPage, page]);

  return (
    total > 0 && (
      <div className={'pagination'}>
        <div className={'left'}>
          <CESelect
            allowClear={false}
            showSearch={false}
            value={perPage}
            onChange={value => onPageSizeChange(value)}
            list={pageSizeOptions.current.map((item: number) => ({ value: item, label: item + ' / page' }))}
          />
          <div className='whitespace-nowrap'>{paginationDescription(temp.ranges[0], temp.ranges[1], total)}</div>
        </div>
        <div className='right'>
          {listOfPageItem.current.map((item: any) => (
            <button
              type={'button'}
              disabled={item.disabled}
              key={item.type}
              className={classNames({ active: page === item.index, disabled: item.disabled })}
              onClick={() => onPageIndexChange(item)}
              aria-label={item.type}
            >
              {renderIconPrev(item)}
              {renderIconNext(item)}
              {renderIconPrev10(item)}
              {renderIconNext10(item)}
              {renderNumberPage(item)}
              {renderThreeDots(item)}
            </button>
          ))}
        </div>
      </div>
    )
  );
};
