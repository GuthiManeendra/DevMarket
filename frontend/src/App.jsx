import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/app.css'

function WelcomePage() {
  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center">
      <h1 className="display-4 fw-semibold text-primary">Welcome to DevMarket</h1>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
