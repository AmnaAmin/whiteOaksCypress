import { useToast } from '@chakra-ui/react'
import { PAYMENT_TERMS_OPTIONS } from 'constants/index'
import { CLIENTS } from 'features/clients/clients.i18n'
import { reset } from 'numeral'
import { Control, FieldErrors, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ClientFormValues } from 'types/client.type'
import { useClient } from 'utils/auth-context'
import { usePaginationQuery } from 'api'
import { reduceArrayToObject } from 'utils'



const getClientQueryString = (filterQueryString: string) => {
  let queryString = filterQueryString
  if (filterQueryString?.search('&sort=id.equals') < 0) {
    queryString = queryString + `&sort=id,asc`
  }
  return queryString
}

type clients = Array<any>

export const useClients = (queryString: string = '', pageSize: number = 20) => {
  const apiQueryString = getClientQueryString(queryString)
  const { data, ...rest } = usePaginationQuery<clients>(
    ['client', apiQueryString],
    `clients?${apiQueryString}`,
    pageSize,
  )
  return {
    data: data?.data,
    totalPages: data?.totalCount,
    dataCount: data?.dataCount,
    ...rest,
  }
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
  const { t } = useTranslation()

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
          title: t(`${CLIENTS}.updateClientDetails`),
          description: t(`${CLIENTS}.updateClientMsg`),
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

export const clientDetailsDefaultValues = ({ clientDetails, statesOptions, marketOptions, markets }) => {
  const stateValue = statesOptions?.find(b => b?.id === clientDetails?.state)
  const paymentTermsValue = PAYMENT_TERMS_OPTIONS?.find(s => s?.value === clientDetails?.paymentTerm)
  const marketsId = clientDetails?.markets.map(m => m.id)
  const marketList = markets?.map(market => ({
    ...market,
    checked: marketsId.includes(market.id),
  }))
  const contactsMarketsValue =
    clientDetails?.contacts?.length > 0
      ? clientDetails?.contacts?.map(c => {
          const selectedMarket = marketOptions?.find(m => m.value === Number(c.market))
          return {
            contact: c.contact,
            phoneNumber: c.phoneNumber,
            emailAddress: c.emailAddress,
            market: selectedMarket,
            phoneNumberExtension: c.phoneNumberExtension,
          }
        })
      : [{ contact: '', phoneNumber: '', emailAddress: '', market: '' }]
  const accPayInfoValue =
    clientDetails?.accountPayableContactInfos?.length > 0
      ? [
          ...clientDetails?.accountPayableContactInfos?.map(c => {
            return {
              contact: c.contact,
              phoneNumber: c.phoneNumber,
              emailAddress: c.emailAddress,
              comments: c.comments,
              phoneNumberExtension: c.phoneNumberExtension,
            }
          }),
        ]
      : [{ contact: '', phoneNumber: '', emailAddress: '', comments: '' }]

  const carrier = clientDetails?.carrier?.map(c => {
    return {
      id: c.id,
      name: c.name,
      emailAddress: c.email,
      phoneNumber: c.phone,
    }
  })
  const defaultValues = {
    ...clientDetails,
    paymentTerm: paymentTermsValue || { label: '20', value: '20' },
    state: stateValue,
    markets: marketList,
    contacts: contactsMarketsValue,
    accountPayableContactInfos: accPayInfoValue,
    carrier,
  }
  return defaultValues
}

export const clientDefault = ({ markets }) => {
  const defaultValues = {
    markets,
    paymentTerm: { value: 20, label: 20 },
    // paymentCreditCard : true,
    // paymentCheck: true,
    // paymentAch: true,
    contacts: [{ contact: '', phoneNumber: '', emailAddress: '', market: '' }],
    accountPayableContactInfos: [{ contact: '', phoneNumber: '', emailAddress: '', comments: '' }],
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
  const { t } = useTranslation()

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
          title: t(`${CLIENTS}.newClientDetails`),
          description: t(`${CLIENTS}.newClientMsg`),
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

export const useSubFormErrors = (errors: FieldErrors<ClientFormValues>) => {
  return {
    isClientDetailsTabErrors:
      !!errors.companyName ||
      !!errors.paymentTerm ||
      !!errors.paymentMethod ||
      !!errors.paymentCreditCard ||
      !!errors.paymentCheck ||
      !!errors.paymentAch ||
      !!errors.streetAddress ||
      !!errors.state ||
      !!errors.city ||
      !!errors?.contacts?.[0]?.contact ||
      !!errors?.contacts?.[0]?.market ||
      !!errors?.contacts?.[0]?.emailAddress ||
      !!errors?.contacts?.[0]?.phoneNumber ||
      !!errors?.accountPayableContactInfos?.[0]?.contact ||
      !!errors?.accountPayableContactInfos?.[0]?.emailAddress ||
      !!errors?.accountPayableContactInfos?.[0]?.phoneNumber ||
      !!errors?.accountPayableContactInfos?.[0]?.comments,
    isCarrierTabErrors: errors?.carrier,
  }
}

export const mappingDataForClientExport = (data, columns) => {
  return data.map((row: any) => {
    const columnDefWithAccessorKeyAsKey = reduceArrayToObject(columns, 'accessorKey')
    return Object.keys(columnDefWithAccessorKeyAsKey).reduce((acc, key) => {
      let value = ''
      switch (key) {
        case 'contactsName':
          value = row?.contacts?.[0].contact
          break
        case 'contactsEmail':
          value = row?.contacts?.[0].emailAddress
          break
        case 'contactsPhone':
          value = row?.contacts?.[0].phoneNumber
          break
        case 'accountPayableContactInfosContact':
          value = row.accountPayableContactInfos?.[0]?.contact
          break
        case 'accountPayableContactInfosEmail':
          value = row.accountPayableContactInfos?.[0]?.emailAddress
          break
        case 'accountPayableContactInfosPhone':
          value = row.accountPayableContactInfos?.[0]?.phoneNumber
          break
        default:
          value = row[key]
          break
      }
      var mappedObj = { ...acc }
      mappedObj[key] = value
      return mappedObj
    }, {})
  })
}

export const CLIENT_TABLE_QUERY_KEYS = {
  companyName: 'companyName.contains',
  contactsName: 'contactName.contains',
  streetAddress: 'streetAddress.contains',
  contactsPhone: 'contactPhone.contains',
  contactsEmail: 'contactEmail.contains',
  accountPayableContactInfosContact: 'accountPayableContactInfosContact.contains',
  accountPayableContactInfosEmail: 'accountPayableContactInfosEmail.contains',
  accountPayableContactInfosPhone: 'accountPayableContactInfosPhone.contains',
};