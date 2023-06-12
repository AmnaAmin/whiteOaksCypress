import * as authApi from './auth-api'

async function client(endpoint: string, httpConfig: any | undefined = {}) {
  const { data, token, headers: customHeaders, ...customConfig } = httpConfig
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(endpoint, config).then(async response => {
    const contentType = response.headers.get(`content-type`)

    if (response.status === 401) {
      await authApi.logout()
      // refresh the page for them
      // @ts-ignore
      // return Promise.reject({ message: `User is unauthorized to access ${endpoint}` })
    }

    if (response.statusText === 'No Content') {
      return null
    }

    if (response.status === 204) {
      return null
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      if (response.ok) {
        return { data, headers: response.headers }
      } else {
        return Promise.reject(data)
      }
    } else if (contentType && contentType.includes('text/xml')) {
      const data = await response.text()
      if (response.ok) {
        return { data, headers: response.headers }
      } else {
        return Promise.reject(data)
      }
    }

    if (contentType && contentType.includes('application/problem+json')) {
      const data = await response.json()
      return Promise.reject(data)
    }

    return Promise.resolve({ data: null, headers: response.headers })
  })
}

export { client }
