import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CDataTable } from '@/components/data-table';
import { CDrawerForm } from '@/components/form/drawer';
import { CSideTree } from '@/components/slide-tree';
import type { IContentType, IMContent } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { KEY_ROLE, searchTree, useRoute } from '@/utils';
import _column from './variable';
/**
 * Represents a page component for managing code.
 * @component
 */
export const Component = () => {
  const sCrud = SCrud<IMContent, IContentType>('Content', 'ContentType');
  const sGlobal = SGlobal();
  const route = useRoute();
  useEffect(() => {
    sCrud.get({ include: 'languages' });
    sCrud.getType({});
    window.Echo?.private('users.' + sGlobal.user?.id).listen('DataChanged', server => {
      if (server.name === 'Content') sCrud.modify(server.data);
    });
  }, []);

  const handleSubmit = values => {
    if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, typeCode: route.query.typeCode });
    else sCrud.post({ ...values, typeCode: route.query.typeCode });
  };
  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Content' });
  const Form = (
    <CDrawerForm
      size={'large'}
      facade={sCrud}
      columns={_column.form({ t })}
      title={t(sCrud.data?.id ? 'EditContent' : 'AddNewContent', {
        name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })?.name,
      })}
      onSubmit={handleSubmit}
    />
  );

  const navigate = useNavigate();
  const handleSelect = typeCode => {
    navigate({ pathname: route.pathname, search: `?${createSearchParams({ ...route.query, typeCode })}` });
  };

  const Main = (
    <div className='card'>
      <div className='body'>
        <CDataTable
          filterGlobal={(row, columnId, value) => row.original[columnId].includes(value)}
          data={sCrud.result?.data
            ?.filter(item => item.typeCode === route.query.typeCode)
            ?.map(item => ({
              ...item,
              name: item?.languages?.find(sub => sub.language === localStorage.getItem('i18nextLng'))?.name,
            }))}
          isLoading={sCrud.isLoading}
          action={{
            onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_UPDATE) && sCrud.put,
            onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_UPDATE) && sCrud.getById,
            onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_DESTROY) && sCrud.delete,
            label: t('Content'),
            name: data =>
              data.languages?.length
                ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).name
                : '',
            onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CONTENT_STORE) && sCrud.set,
            labelAdd: t('AddNewContent', {
              name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })
                ?.name,
            }),
          }}
          paginationDescription={(from: number, to: number, total: number) =>
            t('PaginationContent', { from, to, total })
          }
          columns={_column.table({ t })}
        />
      </div>
    </div>
  );
  return (
    <>
      <CBreadcrumbs title={t('Content')} list={[t('Setting'), t('Content')]} />
      {Form}
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('TypeContent')}
            isLoading={sCrud.isLoadingType}
            listData={sCrud.resultType?.data}
            value={route.query.typeCode as string}
            onSelect={handleSelect}
          />
        </div>
        <div className='intro-x right'>{Main}</div>
      </div>
    </>
  );
};
