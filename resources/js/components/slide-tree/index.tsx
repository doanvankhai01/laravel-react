import { Popconfirm, Spin, Tree, TreeSelect } from 'antd';
import { useTranslation } from 'react-i18next';

import { CButton } from '@/components/button';
import { CSvgIcon } from '@/components/svg-icon';
import { CTooltip } from '@/components/tooltip';
import { EIcon } from '@/enums';
import { mapTreeObject } from '@/utils';
import type { Props } from './interface';

/**
 * Renders a side tree component.
 */
export const CSideTree = ({ isLoading, listData, label, value, onAdd, onEdit, onDelete, onSelect }: Props) => {
  /**
   * Retrieves the translation function from the specified translation namespace.
   *
   * @returns The translation function.
   */
  const { t } = useTranslation('locale', { keyPrefix: 'Components' });

  /**
   * Renders the title of a data item.
   *
   * @param data - The data item containing the title.
   * @returns The JSX element representing the rendered title.
   */
  const renderTitle = data => (
    <span className={'item'}>
      {data.title}
      <div className='action'>
        {!!onEdit && (
          <CTooltip title={t('Edit', { name: data.title, label: label.toLowerCase() })}>
            <button
              title={t('Edit', { name: data.title, label: label.toLowerCase() })}
              onClick={() => onEdit({ id: data.key })}
            >
              <CSvgIcon name={EIcon.Edit} className='primary' />
            </button>
          </CTooltip>
        )}
        {onDelete && (
          <CTooltip title={t('Delete', { name: data.title, label: label.toLowerCase() })}>
            <Popconfirm
              destroyTooltipOnHide={true}
              title={t('AreYouSureWantDelete', {
                name: data.title,
                label: label.toLowerCase(),
              })}
              onConfirm={() => onDelete(data.key)}
            >
              <button title={t('Delete', { name: data.title, label: label.toLowerCase() })}>
                <CSvgIcon name={EIcon.Trash} className='error' />
              </button>
            </Popconfirm>
          </CTooltip>
        )}
      </div>
    </span>
  );

  /**
   * Renders the add button.
   *
   * @returns The JSX element representing the add button.
   */
  const renderBtnAdd = !!onAdd && (
    <CButton
      icon={<CSvgIcon name={EIcon.Plus} size={12} />}
      onClick={() => onAdd({ dataType: undefined, isVisibleType: true })}
    />
  );

  return (
    <div className='card'>
      <div className='header'>
        <h3>
          {label} <Spin spinning={isLoading} />
        </h3>
        {renderBtnAdd}
      </div>

      <div className='desktop'>
        <div className='scrollbar'>
          <Tree
            blockNode
            showLine
            autoExpandParent
            defaultExpandAll
            selectedKeys={[value]}
            treeData={listData?.map(mapTreeObject)}
            onSelect={selectedKeys => selectedKeys[0] && !!onSelect && onSelect(selectedKeys[0])}
            switcherIcon={<CSvgIcon name={EIcon.Arrow} size={12} />}
            titleRender={renderTitle}
          />
        </div>
      </div>
      <div className='mobile'>
        <TreeSelect
          treeLine
          value={value}
          className={'w-full'}
          treeData={listData?.map(mapTreeObject)}
          onChange={e => e && !!onSelect && onSelect(e)}
          switcherIcon={<CSvgIcon name={EIcon.Arrow} size={12} />}
        />
      </div>
    </div>
  );
};
