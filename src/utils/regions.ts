import { Region } from 'types/common.types'

export const parseRegionsAPIDataToFormValues = (regions: Region[], selectedRegions?: string[]): any => {
    return regions?.length > 0
    ? regions?.map(region => {
        return {
            region,
            checked: !!selectedRegions?.find(selectedRegion => selectedRegion === region.value),
        }
    })
    : []
}