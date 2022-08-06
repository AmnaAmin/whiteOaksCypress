import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, FormLabel, HStack, Icon, Input } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { t } from 'i18next'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { BiXCircle } from 'react-icons/bi'

const labelStyle = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'gray.600',
}

const License = () => {
  const [startDate] = useState(new Date())

  const {
    register,
    control,
    formState: { errors },
  } = useForm()
  const {
    fields: licenseFields,
    append,
    remove: removeLicense,
  } = useFieldArray({
    control,
    name: 'client',
  })
  return (
    <Box>
      <form>
        <Button
          leftIcon={<Icon as={AddIcon} boxSize={3} />}
          colorScheme="brand"
          variant="outline"
          mb="4"
          mt="4"
          onClick={() =>
            append({
              licenseType: '',
              licenseNumber: '',
              expiryDate: startDate.toDateString(),
              expirationFile: null,
            })
          }
        >
          Add License
        </Button>
        {licenseFields.map((license, index) => {
          return (
            <HStack spacing="4">
              <FormControl>
                <FormLabel sx={labelStyle}>License Type</FormLabel>
                <ReactSelect selectProps={{ isBorderLeft: true }} />
              </FormControl>

              <FormControl>
                <FormLabel sx={labelStyle}>License Number</FormLabel>
                <Input variant="outline-with-left-border" size="md" placeholder="Input size medium" />
              </FormControl>

              <FormControl>
                <FormLabel sx={labelStyle}>Exp Date</FormLabel>
                <Input type="date" />
              </FormControl>

              <Box>
                <FormFileInput
                  errorMessage={errors.agreement && errors.agreement?.message}
                  label={''}
                  name={`agreement`}
                  register={register}
                  style={{ mt: '50px' }}
                >
                  <Button
                    rounded="none"
                    roundedLeft={5}
                    fontSize="14px"
                    fontWeight={500}
                    color="gray.600"
                    bg="gray.100"
                    h="38px"
                    w={120}
                  >
                    {t('chooseFile')}
                  </Button>
                </FormFileInput>
              </Box>
              <Box>
                <Icon
                  as={BiXCircle}
                  boxSize={8}
                  color="#4E87F8"
                  mt="9"
                  onClick={() => removeLicense(index)}
                  cursor="pointer"
                />
              </Box>
            </HStack>
          )
        })}
      </form>
    </Box>
  )
}

export default License
