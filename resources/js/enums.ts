/**
 * Enum represents the pin alignment options for a table.
 */
export enum ETablePinAlign {
  Left = 'left',
  Right = 'right',
}
/**
 * Enum represents the alignment options for a table.
 */
export enum ETableAlign {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}
/**
 * Enum represents the filter types for a table.
 */
export enum ETableFilterType {
  Date = 'date',
  Text = 'text',
  Number = 'number',
}
/**
 * Enum represents the form types available in the application.
 */
export enum EFormType {
  Hidden = 'hidden',
  Editor = 'editor',
  Upload = 'upload',
  Otp = 'otp',
  Password = 'password',
  Switch = 'switch',
  Radio = 'radio',

  Tab = 'tab',

  Textarea = 'textarea',
  Addable = 'addable',
  Date = 'date',
  DateRange = 'date_range',

  TreeSelect = 'tree_select',
  SelectTable = 'select_table',
  OnlyNumber = 'only_number',
  Time = 'time',
  TimeRange = 'time_range',
  Checkbox = 'checkbox',
  Select = 'select',

  Number = 'number',
  Text = 'text',
}
/**
 * Enum represents the available options for the form picker date.
 */
export enum EFormPickerDate {
  Time = 'time',
  Date = 'date',
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  Year = 'year',
}
/**
 * Enum represents the types of form validation rules.
 */
export enum EFormRuleType {
  Required = 'required',
  Email = 'email',
  Min = 'min',
  Max = 'max',
  Custom = 'custom',
  Phone = 'phone',
  OnlyText = 'only_text',
  OnlyTextSpace = 'only_text_space',
  Textarea = 'textarea',
  Api = 'api',
  CheckExists = 'check_exists',
}
/**
 * Enum represents the possible status store.
 */
export enum EStatusState {
  Idle = 'idle',
  IsFulfilled = 'is.fulfilled',
}

/**
 * Enum representing the possible icon svg.
 */
export enum EIcon {
  DoubleArrow = 'double-arrow',
  Edit = 'edit',
  En = 'en',
  Eye = 'eye',
  EyeSlash = 'eye-slash',
  Filter = 'filter',
  FilterFill = 'filter-fill',
  Home = 'home',
  Key = 'key',
  Logo = 'logo',
  Out = 'out',
  Paste = 'paste',
  Plus = 'plus',
  Sort = 'sort',
  Search = 'search',
  Times = 'times',
  Trash = 'trash',
  Upload = 'upload',
  UserCircle = 'user-circle',
  Vi = 'vi',
  Warning = 'warning',
  Arrow = 'arrow',
  Calendar = 'calendar',
  Check = 'check',
  Cog = 'cog',
  DayNight = 'day-night',
  Disable = 'disable',
}

/**
 * Enum representing the types of charts.
 */
export enum ETypeChart {
  Pie = 'pie',
  Ring = 'ring',
  RingHalfDonut = 'ring-half-donut',
  Bubble = 'bubble',
  Line = 'line',
  Bar = 'bar',
  StackedBar = 'stacked-bar',
  LineBar = 'line-bar',
  Area = 'area',
  StackedArea = 'stacked-area',
  Scatter = 'scatter',
}
