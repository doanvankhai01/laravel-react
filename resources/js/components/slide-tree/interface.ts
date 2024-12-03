/**
 * @param {boolean} [props.isLoading] - Indicates if the component is in a loading state.
 * @param {any[]} [props.listData] - The data used to populate the tree.
 * @param {string} props.label - The label of the tree.
 * @param {string} props.value - The selected value in the tree.
 * @param {Function} [props.onAdd] - The callback function triggered when adding a new item.
 * @param {Function} [props.onEdit] - The callback function triggered when editing an item.
 * @param {Function} [props.onDelete] - The callback function triggered when deleting an item.
 * @param {Function} [props.onSelect] - The callback function triggered when selecting an item.
 */
export interface Props {
  label: string;
  value: string;
  isLoading?: boolean;
  listData?: any;
  onAdd?: any;
  onEdit?: any;
  onDelete?: any;
  onSelect?: any;
}
