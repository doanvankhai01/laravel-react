import { useEffect, useRef } from 'react';

import type { IMFile } from '@/interfaces/model';
import { API, KEY_TOKEN } from '@/utils';
import type { PropsEditor } from './interface';

/**
 * Component for rendering an editor input field.
 */
const Component = ({ onChange, onBlur, value = '', placeholder }: PropsEditor) => {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      /**
       * Creates a SunEditor instance with the specified options.
       *
       * @param {HTMLElement} element - The HTML element to attach the editor to.
       * @param {object} options - The options for configuring the editor.
       * @returns {SunEditor} The created SunEditor instance.
       */
      const editor = SUNEDITOR.create(parentRef.current, {
        value,
        placeholder,
        width: 'auto',
        height: 'auto',
        fontSize: [11, 13, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128],
        buttonList: [
          ['undo', 'redo'],
          ['font', 'fontSize', 'formatBlock'],
          ['paragraphStyle', 'blockquote'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['fontColor', 'hiliteColor', 'textStyle'],
          ['removeFormat'],
          // '/', // Line break
          ['outdent', 'indent'],
          ['align', 'horizontalRule', 'list', 'lineHeight'],
          ['table', 'link', 'image', 'video', 'audio' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
          /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
          ['fullScreen', 'showBlocks', 'codeView'],
          // ['preview', 'print'],
          // ['save', 'template'],
          /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
        ],
      });
      editor.onChange = onChange;
      editor.onFocus = (_: string, core: any) => onChange?.(core.context.element.wysiwyg.innerHTML);
      editor.onBlur = (_: string, core: any) => onBlur?.(core.context.element.wysiwyg.innerHTML);
      editor.onImageUploadBefore = async (files: any, _: any, __: any, uploadHandler: any) => {
        const bodyFormData = new FormData();
        bodyFormData.append('file', files[0]);
        const { data } = await API.responsible<IMFile>({
          url: `/files`,
          config: {
            ...API.init(),
            method: 'post',
            body: bodyFormData,
            headers: {
              authorization: 'Bearer ' + (localStorage.getItem(KEY_TOKEN) ?? ''),
              'Accept-Language': localStorage.getItem('i18nextLng') ?? '',
            },
          },
        });
        uploadHandler({
          result: [
            {
              url: data?.path,
              name: files[0].name,
              size: files[0].size,
            },
          ],
        });
        return false;
      };
    });
  }, []);

  return <div ref={parentRef} />;
};
export default Component;
