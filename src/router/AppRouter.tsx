import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import About from '@/pages/About'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<Home />} index />
          <Route element={<About />} path="about" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}