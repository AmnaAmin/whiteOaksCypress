import { useToast } from '@chakra-ui/react'
import { reset } from 'numeral'
import { Control, useWatch } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ClientFormValues } from 'types/client.type'
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
          description: `Client has been updated successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('client')
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

export const clientDetailsDefaultValues = (clientDetails, paymentTermsValue, stateValue, contactsMarketsValue) => {
  const defaultValues = {
    ...clientDetails,
    paymentTerm: paymentTermsValue || { label: '20', value: '20' },
    state: stateValue,
    contacts: contactsMarketsValue,
    accountPayableContactInfos: clientDetails?.accountPayableContactInfos?.length
      ? clientDetails?.accountPayableContactInfos
      : [{ contact: '', phoneNumber: '', emailAddress: '', comments: '' }],
  }
  return defaultValues
}

export const useClientNoteMutation = clientId => {
  const client = useClient()
  const toast = useToast()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: any) => {
      return client('notes', {
        data: payload,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(['notes', clientId])
        toast({
          title: 'Note',
          description: 'Note has been saved successfully.',
          status: 'success',
          isClosable: true,
          position: 'top-left',
        })
        reset()
      },
      onError(error: any) {
        toast({
          title: 'Note',
          description: (error.title as string) ?? 'Unable to save note.',
          status: 'error',
          isClosable: true,
          position: 'top-left',
        })
      },
    },
  )
}

export const useSaveNewClientDetails = () => {
  const client = useClient()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation(
    (clientDetails: any) => {
      return client('clients', {
        data: clientDetails,
        method: 'POST',
      })
    },
    {
      onSuccess() {
        toast({
          title: 'New Client Details',
          description: `New client has been added successfully.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
        queryClient.invalidateQueries('client')
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

export const useClientDetailsSaveButtonDisabled = (control: Control<ClientFormValues>, errors): boolean => {
  const formValues = useWatch({ control })

  return (
    !formValues?.companyName ||
    !formValues?.paymentTerm ||
    !formValues?.streetAddress ||
    !formValues?.city ||
    !formValues?.contact
  )
}
