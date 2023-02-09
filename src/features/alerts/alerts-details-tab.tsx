import { Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Input } from '@chakra-ui/react'
import { getAttributeOptions } from 'api/alerts'
import Select from 'components/form/react-select'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  AlertFormValues,
  BEHAVIOUR_SELECTION_OPTIONS,
  CATEGORY_OPTIONS,
  NOTIFY_OPTIONS,
  TYPE_SELECTION_OPTIONS,
} from 'types/alert.type'

export const AlertsDetailsTab: React.FC<{ setNextTab }> = props => {
  const { t } = useTranslation()

  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<AlertFormValues>()

  const watchTitle = useWatch({ control, name: 'title' })
  const watchCategory = useWatch({ control, name: 'category' })
  const watchTypeSelection = useWatch({ control, name: 'typeSelection' })

  return (
    <Box>
      <Box h={'calc(100vh - 320px)'} overflow={'auto'}>
        <HStack spacing="16px" mt="30px">
          <FormControl isInvalid={!!errors.title} w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('name')}
            </FormLabel>
            <Input type="text" variant="required-field" {...register('title', { required: 'This is required' })} />
            <FormErrorMessage pos="absolute">{errors.title && errors.title.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.category} w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('category')}
            </FormLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <Select {...field} selectProps={{ isBorderLeft: true }} options={CATEGORY_OPTIONS} />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>

          <Box w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('status')}
            </FormLabel>
            <Controller
              name="notify"
              control={control}
              render={({ field }) => {
                return <Select {...field} options={NOTIFY_OPTIONS} />
              }}
            />
          </Box>
        </HStack>

        <HStack mt="30px">
          <FormLabel variant="strong-label" size="md" whiteSpace="nowrap" m="0">
            {t('alertingRules')}
          </FormLabel>
          <Divider borderWidth="1px" />
        </HStack>

        <Box w={215} mt="30px">
          <FormLabel variant="strong-label" size="md">
            {t('status')}
          </FormLabel>
          <Input type="text" {...register('conditionSelection')} disabled />
        </Box>

        <HStack spacing="16px" mt="30px">
          <Box w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('type')}
            </FormLabel>
            <Controller
              name="typeSelection"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    menuPlacement={'top'}
                    options={TYPE_SELECTION_OPTIONS}
                    size="md"
                    value={field.value}
                    onChange={option => {
                      field.onChange(option)
                      setValue('attributeSelection', null)
                    }}
                    selectProps={{ isBorderLeft: true }}
                  />
                )
              }}
            />
          </Box>

          <Box w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('attribute')}
            </FormLabel>
            <Controller
              name="attributeSelection"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    options={getAttributeOptions(watchTypeSelection?.label)}
                    size="md"
                    menuPlacement={'top'}
                    value={field.value}
                    onChange={option => {
                      field.onChange(option)
                      console.log(option)
                    }}
                    selectProps={{ isBorderLeft: true }}
                  />
                )
              }}
            />
          </Box>

          <Box w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('behaviour')}
            </FormLabel>
            <Controller
              name="behaviourSelection"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    menuPlacement={'top'}
                    options={BEHAVIOUR_SELECTION_OPTIONS}
                    size="md"
                    value={field.value}
                    onChange={option => {}}
                    selectProps={{ isBorderLeft: true }}
                  />
                )
              }}
            />
          </Box>

          <Box w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('customValue')}
            </FormLabel>
            <Controller
              name="subject" // need to change // this is incorrect
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    options={[]}
                    size="md"
                    value={field.value}
                    onChange={option => {}}
                    menuPlacement={'top'}
                    selectProps={{ isBorderLeft: true }}
                  />
                )
              }}
            />
          </Box>
        </HStack>
      </Box>

      <HStack h="78px" mt="30px" borderTop="1px solid #E2E8F0" justifyContent="end" spacing="16px">
        <Button type="submit" form="alertDetails" variant="outline" colorScheme="brand">
          {t('save')}
        </Button>
        <Button isDisabled={!watchTitle || !watchCategory} colorScheme="brand" onClick={props?.setNextTab}>
          {t('next')}
        </Button>
      </HStack>
    </Box>
  )
}
