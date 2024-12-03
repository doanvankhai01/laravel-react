import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CDataTable } from '@/components/data-table';
import { CDrawerForm } from '@/components/form/drawer';
import { CSideTree } from '@/components/slide-tree';
import type { IMUser, IMUserRole } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { KEY_ROLE, searchTree, useRoute } from '@/utils';
import _column from './variable';

/**
 * Represents a page component for managing user.
 * @component
 */
export const Component = () => {
  const sCrud = SCrud<IMUser, IMUserRole>('User', 'UserRole');
  const sGlobal = SGlobal();
  const route = useRoute();

  useEffect(() => {
    sCrud.get({ include: 'position' });
    sCrud.getType({});
    window.Echo?.private('users.' + sGlobal.user?.id).listen('DataChanged', server => {
      if (server.name === 'User') sCrud.modify(server.data);
    });
  }, []);

  const handleSubmit = values => {
    if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.id, roleCode: route.query.roleCode });
    else sCrud.post({ ...values, roleCode: route.query.roleCode });
  };
  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.User' });
  const Form = (
    <CDrawerForm
      facade={sCrud}
      columns={_column.form({ t, position: sCrud.data?.position })}
      title={t(sCrud.data?.id ? 'EditUser' : 'AddNewUser', {
        name: searchTree({ array: sCrud.resultType?.data, value: route.query.roleCode?.toString(), key: 'code' })?.name,
      })}
      onSubmit={handleSubmit}
    />
  );

  const navigate = useNavigate();
  const handleSelect = roleCode => {
    navigate({ pathname: route.pathname, search: `?${createSearchParams({ ...route.query, roleCode })}` });
  };

  const Main = (
    <div className='card'>
      <div className='body'>
        <CDataTable
          filterGlobal={(row, columnId, value) => row.original[columnId].includes(value)}
          data={sCrud.result?.data?.filter(item => item.roleCode === route.query.roleCode)}
          isLoading={sCrud.isLoading}
          action={{
            onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_UPDATE) && sCrud.put,
            onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_UPDATE) && sCrud.getById,
            onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_DESTROY) && sCrud.delete,
            label: t('User'),
            name: data => data.name,
            onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_USER_STORE) && sCrud.set,
            labelAdd: t('AddNewUser', {
              name: searchTree({ array: sCrud.resultType?.data, value: route.query.roleCode?.toString(), key: 'code' })
                ?.name,
            }),
          }}
          paginationDescription={(from: number, to: number, total: number) => t('PaginationUser', { from, to, total })}
          columns={_column.table({ t })}
        />
      </div>
    </div>
  );
  return (
    <>
      <CBreadcrumbs title={t('User')} list={[t('User')]} />
      {Form}
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('Role')}
            isLoading={sCrud.isLoadingType}
            listData={sCrud.resultType?.data}
            value={route.query.roleCode as string}
            onSelect={handleSelect}
          />
        </div>
        <div className='intro-x right'>{Main}</div>
      </div>
    </>
  );
};
