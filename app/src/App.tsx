import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Portfolio from './pages/Portfolio';

const KimiGuide = lazy(() => import('./pages/KimiGuide'));

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route
          path="/guia-kimi"
          element={
            <Suspense fallback={<div className="min-h-dvh bg-[#121416]" aria-busy="true" />}>
              <KimiGuide />
            </Suspense>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
