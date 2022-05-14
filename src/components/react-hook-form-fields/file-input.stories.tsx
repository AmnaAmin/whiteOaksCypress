import { useForm } from 'react-hook-form'
import { FormFileInput } from './file-input'

export default {
  title: 'Form/File Input',
  component: FormFileInput,
}

export const FileInput = () => {
  const { register } = useForm()
  return (
    <FormFileInput errorMessage="" name="file" register={register}>
      Choose File
    </FormFileInput>
  )
}
