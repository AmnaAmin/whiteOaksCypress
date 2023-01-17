import { useCallback } from 'react'
import * as yup from 'yup'

export const useYupValidationResolver = validationSchema =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        })

        return {
          values,
          errors: {},
        }
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        }
      }
    },
    [validationSchema],
  )

export const PasswordFormValidationSchema = yup.object({
  currentPassword: yup.string().required('This is required field'),
  newPassword: yup.string().required('This is required field').min(4, 'New password must be at least 4 characters'),
  confirmPassword: yup
    .string()
    .required('This is required field')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
})

export const usePasswordFormValidationResolver = () => {
  return useYupValidationResolver(PasswordFormValidationSchema)
}

export const phoneRegex = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

export const validateTelePhoneNumber = ( number: string ): boolean => {
  return number ? number.match(/\d/g)?.length===10 : false;
}