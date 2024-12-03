import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DropAnimation,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { CRowVirtualizer } from '../row-virtualizer';
import './index.less';
import type { Props, SortableItemProps } from './interface';
import { Item } from './item';

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
};

export const CSortable = <TData,>({
  activationConstraint,
  animateLayoutChanges,
  adjustScale = false,
  collisionDetection = closestCenter,
  coordinateGetter = sortableKeyboardCoordinates,
  dropAnimation = dropAnimationConfig,
  getNewIndex,
  handle = false,
  items: initialItems,
  isDisabled = () => false,
  measuring,
  modifiers,
  getValue = item => item,
  getLabel = item => item,
  reorderItems = arrayMove,
  strategy = verticalListSortingStrategy,
  useDragOverlay = true,
  onClick = () => {},
  getClassNames = () => '',
  onChange,
  filter = item => !!item,
}: Props<TData>) => {
  const [items, setItems] = useState<any[]>(initialItems);
  useEffect(() => {
    if (JSON.stringify(initialItems) !== JSON.stringify(items)) setItems(initialItems);
  }, [initialItems]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint }),
    useSensor(TouchSensor, { activationConstraint }),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
      coordinateGetter,
    }),
  );
  const isFirstAnnouncement = useRef(true);
  const getIndex = (id: UniqueIdentifier) => items.findIndex(item => getValue(item) === id);
  const activeIndex = activeId !== null ? getIndex(activeId) : -1;

  useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({ active }) => {
        if (!active) return;
        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        setActiveId(null);

        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            const nextItems = reorderItems(items, activeIndex, overIndex);
            setItems(nextItems);
            onChange?.(nextItems);
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      measuring={measuring}
      modifiers={modifiers}
    >
      <SortableContext items={items.map(getValue)} strategy={strategy}>
        <CRowVirtualizer
          data={items.filter(filter)}
          render={(value, index) => (
            <SortableItem
              value={getLabel(value)}
              key={getValue(value)}
              id={getValue(value)}
              handle={handle}
              disabled={isDisabled(getValue(value))}
              index={index}
              animateLayoutChanges={animateLayoutChanges}
              useDragOverlay={useDragOverlay}
              getNewIndex={getNewIndex}
              onClick={!isDisabled(getValue(value)) ? onClick : undefined}
              getClassNames={() => getClassNames(value)}
            />
          )}
        />
      </SortableContext>
      {useDragOverlay &&
        createPortal(
          <DragOverlay style={{ zIndex: 999999 }} adjustScale={adjustScale} dropAnimation={dropAnimation}>
            {activeId && (
              <Item
                value={getLabel(items[activeIndex])}
                handle={handle}
                getClassNames={() => getClassNames(items[activeIndex])}
                dragOverlay
              />
            )}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
};

export const SortableItem = ({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  id,
  index,
  useDragOverlay,
  value,
  onClick,
  getClassNames,
}: SortableItemProps) => {
  const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  });

  return (
    <Item
      ref={setNodeRef}
      onClick={() => onClick?.(id)}
      value={value}
      disabled={disabled}
      dragging={isDragging}
      handle={handle}
      getClassNames={getClassNames}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      transform={transform}
      transition={transition}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  );
};
