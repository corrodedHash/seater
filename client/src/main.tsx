import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/pages/App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'

import store from '@/store'
import { Provider } from 'react-redux'
import Join from '@/pages/Join.tsx'
import Share from '@/pages/Share.tsx'
import Room from '@/pages/Room.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route >
            <Route index element={<App />}></Route>
            <Route path="join/:room_id" element={<Join />} />
            <Route path="share/:room_id" element={<Share />} />
            <Route path="room/:room_id" element={<Room />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
