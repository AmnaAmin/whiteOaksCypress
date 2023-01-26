import { Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Input } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { useState } from 'react'
import { Controller, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  AlertFormValues,
  ATTRIBUTE_SELECTION_OPTIONS,
  BEHAVIOUR_SELECTION_OPTIONS,
  CATEGORY_OPTIONS,
  NOTIFY_OPTIONS,
  TYPE_SELECTION_OPTIONS,
} from 'types/alert.type'

type AlertsDetailsTypes = {
  isOpen: boolean
  onClose: () => void
  selectedAlert: any
}

export const AlertsDetailsTab: React.FC<AlertsDetailsTypes> = ({ isOpen, onClose, selectedAlert }) => {
  const { t } = useTranslation()
  const [watchValue, setWatchValue] = useState()
  const {
    register,
    formState: { errors },
    control,
    clearErrors,
  } = useFormContext<AlertFormValues>()

  return (
    <Box>
      <HStack spacing="16px" mt="30px">
        <FormControl isInvalid={!!errors.title} w={215}>
          <FormLabel variant="strong-label">{t('name')}</FormLabel>
          <Input type="text" borderLeft="2.5px solid blue" {...register('title', { required: 'This is required' })} />
          <FormErrorMessage pos="absolute">{errors.title && errors.title.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.category} w={215}>
          <FormLabel variant="strong-label">{t('category')}</FormLabel>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'This is required' }}
            render={({ field, fieldState }) => (
              <>
                <ReactSelect {...field} selectProps={{ isBorderLeft: true }} options={CATEGORY_OPTIONS} />
                <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
              </>
            )}
          />
        </FormControl>

        <Box w={215}>
          <FormLabel variant="strong-label">{t('status')}</FormLabel>
          <Controller
            name="notify"
            control={control}
            render={({ field }) => {
              return <ReactSelect {...field} options={NOTIFY_OPTIONS} />
            }}
          />
        </Box>
      </HStack>

      <HStack mt="30px">
        <FormLabel variant="strong-label" size="lg" whiteSpace="nowrap" m="0">
          {t('alertingRules')}
        </FormLabel>
        <Divider borderWidth="1px" />
      </HStack>

      <Box w={215} mt="30px">
        <FormLabel variant="strong-label">{t('status')}</FormLabel>
        <Input type="text" {...register('conditionSelection')} disabled />
      </Box>

      <HStack spacing="16px" mt="30px">
        <Box w={215}>
          <FormLabel variant="strong-label">{t('type')}</FormLabel>
          <Controller
            name="typeSelection"
            control={control}
            render={({ field }) => {
              return <ReactSelect {...field} options={TYPE_SELECTION_OPTIONS} />
            }}
          />
        </Box>

        <Box w={215}>
          <FormLabel variant="strong-label">{t('attribute')}</FormLabel>
          <Controller
            name="attributeSelection"
            control={control}
            render={({ field }) => {
              return <ReactSelect {...field} options={ATTRIBUTE_SELECTION_OPTIONS} />
            }}
          />
        </Box>

        <Box w={215}>
          <FormLabel variant="strong-label">{t('behaviour')}</FormLabel>
          <Controller
            name="behaviourSelection"
            control={control}
            render={({ field }) => {
              return <ReactSelect {...field} options={BEHAVIOUR_SELECTION_OPTIONS} />
            }}
          />
        </Box>

        <Box w={215}>
          <FormLabel variant="strong-label">{t('customValue')}</FormLabel>
          <Controller
            name="subject" // need to change // this is incorrect
            control={control}
            render={({ field }) => {
              return <ReactSelect {...field} options={[]} />
            }}
          />
        </Box>
      </HStack>

      <HStack h="78px" mt="30px" borderTop="1px solid #E2E8F0" justifyContent="end" spacing="16px">
        <Button type="submit" form="alertDetails" variant="outline" colorScheme="brand">
          {t('save')}
        </Button>
        <Button isDisabled={true} colorScheme="brand">
          {t('next')}
        </Button>
      </HStack>
    </Box>
  )
}
