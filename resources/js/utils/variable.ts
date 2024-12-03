/**
 * The key used for user authentication.
 */
export const KEY_USER = 'm8nvn*&hKwcgb^D-D#Hz^5CXfKySpY';
/**
 * The key token used for authentication.
 */
export const KEY_TOKEN = 'b7a2bdf4-ac40-4012-9635-ff4b7e55eae0';
/**
 * The refresh token key used for authentication.
 */
export const KEY_REFRESH_TOKEN = '15c665b7-592f-4b60-b31f-a252579a3bd0';
/**
 * The temporary key used for something.
 */
export const KEY_TEMP = 'fbb36f54-abcb-4674-9635-b4b57ccf2e49';
/**
 * The name of the application.
 */
export const APP_NAME = import.meta.env.VITE_APP_NAME;
/**
 * The URL of the API endpoint.
 */
export const LINK_API = import.meta.env.VITE_URL_API;
/**
 * Represents a list of supported languages.
 *
 * @remarks
 * This list is obtained from the `VITE_URL_LANGUAGES` environment variable.
 */
export const LIST_LANGUAGE = import.meta.env.VITE_URL_LANGUAGES.split(',');
/**
 * The language used in the application.
 */
export const LANGUAGE =
  LIST_LANGUAGE.indexOf(location.hash.split('/')[1]) > -1
    ? location.hash.split('/')[1]
    : (localStorage.getItem('i18nextLng') ?? import.meta.env.VITE_LANGUAGE);
/**
 * The format of the date used in the application.
 */
export const FORMAT_DATE = import.meta.env.VITE_APP_FORMAT_DATE;
/**
 * Represents the constant value for full text search.
 */
export const FULL_TEXT_SEARCH = 'fullTextSearch';

export const LATEST_UPDATED = '6fee23ce-afad-459c-9bb3-d6b721969fbc';

export enum KEY_DATA {
  Code = '00143b6a3c-30b4-44d0-9cd2-5899ff46fa98',
  CodeType = '00b1cc09bb-e5d5-4c8b-b765-72ccb5c9bb1a',
  UserRole = '00f39f8e63-b7b6-4065-9a6b-bd219c4c1c30',
  User = '00cdcce026-1135-4ea7-9abc-70b26af11410',
  Content = '00c489935b-a999-4b8f-a7c4-5820dc82a587',
  ContentType = '00a608c4de-abf1-4dab-8f3b-9192e954b478',
  Post = '00bbd59d21-a1d8-4f6f-b0a4-4812e00089e6',
  Parameter = '00ae4563ce-d619-48f5-b40f-91090f66c174',
  PostType = '007ffa46a8-b897-420d-84f6-f38f9820a120',
}

export enum KEY_ROLE {
  P_ADDRESS_PROVINCE_INDEX = '92cf77b7-aac5-43b1-8385-a6fdbb5690aa',
  P_ADDRESS_PROVINCE_STORE = 'fa1f6c69-f2ec-4af8-b580-c6a960a38c8d',
  P_ADDRESS_PROVINCE_SHOW = '542553cd-3912-487c-a612-e98fc5c6e0c2',
  P_ADDRESS_PROVINCE_UPDATE = '5f7d9977-6763-4fe4-ab53-5340eec324e5',
  P_ADDRESS_PROVINCE_DESTROY = '2c4fc62a-df9a-4c4b-88bc-dcc614d5df0b',

  P_ADDRESS_DISTRICT_INDEX = '4f8806a3-5a59-4eba-8428-f78e9d773be3',
  P_ADDRESS_DISTRICT_STORE = '72082d5e-832f-4458-9e2e-8bc629cc066b',
  P_ADDRESS_DISTRICT_SHOW = '8910022c-3f7e-456c-958a-bb3c4a216510',
  P_ADDRESS_DISTRICT_UPDATE = 'c3ce9b99-407d-4965-a4ec-50ea76d3e4cb',
  P_ADDRESS_DISTRICT_DESTROY = '3618123f-b221-4d5e-b793-b17c69a2580e',

  P_ADDRESS_WARD_INDEX = 'caec6138-d55d-43e5-a63e-e4b9343b6e79',
  P_ADDRESS_WARD_STORE = '2f74dc63-3432-4cdc-9452-624d31f7571a',
  P_ADDRESS_WARD_SHOW = '8076eed7-8d0b-4a69-acf6-f186d8dd7ddc',
  P_ADDRESS_WARD_UPDATE = 'b923fb73-6821-4395-93ef-c8f2eed82e0a',
  P_ADDRESS_WARD_DESTROY = 'b38188f3-4615-44cf-a117-50f3a8dfcd07',

  P_ADDRESS_INDEX = '68374512-be01-4d21-a394-f55561fe29e6',
  P_ADDRESS_STORE = '677db375-e823-4577-b587-143ecb352437',
  P_ADDRESS_SHOW = '83281048-af5e-44d8-9cd1-8b8d356e9543',
  P_ADDRESS_UPDATE = '77727195-7984-4104-8fff-512b380683ac',
  P_ADDRESS_DESTROY = 'ccb73c75-90f0-4fe4-a488-65724d65cd2f',

  P_USER_INDEX = 'ac0c4f13-776d-4b71-be4d-f9952734a319',
  P_USER_STORE = '41c9d4e1-ba5a-4850-ad52-35ac928a61d9',
  P_USER_SHOW = 'a9de3f3d-4c04-4f50-9d1b-c3c2e2eca6dc',
  P_USER_UPDATE = 'bc0b5f32-ddf7-4c61-b435-384fc5ac7574',
  P_USER_DESTROY = 'b82e6224-12c3-4e6c-b4e0-62495fb799bf',

  P_USER_ROLE_INDEX = '8f559613-ef55-4ef0-8068-8c37e84b75de',
  P_USER_ROLE_STORE = 'f6732943-cb1d-484b-8644-7740a295e3e3',
  P_USER_ROLE_SHOW = '35ea86b5-e591-4819-9c41-4d35ed580d0b',
  P_USER_ROLE_UPDATE = '3e8aa2c2-35bf-4a56-8bf2-8f8de240e24c',
  P_USER_ROLE_DESTROY = '62fd3bc2-0921-4113-9b5b-9966dd5a0517',

  P_FILE_INDEX = 'f5d6c0fa-f0b7-4b19-a0ae-4bad5393df4e',
  P_FILE_STORE = '6828ff01-024f-426d-aa81-70cce8d02157',
  P_FILE_SHOW = '750a578a-e346-4e45-ad84-4768f5ffec62',
  P_FILE_UPDATE = '794f9edf-4d17-42ad-bf6c-374a7ad28f1a',
  P_FILE_DESTROY = '1ed8a391-73e3-4056-bec8-5ad272b463a0',

  P_CODE_INDEX = '5d808d76-bf99-4a51-b4b6-d5aa37bdb398',
  P_CODE_STORE = 'a9574d5e-269d-44f9-a5bb-41cf06d7bdda',
  P_CODE_SHOW = 'eb510a79-4f75-4b14-a118-f036c1daa430',
  P_CODE_UPDATE = '6d34b679-9c0e-489a-a2de-a17e37fadf72',
  P_CODE_DESTROY = 'e21ac25b-1651-443e-9834-e593789807c9',

  P_CODE_TYPE_INDEX = '2a71d57d-7c2d-49ad-a7e9-3cd4aace132f',
  P_CODE_TYPE_STORE = '45f014c0-9ebe-497e-9766-2054ebb7e1d5',
  P_CODE_TYPE_SHOW = '7af26c77-e81f-4875-89df-9d4c2fa3ce52',
  P_CODE_TYPE_UPDATE = 'fdb47b79-1a6e-49be-8f5b-8525a547534a',
  P_CODE_TYPE_DESTROY = 'f16e2bc7-12b9-446e-b53b-a2597ca0ad3a',

  P_PARAMETER_INDEX = 'd278abcb-1956-4b45-95c1-2ab612110ec6',
  P_PARAMETER_STORE = 'd9185449-e2ac-4e72-9c9f-25788c23d5ba',
  P_PARAMETER_SHOW = 'f22743c7-f7d4-4ae5-b4e1-cd88e6426240',
  P_PARAMETER_UPDATE = '3d478437-949b-4ae7-9c21-79cabb1663a3',
  P_PARAMETER_DESTROY = '275ebda7-3e03-4c93-b352-baa7705528aa',

  P_CONTENT_INDEX = '1db70aa0-7541-4433-b2f6-fbd7bf8bf7bb',
  P_CONTENT_STORE = 'c3ab9e11-7ba3-4afd-b5cb-c560362a3144',
  P_CONTENT_SHOW = '94751fbb-65e0-4efa-a124-ed3f641bcfcb',
  P_CONTENT_UPDATE = '99ea12da-5800-4d6d-9e73-60c016a267a9',
  P_CONTENT_DESTROY = '2e8c8772-2505-4683-b6fa-13fa2570eee7',

  P_CONTENT_TYPE_INDEX = '2712ca04-7e7c-44b6-83c1-b8c7f332a0fb',
  P_CONTENT_TYPE_STORE = '03380c3a-3336-42f4-b8c2-e54084d35655',
  P_CONTENT_TYPE_SHOW = 'f4010557-b3bf-445a-a2fa-2199ce90725b',
  P_CONTENT_TYPE_UPDATE = '00e77095-35ea-4755-bbae-46a1ba78e46e',
  P_CONTENT_TYPE_DESTROY = '0e481286-bd5d-4203-a374-a8f8f8735f33',

  P_POST_INDEX = '7c34dc92-cbbe-4419-8dbc-745818d76098',
  P_POST_STORE = '0ca9634c-3496-4059-bf86-5bec23c96b55',
  P_POST_SHOW = '832a2d7a-8b80-4988-9f1f-ff3ac72eb3ff',
  P_POST_UPDATE = 'eda2799a-4072-46a7-9a26-efa9a98036db',
  P_POST_DESTROY = '4097d5ff-e35c-4bff-a5b1-013ca1181762',

  P_POST_TYPE_INDEX = 'efa34c52-8c9a-444d-a82b-8bec109dbab5',
  P_POST_TYPE_STORE = '87cb77c4-565c-43ec-bffc-fbaf5077c2be',
  P_POST_TYPE_SHOW = '21dcd08f-e901-4277-98b3-23d5677ab41d',
  P_POST_TYPE_UPDATE = 'bfa36cef-71c4-4f08-89e6-d7e0c1c03ba4',
  P_POST_TYPE_DESTROY = 'cd00c62e-1ec4-4c61-b273-cdd6867a3212',
}
export const LINK = {
  Auth: '/auth',
  Login: '/auth/login',
  ForgetPassword: '/auth/forgot-password',
  VerifyForotPassword: '/auth/verify-forgot-password',
  SetPassword: '/auth/set-password',
  MyProfile: '/my-profile',
  Dashboard: '/dashboard',
  User: '/user',
  Setting: '/setting',
  Content: '/setting/content',
  Post: '/setting/post',
  Code: '/setting/code',
  Parameter: '/setting/parameter',
};
export const C_API = {
  Auth: '/auth',
  CodeType: '/codes/types',
  Code: '/codes',
  UserRole: '/users/roles',
  User: '/users',
  Content: '/contents',
  ContentType: '/contents/types',
  Post: '/posts',
  Parameter: '/parameters',
  PostType: '/posts/types',
};
