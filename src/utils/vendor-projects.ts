import { useClient } from 'utils/auth-context'
import { Document } from '../types/vendor.types'
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
          duration: 9000,
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
  { id: 56, value: 'Drawings' },
  { id: 57, value: 'NOC' },
  { id: 39, value: 'Original SOW' },
  { id: 58, value: 'Other' },
  { id: 19, value: 'Photos' },
  { id: 18, value: 'Reciept' },
]
