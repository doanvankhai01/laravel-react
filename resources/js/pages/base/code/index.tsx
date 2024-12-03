import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CDataTable } from '@/components/data-table';
import { CDrawerForm } from '@/components/form/drawer';
import { CSideTree } from '@/components/slide-tree';
import type { IMCode, IMCodeType } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { KEY_ROLE, searchTree, useRoute } from '@/utils';
import _column from './variable';
/**
 * Represents a page component for managing code.
 * @component
 */
export const Component = () => {
  const sCrud = SCrud<IMCode, IMCodeType>('Code', 'CodeType');
  const sGlobal = SGlobal();
  const route = useRoute();
  useEffect(() => {
    sCrud.get({});
    sCrud.getType({});
    window.Echo?.private('users.' + sGlobal.user?.id).listen('DataChanged', server => {
      if (server.name === 'Code') sCrud.modify(server.data);
    });
  }, []);

  const handleSubmit = values => {
    if (sCrud.data?.id) sCrud.put({ ...values, id: sCrud.data.code, typeCode: route.query.typeCode });
    else sCrud.post({ ...values, typeCode: route.query.typeCode });
  };
  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Code' });
  const Form = (
    <CDrawerForm
      facade={sCrud}
      columns={_column.form({ t })}
      title={t(sCrud.data?.id ? 'EditCode' : 'AddNewCode', {
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
          data={sCrud.result?.data?.filter(item => item.typeCode === route.query.typeCode)}
          isLoading={sCrud.isLoading}
          action={{
            onDisable: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_UPDATE) && sCrud.put,
            onEdit: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_UPDATE) && sCrud.getById,
            onDelete: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_DESTROY) && sCrud.delete,
            label: t('Code'),
            name: data => data.name,
            onAdd: sGlobal.user?.role?.permissions?.includes(KEY_ROLE.P_CODE_STORE) && sCrud.set,
            labelAdd: t('AddNewCode', {
              name: searchTree({ array: sCrud.resultType?.data, value: route.query.typeCode?.toString(), key: 'code' })
                ?.name,
            }),
          }}
          paginationDescription={(from: number, to: number, total: number) => t('PaginationCode', { from, to, total })}
          columns={_column.table({ t })}
        />
      </div>
    </div>
  );
  return (
    <>
      <CBreadcrumbs title={t('Code')} list={[t('Setting'), t('Code')]} />
      {Form}
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('TypeCode')}
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
