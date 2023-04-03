import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { KerbalUIControllerProvider } from "./context";

const container = document.getElementById('root')
if (container == null) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <KerbalUIControllerProvider>
        <App/>
      </KerbalUIControllerProvider>
    </BrowserRouter>
  </React.StrictMode>
)
