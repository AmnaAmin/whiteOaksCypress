import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Providers } from 'providers'
import 'focus-visible/dist/focus-visible'

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)
