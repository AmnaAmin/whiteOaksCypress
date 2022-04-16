import ReactSelect from './react-select'

export default {
  title: 'Form/React Select',
  component: ReactSelect,
}

export const Select = () => <ReactSelect />
export const SelectWithLeftBorder = () => <ReactSelect selectProps={{ isLeftBorder: true }} />
export const SelectDisabled = () => <ReactSelect selectProps={{ isLeftBorder: true }} isDisabled />
