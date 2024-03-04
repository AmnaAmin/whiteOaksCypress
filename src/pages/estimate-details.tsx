import { Box } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from 'utils/auth-context'
import { getToken } from 'utils/storage.utils'

export const EstimateDetails = () => {
  const { data } = useAuth()
  const user = data?.user
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  let workorderId: any = searchParams.get('workorderId');

  const iframeUrl = process.env.REACT_APP_ESTIMATES_URL + `/estimate-details/${projectId}?workorderId=${workorderId}`


  const iframe = useRef<HTMLIFrameElement>(null)

  const sendMessage = () => {
    ; (document.getElementById('estimatesPortalIframe') as HTMLIFrameElement).contentWindow?.postMessage(
      { token: getToken(), user: user },
      '*',
    )
  }

  useEffect(() => {
    window.addEventListener('message', (event: any) => {
      if (event.data.estimatesLoaded) {
        sendMessage()
      }

      if (event.data.redirectToEstimates) {
        window.history.pushState(null, '', '/estimates')
      }

      if (event.data.isEstimatesDetailsPage) {
        //window.history.pushState(null, '', `/${event.data.path}/${event.data.estimatesId}`);
      }
      if (event.data.redirectToProjectsPage) {
        setTimeout(() => {
          window.location.href = `project-details/${event.data.projectId}/`
        }, 300)
      }
      if (event.data.clearWOParams) {
        searchParams.delete('workorderId')
        setSearchParams(searchParams)
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
          title="Estimates"
        ></iframe>
      </Box>
    </>
  )
}
