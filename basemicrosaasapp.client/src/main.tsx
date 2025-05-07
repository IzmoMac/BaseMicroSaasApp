import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ForecastApp from './Forecast.tsx'
import AppLayout from './components/AppLayout.tsx';
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppLayout>
            <ForecastApp />
        </AppLayout>
    </StrictMode>,
)