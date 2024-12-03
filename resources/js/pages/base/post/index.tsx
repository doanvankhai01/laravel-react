import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CDataTable } from '@/components/data-table';
import { CDrawerForm } from '@/components/form/drawer';
import { CSideTree } from '@/components/slide-tree';
import type { IMPost, IMPostType } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { KEY_ROLE, mapTreeObject, searchTree, useRoute } from '@/utils';
import _column from './variable';
import _columnType from './variable/type';

/**
 * Represents a page component for managing post.
 * @component
 */
export const Component = () => {
  const sCrud = SCrud<IMPost, IMPostType>('Post', 'PostType');
  const sGlobal = SGlobal();
  const route = useRoute();

  useEffect(() => {
    sCrud.get({ include: 'languages' });
    sCrud.getType({ include: 'children', postTypeId: '' });
    window.Echo?.private('users.' + sGlobal.user?.id).listen('DataChanged', server => {
      if (server.name === 'Post') sCrud.modify(server.data);
      if (server.name === 'PostType') sCrud.modifyType(server.data);
    });
  }, []);

  const handleSubmit = values => {
    if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, typeCode: route.query.typeCode });
    else sCrud.post({ ...values, typeCode: route.query.typeCode });
  };
  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Post' });
  const Form = (
    <CDrawerForm
      size={'large'}
      facade={sCrud}
      columns={_column.form({ t, id: sCrud.data?.id })}
      title={t(sCrud.data?.id ? 'EditPost' : 'AddNewPost', {
        name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })?.name,
      })}
      onSubmit={handleSubmit}
    />
  );

  const navigate = useNavigate();
  const onSelect = typeCode => {
    navigate({ pathname: route.pathname, search: `?${createSearchParams({ ...route.query, typeCode })}` });
  };
  const Main = (
    <div className='card'>
      <div className='body'>
        <CDataTable
          filterGlobal={(row, columnId, value) => row.original[columnId].includes(value)}
          data={sCrud.result?.data
            ?.filter(item => item.typeCode === route.query.typeCode)
            ?.map(item => {
              const language = item?.languages?.find(sub => sub.language === localStorage.getItem('i18nextLng'));
              return {
                ...item,
                name: language?.name,
                slug: language?.slug,
              };
            })}
          isLoading={sCrud.isLoading}
          action={{
            onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_UPDATE) && sCrud.put,
            onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_UPDATE) && sCrud.getById,
            onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_DESTROY) && sCrud.delete,
            label: t('Post'),
            name: data =>
              data.languages?.length
                ? data.languages?.find((item: any) => item?.language === localStorage.getItem('i18nextLng')).name
                : '',
            onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_STORE) && sCrud.set,
            labelAdd: t('AddNewPost', {
              name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })
                ?.name,
            }),
          }}
          paginationDescription={(from: number, to: number, total: number) => t('PaginationPost', { from, to, total })}
          columns={_column.table({ t })}
        />
      </div>
    </div>
  );
  const onSubmitType = values => {
    if (sCrud.dataType?.id) sCrud.putType({ ...values, id: sCrud.dataType.id });
    else sCrud.postType({ ...values });
  };
  const FormType = (
    <CDrawerForm
      facade={sCrud}
      keyData='dataType'
      keyIsLoading='isLoadingType'
      keyState='isVisibleType'
      columns={_columnType.form({ t, id: sCrud.dataType?.id, list: sCrud.resultType?.data?.map(mapTreeObject) })}
      title={t(sCrud.dataType?.id ? 'EditTypePost' : 'AddNewTypePost')}
      onSubmit={onSubmitType}
    />
  );
  return (
    <>
      <CBreadcrumbs title={t('Post')} list={[t('Setting'), t('Post')]} />
      {Form}
      {FormType}
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('TypePost')}
            isLoading={sCrud.isLoadingType}
            listData={sCrud.resultType?.data}
            value={route.query.typeCode as string}
            onAdd={sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_STORE) && sCrud.set}
            onEdit={sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_UPDATE) && sCrud.getByIdType}
            onDelete={sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_POST_TYPE_DESTROY) && sCrud.deleteType}
            onSelect={onSelect}
          />
        </div>
        <div className='intro-x right'>{Main}</div>
      </div>
    </>
  );
};
