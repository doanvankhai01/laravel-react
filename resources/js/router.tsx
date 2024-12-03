import { createHashRouter, redirect } from 'react-router-dom';

import { App } from './app';
import { KEY_TOKEN, LANGUAGE, LINK } from './utils';

const langPath = '/:lang';

export const router = createHashRouter([
  {
    path: '*',
    loader: () => redirect(`/${LANGUAGE}${!localStorage.getItem(KEY_TOKEN) ? LINK.Login : LINK.Dashboard}`),
  },
  {
    path: langPath,
    Component: App,
    children: [
      {
        path: langPath + LINK.Auth,
        lazy: () => import('@/layouts/auth'),
        children: [
          {
            path: langPath + LINK.Login,
            lazy: () => import('@/pages/base/login'),
          },
          {
            path: langPath + LINK.ForgetPassword,
            lazy: () => import('@/pages/base/login/forget-password'),
          },
          {
            path: langPath + LINK.VerifyForotPassword,
            lazy: () => import('@/pages/base/login/forget-password/verify-forgot-password'),
          },
          {
            path: langPath + LINK.SetPassword,
            lazy: () => import('@/pages/base/login/forget-password/verify-forgot-password/set-password'),
          },
        ],
      },
      {
        path: langPath,
        lazy: () => import('@/layouts/admin'),
        children: [
          {
            path: langPath + LINK.MyProfile,
            lazy: () => import('@/pages/base/my-profile'),
          },
          {
            path: langPath + LINK.Dashboard,
            lazy: () => import('@/pages/dashboard'),
          },
          {
            path: langPath + LINK.Parameter,
            lazy: () => import('@/pages/base/parameter'),
          },
          {
            path: langPath + LINK.Code,
            lazy: () => import('@/pages/base/code'),
          },
          {
            path: langPath + LINK.User,
            lazy: () => import('@/pages/base/user'),
          },
          {
            path: langPath + LINK.Content,
            lazy: () => import('@/pages/base/content'),
          },
          {
            path: langPath + LINK.Post,
            lazy: () => import('@/pages/base/post'),
          },
        ],
      },
    ],
  },
]);
