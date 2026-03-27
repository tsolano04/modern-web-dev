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

// TODO: replace with real auth check once authentication service is added
const isAuthenticated = false;

function Components() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MusicListParent />} />
        <Route
          path="/addSong"
          element={<ProtectedRoute element={AddSongParent} flag={isAuthenticated} />}
        />
        <Route
          path="/pieChart"
          element={<ProtectedRoute element={PieChartParent} flag={isAuthenticated} />}
        />
        <Route path="/register" element={<AuthRegister />} />
        <Route path="/login" element={<AuthLogin />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default Components
