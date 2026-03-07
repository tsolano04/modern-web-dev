import React from 'react'
import MusicListParent from './musicList/musicListParent'
import AddSongParent from './addSong/addSongParent'
import PieChartParent from './pieChart/pieChartParent'
import Footer from './Footer/Footer'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function Components() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MusicListParent />} />
        <Route path="/addSong" element={<AddSongParent />} />
        <Route path="/pieChart" element={<PieChartParent />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default Components
