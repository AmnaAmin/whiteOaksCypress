import { State } from 'types/common.types'

export const parseStatesAPIDataToFormValues = (states: State[], fpmStateId?: number): any => {
  return states?.length > 0
    ? states?.map(state => ({
        state,
        checked: state.id === fpmStateId,
      }))
    : []
}
