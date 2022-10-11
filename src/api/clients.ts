import { useToast } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Contact } from 'types/client.type'
import { useClient } from 'utils/auth-context'

export const useClients = () => {
  const client = useClient()

  return useQuery('client', async () => {
    const response = await client(`clients?page=0&size=10000000&sort=id,asc`, {})

    return response?.data
  })
}

export const useNotes = ({ clientId }: { clientId: number | undefined }) => {
  const client = useClient()

  const { data: notes, ...rest } = useQuery<Array<Document>>(['notes', clientId], async () => {
    const response = await client(`notes?clientId.equals=${clientId}&sort=modifiedDate,asc`, {})
    return response?.data
  })

  return {
    notes,
    ...rest,
  }
}

export const contactsDefaultFormValues = (clientDetails): Contact[] => {
  const contactsDetails: Contact[] = []
  clientDetails?.contacts &&
    clientDetails?.contacts.forEach(c => {
      const contactsObject = {
        id: c.id,
        contact: c.contact,
        phoneNumber: c.phoneNumber,
        emailAddress: c.emailAddress,
        market: c.market,
        ...clientDetails,
      }
      contactsDetails.push(contactsObject)
    })

  return contactsDetails
}

export const accPayInfoDefaultFormValues = (clientDetails): Contact[] => {
  const accPayInfo: Contact[] = []
  clientDetails?.contacts &&
    clientDetails?.contacts.forEach(a => {
      const accPayInfoObject = {
        id: a.id,
        contact: a.contact,
        phoneNumber: a.phoneNumber,
        comments: a.comments,
        ...clientDetails,
      }
      accPayInfo.push(accPayInfoObject)
    })

  return accPayInfo
}

export const useUpdateClientDetails = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (clientDetails: any) => {
      return client('clients', {
        data: clientDetails,
        method: 'PUT',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Client Details',
          description: `client has been updated successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('clients')
      },

      onError(error: any) {
        toast({
          title: 'Client Details',
          description: (error.title as string) ?? 'Unable to save client.',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}
