import { Box, useToast } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from 'utils/auth-context'
import { getToken } from 'utils/storage.utils'

document.addEventListener('DOMContentLoaded', () => {})

window.addEventListener('message', (event: any) => {
  //console.log( "John: Event Data Received From Child", event );
})

export const Estimates = () => {
  const { data } = useAuth()
  const user = data?.user
  const platformParam = 'platform=1'
 
  let iframeUrl = process.env.REACT_APP_ESTIMATES_URL
  

  if ((window as any).Cypress) {
    if (iframeUrl && iframeUrl.indexOf('?') === -1) {
      iframeUrl = iframeUrl + '?' + platformParam
    } 
  }else {
    iframeUrl = iframeUrl + '?hideLogin=1'
  }
 
  const navigate = useNavigate()
  const iframe = useRef<HTMLIFrameElement>(null)

  const sendMessage = () => {
    ;(document.getElementById('estimatesPortalIframe') as HTMLIFrameElement).contentWindow?.postMessage(
      { token: getToken(), user: user },
      '*',
    )
  }

  const toast = useToast()

  useEffect(() => {
    window.addEventListener('message', (event: any) => {
      if (event.data.estimatesLoaded) {
        sendMessage()
      }

      if (event.data?.estimateCreated) {
        toast.closeAll()
        toast({
          title: 'Estimate Details',
          description: `New Estimate has been created successfully with estimate id: ${event.data.estimateId}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      }

      if (event.data.isEstimatesDetailsPage) {
        navigate(`/${event.data.path}/${event.data.estimatesId}/`)
        //window.history.pushState(null, '', `/${event.data.path}/${event.data.estimatesId}`);
      }
      //console.log( "WOA: Event Data Received From Child", event );
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
          title="Estimates"
        ></iframe>
      </Box>
    </>
  )
}
