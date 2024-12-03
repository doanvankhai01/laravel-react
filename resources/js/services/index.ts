import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import { crudSlice, globalSlice } from './';
/**
 * Sets up the store for the application.
 * @returns The configured store.
 */
const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};
/**
 * Custom hook that returns the app dispatch function.
 * @returns The app dispatch function.
 */
const useAppDispatch = () => useDispatch<ReturnType<typeof setupStore>['dispatch']>();
/**
 * Custom hook that provides type-safe access to the Redux store state.
 *
 * @template T - The type of the Redux store state.
 * @param {T} state - The Redux store state.
 * @returns {T} - The type-safe Redux store state.
 */
const useTypedSelector: TypedUseSelectorHook<ReturnType<typeof rootReducer>> = useSelector;
export { setupStore, useAppDispatch, useTypedSelector };

export * from './crud';
export * from './global';
/**
 * Combines multiple reducers into a single root reducer.
 *
 * @param reducers - An object containing the reducers to be combined.
 * @returns The combined root reducer.
 */
const rootReducer = combineReducers({
  [globalSlice.name]: globalSlice.reducer,
  [crudSlice.name]: crudSlice.reducer,
});
