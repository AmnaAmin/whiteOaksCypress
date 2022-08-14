import { useMemo } from 'react'
import { useCaptureElementResize } from './useCaptureElementResize'

/** @Hack: to capture the table container element width and based on that we decide to calculate the columns widths 
 passed to react-table for accurate calculation on in different resolutions of screen. Here we have one caveat.
 In case of tabs the element of table hide and ref element don't have correct calculation so we decide to pass ref from 
 top most parent which is above and override the behavior of useCaptureElementResize.
 *  */
export const useColumnWidthResize = (columns: any, ref?: any) => {
  const { resizeElementRef, size } = useCaptureElementResize(ref)

  const updatedColumns = useMemo(() => {
    const staticColumnWidth = columns.reduce(
      (totalWidth, column) => (column.width ? totalWidth + (column.width as number) : totalWidth),
      0,
    )
    const noOfColumnsWithoutWidth = columns.filter(column => !column.width).length
    const calculateColumnWidth = () =>
      noOfColumnsWithoutWidth > 0 && size?.width ? (size?.width - staticColumnWidth) / noOfColumnsWithoutWidth : 250

    return columns.map(column => {
      if (!column.width) {
        const newWidth = calculateColumnWidth()
        return { ...column, width: newWidth }
      }

      return column
    })
  }, [size, columns])

  return { columns: updatedColumns, resizeElementRef }
}
