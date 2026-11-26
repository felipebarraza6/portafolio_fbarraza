import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Portfolio from './pages/Portfolio';

const KimiGuide = lazy(() => import('./pages/KimiGuide'));

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="/guia-kimi"
          element={
            <Suspense fallback={<div className="min-h-dvh bg-[#121416]" aria-busy="true" />}>
              <KimiGuide />
            </Suspense>
          }
        />
        <Route path="/cerebro" element={<Navigate to="/cortex" replace />} />
        <Route path="/productos" element={<Navigate to="/plataformas" replace />} />
        <Route path="/*" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
