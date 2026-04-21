import React from 'react'
import MusicListParent from './musicList/musicListParent'
import AddSongParent from './addSong/addSongParent'
import PieChartParent from './pieChart/pieChartParent'
import Footer from './Footer/Footer'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import Navbar from './Navbar/Navbar'
import AuthRegister from "./Auth/AuthRegister";
import AuthLogin from "./Auth/AuthLogin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react";
import Parse from "parse";

function Components() {
    const [flag, setFlag] = useState(false);

  useEffect(() => {
    const currentUser = Parse.User.current();
    setFlag(!!currentUser);
  }, []);
  return (
    <Router>
      <Navbar setFlag={setFlag} />
      <Routes>
        <Route path="/" element={<MusicListParent />} />
        <Route
          path="/addSong"
          element={<ProtectedRoute element={AddSongParent} flag={flag} />}
        />
        <Route
          path="/pieChart"
          element={<ProtectedRoute element={PieChartParent} flag={flag} />}
        />
        <Route path="/register" element={<AuthRegister />} />
        <Route path="/login" element={<AuthLogin setFlag={setFlag}/>} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default Components
