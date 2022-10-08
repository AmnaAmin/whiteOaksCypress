import {
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  SimpleGrid,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import zxcvbn from 'zxcvbn'

export const PasswordField: React.FC<{ errors: any; register: any }> = ({ register, errors }) => {
  const [password, setPassword] = useState(false)
  const { t } = useTranslation()

  const [strength, setStrength] = useState(0)
  const { type, colorScheme } = useMemo(() => {
    if (strength === 0) {
      return {
        type: 'empty',
        colorScheme: 'lightgray',
      }
    } else if (strength <= 1 && strength > 0) {
      return {
        type: 'weak',
        colorScheme: 'strengthColor',
      }
    } else if (strength > 2 && strength <= 3) {
      return {
        type: 'average',
        colorScheme: 'orange',
      }
    }

    return {
      type: 'strong',
      colorScheme: 'green',
    }
  }, [strength])

  const handleClickSecond = () => setPassword(!password)

  return (
    <FormControl w="215px">
      <FormLabel variant="strong-label" size="md">
        {t('userManagementTranslation.managementModals.password')}
      </FormLabel>
      <InputGroup size="md">
        <Input
          type={password ? 'text' : 'password'}
          id="password"
          {...register('password')}
          rounded="6px"
          onInput={event => {
            const value = event.currentTarget.value
            let score = zxcvbn(value).score
            if (score === 0 && value !== '') {
              score = 1
            }
            setStrength(score)
          }}
        />
        <InputRightElement h="40px">
          <Icon
            as={password ? BsEyeSlash : BsEye}
            onClick={handleClickSecond}
            fontSize="13px"
            color="gray.600"
            _hover={{ color: 'black' }}
          />
        </InputRightElement>
      </InputGroup>

      <FormControl height={29} mt={2}>
        <FormLabel fontStyle="normal" fontSize="10px" fontWeight={400} lineHeight="15px" color="#374151">
          {t('userManagementTranslation.managementModals.passwordStrength')}
        </FormLabel>
        <SimpleGrid columns={3} row={1} gap={2} w="215px">
          <Progress
            colorScheme={colorScheme}
            w="65px"
            h="4px"
            bg="#E2E8F0"
            rounded="4px"
            value={type === 'empty' ? 0 : 100}
          />
          <Progress
            colorScheme={colorScheme}
            w="65px"
            h="4px"
            bg="#E2E8F0"
            rounded="4px"
            value={type === 'weak' || type === 'empty' ? 0 : 100}
          />
          <Progress
            colorScheme={colorScheme}
            w="65px"
            h="4px"
            bg="#E2E8F0"
            rounded="4px"
            value={type === 'empty' || type === 'weak' || type === 'average' ? 0 : 100}
          />
        </SimpleGrid>
      </FormControl>
    </FormControl>
  )
}
