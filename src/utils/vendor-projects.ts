import { useClient } from 'utils/auth-context'
import { Document } from 'types/vendor.types'
import { useToast } from '@chakra-ui/toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

export const useUploadDocument = () => {
  const { projectId } = useParams<'projectId'>()
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (doc: Document) => {
      return client('documents', {
        data: doc,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['documents', projectId])

        toast({
          title: 'Upload New Document',
          description: 'New document has been uploaded successfully.',
          status: 'success',
          isClosable: true,
        })
      },
      onError(error) {
        toast({
          title: 'Upload New Document',
          description: 'Error occured during uploading new document',
          status: 'error',
          isClosable: true,
        })
      },
    },
  )
}

export const useDocuments = ({ projectId }: { projectId: string | undefined }) => {
  const client = useClient()

  const { data: documents, ...rest } = useQuery<Array<Document>>(['documents', projectId], async () => {
    const response = await client(`documents?projectId.equals=${projectId}&sort=modifiedDate,asc`, {})
    return response?.data
  })

  return {
    documents,
    ...rest,
  }
}

export const documentTypes = [
  { value: 24, label: 'Permit' },
  { value: 25, label: 'Warranty' },
  { value: 56, label: 'Drawings' },
  { value: 57, label: 'NOC' },
  { value: 39, label: 'Original SOW' },
  { value: 58, label: 'Other' },
  { value: 19, label: 'Photos' },
  { value: 18, label: 'Reciept' },
]
