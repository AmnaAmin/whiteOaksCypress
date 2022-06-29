import { Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Input, Text } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const SelectOpion = [
  { value: '1', label: 'Saqib' },
  { value: '2', label: 'Maroof Ali' },
  { value: '3', label: 'Jabir Hussain' },
  { value: '4', label: 'Ansar Ali' },
  { value: '5', label: 'Wili Hassan ' },
  { value: '6', label: 'Nasir Hussain' },
  { value: '7', label: 'Talat Hussain' },
  { value: '8', label: 'Manal Hassan' },
]

export const AlertsDetailsTab = () => {
  const { t } = useTranslation()
  const [watchValue, setWatchValue] = useState()
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()
  const onSubmit = data => {
    setWatchValue(watch)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <HStack spacing="16px" mt="30px">
          <FormControl isInvalid={errors.Name} w={215}>
            <FormLabel variant="strong-label">{t('name')}</FormLabel>
            <Input type="text" borderLeft="2.5px solid blue" {...register('Name', { required: 'This is required' })} />
            <FormErrorMessage pos="absolute">{errors.Name && errors.Name.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.Category} w={215}>
            <FormLabel variant="strong-label">{t('category')}</FormLabel>
            <Controller
              name="Category"
              control={control}
              rules={{ required: 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <ReactSelect {...field} selectProps={{ isBorderLeft: true }} options={SelectOpion} />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>

          <Box w={215}>
            <FormLabel variant="strong-label">{t('status')}</FormLabel>
            <Controller
              name="Status"
              control={control}
              render={({ field }) => {
                return <ReactSelect {...field} options={SelectOpion} />
              }}
            />
          </Box>
        </HStack>

        <HStack mt="30px">
          <Text whiteSpace="nowrap" fontSize="16px" fontWeight={500} color="#4A5568">
            {t('alertingRules')}
          </Text>
          <Divider borderWidth="1px" />
        </HStack>

        <Box w={215} mt="30px">
          <FormLabel variant="strong-label">{t('status')}</FormLabel>
          <Input type="text" {...register('Status')} disabled value="If" />
        </Box>

        <HStack spacing="16px" mt="30px">
          <Box w={215}>
            <FormLabel variant="strong-label">{t('type')}</FormLabel>
            <Controller
              name="Type"
              control={control}
              render={({ field }) => {
                return <ReactSelect {...field} options={SelectOpion} />
              }}
            />
          </Box>

          <Box w={215}>
            <FormLabel variant="strong-label">{t('attribute')}</FormLabel>
            <Controller
              name="Attribute"
              control={control}
              render={({ field }) => {
                return <ReactSelect {...field} options={SelectOpion} />
              }}
            />
          </Box>

          <Box w={215}>
            <FormLabel variant="strong-label">{t('behaviour')}</FormLabel>
            <Controller
              name="Behaviour"
              control={control}
              render={({ field }) => {
                return <ReactSelect {...field} options={SelectOpion} />
              }}
            />
          </Box>

          <Box w={215}>
            <FormLabel variant="strong-label">{t('customValue')}</FormLabel>
            <Controller
              name="Custom Value"
              control={control}
              render={({ field }) => {
                return <ReactSelect {...field} options={SelectOpion} />
              }}
            />
          </Box>
        </HStack>

        <HStack h="78px" mt="30px" borderTop="1px solid #E2E8F0" justifyContent="end" spacing="16px">
          <Button type="submit" variant="outline" colorScheme="brand">
            {t('save')}
          </Button>
          <Button isDisabled={watchValue ? false : true} colorScheme="brand">
            {t('next')}
          </Button>
        </HStack>
      </Box>
    </form>
  )
}
