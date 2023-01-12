// import { User } from "types/user";
const localStorageKey = 'jhi-authenticationToken'

async function client(endpoint: string, data: unknown, headers = { 'Content-Type': 'application/json' }) {
  const config = {
    method: 'POST',
    body: typeof data === 'string' ? data : JSON.stringify(data),
    headers,
  }
  return window
    .fetch(`/api/${endpoint}`, config)
    .then(async response => {
      let data
      const contentType = response.headers.get('content-type')
      const isJson = contentType && contentType.includes('application/json')

      // For reason unknown acction confirm api does not return json response
      if (endpoint === 'account/confirm') {
        if (response.ok) {
          return response.body
        } else {
          return Promise.reject(response)
        }
      }

      if (isJson) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
    .then(error => {
      return error
    })
}

function handleUserResponse(user: any) {
  window.localStorage.setItem(localStorageKey, user.id_token)
  return user
}

function login({ email, password }: { email: string; password: string }) {
  return client('authenticate', {
    username: email,
    password,
    firebaseToken: null,
    rememberMe: false,
  }).then(handleUserResponse)
}

function forgetPassword(email: string) {
  const headers = { 'Content-Type': 'text/plain' }

  return client('account/reset-password/init', `${email}`, headers)
}

function resetPassword(payload: { newPassword: string; key: string }) {
  return client('account/reset-password/finish', payload)
}

function register(payload: unknown) {
  return client('account/confirm', payload)
}

async function logout() {
   window.location.href = window.location.origin
   return Promise.resolve()
}

export { login, forgetPassword, resetPassword, register, logout, localStorageKey }
