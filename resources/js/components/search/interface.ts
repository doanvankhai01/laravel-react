/**
 * @param {string} props.value - The pagination query parameters.
 * @param {Function} props.handleTableChange - The function to handle table changes.
 */
export interface Props {
  value?: string;
  onChange: (value?: string) => void;
}
