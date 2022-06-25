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
        <Route path='appartmentrooms' element={<AppartmentRooms />}></Route>
        <Route path='services' element={<Services />}></Route>
        <Route path='blogs' element={<Blogs />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
