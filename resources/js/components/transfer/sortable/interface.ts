import type {
  CollisionDetection,
  DraggableSyntheticListeners,
  DropAnimation,
  KeyboardCoordinateGetter,
  MeasuringConfiguration,
  Modifiers,
  PointerActivationConstraint,
  UniqueIdentifier,
} from '@dnd-kit/core';
import type { AnimateLayoutChanges, arrayMove, NewIndexGetter, SortingStrategy } from '@dnd-kit/sortable';
import type { Transform } from '@dnd-kit/utilities';

export interface Props<TData> {
  activationConstraint?: PointerActivationConstraint;
  animateLayoutChanges?: AnimateLayoutChanges;
  adjustScale?: boolean;
  collisionDetection?: CollisionDetection;
  coordinateGetter?: KeyboardCoordinateGetter;
  dropAnimation?: DropAnimation | null;
  getNewIndex?: NewIndexGetter;
  handle?: boolean;
  items: TData[];
  measuring?: MeasuringConfiguration;
  modifiers?: Modifiers;
  getValue?(item: TData): any;
  getLabel?(item: TData): any;
  reorderItems?: typeof arrayMove;
  strategy?: SortingStrategy;
  useDragOverlay?: boolean;
  isDisabled?(id: UniqueIdentifier): boolean;
  onClick?(id: string): void;
  getClassNames?(item: TData): string;
  onChange?(items: TData[]): void;
  filter?: (item: TData) => boolean;
}

export interface PropsItem {
  value: React.ReactNode;
  handle?: boolean;
  dragOverlay?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  transition?: string | null;
  disabled?: boolean;
  dragging?: boolean;
  handleProps?: any;
  onClick?(item: any): void;
  getClassNames?(item: any): string;
}
export interface SortableItemProps {
  animateLayoutChanges?: AnimateLayoutChanges;
  disabled?: boolean;
  getNewIndex?: NewIndexGetter;
  id: UniqueIdentifier;
  index: number;
  handle: boolean;
  useDragOverlay?: boolean;
  value: React.ReactNode;
  onClick?(item: any): void;
  getClassNames?(item: any): string;
}
