import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Portfolio from './pages/Portfolio';
import KimiGuide from './pages/KimiGuide';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/guia-kimi" element={<KimiGuide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
