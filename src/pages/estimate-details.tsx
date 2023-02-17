import { Box } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from 'utils/auth-context';
import { getToken } from 'utils/storage.utils'


document.addEventListener( "DOMContentLoaded", () => {

} );

window.addEventListener( "message", ( event: any ) => {
  //console.log( "John: Event Data Received From Child", event );
} );

export const EstimateDetails = () => {
  const { data } = useAuth()
  const user = data?.user
  const { projectId } = useParams<{ projectId: string }>()
  
  const iframeUrl = process.env.REACT_APP_ESTIMATES_URL + `/estimate-details/${projectId}`;

  const iframe = useRef<HTMLIFrameElement>(null)

  const sendMessage = () => {
    
    (document.getElementById('estimatesPortalIframe') as HTMLIFrameElement).contentWindow?.postMessage(
      { token: getToken(), user: user },
      '*',
    );

  }

  useEffect( () => {

    window.addEventListener( "message", ( event: any ) => {
  
      if ( event.data.estimatesLoaded ) {
        sendMessage();
      }

      if ( event.data.isEstimatesDetailsPage ) {
        //window.history.pushState(null, '', `/${event.data.path}/${event.data.estimatesId}`);
      }
      console.log( "WOA: Event Data Received From Child", event );
    } );

   

  }, [] );

  return (
    <>
      <Box h="100%">
        <iframe id="estimatesPortalIframe" ref={iframe} src={iframeUrl} width="100%" height="100%" title="Estimates"></iframe>
      </Box>
    </>
  )
}
