import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Portfolio from './pages/Portfolio';
import KimiGuide from './pages/KimiGuide';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/guia-kimi" element={<KimiGuide />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
