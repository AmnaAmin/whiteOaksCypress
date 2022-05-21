import ChooseFileField from './choose-file'
import { Grid, GridItem } from '@chakra-ui/react'

export default {
  title: 'Form/ChooseFile',
  component: ChooseFileField,
}

export const Basic = () => {
  return (
    <Grid gridTemplateColumns="350px" gap="30px">
      <GridItem>
        <ChooseFileField
          name="file"
          value=""
          isError={false}
          onChange={(file: any) => {
            //   onFileChange(file)
            //   field.onChange(file)
          }}
          // onClear={() => setValue(field.name, null)}
        >
          Choose File
        </ChooseFileField>
      </GridItem>
      <GridItem>
        <ChooseFileField
          name="file"
          value=""
          isError={false}
          onChange={(file: any) => {
            //   onFileChange(file)
            //   field.onChange(file)
          }}
          // onClear={() => setValue(field.name, null)}
        >
          Choose File
        </ChooseFileField>
      </GridItem>
      <GridItem>
        <ChooseFileField
          name="file"
          value=""
          isError={false}
          onChange={(file: any) => {
            //   onFileChange(file)
            //   field.onChange(file)
          }}
          // onClear={() => setValue(field.name, null)}
        >
          Choose File
        </ChooseFileField>
      </GridItem>
    </Grid>
  )
}

export const WithError = () => {
  return (
    <ChooseFileField
      name="file"
      value=""
      isError={true}
      onChange={(file: any) => {
        //   onFileChange(file)
        //   field.onChange(file)
      }}
      // onClear={() => setValue(field.name, null)}
    >
      Choose File
    </ChooseFileField>
  )
}
