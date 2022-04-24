import React, { useCallback, useEffect } from 'react'
import GSTC from 'gantt-schedule-timeline-calendar'
import 'gantt-schedule-timeline-calendar/dist/style.css'

let gstc
export default function GSTCWrapper(props) {
  // @ts-ignore
  let state = GSTC.api.stateFromConfig(props.config)
  props.onState(state)
  // var element = document.getElementsByClassName('gstc_list')
  // element.removeAttribute('style')

  const callback = useCallback(
    node => {
      if (node) {
        gstc = GSTC({
          element: node,
          state,
        })
      }
    },
    [state],
  )

  useEffect(() => {
    return () => {
      if (gstc) {
        // disabling this allows React.useState
        // gstc.app.destroy();
      }
    }
  })

  return <div ref={callback} min-height={300} />
}
