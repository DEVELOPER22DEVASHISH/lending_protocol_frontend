import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import RainbowKitWrapper from './providers/RainbowKitWrapper';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <RainbowKitWrapper>
    <App />
    </RainbowKitWrapper>
  </StrictMode>,
)
