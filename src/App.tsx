// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GeneralPages } from './utils/pageLinks';
import { WalletProvider } from './context/WalletContext';

const App: React.FC = () => {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>

          {GeneralPages.map(({ component: Component, path }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>

  );
};

export default App;