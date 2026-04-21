import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#E2E8F0',
            border: '1px solid #1E2A3A',
            borderRadius: '12px',
            fontFamily: 'Syne, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#00FF88', secondary: '#111827' },
          },
          error: {
            iconTheme: { primary: '#FF4545', secondary: '#111827' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
