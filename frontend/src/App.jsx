// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Market from './pages/Market';


function ConnectedRoutes() {
  return (
    <Header />
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Router>
      <Routes>
        {/* <Route path="*" element={<Navigate to={isConnected ? "/admin" : "/login"} />} /> */}
        <Route path="/login" element={<Login setIsConnected={setIsConnected} />} />
      </Routes>

      <Routes element={<ConnectedRoutes />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/market" element={<Market />} />
      </Routes>
    </Router>
  );
}

export default App;
