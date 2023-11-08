import { fireEvent, waitFor, render, screen } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { setToken } from 'utils/storage.utils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'
import { BrowserRouter as Router } from 'react-router-dom'

jest.setTimeout(50000)

beforeAll(() => {
  setToken('')
})

afterAll(() => {
  setToken('vendor') 
})

const queryClient = new QueryClient({})

const LoginTestForm = (props: any): JSX.Element => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router basename={process.env.PUBLIC_URL}>
          <LoginForm onSubmitForm={props.submitFn} isError={props.isError} />
        </Router>
      </QueryClientProvider>
    </>
  )
}
describe('Test Login Form', () => {
  test('with Admin Account testtest@devtek.ai', async () => {
    const onSubmit = jest.fn()

    await render(<LoginTestForm submitFn={onSubmit} showDisclaimerModal={true} isError={false} />)

    const email = 'testtest@devtek.ai'
    const password = 'test'

    const form = screen.getByTestId('loginForm') as HTMLFormElement
    const emailInput = screen.getByTestId('email') as HTMLInputElement
    const passwordInput = screen.getByTestId('password') as HTMLInputElement
    const submitFormBtn = screen.getByTestId('signInButton') as HTMLButtonElement
    const forgotPasswordLink = screen.getByTestId('forgotPasswordLink') as HTMLLinkElement
    const registerBtn = screen.getByTestId('registerBtn') as HTMLButtonElement

    expect(form).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitFormBtn).toBeInTheDocument()
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(screen.queryByTestId('alertError')).toBeNull()
    expect(registerBtn).toBeInTheDocument()

    await fireEvent.change(emailInput, { target: { value: email } })
    await fireEvent.change(passwordInput, { target: { value: password } })

    expect(emailInput.value).toBe(email)
    expect(passwordInput.value).toBe(password)

    expect(forgotPasswordLink).toHaveTextContent('Forgot Password?')
    expect(submitFormBtn).toHaveTextContent('SIGN IN')
    expect(registerBtn).toHaveTextContent('Register As a Vendor')

    await userEvent.click(document.body)

    await waitFor(() => {
      userEvent.click(submitFormBtn)
    })
    // expect(screen.getByTestId('disclaimer-message')).toBeInTheDocument()
    // expect(screen.getByTestId('agreeDisclaimer')).toBeInTheDocument()

    // act(() => {
    //   userEvent.click(screen.getByTestId('agreeDisclaimer'))
    // })
    // await waitFor(() => {
    //   expect(onSubmit).toHaveBeenCalledTimes(1)
    // })
  })

  test('with Admin Account testtest@devtek.ai - Error', async () => {
    const onSubmit = jest.fn()

    await render(<LoginTestForm submitFn={onSubmit} showDisclaimerModal={true} isError={true} />)

    const email = 'testtest@devtek.ai'
    const password = 'test'

    const form = screen.getByTestId('loginForm') as HTMLFormElement
    const emailInput = screen.getByTestId('email') as HTMLInputElement
    const passwordInput = screen.getByTestId('password') as HTMLInputElement
    const submitFormBtn = screen.getByTestId('signInButton') as HTMLButtonElement
    const forgotPasswordLink = screen.getByTestId('forgotPasswordLink') as HTMLLinkElement
    const registerBtn = screen.getByTestId('registerBtn') as HTMLButtonElement

    expect(form).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitFormBtn).toBeInTheDocument()
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(screen.queryByTestId('alertError')).toBeInTheDocument()
    expect(registerBtn).toBeInTheDocument()

    await fireEvent.change(emailInput, { target: { value: email } })
    await fireEvent.change(passwordInput, { target: { value: password } })

    expect(emailInput.value).toBe(email)
    expect(passwordInput.value).toBe(password)

    expect(forgotPasswordLink).toHaveTextContent('Forgot Password?')
    expect(submitFormBtn).toHaveTextContent('SIGN IN')
    expect(registerBtn).toHaveTextContent('Register As a Vendor')

    await userEvent.click(document.body)

    await waitFor(() => {
      userEvent.click(submitFormBtn)
    })
    // expect(screen.getByTestId('disclaimer-message')).toBeInTheDocument()
    // expect(screen.getByTestId('agreeDisclaimer')).toBeInTheDocument()

    // act(() => {
    //   userEvent.click(screen.getByTestId('agreeDisclaimer'))
    // })

    // await waitFor(() => {
    //   expect(onSubmit).toHaveBeenCalledTimes(1)
    // })
  })
})
