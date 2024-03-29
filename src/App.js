import { useEffect } from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AppartmentRooms from "./Pages/AppartmentRooms";
import Home from "./Pages/Home/Home";
import Loader from "./Pages/Shared/Loader";
import Footer from "./Pages/Shared/Footer";
import Navbar from "./Pages/Shared/Navbar";
import Services from "./Pages/Services";
import Blogs from "./Pages/Blogs";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import RoomDetail from "./Pages/RoomDetail";
import Cart from "./Pages/Cart";
import PasswordReset from "./Pages/PasswordReset";
import NotFound from "./Pages/NotFound";
import Dashboard from "./Pages/Dashboard/Dashboard";
import MyBookings from "./Pages/Dashboard/MyBookings";
import AddReview from "./Pages/Dashboard/AddReview";
import AllBookings from "./Pages/Dashboard/AllBookings";
import Customers from "./Pages/Dashboard/Customers";
import Team from "./Pages/Dashboard/Team";
import BlogDetail from "./Pages/BlogDetail";

function App() {
  /*   const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let timer1 = setTimeout(() => setLoading(false), 1100);
    return () => {
      clearTimeout(timer1);
    };
  }, []);
  if (Loading) {
    return <Loader />;
  } */
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="about" element={<About />}></Route>
        <Route path="room" element={<AppartmentRooms />}></Route>
        <Route path="services" element={<Services />}></Route>
        <Route path="blogs" element={<Blogs />}></Route>
        <Route path="blogDetail/:id" element={<BlogDetail />}></Route>
        <Route path="contact" element={<Contact />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="passwordreset" element={<PasswordReset />}></Route>
        <Route path="roomDetail/:id" element={<RoomDetail />}></Route>
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<MyBookings />}></Route>
          <Route path="cart" element={<Cart />}></Route>
          <Route path="addreview" element={<AddReview />}></Route>
          <Route path="allbookings" element={<AllBookings />}></Route>
          <Route path="customers" element={<Customers />}></Route>
          <Route path="team" element={<Team />}></Route>
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
