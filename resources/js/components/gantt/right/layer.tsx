import classNames from 'classnames';
import { useRef } from 'react';

/**
 * Renders the right layer of the Gantt chart.
 *
 * @param widthColumnDay - The width of each column representing a day.
 * @param state - The temporary data used for rendering.
 * @param event - The array of events to be rendered.
 * @param perRow - The number of rows per column.
 *
 * @returns The JSX element representing the right layer of the Gantt chart.
 */
export const GanttRightLayer = ({ widthColumnDay, state, event, perRow }) => {
  const renderEvent = () =>
    event.map((item, index) => {
      if (item.endDate)
        return (
          <div
            key={'event' + index}
            className={'absolute flex h-full items-center justify-center bg-base-300 text-base-content'}
            style={{
              width: (item.endDate.diff(item.startDate, 'day') + 1) * (widthColumnDay / perRow) + 'px',
              left: item.startDate.diff(state.dateStart, 'day') * (widthColumnDay / perRow) + 'px',
            }}
          >
            <div
              className='rotate-90 whitespace-nowrap text-center'
              style={{ marginTop: -item.name.length * 6 + 'px' }}
            >
              {item.name}
            </div>
          </div>
        );
      else
        return (
          <div
            key={'event' + index}
            className={'absolute flex h-full items-center justify-center border-l border-dashed border-error'}
            style={{
              left: item.startDate.diff(state.dateStart, 'day') * (widthColumnDay / perRow) + 'px',
            }}
          >
            <div className='rounded-r-xl bg-error px-2 py-1 text-error-content'>{item.name}</div>
          </div>
        );
    });
  /**
   * Represents the index of the task.
   */
  const indexTask = useRef(-1);
  /**
   * Renders the progress of an item in the Gantt chart.
   *
   * @param item - The item to render the progress for.
   * @param index - The index of the item in the list.
   * @returns The JSX element representing the progress of the item.
   */
  const renderProgress = (item: any, index: number) => {
    if (index === 0) indexTask.current = -1;
    if (item.hidden) return;
    indexTask.current += 1;
    const startTop = indexTask.current * widthColumnDay + 4;
    const startLeft = item.startDate.diff(state.dateStart, 'day') * (widthColumnDay / perRow);
    return item.endDate && item.percent ? (
      <div
        key={index}
        className={'absolute'}
        style={{
          top: startTop + 'px',
          left: startLeft + 'px',
        }}
      >
        <div
          className={classNames('z-10 overflow-hidden', {
            'bg-base-200': item?.children,
            'rounded-md bg-primary': !item?.children,
          })}
          style={{
            width: (item.endDate.diff(item.startDate, 'day') + 1) * (widthColumnDay / perRow) + 'px',
          }}
        >
          <div
            className={classNames('h-4 text-center text-xs text-base-content', {
              'bg-base-content/50': item?.children,
              'bg-primary': !item?.children,
            })}
            style={{ width: item.percent + '%' }}
          ></div>
        </div>
      </div>
    ) : (
      <div
        key={index}
        className={'absolute'}
        style={{
          top: startTop,
          left: startLeft + (item.endDate || index === 0 ? 0 : widthColumnDay / perRow) + 'px',
        }}
      >
        <div className={'absolute -left-1 top-1 z-10 size-3 rotate-45 bg-black'}></div>
      </div>
    );
  };
  /**
   * Renders an SVG element based on the provided item and index.
   *
   * @param item - The item to render the SVG for.
   * @param i - The index of the item.
   * @returns An array of rendered SVG elements.
   */
  const renderSvg = (item: any, i: number) => {
    if (item.success) {
      const endDate = item.endDate ?? item.startDate.add(i === 0 ? 0 : 1, 'day');
      const startTop = i * widthColumnDay + 4 + 8;
      const startLeft = (endDate.diff(state.dateStart, 'day') + perRow / 10) * (widthColumnDay / perRow);
      return item.success.split(',').map((id, index) => {
        const listData = state.flatTask.filter(item => !item.hidden && item.id === id);
        if (listData.length) {
          const data = listData[0];
          const endTop =
            state.flatTask.filter(item => !item.hidden).indexOf(data) * widthColumnDay + (data.endDate ? 4 : 7);
          const endLeft =
            (data.startDate.diff(state.dateStart, 'day') + (data.endDate ? 0 : 1) + perRow / 8) *
              (widthColumnDay / perRow) +
            (data.endDate || data.startDate.diff(endDate) === 0 ? 3 : -9);

          return renderRow({
            key: i + '' + index,
            endDate,
            startDate: data.startDate,
            startLeft,
            startTop,
            endLeft,
            endTop,
            item,
          });
        }
      });
    }
  };
  /**
   * Renders a row in the Gantt chart layer.
   *
   * @param key - The unique key for the row.
   * @param endDate - The end date of the row.
   * @param startDate - The start date of the row.
   * @param startLeft - The left position of the row's start point.
   * @param startTop - The top position of the row's start point.
   * @param endLeft - The left position of the row's end point.
   * @param endTop - The top position of the row's end point.
   * @param item - The item associated with the row.
   */
  const renderRow = ({ key, endDate, startDate, startLeft, startTop, endLeft, endTop, item }: any) => (
    <g key={key}>
      <path
        d={
          endDate.diff(startDate, 'day') > 1
            ? `M ${startLeft - 1} ${startTop} L ${startLeft + widthColumnDay / perRow} ${startTop} L ${
                startLeft + widthColumnDay / perRow
              } ${startTop + 10} L ${endLeft} ${startTop + 10} L ${endLeft} ${endTop} `
            : `M ${startLeft - 1} ${startTop} L ${endLeft} ${startTop} L ${endLeft} ${endTop}`
        }
        fill='transparent'
        stroke={!item.endDate ? 'black' : '#2563eb'}
        strokeWidth={1}
        aria-label={item.name}
        tabIndex={-1}
      ></path>
      <path
        d={`M ${endLeft + 4.2} ${endTop - 4.5} L ${endLeft - 4.5} ${endTop - 4.5} L ${endLeft + 0.2} ${endTop} Z`}
        aria-label={item.name}
        fill={!item.endDate ? 'black' : '#2563eb'}
      ></path>
    </g>
  );
  return (
    <>
      <div
        className='event absolute left-0 top-[41px] flex h-[calc(100%-3rem)]'
        style={{ width: state.date.total * widthColumnDay + 'px' }}
      >
        {renderEvent()}
      </div>
      <svg
        className={'absolute left-0 top-[41px]'}
        style={{
          width: state.date.total * widthColumnDay + 'px',
          height: state.flatTask.filter(item => !item.hidden).length * widthColumnDay + 'px',
        }}
      >
        {state.flatTask.filter(item => !item.hidden).map((item, i) => renderSvg(item, i))}
      </svg>
      <div
        className='task relative left-0 top-[41px] z-10 flex'
        style={{ width: state.date.total * widthColumnDay + 'px' }}
      >
        {state.flatTask.map(renderProgress)}
      </div>
    </>
  );
};
