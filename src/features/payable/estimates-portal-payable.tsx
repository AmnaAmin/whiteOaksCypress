import { Box } from '@chakra-ui/layout'
import React, { useRef, useEffect } from 'react'
import { useAuth } from 'utils/auth-context'
import { getToken } from 'utils/storage.utils'

export const EstimatesPortalPayable: React.FC = () => {
  const { data } = useAuth()
  const user = data?.user
  const iframeUrl = process.env.REACT_APP_ESTIMATES_URL + '/payable'

  const iframe = useRef<HTMLIFrameElement>(null)

  const sendMessage = () => {
    ;(document.getElementById('estimatesPortalIframe') as HTMLIFrameElement).contentWindow?.postMessage(
      { token: getToken(), user: user, page: 'payable' },
      '*',
    )
  }

  useEffect(() => {
    window.addEventListener('message', (event: any) => {
      if (event.data.estimatesLoaded) {
        sendMessage()
      }
    })
  }, [])

  return (
    <>
      <Box h="100%">
        <iframe
          id="estimatesPortalIframe"
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
