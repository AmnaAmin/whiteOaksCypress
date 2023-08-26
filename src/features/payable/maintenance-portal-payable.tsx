import { Box } from '@chakra-ui/layout'
import React, { useRef, useEffect } from 'react'
import { useAuth } from 'utils/auth-context'
import { getToken } from 'utils/storage.utils'

export const MaintenancePortalPayable: React.FC = () => {
  const { data } = useAuth()
  const user = data?.user
  const iframeUrl = process.env.REACT_APP_MAINTENANCE_URL + '/payable?embedded=1'
  

  const iframe = useRef<HTMLIFrameElement>(null)

  const sendMessage = () => {
    ;(document.getElementById('maintenancePortalIframe') as HTMLIFrameElement).contentWindow?.postMessage(
      { token: getToken(), user: user, page: 'payable' },
      '*',
    )
  }

  useEffect(() => {
    window.addEventListener('message', (event: any) => {
      if (event.data.maintenanceLoaded) {
        sendMessage()
      }
    })
  }, [])

  return (
    <>
      <Box h="100%">
        <iframe
          id="maintenancePortalIframe"
          ref={iframe}
          src={iframeUrl}
          width="100%"
          height="100%"
          title="Payables"
        ></iframe>
      </Box>
    </>
  )
}