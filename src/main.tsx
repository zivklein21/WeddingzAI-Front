import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='809922866108-u1l5vt17vdb4g3q2paf2ll1nqap519qe.apps.googleusercontent.com'>
    <StrictMode>
      <App />
    </StrictMode >
  </GoogleOAuthProvider>
)
