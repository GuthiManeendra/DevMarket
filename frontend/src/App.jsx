import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PhaseTwoPreview from './pages/PhaseTwoPreview'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PhaseTwoPreview />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
