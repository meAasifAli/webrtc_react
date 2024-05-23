import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SocketContextprovider from '../src/context/SocketProvider.jsx'
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketContextprovider>
        <App />
      </SocketContextprovider>
    </BrowserRouter>
  </React.StrictMode>,
)
