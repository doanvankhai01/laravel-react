import { Popover } from 'antd';
import { Avatar } from './avatar';
import type { PropsObject } from './interface';

/**
 * Renders an avatar component.
 *
 * @param text - The text to display on the avatar.
 * @param src - The source URL of the avatar image.
 * @param size - The size of the avatar.
 * @param showName - Determines whether to show the name on the avatar.
 * @param keySrc - The key for the source URL in the data object.
 * @param keyName - The key for the name in the data object.
 * @param maxCount - The maximum number of avatars to display.
 * @param index - The index of the avatar.
 * @returns The rendered avatar component.
 */
export const CAvatar = ({
  text,
  src,
  size = 20,
  showName = true,
  keySrc = 'avatarPath',
  keyName = 'fullName',
  maxCount = 4,
  index = 0,
}: PropsObject) => {
  if (typeof text !== 'object') {
    return <Avatar text={text} src={src} showName={showName} size={size} index={index} />;
  } else {
    return (
      !!text && (
        <div className='flex items-center'>
          {text
            .filter((_, index: number) => index < maxCount)
            .map((item, index: number) => (
              <Avatar
                showName={false}
                text={item[keyName]}
                src={item[keySrc]}
                size={size}
                index={index}
                key={'avatar' + index}
              />
            ))}
          {text.length > maxCount && (
            <Popover
              content={text
                .filter((_, index: number) => index >= maxCount)
                .map((item, index: number) => (
                  <Avatar showName={true} text={item[keyName]} src={item[keySrc]} size={size} key={'avatar' + index} />
                ))}
            >
              <div
                style={{ height: size, width: size }}
                className='-ml-2 inline-block rounded-xl border border-primary bg-primary/30 text-center text-xs text-primary'
              >
                +{text.length - maxCount}
              </div>
            </Popover>
          )}
        </div>
      )
    );
  }
};
