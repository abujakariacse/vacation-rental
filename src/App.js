import { useEffect } from 'react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppartmentRooms from './Pages/AppartmentRooms';
import Home from './Pages/Home/Home';
import Loader from './Pages/Loader';
import Footer from './Pages/Shared/Footer';
import Navbar from './Pages/Shared/Navbar';

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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
