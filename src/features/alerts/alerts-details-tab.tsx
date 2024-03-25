import { Box, Button, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Input } from '@chakra-ui/react'
import { getAttributeOptions, getBehaviorOptions, getCustomOptions, useFieldRelatedDecisions } from 'api/alerts'
import Select from 'components/form/react-select'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AlertFormValues, CATEGORY_OPTIONS, NOTIFY_OPTIONS, TYPE_SELECTION_OPTIONS } from 'types/alert.type'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

export const AlertsDetailsTab: React.FC<{ setNextTab; selectedAlert; onClose }> = props => {
  const { t } = useTranslation()

  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<AlertFormValues>()

  const watchTypeSelection = useWatch({ control, name: 'typeSelection' })
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('ALERT.READ')
  const watchAttributeSelection = useWatch({ control, name: 'attributeSelection' })
  const { disableNext, showCustomInput, showCustomSelect } = useFieldRelatedDecisions(control)
  const { selectedAlert, onClose } = props
  return (
    <Box>
      <Box h={'calc(100vh - 250px)'} overflowY={'auto'}>
        <HStack spacing="16px" mt="30px">
          <FormControl isInvalid={!!errors.title} w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('name')}
            </FormLabel>
            <Input
              data-testid="title"
              type="text"
              variant="required-field"
              isDisabled={isReadOnly}
              {...register('title', { required: 'This is required' })}
            />
            <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.category} w={215} data-testid="category">
            <FormLabel variant="strong-label" size="md">
              {t('category')}
            </FormLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'This is required' }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                   classNamePrefix={'categoryDropdown'}
                    isDisabled={isReadOnly}
                    {...field}
                    selectProps={{ isBorderLeft: true }}
                    options={CATEGORY_OPTIONS}
                  />
                  <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>

          <Box w={215}>
            <FormLabel variant="strong-label" size="md" data-testid="notify">
              {t('status')}
            </FormLabel>
            <Controller
              name="notify"
              control={control}
              render={({ field }) => {
                return <Select  classNamePrefix={'statusDropdown'} isDisabled={isReadOnly} {...field} options={NOTIFY_OPTIONS} />
              }}
            />
          </Box>
        </HStack>

        <HStack mt="30px">
          <FormLabel variant="strong-label" size="md" whiteSpace="nowrap" m="0" data-testid="conditionSelection">
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
        <HStack h="200px" alignItems={'flex-start'} spacing="16px" mt="30px">
          <FormControl isInvalid={!!errors.typeSelection} data-testid="typeSelection" w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('type')}
            </FormLabel>
            <Controller
              name="typeSelection"
              rules={{ required: 'This is required' }}
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <Select
                     classNamePrefix={'typeSelectionOption'}
                      isDisabled={isReadOnly}
                      {...field}
                      //menuPlacement={'top'}
                      options={TYPE_SELECTION_OPTIONS}
                      size="md"
                      value={field.value}
                      onChange={option => {
                        field.onChange(option)
                        setValue('attributeSelection', null)
                        setValue('behaviourSelection', null)
                        setValue('customAttributeSelection', null)
                      }}
                      selectProps={{ isBorderLeft: true, menuHeight: '112px' }}
                    />
                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.attributeSelection} data-testid="attributeSelection" w={215}>
            <FormLabel variant="strong-label" size="md">
              {t('attribute')}
            </FormLabel>
            <Controller
              name="attributeSelection"
              control={control}
              rules={{ required: 'This is required' }}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <Select
                      {...field}
                      classNamePrefix={'attributeSelection'}
                      options={getAttributeOptions(watchTypeSelection?.label)}
                      size="md"
                      isDisabled={isReadOnly}
                      //menuPlacement={'top'}
                      value={field.value}
                      onChange={option => {
                        field.onChange(option)
                        setValue('behaviourSelection', null)
                        setValue('customAttributeSelection', null)
                      }}
                      selectProps={{ isBorderLeft: true, menuHeight: '112px' }}
                    />
                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.behaviourSelection} w={215} data-testid="behaviourSelection">
            <FormLabel variant="strong-label" size="md">
              {t('behaviour')}
            </FormLabel>
            <Controller
              name="behaviourSelection"
              control={control}
              rules={{ required: 'This is required' }}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <Select
                     classNamePrefix={'behaviourSelectionDropdown'}
                      isDisabled={isReadOnly}
                      {...field}
                      //menuPlacement={'top'}
                      options={getBehaviorOptions(watchAttributeSelection?.type)}
                      size="md"
                      value={field.value}
                      onChange={option => {
                        field.onChange(option)
                        setValue('customAttributeSelection', null)
                      }}
                      selectProps={{ isBorderLeft: true }}
                    />
                    <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                  </>
                )
              }}
            />
          </FormControl>
          {showCustomSelect && (
            <FormControl isInvalid={!!errors.customAttributeSelection} w={215} data-testid="customAttributeSelection">
              <FormLabel variant="strong-label" size="md">
                {t('customValue')}
              </FormLabel>
              <Controller
                name="customAttributeSelection" // need to change // this is incorrect
                control={control}
                rules={{ required: 'This is required' }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <Select
                       classNamePrefix={'customAttributeSelection'}
                        isDisabled={isReadOnly}
                        {...field}
                        options={getCustomOptions({
                          type: watchTypeSelection?.label,
                          attribute: watchAttributeSelection?.label,
                        })}
                        size="md"
                        value={field.value}
                        onChange={option => {
                          field.onChange(option)
                        }}
                        menuPlacement={'top'}
                        selectProps={{ isBorderLeft: true }}
                      />
                      <FormErrorMessage pos="absolute">{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              />
            </FormControl>
          )}
          {showCustomInput && (
            <FormControl isInvalid={!!errors.customAttributeSelection} w={215}>
              <FormLabel variant="strong-label" size="md">
                {t('customValue')}
              </FormLabel>
              <Input
                type="text"
                data-testid={'customAttributeInput'}
                variant="required-field"
                {...register('customAttributeSelection', { required: 'This is required' })}
              />
              <FormErrorMessage pos="absolute">
                {errors.customAttributeSelection && (errors.customAttributeSelection as any)?.message}
              </FormErrorMessage>
            </FormControl>
          )}
        </HStack>
      </Box>

      <HStack h="78px" mt="30px" borderTop="1px solid #E2E8F0" justifyContent="end" spacing="16px">
        <Button onClick={onClose} data-testid="cancel" variant="outline" colorScheme="brand">
          {t('cancel')}
        </Button>

        {!isReadOnly && selectedAlert && (
          <Button type="submit" data-testid="saveDetails" form="alertDetails" colorScheme="brand">
            {t('save')}
          </Button>
        )}
        {!isReadOnly && !selectedAlert && (
          <Button isDisabled={disableNext} data-testid="nextDetail" colorScheme="brand" onClick={props?.setNextTab}>
            {t('next')}
          </Button>
        )}
      </HStack>
    </Box>
  )
}
