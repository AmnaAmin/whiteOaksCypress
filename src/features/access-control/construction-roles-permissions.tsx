import { Checkbox, HStack, VStack, Text } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'

export const ConstructionRolePermissions = ({ formReturn }) => {
  const { watch, setValue, control } = formReturn
  const advancedPermissionsConsWatch = watch('advancedPermissionsCons')

  const isSelectAll = advancedPermissionsConsWatch
    ? (Object?.values(advancedPermissionsConsWatch)?.every(item => item) as boolean)
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
          for (const key in advancedPermissionsConsWatch) {
            setValue(`advancedPermissionsCons.${key}`, value.currentTarget.checked)
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
            Project Management
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsCons.hideCreateProject`}
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
                  <Text fontSize="14px" fontWeight={400}>
                    Hide Project Creation
                  </Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.hidePaidProjects`}
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
                  <Text fontSize="14px" fontWeight={400}>
                    Hide Paid Projects
                  </Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.woaStartEdit`}
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
                  <Text fontSize="14px" fontWeight={400}>
                    Can Change WOA Start Date
                  </Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.clientStartEdit`}
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
                  <Text fontSize="14px">Can Change Client Start Date</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.clientDueEdit`}
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
                  <Text fontSize="14px">Can Change Client Due Date</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.verifyProjectEnable`}
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
                  <Text fontSize="14px">Can Verify Project</Text>
                </Checkbox>
              </>
            )}
          />
          <Text color="gray.500" mt="25px !important" fontWeight={500}>
            Contacts
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsCons.fpmEdit`}
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
                  <Text fontSize="14px">Can Change FPM</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.pcEdit`}
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
                  <Text fontSize="14px">Can Change Project Coordinator</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.clientEdit`}
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
                  <Text fontSize="14px">Can Change Client</Text>
                </Checkbox>
              </>
            )}
          />
        </VStack>
        <VStack
          w="40%"
          pl="40px"
          alignItems={'flex-start'}
          borderLeft="1px solid #E2E8F0"
          borderRight="1px solid #E2E8F0"
        >
          <Text color="gray.500" fontWeight={500}>
            Location
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsCons.addressEdit`}
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
                  <Text fontSize="14px">Can Change Address</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.marketEdit`}
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
                  <Text fontSize="14px">Can Change Market</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.lockBoxEdit`}
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
                  <Text fontSize="14px">Can Change Lock Box Code</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.gateCodeEdit`}
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
          <Text color="gray.500" mt="25px !important" fontWeight={500}>
            Invoicing
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsCons.invoiceEdit`}
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
                  <Text fontSize="14px" overflow="hidden" maxW="98%" wordBreak={'break-word'}>
                    Can Create Invoice
                  </Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.invoiceDateEdit`}
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
                  <Text fontSize="14px" overflow="hidden" maxW="98%" wordBreak={'break-word'}>
                    Can Change Invoice Date
                  </Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.preInvoicingEdit`}
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
                  <Text fontSize="14px" overflow="hidden" maxW="98%" wordBreak={'break-word'}>
                    Can Pre Invoice Project
                  </Text>
                </Checkbox>
              </>
            )}
          />
          <Text color="gray.500" mt="25px !important" fontWeight={500}>
            Work Order
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsCons.cancelWorkOrderEnable`}
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
                  <Text fontSize="14px">Can Cancel Work order</Text>
                </Checkbox>
              </>
            )}
          />
          <Text color="gray.500" mt="25px !important" fontWeight={500}>
            Vendor
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsCons.deactivateVendor`}
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
                  <Text fontSize="14px">Can Deactivate Vendor</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.vendorAccountsTabView`}
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
                  <Text fontSize="14px">Enable Vendor Accounts </Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.verifyVendorDocuments`}
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
                  <Text fontSize="14px">Can Verify Documents</Text>
                </Checkbox>
              </>
            )}
          />
        </VStack>
        <VStack pl="20px" alignItems={'flex-start'}>
          <Text color="gray.500" fontWeight={500}>
            Transaction
          </Text>
          <Controller
            control={control}
            name={`advancedPermissionsCons.transStatusEdit`}
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
                  <Text fontSize="14px">Can Change Status</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.transPaidDateEdit`}
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
                  <Text fontSize="14px">Can Change Paid Date</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.transPaymentReceivedEdit`}
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
                  <Text fontSize="14px">Can Change Payment Received</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.transInvoicedDateEdit`}
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
                  <Text fontSize="14px">Can Change Invoiced Date</Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.futureDateEnabled`}
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
                  <Text fontSize="14px" overflow="hidden" maxW="98%" wordBreak={'break-word'}>
                    Enable Future Date for Payment Received
                  </Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.overrideDrawRestrictionOnPercentageCompletion`}
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
                  <Text fontSize="14px" overflow="hidden" maxW="98%" wordBreak={'break-word'}>
                    Enable Creating Draw Without Percentage Completion Restrictions
                  </Text>
                </Checkbox>
              </>
            )}
          />
          <Controller
            control={control}
            name={`advancedPermissionsCons.verifiedByFPM`}
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
                  <Text fontSize="14px" overflow="hidden" maxW="98%" wordBreak={'break-word'}>
                    Enable Verified By FPM
                  </Text>
                </Checkbox>
              </>
            )}
          />
        </VStack>
      </HStack>
    </>
  )
}
