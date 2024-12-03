/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_URL_API: string;
  readonly VITE_URL_LANGUAGES: string;
  readonly VITE_LANGUAGE: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_FORMAT_DATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const GLightbox: GLightbox;
declare const echarts: echarts;
declare const SUNEDITOR: any;
declare const Inputmask: any;
declare const NProgress: any;
