import { EIcon } from '@/enums';
import { CSvgIcon } from '../svg-icon';
import type { Props } from './interface';

export const CBreadcrumbs = ({ title, list }: Props) => (
  <div className='wrapper-flex'>
    <h2 className={'-intro-x'}>{title}</h2>
    <div className={'intro-x breadcrumbs'}>
      {!!list && (
        <ul>
          <li>
            <CSvgIcon name={EIcon.Home} />
          </li>
          {list.map(item => (
            <li key={item}>
              <CSvgIcon name={EIcon.Arrow} size={8} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
