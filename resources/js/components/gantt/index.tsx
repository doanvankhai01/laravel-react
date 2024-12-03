import { DndContext, useDraggable } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useRef, useState, type Key } from 'react';

import type { IDataTable } from '@/interfaces';
import { SGlobal } from '@/services';
import { generateObjDate, loopFlatMapChildren } from '@/utils';
import { CDataTable } from '../data-table';
import './index.less';
import { GanttRight } from './right';
/**
 * Renders a Gantt chart component.
 *
 * @component
 * @param {number} [widthColumnDay=40.8] - The width of each day column.
 * @param {number} [widthMonthYear=110] - The width of each month/year column.
 * @param {number} [perRow=1] - The number of rows to display per row.
 * @param {number} [maxHeight=window.innerHeight - 170] - The maximum height of the component.
 * @param {any[]} [data=[]] - The data to display in the Gantt chart.
 * @param {object[]} [event=[]] - The events to display in the Gantt chart.
 * @param {IDataTable[]} columns - The columns to display in the data table.
 * @param {string} [keyChildren='children'] - The key to use for nested children in the data.
 * @param {string} [dateStart] - The start date of the Gantt chart.
 * @param {string} [dateEnd] - The end date of the Gantt chart.
 * @param {Function} [cellRender] - The custom cell rendering function.
 * @returns {JSX.Element} The rendered Gantt chart component.
 */
export const CGantt = ({
  widthColumnDay = 35,
  widthMonthYear = 110,
  perRow = 1,
  maxHeight = window.innerHeight - 170,
  data = [],
  event = [],
  columns,
  keyChildren = 'children',
  dateStart,
  dateEnd,
  cellRender,
}: {
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
}) => {
  /**
   * Generates a unique identifier for the Gantt component.
   * @returns {string} The generated identifier.
   */
  const parentRef = useRef<HTMLDivElement>(null);
  if (cellRender) perRow = 1;
  /**
   * Represents the state of the Gantt component.
   *
   * @property {any} date - The date object.
   * @property {Dayjs} dateStart - The start date.
   * @property {any[]} task - The task array.
   * @property {any[]} flatTask - The flattened task array.
   */
  const [state, setState] = useState<{ date: any; dateStart: Dayjs; task: any[]; flatTask: any[] }>({
    date: { obj: {}, total: 0 },
    dateStart: dayjs(dateStart),
    task: data,
    flatTask: [],
  });
  const sGlobal = SGlobal();
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(state.task)) return;
    dayjs.locale(sGlobal.language);
    let start = dayjs(dateStart);
    let end = dateEnd ? dayjs(dateEnd) : dayjs().add(1, 'months');
    if (!dateEnd && data.length && state.date.total === 0) {
      if (!dateStart) start = dayjs(data[0].startDate);
      end = data[0].endDate ? dayjs(data[0].endDate) : start.add(1, 'months');
      if (end.day() < 5) end = end.add(5 - end.day(), 'days');
      data.forEach(item => {
        if (item.startDate < start) start = item.startDate;
        if (item.endDate && item.endDate > end) end = item.endDate;
      });
    }
    /**
     * Flattens the task data and maps it using the provided loopFlatMapChildren function.
     *
     * @param data - The task data to be flattened.
     * @param keyChildren - The key used to identify the children of each task.
     * @returns The flattened task data.
     */
    const flatTask = data.flatMap(item => loopFlatMapChildren({ item, keyChildren }));
    flatTask.forEach((item, index) => handleCollapse({ index, level: item.level, status: true }));
    setState(pre => ({
      ...pre,
      date: generateObjDate({ start, end, widthColumnDay, widthMonthYear, perRow }),
      flatTask,
    }));
  }, [data]);

  /**
   * A reference to the statusCollapse object.
   */
  const statusCollapse = useRef<any>({});
  /**
   * Handles the collapse behavior of a task in the Gantt chart.
   *
   * @param {Object} options - The options for collapsing a task.
   * @param {number} options.index - The index of the task.
   * @param {number} options.level - The level of the task.
   * @param {boolean} [options.status] - The status of the collapse. If not provided, it will toggle the collapse status.
   */
  const handleCollapse = ({ index, level, status }: { index: number; level: number; status?: boolean }) => {
    statusCollapse.current[index] = status ?? !statusCollapse.current[index];
    let isCheck = true;
    let currentLevel: number | undefined;

    const data = state.flatTask.map((item, trIndex) => {
      if (isCheck && trIndex > index) {
        if (item?.level !== undefined && item?.level > level) {
          if (currentLevel !== undefined && currentLevel === item.level && !statusCollapse.current[trIndex])
            currentLevel = undefined;
          else if (statusCollapse.current[trIndex] && currentLevel === undefined) currentLevel = item.level;
          item.hidden = statusCollapse.current[index] || (currentLevel !== undefined && currentLevel !== item.level);
        } else isCheck = false;
      }
      return item;
    });
    setState(pre => ({
      ...pre,
      flatTask: [...data],
    }));
  };

  /**
   * Handles the scroll event.
   *
   * @param e - The scroll event object.
   */
  const handleScroll = (e: any) => {
    ['left', 'right'].forEach(className => {
      const list = parentRef.current?.querySelectorAll(`.${className} .scrollbar`);
      if (list) {
        for (let i = 0, len = list.length; i < len; i++) {
          list[i].scrollTo({ top: e.target.scrollTop });
        }
      }

      const listHolder = parentRef.current?.querySelectorAll(`.${className} .border-table`);
      if (listHolder) {
        for (let i = 0, len = listHolder.length; i < len; i++) {
          listHolder[i].scrollTo({ top: e.target.scrollTop });
        }
      }
    });
  };

  /**
   * Handles the horizontal drag movement.
   *
   * @param {Object} options - The options for the drag movement.
   * @param {Object} options.delta - The delta values for the drag movement.
   * @param {Object} options.active - The active element during the drag movement.
   */
  const handleDragMoveHorizontal = ({ delta, active }) => {
    const left: any = parentRef.current?.querySelector(`.left`);
    const right: any = parentRef.current?.querySelector(`.right`);
    if (active.id === 'side') {
      if (dragStart) {
        dragStart = false;
        wLeft = parseFloat(left.clientWidth);
        wRight = parseFloat(right.clientWidth);
      }
      const p = delta.x;
      parentRef.current?.setAttribute(
        'style',
        `--left: ${((wLeft + p) / (wLeft + wRight)) * 100}%; --right: ${((wRight - p) / (wLeft + wRight)) * 100}%;`,
      );
    }
  };

  /**
   * Represents the left position of an element.
   */
  let wLeft = 0;
  /**
   * Represents the value of the right position in the Gantt chart.
   */
  let wRight = 0;
  /**
   * Indicates whether the drag operation has started.
   */
  let dragStart = true;

  return (
    <div ref={parentRef} className='c-gantt relative' style={{ '--left': '50%', '--right': '50%' }}>
      <div className='relative'>
        <DndContext
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={() => (dragStart = true)}
          onDragMove={handleDragMoveHorizontal}
        >
          <div className={'flex w-full gap-0.5'}>
            <div className={'left overflow-hidden'} style={{ flexBasis: 'var(--left)' }}>
              {state.flatTask.length > 0 && (
                <CDataTable
                  isVirtualized={true}
                  isExpanded={true}
                  isSearch={false}
                  onScroll={handleScroll}
                  style={{ maxHeight }}
                  onExpand={row =>
                    handleCollapse({
                      index: state.flatTask.findIndex(item => item.id === row.id),
                      level: row.level,
                    })
                  }
                  heightCell={widthColumnDay}
                  data={state.task}
                  columns={columns}
                  isPagination={false}
                />
              )}
            </div>
            <DraggableSide />
            <GanttRight
              handleScroll={handleScroll}
              maxHeight={maxHeight}
              state={state}
              perRow={perRow}
              widthColumnDay={widthColumnDay}
              event={event}
              cellRender={cellRender}
              setState={setState}
            />
          </div>
        </DndContext>
      </div>
    </div>
  );
};
/**
 * DraggableSide component.
 *
 * This component represents a draggable side element.
 * It provides functionality for resizing elements horizontally.
 *
 * @returns The DraggableSide component.
 */
const DraggableSide = () => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: 'side' });
  return (
    <div className={'h-auto w-1 cursor-ew-resize hover:bg-error'} ref={setNodeRef} {...listeners} {...attributes} />
  );
};
