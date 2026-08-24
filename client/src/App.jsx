import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PetDetails from './pages/PetDetails';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Chat from './pages/Chat';
import Inbox from './pages/Inbox';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/pets/:id/edit" element={<EditPet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/chat/:petId/:receiverId" element={<Chat />} />
          <Route path="/inbox" element={<Inbox />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;