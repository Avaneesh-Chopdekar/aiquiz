import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import NavBar from './components/navbar';
import { ProtectedRoute } from './components/protected-route';
import { useAuthStore } from './store';
import { useEffect } from 'react';

function BootstrapAuth() {
  const refreshUser = useAuthStore((s) => s.refreshUser);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return null;
}

export function App() {
  return (
    <>
      <BootstrapAuth />
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
