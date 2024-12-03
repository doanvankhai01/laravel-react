import classNames from 'classnames';
import React, { useEffect } from 'react';
import type { PropsItem } from './interface';

export const Item = React.memo(
  React.forwardRef<HTMLDivElement, PropsItem>(
    (
      {
        value,
        handle,
        dragOverlay,
        listeners,
        transition,
        transform,
        disabled,
        dragging,
        handleProps,
        onClick,
        getClassNames,
      },
      ref,
    ) => {
      useEffect(() => {
        if (!dragOverlay) return;
        document.body.style.cursor = 'grabbing';
        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      return (
        <div
          className={'c-sortable'}
          style={
            {
              transition: [transition].filter(Boolean).join(', '),
              '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
              '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
              '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
              '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
              '--scale': dragOverlay ? `1.05` : undefined,
            } as React.CSSProperties
          }
          ref={ref}
        >
          <button
            onClick={onClick}
            className={classNames(
              'item',
              getClassNames?.(value),
              handle && 'withHandle',
              dragOverlay && 'drag-overlay',
              disabled && 'disabled',
              dragging && 'dragging',
            )}
            {...(!handle && listeners)}
            tabIndex={!handle ? 0 : undefined}
          >
            {value}
            {handle && (
              <div className='action'>
                <svg {...handleProps} {...listeners} viewBox='0 0 20 20' width='12'>
                  <path d='M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z'></path>
                </svg>
              </div>
            )}
          </button>
        </div>
      );
    },
  ),
);
