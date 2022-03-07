import React from "react";
import {
  FormErrorMessage,
  FormControl,
  FormLabel,
  InputGroup,
  Box,
  Select,
} from "@chakra-ui/react";
import { Controller, Control } from "react-hook-form";
// import Select from '../form/react-select' (unable to apply custom styles to react-select component)

type SelectProps = {
  errorMessage: any;
  label?: string;
  name: string;
  control: Control;
  className?: string;
  options: { label: string | number; value: string }[];
  rules?: any;
  size?: "lg" | "sm";
  controlStyle?: any;
  elementStyle?: any;
};

export const FormSelect = React.forwardRef((props: SelectProps, ref) => (
  <FormControl
    size={props.size || "lg"}
    {...props.controlStyle}
    isInvalid={!!props.errorMessage}
  >
    <FormLabel fontSize={props.size || "lg"} htmlFor={props.name}>
      {props.label}
    </FormLabel>
    <Controller
      control={props.control}
      name={props.name}
      rules={props.rules}
      render={({ field, fieldState }) => (
        <>
          <InputGroup>
            <Select
              {...field}
              {...props.elementStyle}
              size={props.size || "lg"}
            >
              <option value={""}>Select..</option>
              {props.options.map((option, index) => {
                return (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </Select>
          </InputGroup>
          <Box minH="20px" mt="3px">
            <FormErrorMessage m="0px">
              {fieldState.error?.message}
            </FormErrorMessage>
          </Box>
        </>
      )}
    />
  </FormControl>
));
