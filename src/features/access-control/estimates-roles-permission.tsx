import { Checkbox, HStack, VStack, Text } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'

export const EstimateRolePermissions = ({ formReturn }) => {
  const { watch, setValue, control } = formReturn
  const advancedPermissionsEstWatch = watch('advancedPermissionsEst')

  const isSelectAll = advancedPermissionsEstWatch
    ? (Object?.values(advancedPermissionsEstWatch)?.every(item => item) as boolean)
    : false
  return (
    <>
      <Checkbox
        colorScheme="PrimaryCheckBox"
        style={{ background: 'white', border: '#DFDFDF' }}
        mr="2px"
        mb="20px"
        size="md"
        isChecked={isSelectAll}
        onChange={value => {
          for (const key in advancedPermissionsEstWatch) {
            setValue(`advancedPermissionsEst.${key}`, value.currentTarget.checked)
          }
        }}
      >
        <Text fontSize="16px" color="gray.600">
          Select All
        </Text>
      </Checkbox>
      <HStack alignItems={'flex-start'}>
        <VStack w="33%" alignItems={'flex-start'}>
          <Text color="gray.500" fontWeight={500}>
            Estimates Management
          </Text>

          <Controller
            control={control}
            name={`advancedPermissionsEst.enableConvertProject`}
            render={({ field, fieldState }) => (
              <>
                <Checkbox
                  colorScheme="PrimaryCheckBox"
                  isChecked={field.value}
                  style={{ background: 'white', border: '#DFDFDF' }}
                  mr="2px"
                  size="md"
                  onChange={value => {
                    field.onChange(value)
                  }}
                  // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                >
                  <Text fontSize="14px">Can Convert Project </Text>
                </Checkbox>
              </>
            )}
          />

          <Text color="gray.500" mt="25px !important" fontWeight={500}>
            Estimate Contacts
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsEst.estFpmEdit`}
            render={({ field, fieldState }) => (
              <>
                <Checkbox
                  colorScheme="PrimaryCheckBox"
                  isChecked={field.value}
                  style={{ background: 'white', border: '#DFDFDF' }}
                  mr="2px"
                  size="md"
                  onChange={value => {
                    field.onChange(value)
                  }}
                  // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                >
                  <Text fontSize="14px">Can Change FPM Contact</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsEst.estGateCodeEdit`}
            render={({ field, fieldState }) => (
              <>
                <Checkbox
                  colorScheme="PrimaryCheckBox"
                  isChecked={field.value}
                  style={{ background: 'white', border: '#DFDFDF' }}
                  mr="2px"
                  size="md"
                  onChange={value => {
                    field.onChange(value)
                  }}
                  // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                >
                  <Text fontSize="14px">Can Change Gate Code</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsEst.estLockBoxEdit`}
            render={({ field, fieldState }) => (
              <>
                <Checkbox
                  colorScheme="PrimaryCheckBox"
                  isChecked={field.value}
                  style={{ background: 'white', border: '#DFDFDF' }}
                  mr="2px"
                  size="md"
                  onChange={value => {
                    field.onChange(value)
                  }}
                  // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                >
                  <Text fontSize="14px">Can Change Lock Box</Text>
                </Checkbox>
              </>
            )}
          />
          <Text mt="25px !important" color="gray.500" fontWeight={500}>
            Estimate Transaction
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsEst.carrierFeeCreateInApprovedStatus`}
            render={({ field, fieldState }) => (
              <>
                <Checkbox
                  colorScheme="PrimaryCheckBox"
                  isChecked={field.value}
                  style={{ background: 'white', border: '#DFDFDF' }}
                  mr="2px"
                  size="md"
                  onChange={value => {
                    field.onChange(value)
                  }}
                  // disabled={watchPermissions?.[index]?.hide || watchPermissions?.[index]?.read}
                >
                  <Text fontSize="14px">Can Create Carier Fee in Approved status</Text>
                </Checkbox>
              </>
            )}
          />
        </VStack>
      </HStack>
    </>
  )
}
