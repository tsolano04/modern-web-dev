import React from 'react'
import MusicListParent from './musicList/musicListParent'
import AddSongParent from './addSong/addSongParent'
import PieChartParent from './pieChart/pieChartParent'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function Components() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MusicListParent />} />
        <Route path="/add-song" element={<AddSongParent />} />
        <Route path="/pie-chart" element={<PieChartParent />} />
      </Routes>
    </Router>
  )
}

export default Components
