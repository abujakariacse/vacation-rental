import { useEffect } from 'react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppartmentRooms from './Pages/AppartmentRooms';
import Home from './Pages/Home/Home';
import Loader from './Pages/Shared/Loader';
import Footer from './Pages/Shared/Footer';
import Navbar from './Pages/Shared/Navbar';
import Services from './Pages/Services';
import Blogs from './Pages/Blogs';
import Contact from './Pages/Contact';
import About from './Pages/About';
import Login from './Pages/Login';
import Register from './Pages/Register';
import RoomDetail from './Pages/RoomDetail';

function App() {
  const [Loading, setLoading] = useState(false);

  useEffect(
    () => {
      setLoading(true)
      let timer1 = setTimeout(() => setLoading(false), 1100);
      return () => {
        clearTimeout(timer1);
      };
    }, [])
  if (Loading) {
    return <Loader />
  }
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='home' element={<Home />}></Route>
        <Route path='about' element={<About />}></Route>
        <Route path='room' element={<AppartmentRooms />}></Route>
        <Route path='services' element={<Services />}></Route>
        <Route path='blogs' element={<Blogs />}></Route>
        <Route path='contact' element={<Contact />}></Route>
        <Route path='login' element={<Login />}></Route>
        <Route path='register' element={<Register />}></Route>
        <Route path='roomDetail/:id' element={<RoomDetail />}></Route>
        <Route path='room/roomDetail/:id' element={<RoomDetail />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
