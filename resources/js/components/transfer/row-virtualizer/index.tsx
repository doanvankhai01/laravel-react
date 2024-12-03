import { useVirtualizer } from '@tanstack/react-virtual';
import classNames from 'classnames';
import { useRef } from 'react';
import type { Props } from './interface';

/**
 * Component for rendering a row virtualizer.
 */
export const CRowVirtualizer = ({ className, data, render, firstItem, heightCell = 28 }: Props) => {
  const parentRef = useRef<any>();

  /**
   * Initializes a virtualizer for efficient rendering of a large list.
   *
   * @param {number} count - The number of items in the list.
   * @param {Function} getScrollElement - A function that returns the scroll element.
   * @param {Function} estimateSize - A function that estimates the size of each item in the list.
   * @returns {Virtualizer} The virtualizer object.
   */
  const virtualizer = useVirtualizer({
    count: data?.length ?? 0,
    getScrollElement: () => parentRef.current ?? document.body,
    estimateSize: () => heightCell,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: 0,
  });
  const items = virtualizer.getVirtualItems();
  const measureElement = el => {
    if (!el) return;
    virtualizer.measureElement(el);
    return undefined;
  };
  return (
    <div ref={parentRef} className={classNames('scrollbar', className)}>
      {firstItem}
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <div style={{ transform: `translateY(${items[0]?.start ?? 0}px)` }}>
          {items.map(virtualRow => (
            <div key={virtualRow.key} data-index={virtualRow.index} ref={measureElement}>
              {data && render?.(data[virtualRow.index], virtualRow.index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
