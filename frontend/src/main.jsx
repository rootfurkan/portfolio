import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import store from './store/index'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider — tüm uygulamaya Redux store'u sağlar */}
    <Provider store={store}>
      {/* BrowserRouter — sayfa yönlendirmesi için */}
      <BrowserRouter>
        {/* HelmetProvider — SEO için <head> yönetimi */}
        <HelmetProvider>
          <App />
          {/* Toaster — bildirimler için, uygulamanın her yerinden kullanılabilir */}
          <Toaster position="top-right" />
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)