import React from 'react'
import MusicListParent from './musicList/musicListParent'
import AddSongParent from './addSong/addSongParent'
import PieChartParent from './pieChart/pieChartParent'
import Footer from './Footer/Footer'
import Navbar from './Navbar/Navbar'
import AuthRegister from "./Auth/AuthRegister";
import AuthLogin from "./Auth/AuthLogin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
//contatins all the components and routing
function Components() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MusicListParent />} />
        <Route path="/addSong" element={<AddSongParent />} />
        <Route path="/pieChart" element={<PieChartParent />} />
        <Route path="/register" element={<AuthRegister />} />
        <Route path="/login" element={<AuthLogin />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default Components
