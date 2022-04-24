import ReactSelect from './react-select'

export default {
  title: 'Form/React Select',
  component: ReactSelect,
}

export const Select = () => <ReactSelect />

export const SelectWithLeftBorder = () => <ReactSelect selectProps={{ isBorderLeft: true }} />

export const SelectDisabled = () => <ReactSelect isDisabled />

export const SelectSmall = () => <ReactSelect size="sm" />

export const SelectMedium = () => <ReactSelect size="md" />

export const SelectLarge = () => <ReactSelect size="lg" />

export const SelectWithError = () => <ReactSelect size="lg" errorBorderColor="red.500" isInvalid />
