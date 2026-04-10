import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppEs from './AppEs.jsx'
import Dashboard from './Dashboard.jsx'

const path = window.location.pathname;
const Page = path === '/dashboard' ? Dashboard : path === '/es' ? AppEs : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
