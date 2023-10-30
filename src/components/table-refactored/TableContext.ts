import { createContext } from 'react'
type TableContextProp = {
  isLastColumn: boolean
}
export enum TableReducerActionType {
  SET_IS_LAST_COLUMN,
  SET_IS_NOT_LAST_COLUMN,
}

export const TableDatePickerContext = createContext<TableContextProp | any>({ isLastColumn: false })

export function tableContextReducer(state, action) {
  switch (action.type) {
    case TableReducerActionType.SET_IS_LAST_COLUMN:
      return { ...state, isLastColumn: true }
    case TableReducerActionType.SET_IS_NOT_LAST_COLUMN:
      return { ...state, isLastColumn: false }
    default:
      return state
  }
}
