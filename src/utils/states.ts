import { State } from 'types/common.types'

export const parseStatesAPIDataToFormValues = (states: State[], selectedStates?: State[]): any => {
  
  return states?.length > 0
    ? states?.map(state => ({
        state,
        checked: !!selectedStates?.find(ss => ss.id === state.id),
      }))
    : []
}
