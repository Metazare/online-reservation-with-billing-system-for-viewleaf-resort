import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Layouts
import Base from './Layouts/Base/Base';

// Pages
import Default from './Pages/Default/Default';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import LandingPage from './Pages/LandingPage';
import Booking from './Pages/Login/Booking/Booking';
function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />


        <Route element={<Base />} >
          <Route path="/" element={<LandingPage/>} />
          <Route path="/Booking" element={<Booking/>} />
        </Route>
    </Routes>
  );
}

export default App;