import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';

import { CBreadcrumbs } from '@/components/breadcrumbs';
import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { CSideTree } from '@/components/slide-tree';
import { EFormType } from '@/enums';
import type { IMParameter } from '@/interfaces/model';
import { SCrud, SGlobal } from '@/services';
import { useRoute } from '@/utils';

/**
 * Represents a page component for managing parameter.
 * @component
 */
export const Component = () => {
  const sCrud = SCrud<IMParameter>('Parameter');
  const sGlobal = SGlobal();
  const route = useRoute();

  useEffect(() => {
    sCrud.get({});
    window.Echo?.private('users.' + sGlobal.user?.id).listen('DataChanged', server => {
      if (server.name === 'Parameter') sCrud.modify(server.data);
    });
  }, []);

  const navigate = useNavigate();
  const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Parameter' });

  const handleSelect = code => {
    if (sCrud.result?.data)
      sCrud.getById({
        id: route.query.code as string,
        data: sCrud.result.data.find(item => item.code === code)!,
      });
    navigate({ pathname: route.pathname, search: `?${createSearchParams({ ...route.query, code })}` });
  };

  const columns = [
    { title: 'name', name: 'name', formItem: { type: EFormType.Hidden } },
    { title: 'code', name: 'code', formItem: { type: EFormType.Hidden } },
    {
      title: t('VietnameseParameter'),
      name: 'contentVi',
      formItem: {
        col: 6,
        type: EFormType.Textarea,
      },
    },
    {
      title: t('EnglishParameter'),
      name: 'contentEn',
      formItem: {
        col: 6,
        type: EFormType.Textarea,
      },
    },
  ];
  const renderFooter = ({ canSubmit, form }) => (
    <CButton
      text={t('Save')}
      onClick={() => form.handleSubmit()}
      disabled={!canSubmit}
      className={'!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90'}
    />
  );
  const data = sCrud.data ?? sCrud.result?.data?.find(item => item.code === route.query.code);

  const Main = (
    <div className='card'>
      <div className='header'>
        <h3>{t('EditParameter', { code: data?.name })}</h3>
      </div>
      <div className='desktop has-header'>
        <CForm
          isLoading={sCrud.isLoading}
          values={{ ...data }}
          className='intro-x'
          columns={columns}
          footer={renderFooter}
          onSubmit={({ value }) => sCrud.put({ ...value, id: data!.code })}
        />
      </div>
    </div>
  );

  return (
    <>
      <CBreadcrumbs title={t('Parameter')} list={[t('Setting'), t('Parameter')]} />
      <div className={'wrapper-grid'}>
        <div className='-intro-x left'>
          <CSideTree
            label={t('Parameter')}
            isLoading={sCrud.isLoading}
            listData={sCrud.result?.data}
            value={(route?.query?.code ?? 'ADDRESS') as string}
            onSelect={handleSelect}
          />
        </div>
        <div className='intro-x right'>{Main}</div>
      </div>
    </>
  );
};
