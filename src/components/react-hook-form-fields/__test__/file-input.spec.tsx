// import { fireEvent } from '@testing-library/react'
// import { act } from 'react-dom/test-utils'
// import { screen } from 'utils/test-utils'
// import App from 'App'
// import userEvent from '@testing-library/user-event'

// const chooseFilebyTestId = (id, filename) => {
//   const inputEl = screen.getByTestId(id)
//   // Create dummy file then upload
//   const file = new File(['(⌐□_□)'], filename, {
//     type: 'image/png',
//   })

//   userEvent.upload(inputEl, file)

//   expect(screen.getByText(new RegExp(filename))).toBeInTheDocument()
// }

// jest.setTimeout(150000)

/* keeping as it is for now. Will create a story and change this */

// @ts-ignore
describe('File Input test cases', () => {
  it('File dummy test case', () => {})
  //   it('documents upload successfully in Vendor Profile documents tab', async () => {
  // await render(<App />, { route: '/vendors' })
  // const documents = screen.getByTestId('documents')
  // act(() => {
  //   fireEvent.click(documents)
  // })
  // chooseFilebyTestId('fileInputW9Document', 'w9document.png')
  // chooseFilebyTestId('fileInputAgreement', 'agreement.png')
  // chooseFilebyTestId('fileInputInsurance', 'insurance.png')
  // chooseFilebyTestId('fileInputCoiGlExp', 'coiGlExp.png')
  // chooseFilebyTestId('fileInputCoiWcExp', 'colWcExp.png')
  //   })
})
