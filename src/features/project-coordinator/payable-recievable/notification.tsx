import React from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  AlertDialogCloseButton,
} from '@chakra-ui/react'
export const BatchNotification: React.FC<{ isOpen: boolean; onClose: any; onOpen: () => void }> = props => {
  const cancelRef = React.useRef()

  return (
    <>
      <AlertDialog
        /* @ts-ignore  */
        leastDestructiveRef={cancelRef}
        // isCentered
        closeOnOverlayClick={false}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent rounded={6}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <AlertDialogCloseButton bg="white" border="none" />
              {/* use reuseable FormLabel */}
              Batch Process
            </AlertDialogHeader>
            <AlertDialogBody fontSize="16px" fontWeight={400}>
              Batch Process has been completed successfully.{' '}
            </AlertDialogBody>
            <AlertDialogFooter>
              {/* Use reuseable button  */}
              <Button bg="blue" onClick={props.onClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
