import { createAsyncThunk, type ActionReducerMapBuilder } from '@reduxjs/toolkit';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { EStatusState } from '@/enums';
import type { IMUser, IResetPassword } from '@/interfaces/model';
import { API, C_API, KEY_DATA, KEY_REFRESH_TOKEN, KEY_TOKEN, KEY_USER, LINK_API } from '@/utils';
import type { StateGlobal } from './state';
declare global {
  interface Window {
    Echo?: Echo<any>;
    Pusher: typeof Pusher;
  }
}

/**
 * RReducer class represents a reducer for global state.
 * It handles pending, fulfilled, and rejected actions.
 */
class RReducer {
  public action;
  public reducer;
  public pending = (_, __) => {};
  public fulfilled = (_, __) => {};
  public rejected = (_, __) => {};
  public constructor() {
    this.reducer = (builder: ActionReducerMapBuilder<StateGlobal>) => {
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
 * Represents a class that handles the retrieval of a user profile.
 */
class GetProfile extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/profile', async () => {
      const { data } = await API.get<IMUser>({ url: `${C_API[name]}/profile` });
      return data || {};
    });

    this.fulfilled = (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.data = action.payload;
        if (!window.Echo && state.data) {
          window.Pusher = Pusher;

          window.Echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
            wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: LINK_API + '/broadcasting/auth',
            auth: {
              headers: {
                authorization: localStorage.getItem(KEY_TOKEN) ? 'Bearer ' + localStorage.getItem(KEY_TOKEN) : '',
                'Accept-Language': localStorage.getItem('i18nextLng') ?? '',
              },
            },
          });

          window.Echo.private('users.' + state.data?.id).listen('DataChanged', server => {
            const local = JSON.parse(localStorage.getItem(KEY_DATA[server.name]) ?? '{}');
            if (!local.data) local.data = [];
            local.data = local.data.filter(item => item.id !== server.data.id);
            localStorage.setItem(
              KEY_DATA[server.name],
              JSON.stringify({ data: [server.data, ...local.data], isLatest: true }),
            );
          });
        }
        localStorage.setItem(KEY_USER, JSON.stringify(action.payload));
        state.status = EStatusState.Idle;
      }
    };
  }
}
/**
 * Represents a class for putting a user profile.
 */
class PutProfile extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/putProfile', async (values: IMUser) => {
      const { data } = await API.put<{ user: IMUser; token: string; refreshToken: string }>({
        url: `${C_API[name]}/profile`,
        values,
      });
      if (data) {
        localStorage.setItem(KEY_TOKEN, data?.token);
        localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
      }
      return data!.user;
    });

    this.pending = (state, action) => {
      state.data = { ...JSON.parse(JSON.stringify(state.data)), ...JSON.parse(JSON.stringify(action.meta.arg)) };
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        localStorage.setItem(KEY_USER, JSON.stringify(action.payload));
        state.user = action.payload;
        state.status = EStatusState.IsFulfilled;
      }
    };
  }
}
/**
 * Represents a class for handling login functionality.
 * @class
 */
class PostLogin extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/login', async (values: { password: string; username: string }) => {
      const { data } = await API.post<{ user: IMUser; token: string; refreshToken: string }>({
        url: `${C_API[name]}/login`,
        values,
        params: { include: 'role' },
      });
      if (data) {
        localStorage.setItem(KEY_TOKEN, data?.token);
        localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
      }
      return data!.user;
    });

    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        localStorage.setItem(KEY_USER, JSON.stringify(action.payload));
        state.user = action.payload;
        state.data = undefined;
        state.status = EStatusState.IsFulfilled;
      }
    };
  }
}
/**
 * Represents a class for patching forgotten passwords.
 */
class PostForgottenPassword extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/forgotten-password', async (values: { email: string }) => {
      await API.post({ url: `${C_API[name]}/forgotten-password`, values });
      return true;
    });

    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = state => {
      state.status = EStatusState.IsFulfilled;
    };
  }
}
/**
 * Represents a class for handling OTP confirmation.
 */
class PostOtpConfirmation extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/otp-confirmation', async (values: { email: string; otp: string }) => {
      await API.post({ url: `${C_API[name]}/otp-confirmation`, values });
      return true;
    });

    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = (state, action) => {
      if (action.payload) {
        state.status = EStatusState.IsFulfilled;
      }
    };
  }
}
/**
 * Represents a class for resetting password using patch method.
 */
class PostResetPassword extends RReducer {
  public constructor(name: string) {
    super();
    this.action = createAsyncThunk(name + '/reset-password', async (values: IResetPassword) => {
      await API.post({ url: `${C_API[name]}/reset-password`, values });
      return true;
    });

    this.pending = (state, action) => {
      state.data = action.meta.arg;
    };
    this.fulfilled = state => {
      state.data = {};
      state.status = EStatusState.IsFulfilled;
    };
  }
}

export const name = 'Auth';
/**
 * RGlobal is an object that contains various service methods for global functionality.
 * Each property represents a specific service method.
 */
export const RGlobal = {
  getProfile: new GetProfile(name),
  putProfile: new PutProfile(name),
  postLogin: new PostLogin(name),
  postForgottenPassword: new PostForgottenPassword(name),
  postOtpConfirmation: new PostOtpConfirmation(name),
  postResetPassword: new PostResetPassword(name),
};
/**
 * Represents the global state of the application.
 */
export interface GlobalState {
  isLoading?: boolean;
  user?: IMUser;
  data?: IResetPassword & IMUser;
  status?: EStatusState;
}
