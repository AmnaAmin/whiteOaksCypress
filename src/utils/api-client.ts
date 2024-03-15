import * as authApi from './auth-api'

async function client(endpoint: string, httpConfig: any | undefined = {}, customURL="") {
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

  return window.fetch(customURL+endpoint, config).then(async response => {
    const contentType = response.headers.get(`content-type`)

    if (response.status === 401) {
      // For any other API if we get 401 logout.
      // api/account returns 401 when user has been logged out.
      if (!response.url?.includes('api/account')) {
        await authApi.logout()
      } else {
        return Promise.reject({ message: `User is unauthorized to access ${endpoint}` })
      }
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
    } else if (contentType && (contentType.includes('text/xml') || contentType.includes('text'))) {
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
