import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import NavBar from './components/navbar';
import { ProtectedRoute } from './components/protected-route';

export function App() {
  return (
    <>
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
