import { EStatusState } from '@/enums';
import type { CurdState } from './reducer';
import type { CurdTypeState } from './reducer-type';

/**
 * Represents the state for CRUD operations with additional properties.
 *
 * @template T - The type of the object being manipulated.
 */
export interface StateCrud<T = object, Y = object> extends CurdState<T>, CurdTypeState<Y> {}

/**
 * Initial state for the CRUD service.
 */
export const initialStateCrud: StateCrud = {
  result: undefined,
  data: undefined,
  isLoading: false,
  isVisible: false,
  status: EStatusState.Idle,

  resultType: undefined,
  dataType: undefined,
  isLoadingType: false,
  isVisibleType: false,
  statusType: EStatusState.Idle,
};
