import { Box } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { useAuth } from 'utils/auth-context';
import { getToken } from 'utils/storage.utils'


document.addEventListener( "DOMContentLoaded", () => {

} );

window.addEventListener( "message", ( event: any ) => {
  console.log( "John: Event Data Received From Child", event );
} );

export const Estimates = () => {
  const { data } = useAuth()
  const user = data?.user
  
  const iframeUrl = process.env.REACT_APP_ESTIMATES_URL; //? process.env.REACT_APP_ESTIMATES_URL : 'http://localhost:3000/';

  const iframe = useRef<HTMLIFrameElement>(null)

  const sendMessage = () => {

    //console.log( "John: Sending Message to Estimates From Main Portal." );
    
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
      console.log( "John: Event Data Received From Child", event );
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
