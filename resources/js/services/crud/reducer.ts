import { createAsyncThunk, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { EStatusState } from '@/enums';
import type { IPaginationQuery, IResponses } from '@/interfaces';
import { API, C_API, KEY_DATA } from '@/utils';
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
          state.isLoading = true;
          state.status = EStatusState.Idle;
          this.pending(state, action);
        })

        .addCase(this.action.fulfilled, (state, action) => {
          state.isLoading = false;
          this.fulfilled(state, action);
        })

        .addCase(this.action.rejected, (state, action) => {
          state.isLoading = false;
          this.rejected(state, action);
        });
    };
  }
}

/**
 * Represents a class for performing a GET request.
 * @class
 * @extends RReducer
 */
class Get extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(
      name + '/get',
      async ({
        params,
        keyApi,
        format,
      }: {
        params: IPaginationQuery;
        keyApi: string;
        format: (item: any, index: number) => void;
      }) => {
        const { data = [], isLatest } = JSON.parse(localStorage.getItem(KEY_DATA[keyApi]) ?? '{}');
        params.latestUpdated = data?.[0]?.updatedAt;
        if (isLatest) return { data: data.filter(item => !item.isDelete) };

        const result = await API.get<any>({ url: `${C_API[keyApi]}`, params });
        const newData = format ? result.data.map(format) : result.data;
        result.data = [...newData, ...data];
        localStorage.setItem(KEY_DATA[keyApi], JSON.stringify({ data: result.data, isLatest: true }));
        return { data: result.data.filter(item => !item.isDelete) };
      },
    );
    this.pending = (state, action) => {
      const queryParams = JSON.parse(JSON.stringify(action.meta.arg));
      state.result = {
        data: JSON.parse(localStorage.getItem(KEY_DATA[queryParams.keyApi]) ?? '[]').data.filter(
          item => !item.isDelete,
        ),
      };
    };
    this.fulfilled = (state, action) => {
      state.result = action.payload;
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
      name + '/getById',
      async ({ data }: { id: string; params?: IPaginationQuery; keyApi: string; data: any }) => {
        return data;
      },
    );
    this.fulfilled = (state, action) => {
      if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) state.data = action.payload;
      state.isVisible = true;
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
    this.action = createAsyncThunk(name + '/post', async ({ values, keyApi }: { values: any; keyApi: string }) => {
      const { data } = await API.post({ url: `${C_API[keyApi]}`, values });
      return data;
    });
    this.pending = (state, action) => {
      state.data = action.meta.arg.values;
    };
    this.fulfilled = state => {
      state.isVisible = false;
      state.status = EStatusState.IsFulfilled;
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
      name + '/put',
      async ({ values: { id, ...values }, keyApi }: { values: any; keyApi: string }) => {
        const { data } = await API.put({ url: `${C_API[keyApi]}/${id}`, values });
        return data;
      },
    );
    this.pending = (state, action) => {
      state.data = action.meta.arg.values;
    };
    this.fulfilled = state => {
      state.isVisible = false;
      state.status = EStatusState.IsFulfilled;
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
    this.action = createAsyncThunk(name + '/delete', async ({ id, keyApi }: { id: string; keyApi: string }) => {
      const { data } = await API.delete({ url: `${C_API[keyApi]}/${id}` });
      return data;
    });
    this.fulfilled = state => {
      state.status = EStatusState.IsFulfilled;
    };
  }
}

export const name = 'CURD';
export const RCurd = {
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
export interface CurdState<T> {
  isLoading?: boolean;
  status?: EStatusState;
  result?: IResponses<T[]>;
  data?: T;
  isVisible?: boolean;
}
