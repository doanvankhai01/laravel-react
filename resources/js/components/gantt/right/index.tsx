import { CGridVirtualizer } from '@/components/grid-virtualizer';
import type { Dayjs } from 'dayjs';
import { GanttRightLayer } from './layer';

/**
 * Renders the right section of the Gantt chart.
 *
 * @param widthColumnDay - The width of each column representing a day.
 * @param perRow - The number of days displayed per row.
 * @param state - The temporary data object containing date information.
 * @param event - The event object.
 * @param handleScroll - The scroll event handler.
 * @param cellRender - The function to render custom cells.
 * @returns The JSX element representing the right section of the Gantt chart.
 */
export const GanttRight = ({ widthColumnDay, perRow, state, event, cellRender, maxHeight, handleScroll, setState }) => {
  /**
   * Generates a column configuration object for the Gantt chart.
   *
   * @param year - The year of the column.
   * @param day - The day of the column.
   * @param index - The index of the column.
   * @returns The column configuration object.
   */
  const column = ({ year, day, index }) => ({
    accessorKey: `${year}-${day.format('MM')}-${day.format('DD')}`,
    header: day.format('DD'),
    size: widthColumnDay,
    cell: cellRender
      ? ({ row }) =>
          cellRender({
            row: row.original,
            iRow: row.index,
            kRow: row.id,
            column: {
              year,
              month: day.format('MM'),
              day: day.format('DD'),
              date: `${year}-${day.format('MM')}-${day.format('DD')}`,
            },
            iColumn: index,
            kColumn: `${year}-${day.format('MM')}-${day.format('DD')}`,
            setState,
          })
      : undefined,
    meta: {
      onCell: () => ({
        className: day.day() === 0 || day.day() === 6 ? 'weekend' : '',
      }),
    },
  });

  /**
   * Generates an array of objects representing days, months, and years.
   * Each object in the array contains an id, header, and columns.
   * The id is a string in the format "year-month".
   * The header is a string representing the month and year.
   * The columns is an array of objects representing individual days within the month.
   * Each column object contains information about the year, day, and index.
   *
   * @returns {Array} An array of objects representing days, months, and years.
   */
  const arrayDay = Object.keys(state.date.obj).flatMap(year =>
    Object.keys(state.date.obj[year]).map(month => ({
      id: `${year}-${month}`,
      header: `${state.date.obj[year][month][0].format('MMMM')} ${year}`,
      columns: state.date.obj[year][month].map((day: Dayjs, index) => column({ year, day, index })),
    })),
  );

  return (
    <div className={'right relative overflow-hidden bg-base-100'} style={{ flexBasis: '50%' }}>
      {arrayDay.length > 0 && (
        <CGridVirtualizer
          isVirtualized={true}
          heightCell={widthColumnDay}
          data={state.flatTask.filter(item => !item.hidden)}
          columns={arrayDay}
          firstItem={
            !cellRender && (
              <GanttRightLayer widthColumnDay={widthColumnDay} state={state} event={event} perRow={perRow} />
            )
          }
          widthCell={widthColumnDay}
          onScroll={handleScroll}
          style={{ maxHeight }}
          className='border-table scrollbar'
          isResizing={false}
          isPagination={false}
        />
      )}
    </div>
  );
};
