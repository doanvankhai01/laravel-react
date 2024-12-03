import classNames from 'classnames';
import type { Props } from './interface';
import { getColorByLetter, getFirstLetter, pickTextColorBasedOnBgColorAdvanced } from './util';

export const Avatar = ({ text, src, showName, size, index = 0 }: Props) => {
  /**
   * Renders an avatar image.
   *
   * @returns The JSX element representing the avatar image.
   */
  const renderImage = () => (
    <div className={classNames({ '-ml-2': index > 0 })} style={{ height: size + 'px', width: size + 'px' }}>
      <img
        alt='Avatar'
        style={{ height: size, width: size }}
        className={classNames('rounded-full object-center', {
          'object-contain': !showName,
          'object-cover': showName,
        })}
        src={src}
      />
    </div>
  );
  const getText = (text: string) => getFirstLetter(text);
  /**
   * Renders an avatar letter.
   *
   * @returns The JSX element representing the avatar letter.
   */
  const renderLetter = () => (
    <div
      className={classNames('inline-block rounded-xl pt-0.5 text-center', {
        '-ml-2': index > 0,
      })}
      style={{
        color: pickTextColorBasedOnBgColorAdvanced(getColorByLetter(text as string)),
        backgroundColor: getColorByLetter(text as string),
        height: size + 'px',
        width: size + 'px',
      }}
    >
      {getText(text as string)}
    </div>
  );
  return (
    <div className={classNames({ 'flex items-center': showName })}>
      {!text || (src && src.indexOf('/defaultAvatar.png') === -1) ? renderImage() : renderLetter()}
      {!!showName && !!text && <span className='ml-1'>{text as string}</span>}
    </div>
  );
};
