import queryString from 'query-string';

import { message } from '@/app';
import type { IResponses } from '@/interfaces';
import { C_API, KEY_REFRESH_TOKEN, KEY_TOKEN, LINK, LINK_API } from '@/utils';

/**
 * API object for making HTTP requests.
 *
 * @remarks
 * This object provides methods for making GET, POST, PATCH, PUT, and DELETE requests.
 * It also includes a method for initializing the request configuration.
 */
export const API = {
  init: () =>
    ({
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: localStorage.getItem(KEY_TOKEN) ? 'Bearer ' + localStorage.getItem(KEY_TOKEN) : '',
        'Accept-Language': localStorage.getItem('i18nextLng') ?? '',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }) as RequestInit,
  checkRefreshToken: async <T>({ response, url, config, linkParam }) => {
    if (
      response.status === 401 &&
      url !== `${C_API.Auth}/refresh-token` &&
      url !== `${C_API.Auth}/login` &&
      url !== `${C_API.Auth}/logout`
    ) {
      const token = await API.refresh();
      if (token) {
        config.headers = { ...config.headers, authorization: token };
        const response = await fetch(LINK_API + url + (linkParam && '?' + linkParam), config);
        return (await response.json()) as IResponses<T>;
      }
    } else if (response.status === 401 && url !== `${C_API.Auth}/login`) {
      localStorage.removeItem(KEY_TOKEN);
      location.href =
        location.href.replace(location.hash, '') + location.hash.split('/').slice(0, 2).join('/') + LINK.Login;
    }
  },
  responsible: async <T>({
    url,
    params = {},
    config,
    headers = {},
    throwError = false,
    showMessage = false,
  }: {
    url: string;
    params?: any;
    config: RequestInit;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) => {
    config.headers = { ...config.headers, ...headers };
    const linkParam = queryString.stringify(params, { arrayFormat: 'index' });
    const response = await fetch(
      (url.includes('https://') || url.includes('http://') ? '' : LINK_API) + url + (linkParam && '?' + linkParam),
      config,
    );
    await API.checkRefreshToken({ response, url, config, linkParam });

    const res: IResponses<T> = await response.json();
    if (response.ok) {
      if (showMessage && res.message) message.success(res.message);
      return res;
    } else if (res.message) {
      if (!throwError) message.error(res.message);
      else throw new Error(res.message);
    }
    throw new Error('Error');
  },
  get: <T>({
    url,
    params = {},
    headers,
    throwError = false,
    showMessage = false,
  }: {
    url: string;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) => API.responsible<T>({ url, params, config: { ...API.init(), method: 'GET' }, headers, throwError, showMessage }),
  post: <T>({
    url,
    values = {},
    params = {},
    headers,
    throwError = false,
    showMessage = true,
  }: {
    url: string;
    values: any;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) =>
    API.responsible<T>({
      url,
      params,
      config: { ...API.init(), method: 'POST', body: JSON.stringify(values) },
      headers,
      throwError,
      showMessage,
    }),
  patch: <T>({
    url,
    values = {},
    params = {},
    headers,
    throwError = false,
    showMessage = true,
  }: {
    url: string;
    values: any;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) =>
    API.responsible<T>({
      url,
      params,
      config: { ...API.init(), method: 'PATCH', body: JSON.stringify(values) },
      headers,
      throwError,
      showMessage,
    }),
  put: <T>({
    url,
    values = {},
    params = {},
    headers,
    throwError = false,
    showMessage = true,
  }: {
    url: string;
    values: any;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) =>
    API.responsible<T>({
      url,
      params,
      config: { ...API.init(), method: 'PUT', body: values instanceof FormData ? values : JSON.stringify(values) },
      headers,
      throwError,
      showMessage,
    }),
  delete: <T>({
    url,
    params = {},
    headers,
    throwError = false,
    showMessage = true,
  }: {
    url: string;
    params?: any;
    headers?: RequestInit['headers'];
    throwError?: boolean;
    showMessage?: boolean;
  }) =>
    API.responsible<T>({ url, params, config: { ...API.init(), method: 'DELETE' }, headers, throwError, showMessage }),
  refresh: async () => {
    const res = await API.get<{ token: string; refreshToken: null }>({
      url: `${C_API.Auth}/refresh-token`,
      headers: { authorization: 'Bearer ' + localStorage.getItem(KEY_REFRESH_TOKEN) },
    });
    if (res) {
      localStorage.setItem(KEY_TOKEN, res.data!.token);
      return 'Bearer ' + res.data!.token;
    }
  },
};
