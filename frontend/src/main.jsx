import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Routing from './Routing'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <Routing />
       <Toaster position="top-right" reverseOrder={false} /> 
    </StrictMode>,
  </BrowserRouter>
)
