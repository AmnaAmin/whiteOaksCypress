import { ProjectType, PropertyType } from 'types/project.type'
import { useMutation, useQuery } from 'react-query'
import { useClient } from 'utils/auth-context'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'

export const usePCProject = (projectId?: string) => {
  const client = useClient()

  const { data: projectData, ...rest } = useQuery<ProjectType>(['project', projectId], async () => {
    const response = await client(`projects/${projectId}`, {})

    return response?.data
  })

  return {
    projectData,
    ...rest,
  }
}

export const useAddressDetails = () => {
  const client = useClient()

  return useQuery(
    'address-details',
    async () => {
      const response = await client(`projects`, {})

      return response?.data
    },
    { enabled: false },
  )
}

export const useAddressSettings = () => {
  const client = useClient()
  const toast = useToast()

  return useMutation(
    (settings: any) => {
      return client('project', {
        data: settings,
      })
    },
    {
      onSuccess() {
        toast({
          title: 'Update Settings',
          description: 'Settings have been updated successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      },
    },
  )
}

export const usePCProperties = (propertyId?: string) => {
  const client = useClient()

  const { data: propertiesData, ...rest } = useQuery<PropertyType>(['property', propertyId], async () => {
    const response = await client('properties', {})
    //`${'api/properties'}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`, {})

    return response?.data
  })

  return {
    propertiesData,
    ...rest,
  }
}

export const verifyAddressApi = (propertyInput, values) => {
  return axios.get(
    '/api/addressVerification/?address=' +
      encodeURI(propertyInput.streetAddress) +
      '&city=' +
      values.property.city +
      '&state=' +
      values.property.state +
      '&zip=' +
      values.property.zipCode,
    {
      timeout: 6000,
    },
  )
}
