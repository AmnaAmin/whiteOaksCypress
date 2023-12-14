import { Box } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { useAuth } from 'utils/auth-context'
import { getToken } from 'utils/storage.utils'

document.addEventListener('DOMContentLoaded', () => { })

export const Messages = (props: any) => {
    const { workOrderId, projectId } = props;
    const { data } = useAuth()
    const user = data?.user
    const platformParam = 'platform=1'

    let iframeUrl = process.env.REACT_APP_CRM_URL + '?' + platformParam;

    const iframe = useRef<HTMLIFrameElement>(null)

    const sendMessage = () => {
        iframe?.current?.contentWindow?.postMessage(
            { token: getToken(), user: user, projectId, workOrderId },
            '*',
        )
    }

    // const toast = useToast()

    useEffect(() => {
        window.addEventListener('message', (event: any) => {
            if (event.data.messagesLoaded) {
                sendMessage()
            }

            // if (event.data?.estimateCreated) {
            //   toast.closeAll()
            //   toast({
            //     title: 'Estimate Details',
            //     description: `New Estimate has been created successfully with estimate id: ${event.data.estimateId}`,
            //     status: 'success',
            //     duration: 9000,
            //     isClosable: true,
            //     position: 'top-left',
            //   })
            // }

            // if (event.data.isEstimatesDetailsPage) {
            //   navigate(`/${event.data.path}/${event.data.estimatesId}/`)
            // }
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
