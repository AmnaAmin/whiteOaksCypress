import * as React from 'react'

function useSafeDispatch(dispatch: (...arg: any[]) => void) {
  const mounted = React.useRef(false)
  React.useLayoutEffect((): any => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])
  return React.useCallback((...args) => (mounted.current ? dispatch(...args) : void 0), [dispatch])
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])
const defaultInitialState = { status: 'idle', data: null, error: null }
function useAsync(initialState: any) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })

  const [{ status, data, error }, setState] = React.useReducer(
    (s: any, a: any) => ({ ...s, ...a }),
    initialStateRef.current,
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(data => safeSetState({ data, status: 'resolved' }), [safeSetState])
  const setError = React.useCallback(error => safeSetState({ error, status: 'rejected' }), [safeSetState])
  const reset = React.useCallback(() => safeSetState(initialStateRef.current), [safeSetState])

  const run = React.useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      safeSetState({ status: 'pending' })
      return promise.then(
        (data: any) => {
          setData(data)
          return data
        },
        (error: any) => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [safeSetState, setData, setError],
  )

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

const useStickyState = (defaultValue, key) => {
  const [value, setValue] = React.useState(() => {
    if (!key) {
      return
    }
    const stickyValue = window.localStorage.getItem(key)
    return stickyValue !== null && stickyValue !== 'undefined' ? JSON.parse(stickyValue) : defaultValue
  })
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}

export { useAsync, useStickyState }
