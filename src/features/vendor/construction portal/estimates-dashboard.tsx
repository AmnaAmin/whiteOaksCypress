import { Box } from '@chakra-ui/layout'
import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'utils/auth-context'
import { getToken } from 'utils/storage.utils'

export const EstimatesPortalDashboard: React.FC = () => {
  const { data } = useAuth()
  const user = data?.user
  const iframeUrl = process.env.REACT_APP_ESTIMATES_URL + '/vendorDashboard'
  const navigate = useNavigate()

  const iframe = useRef<HTMLIFrameElement>(null)

  const sendMessage = () => {
    ;(document.getElementById('estimatesPortalIframe') as HTMLIFrameElement).contentWindow?.postMessage(
      { token: getToken(), user: user, page: 'vendorDashboard' },
      '*',
    )
  }

  useEffect(() => {
    window.addEventListener('message', (event: any) => {
      if (event.data.estimatesLoaded) {
        sendMessage()
      }
      if (event.data.redirectToEstimates) {
        navigate('/estimates', { state: event.data.params })
      }
    })
  }, [])

  return (
    <>
      <Box h="100%" minH={'850px'}>
        <iframe
          id="estimatesPortalIframe"
          ref={iframe}
          src={iframeUrl}
          width="100%"
          height="100%"
          title="Dashboard"
        ></iframe>
      </Box>
    </>
  )
}
