import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PetDetails from './pages/PetDetails';
import AddPet from './pages/AddPet';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          <Route path="/add-pet" element={<AddPet />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;