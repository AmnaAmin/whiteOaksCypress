import { Market } from 'types/vendor.types'

export const parseMarketAPIDataToFormValues = (markets: Market[], selectedMarkets: Market[]): any => {
  return markets?.length > 0
    ? markets?.map(market => ({
        market,
        checked: !!selectedMarkets?.find(skill => skill.id === market.id),
      }))
    : []
}

export const parseMarketFormValuesToAPIPayload = (formValues): any => {
  return {
    ...formValues,
    markets: formValues.markets
      .map(market => ({ ...market.market, checked: market.checked }))
      .filter(market => market.checked)
      .map(market => {
        const { checked, ...rest } = market
        return rest
      }),
  }
}
