import { createSlice, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

import type { IPaginationQuery } from '@/interfaces';
import { useAppDispatch, useTypedSelector } from '@/services';
import { RCurd, name } from './reducer';
import { RCurdType } from './reducer-type';
import { initialStateCrud, type StateCrud } from './state';

/**
 * Represents a slice for CRUD operations.
 *
 * @remarks
 * This slice is used to handle CRUD operations in the application.
 *
 * @public
 */
export const crudSlice = createSlice({
  name,
  initialState: initialStateCrud,
  reducers: {
    set: (state, action) => {
      Object.keys(action.payload).forEach(key => {
        state[key] = action.payload[key as keyof StateCrud];
      });
    },
    modify: (state, action) => {
      const data = state.result?.data ?? [];
      const index = data.findIndex(item => item[keyId] === action.payload[keyId]);
      if (index > -1) data[index] = action.payload;
      else data.unshift(action.payload);
      state.result = { ...state.result, data: data.filter(item => !item[keyIsDelete]) };
    },
    modifyType: (state, action) => {
      const data = state.resultType?.data ?? [];
      const index = data.findIndex(item => item[keyId] === action.payload[keyId]);
      if (index > -1) data[index] = action.payload;
      else data.unshift(action.payload);
      state.resultType = { ...state.resultType, data: data.filter(item => !item[keyIsDelete]) };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<StateCrud>) => {
    RCurd.get.reducer(builder);
    RCurd.getId.reducer(builder);
    RCurd.post.reducer(builder);
    RCurd.put.reducer(builder);
    RCurd.delete.reducer(builder);

    RCurdType.get.reducer(builder);
    RCurdType.getId.reducer(builder);
    RCurdType.post.reducer(builder);
    RCurdType.put.reducer(builder);
    RCurdType.delete.reducer(builder);
  },
});

/**
 * SCrud is a utility function that provides CRUD operations for a specific API endpoint.
 *
 * @template T - The type of data being handled by the CRUD operations.
 * @template Y - The type of data being handled by the CRUD operations.
 * @param {string} keyApi - The key representing the API endpoint.
 * @param {string} [keyApiType] - An optional second key representing the API endpoint.
 * @returns {Object} - An object containing various CRUD operations.
 */
const keyId = 'id';
const keyIsDelete = 'isDelete';
export const SCrud = <T, Y = object>(keyApi: string, keyApiType?: string) => {
  const dispatch = useAppDispatch();
  return {
    ...(useTypedSelector(state => state[name]) as StateCrud<T, Y>),
    set: (values: StateCrud<T>) => dispatch(crudSlice.actions.set(values as StateCrud)),
    reset: () => dispatch(crudSlice.actions.set(initialStateCrud)),
    modify: (values: T) => dispatch(crudSlice.actions.modify(values)),
    modifyType: (values: T) => dispatch(crudSlice.actions.modifyType(values)),

    get: (params: IPaginationQuery<T>, format?: (item: T, index: number) => void) =>
      dispatch(RCurd.get.action({ params: params as IPaginationQuery, keyApi, format })),
    getById: ({ id, params, data }: { id: string; params?: IPaginationQuery<T>; data: T }) =>
      dispatch(RCurd.getId.action({ id, params: params as IPaginationQuery, keyApi, data })),
    post: (values: T) => dispatch(RCurd.post.action({ values: values as StateCrud, keyApi })),
    put: (values: T) => dispatch(RCurd.put.action({ values: values as StateCrud, keyApi })),
    delete: (id: string) => dispatch(RCurd.delete.action({ id, keyApi })),

    getType: (params: IPaginationQuery<Y>) =>
      dispatch(RCurdType.get.action({ params: params as IPaginationQuery, keyApiType })),
    getByIdType: ({ id, params }: { id: string; params?: IPaginationQuery<Y> }) =>
      dispatch(RCurdType.getId.action({ id, params: params as IPaginationQuery, keyApiType })),
    postType: (values: Y) => dispatch(RCurdType.post.action({ values: values as StateCrud, keyApiType })),
    putType: (values: Y) => dispatch(RCurdType.put.action({ values: values as StateCrud, keyApiType })),
    deleteType: (id: string) => dispatch(RCurdType.delete.action({ id, keyApiType })),
  };
};
