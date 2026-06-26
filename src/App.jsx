import { useEffect } from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AppartmentRooms from "./Pages/AppartmentRooms.jsx";
import Home from "./Pages/Home/Home.jsx";
import Loader from "./Pages/Shared/Loader.jsx";
import Footer from "./Pages/Shared/Footer.jsx";
import Navbar from "./Pages/Shared/Navbar.jsx";
import Blogs from "./Pages/Blogs.jsx";
import Contact from "./Pages/Contact.jsx";
import About from "./Pages/About.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import RoomDetail from "./Pages/RoomDetail.jsx";
import Cart from "./Pages/Cart.jsx";
import PasswordReset from "./Pages/PasswordReset.jsx";
import NotFound from "./Pages/NotFound.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import MyBookings from "./Pages/Dashboard/MyBookings.jsx";
import DashboardIndex from "./Pages/Dashboard/DashboardIndex.jsx";
import AddReview from "./Pages/Dashboard/AddReview.jsx";
import AllBookings from "./Pages/Dashboard/AllBookings.jsx";
import Customers from "./Pages/Dashboard/Customers.jsx";
import Team from "./Pages/Dashboard/Team.jsx";
import RoomsAdmin from "./Pages/Dashboard/RoomsAdmin.jsx";
import AdminBookRoom from "./Pages/Dashboard/AdminBookRoom.jsx";
import AddBlog from "./Pages/Dashboard/AddBlog.jsx";
import BlogsAdmin from "./Pages/Dashboard/BlogsAdmin.jsx";
import MyQuestions from "./Pages/Dashboard/MyQuestions.jsx";
import AdminQuestions from "./Pages/Dashboard/AdminQuestions.jsx";
import AdminReviews from "./Pages/Dashboard/AdminReviews.jsx";
import BlogDetail from "./Pages/BlogDetail.jsx";
import Profile from "./Pages/Profile.jsx";
import AskQuestion from "./Pages/AskQuestion.jsx";
import RequireAuth from "./Pages/Shared/RequireAuth.jsx";
import RequireAdmin from "./Pages/Shared/RequireAdmin.jsx";

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
        <Route path="rooms" element={<AppartmentRooms />}></Route>
        <Route path="blogs" element={<Blogs />}></Route>
        <Route path="blogDetail/:slug" element={<BlogDetail />}></Route>
        <Route path="contact" element={<Contact />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="passwordreset" element={<PasswordReset />}></Route>
        <Route path="roomDetail/:slug" element={<RoomDetail />}></Route>
        <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>}></Route>
        <Route path="question/create" element={<RequireAuth><AskQuestion /></RequireAuth>}></Route>
        <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>}>
          <Route index element={<DashboardIndex />}></Route>
          <Route path="mybookings" element={<MyBookings />}></Route>
          <Route path="cart" element={<Cart />}></Route>
          <Route path="addreview" element={<AddReview />}></Route>
          <Route path="myquestions" element={<MyQuestions />}></Route>
          <Route path="allbookings" element={<RequireAdmin><AllBookings /></RequireAdmin>}></Route>
          <Route path="customers" element={<RequireAdmin><Customers /></RequireAdmin>}></Route>
          <Route path="rooms" element={<RequireAdmin><RoomsAdmin /></RequireAdmin>}></Route>
          <Route path="admin-book-room" element={<RequireAdmin><AdminBookRoom /></RequireAdmin>}></Route>
          <Route path="addblog" element={<RequireAdmin><AddBlog /></RequireAdmin>}></Route>
          <Route path="blogs" element={<RequireAdmin><BlogsAdmin /></RequireAdmin>}></Route>
          <Route path="team" element={<RequireAdmin><Team /></RequireAdmin>}></Route>
          <Route path="questions" element={<RequireAdmin><AdminQuestions /></RequireAdmin>}></Route>
          <Route path="reviews" element={<RequireAdmin><AdminReviews /></RequireAdmin>}></Route>
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
