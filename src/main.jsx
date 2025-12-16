import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App'
import './index.css'
import { FileProvider } from './contexts/FileContext'
import { AudioControlProvider } from './contexts/AudioControlContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <FileProvider>
    <AudioControlProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AudioControlProvider >
  </FileProvider>
  // </React.StrictMode>,
)
