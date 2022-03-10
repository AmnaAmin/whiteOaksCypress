import { useCallback } from "react";
import * as yup from "yup";

export const useYupValidationResolver = (validationSchema) =>
  useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

export const PasswordFormValidationSchema = yup.object({
  currentPassword: yup.string().required("This is required field"),
  newPassword: yup.string().required("This is required field").min(4),
  confirmPassword: yup
    .string()
    .required("This is required field")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

export const usePasswordFormValidationResolver = () => {
  return useYupValidationResolver(PasswordFormValidationSchema);
};
