import { createAsyncThunk, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { EStatusState } from '@/enums';
import type { IPaginationQuery, IResponses } from '@/interfaces';
import { API, C_API, KEY_DATA } from '@/utils';
import { name } from './reducer';
import type { StateCrud } from './state';

/**
 * RReducer class represents a reducer for handling actions in the application.
 * It provides methods for handling pending, fulfilled, and rejected actions.
 */
class RReducer {
  public action;
  public reducer;
  public pending = (_, __) => {};
  public fulfilled = (_, __) => {};
  public rejected = (_, __) => {};
  public constructor() {
    this.reducer = (builder: ActionReducerMapBuilder<StateCrud>) => {
      builder
        .addCase(this.action.pending, (state, action) => {
          state.isLoadingType = true;
          state.statusType = EStatusState.Idle;
          this.pending(state, action);
        })

        .addCase(this.action.fulfilled, (state, action) => {
          state.isLoadingType = false;
          this.fulfilled(state, action);
        })

        .addCase(this.action.rejected, (state, action) => {
          state.isLoadingType = false;
          this.rejected(state, action);
        });
    };
  }
}

/**
 * Represents a class for performing a GET request.
 * @class
 */
class Get extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/getType',
      async ({ params, keyApiType }: { params: IPaginationQuery; keyApiType: string }) => {
        const { data = [], isLatest } = JSON.parse(localStorage.getItem(KEY_DATA[keyApiType]) ?? '{}');
        params.latestUpdated = data?.[0]?.updatedAt;
        if (isLatest) return { data };

        const result = await API.get<any>({ url: `${C_API[keyApiType]}`, params });
        result.data = [...result.data, ...data];
        localStorage.setItem(KEY_DATA[keyApiType], JSON.stringify({ data: result.data, isLatest: true }));
        return { data: result.data.filter(item => !item.isDelete) };
      },
    );
    this.pending = (state, action) => {
      const queryParams = JSON.parse(JSON.stringify(action.meta.arg));
      state.resultType = {
        data: JSON.parse(localStorage.getItem(KEY_DATA[queryParams.keyApiType]) ?? '{}').data.filter(
          item => !item.isDelete,
        ),
      };
    };
    this.fulfilled = (state, action) => {
      state.resultType = action.payload;
    };
  }
}

/**
 * Represents a class that handles the retrieval of data by ID.
 * @class
 * @extends RReducer
 */
class GetId extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/getByIdType',
      async ({ id, params, keyApiType }: { id: string; params?: IPaginationQuery; keyApiType: string }) => {
        const { data } = await API.get({ url: `${C_API[keyApiType]}/${id}`, params });
        return data;
      },
    );
    this.fulfilled = (state, action) => {
      if (JSON.stringify(state.dataType) !== JSON.stringify(action.payload)) state.dataType = action.payload;
      state.isVisibleType = true;
    };
  }
}

/**
 * Represents a Post reducer class.
 * @class
 * @extends RReducer
 */
class Post extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/postType',
      async ({ values, keyApiType }: { values: any; keyApiType: string }) => {
        const { data } = await API.post({ url: `${C_API[keyApiType]}`, values });
        return data;
      },
    );
    this.pending = (state, action) => {
      state.dataType = action.meta.arg.values;
    };
    this.fulfilled = (state, action) => {
      if (JSON.stringify(state.dataType) !== JSON.stringify(action.payload)) state.dataType = action.payload;
      state.isVisibleType = false;
      state.statusType = EStatusState.IsFulfilled;
    };
  }
}

/**
 * Represents a class for handling the PUT operation in a reducer.
 * @class
 * @extends RReducer
 */
class Put extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/putType',
      async ({ values: { id, ...values }, keyApiType }: { values: any; keyApiType: string }) => {
        const { data } = await API.put({ url: `${C_API[keyApiType]}/${id}`, values });
        return data;
      },
    );
    this.pending = (state, action) => {
      state.dataType = action.meta.arg.values;
    };
    this.fulfilled = (state, action) => {
      if (JSON.stringify(state.dataType) !== JSON.stringify(action.payload)) state.dataType = action.payload;
      state.isVisibleType = false;
      state.statusType = EStatusState.IsFulfilled;
    };
  }
}

/**
 * Represents a class for deleting data using a reducer.
 * @class
 * @extends RReducer
 */
class Delete extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/deleteType',
      async ({ id, keyApiType }: { id: string; keyApiType: string }) => {
        const { data } = await API.delete({ url: `${C_API[keyApiType]}/${id}` });
        return data;
      },
    );
    this.fulfilled = state => {
      state.statusType = EStatusState.IsFulfilled;
    };
  }
}
export const RCurdType = {
  get: new Get(name),
  getId: new GetId(name),
  post: new Post(name),
  put: new Put(name),
  delete: new Delete(name),
};

/**
 * Represents the state of a CRUD operation.
 * @template T - The type of data being operated on.
 */
export interface CurdTypeState<T> {
  isLoadingType?: boolean;
  statusType?: EStatusState;
  resultType?: IResponses<T[]>;
  dataType?: T;
  isVisibleType?: boolean;
}
