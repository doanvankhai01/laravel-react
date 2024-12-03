import { Tabs } from 'antd';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import CField from '../field';
import { handleCondition } from '../util';
import type { PropsTab } from './interface';

/**
 * Renders a tab component for form input.
 */
const Component = ({ name, column = [], list, form, values, Field }: PropsTab) => {
  const { t } = useTranslation('locale', { keyPrefix: 'Components' });

  /**
   * Renders the tab content for a given name and index.
   *
   * @param name - The name of the tab.
   * @param i - The index of the tab.
   * @returns An array of JSX elements representing the tab content.
   */
  const render = (name: string, i: number) =>
    column
      .filter((item, index) => handleCondition({ item, index, values: values[i] }))
      .map((col: any, index: number) => (
        <div
          className={classNames(col?.formItem?.classItem, 'sm:col-span-' + (col?.formItem?.col ?? 12), 'col-span-12')}
          key={'tabs' + index}
        >
          <CField
            item={col}
            index={index + '_' + i}
            name={`${name}[${i}].${col.name}`}
            t={t}
            form={form}
            values={values[i]}
            Field={Field}
          />
        </div>
      ));

  return (
    <Field name={name} mode='array'>
      {(field: any) => (
        <Tabs
          destroyInactiveTabPane={true}
          items={field.state.value?.map((_, i) => ({
            label: list[i].label,
            key: i,
            children: <div className={'grid grid-cols-12 gap-x-5'}>{render(name, i)}</div>,
          }))}
        ></Tabs>
      )}
    </Field>
  );
};
export default Component;
