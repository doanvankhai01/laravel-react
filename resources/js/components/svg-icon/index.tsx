import type { Props } from './interface';

/**
 * Renders an SVG icon.
 */
export const CSvgIcon = ({ name, size, className }: Props) => {
  return (
    <svg style={size ? { width: size, height: size } : {}} className={className}>
      <use href={`/assets/images/sprite.svg#icon_${name}`} />
    </svg>
  );
};
