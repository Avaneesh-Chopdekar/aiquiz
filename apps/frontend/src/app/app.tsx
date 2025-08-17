import { Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import NavBar from './components/navbar';

export function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
