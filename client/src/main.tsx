import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'

import store from './store'
import { Provider } from 'react-redux'
import Join from './Join.tsx'
import Share from './Share.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route >
            <Route index element={<App />}></Route>
            <Route path="join/:room_id" element={<Join />} />
            <Route path="share/:room_id" element={<Share />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
