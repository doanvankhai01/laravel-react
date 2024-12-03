import classNames from 'classnames';
import { useRef, useState } from 'react';

import { EIcon } from '@/enums';
import { CSearch } from '../search';
import { CSvgIcon } from '../svg-icon';
import './index.less';
import type { Props } from './interface';
import { CSortable } from './sortable';

type TransferItem = {
  [key: string]: any;
};

export const CTransfer = <TData extends TransferItem>({
  className,
  top,
  titleTop,
  bottom = [],
  titleBottom,
  getValue = item => (item as any)?.value ?? '',
  getLabel = item => (item as any)?.label ?? '',
  onChange,
  keySelected = 'isSelected',
  isDisabled,
}: Props<TData>) => {
  const [state, setState] = useState<{
    top: TData[];
    filterTop: string;
    bottom: TData[];
    filterBottom: string;
  }>({
    top: top,
    filterTop: '',
    bottom: bottom,
    filterBottom: '',
  });
  const heightItem = 30;

  const handleMoveLast = (isFirst?: boolean) => {
    const noSelect = state.top.filter((item: TData) => !item[keySelected]);
    const selected = state.top.filter((item: TData) => item[keySelected]);
    const data = {
      ...state,
      top: [...(isFirst ? selected : []), ...noSelect, ...(!isFirst ? selected : [])],
    };
    setState(data);
    onChange?.({ top: data.top, bottom: data.bottom });
    handleScrollLast(isFirst);
  };
  const handleScrollLast = (isFirst?: boolean) => {
    const scroll = refTransfer.current?.querySelector('.scrollbar');
    const scrollTop = !isFirst ? scroll?.children[0].clientHeight : 0;

    scroll?.scrollTo({ top: scrollTop, behavior: 'smooth' });
    setTimeout(() => scroll?.scrollTo({ top: scrollTop }), 250);
  };
  const handleMoveNext = (isPrevious?: boolean) => {
    const selectedIndex: number[] = [];
    let firstIndex = -1;
    state.top.forEach((item: any, index) => {
      if (item[keySelected]) {
        selectedIndex.push(index);
        if (firstIndex === -1) firstIndex = index;
      }
    });
    let iFlag = -1;

    if (!isPrevious) {
      for (let i = selectedIndex.length - 1; i >= 0; i--) {
        const idxValue = selectedIndex[i];
        if (idxValue == state.top.length - 1 || idxValue == iFlag - 1) iFlag = idxValue;
        else {
          const tmp = state.top[idxValue];
          state.top[idxValue] = state.top[idxValue + 1];
          state.top[idxValue + 1] = tmp;
        }
      }
    } else {
      for (const idxValue of selectedIndex) {
        if (idxValue == 0 || idxValue == iFlag + 1) iFlag = idxValue;
        else {
          const tmp = state.top[idxValue];
          state.top[idxValue] = state.top[idxValue - 1];
          state.top[idxValue - 1] = tmp;
        }
      }
    }

    setState({ ...state, top: [...state.top] });
    onChange?.({ top: state.top, bottom: state.bottom });
    handleScrollNext({ index: firstIndex, isPrevious });
  };
  const handleScrollNext = ({ index, isPrevious }: { index: number; isPrevious?: boolean }) => {
    index += !isPrevious ? 1 : -1;
    const scroll = refTransfer.current?.querySelector('.scrollbar');
    const scrollTop = index * heightItem;

    if (
      scrollTop !== undefined &&
      scroll?.scrollTop !== undefined &&
      (scrollTop <= scroll?.scrollTop || scrollTop > scroll?.scrollTop + (isPrevious ? scroll?.clientHeight : 0))
    ) {
      scroll?.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  };

  const groupRight = () => (
    <div className='group-right'>
      <button
        className={classNames('arrow', {
          'cursor-not-allowed opacity-50': !state.top.some((item: any) => item[keySelected]) || isDisabled,
        })}
        onClick={() => handleMoveLast(true)}
      >
        <CSvgIcon name={EIcon.DoubleArrow} className='-rotate-180' size={20} />
      </button>
      <button
        className={classNames('arrow', {
          'cursor-not-allowed opacity-50': !state.top.some((item: any) => item[keySelected]) || isDisabled,
        })}
        onClick={() => handleMoveNext(true)}
      >
        <CSvgIcon name={EIcon.Arrow} className='-rotate-180' size={20} />
      </button>
      <button
        className={classNames('arrow', {
          'cursor-not-allowed opacity-50': !state.top.some((item: any) => item[keySelected]) || isDisabled,
        })}
        onClick={() => handleMoveNext()}
      >
        <CSvgIcon name={EIcon.Arrow} size={20} />
      </button>
      <button
        className={classNames('arrow', {
          'cursor-not-allowed opacity-50': !state.top.some((item: any) => item[keySelected]) || isDisabled,
        })}
        onClick={() => handleMoveLast()}
      >
        <CSvgIcon name={EIcon.DoubleArrow} size={20} />
      </button>
    </div>
  );

  const handleMoveBottom = (isTop?: boolean) => {
    const noSelect = (!isTop ? state.top : state.bottom).filter((item: any) => !item[keySelected]);
    const selected = (!isTop ? state.top : state.bottom).filter((item: any) => item[keySelected]);

    const data = {
      ...state,
      top: !isTop ? noSelect : [...state.top, ...selected],
      bottom: !isTop ? [...selected, ...state.bottom] : noSelect,
    };
    setState(data);
    onChange?.({ top: data.top, bottom: data.bottom });
    if (isTop) handleScrollLast();
  };
  const groupBottom = () => (
    <div className='group-bottom'>
      <button
        className={classNames('arrow', {
          'cursor-not-allowed opacity-50': !state.bottom.some((item: any) => item[keySelected]) || isDisabled,
        })}
        onClick={() => handleMoveBottom(true)}
      >
        <CSvgIcon name={EIcon.Arrow} className='-rotate-180' size={20} />
      </button>
      <button
        className={classNames('arrow', {
          'cursor-not-allowed opacity-50': !state.top.some((item: any) => item[keySelected]) || isDisabled,
        })}
        onClick={() => handleMoveBottom()}
      >
        <CSvgIcon name={EIcon.Arrow} className='' size={20} />
      </button>
    </div>
  );

  const refTransfer = useRef<HTMLDivElement>(null);
  return (
    <div className={classNames('c-transfer', className)}>
      <h3>{titleTop}</h3>
      <CSearch onChange={filterTop => setState(prev => ({ ...prev, filterTop: filterTop ?? '' }))} />
      <div className='relative' ref={refTransfer}>
        <CSortable<TData>
          isDisabled={() => !!isDisabled}
          handle
          items={state.top}
          filter={item => getLabel(item)?.toUpperCase()?.includes(state.filterTop.toUpperCase())}
          getValue={getValue}
          getLabel={getLabel}
          onChange={nextItems => {
            setState(prev => ({ ...prev, top: nextItems }));
            onChange?.({ top: nextItems, bottom: state.bottom });
          }}
          onClick={id => {
            const index = state.top.findIndex(item => getValue(item) === id);
            (state.top[index][keySelected] as boolean) = !state.top[index][keySelected];
            setState({ ...state });
          }}
          getClassNames={(item: any) => classNames({ active: item[keySelected] })}
        />

        {groupRight()}
      </div>
      {groupBottom()}
      <h3>{titleBottom}</h3>
      <CSearch onChange={filterBottom => setState(prev => ({ ...prev, filterBottom: filterBottom ?? '' }))} />
      <CSortable<TData>
        isDisabled={() => !!isDisabled}
        handle
        items={state.bottom}
        filter={item => getLabel(item)?.toUpperCase()?.includes(state.filterBottom.toUpperCase())}
        getValue={getValue}
        getLabel={getLabel}
        onChange={nextItems => {
          setState(prev => ({ ...prev, bottom: nextItems }));
          onChange?.({ bottom: nextItems, top: state.top });
        }}
        onClick={id => {
          const index = state.bottom.findIndex(item => getValue(item) === id);
          (state.bottom[index][keySelected] as boolean) = !state.bottom[index][keySelected];
          setState({ ...state });
        }}
        getClassNames={(item: any) => classNames({ active: item[keySelected] })}
      />
    </div>
  );
};
