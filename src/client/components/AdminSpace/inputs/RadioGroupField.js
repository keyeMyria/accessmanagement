
import { RadioButtonGroup } from 'material-ui/RadioButton'
import createComponent from './createComponent'

const mapValueToValueSelected = (
  { input: { ...inputProps }, ...props }
) => {
  return mapError(
    {
      ...props,
      input: { ...inputProps, valueSelected: inputProps.value }
    }
  )
}

export default createComponent(RadioButtonGroup, mapValueToValueSelected)