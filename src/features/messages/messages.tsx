import { Box } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { useAuth } from 'utils/auth-context'
import { getToken } from 'utils/storage.utils'

document.addEventListener('DOMContentLoaded', () => {})

export const Messages = (props: any) => {
  const { projectId, id, entity } = props
  const { data } = useAuth()
  const user = data?.user
  const platformParam = 'platform=1'

  let iframeUrl = 'http://localhost:3001/?' + platformParam

  const iframe = useRef<HTMLIFrameElement>(null)

  const sendMessage = () => {
    iframe?.current?.contentWindow?.postMessage(
      { token: getToken(), user: user, payload: { projectId, id, entity } },
      '*',
    )
  }

  // const toast = useToast()

  useEffect(() => {
    window.addEventListener('message', (event: any) => {
      if (event.data.messagesLoaded) {
        sendMessage()
      }
    })
  }, [])

  return (
    <>
      <Box h="100%" w="100%">
        <iframe
          id="messagesPortalIframe"
          ref={iframe}
          src={iframeUrl}
          width="100%"
          height="100%"
          title="Messages"
        ></iframe>
      </Box>
    </>
  )
}
