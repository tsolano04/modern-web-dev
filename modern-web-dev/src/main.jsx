import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Parse from "parse";

Parse.initialize(
  "rB891TYII4L9EimcNhfG8WMFmO010TcL790maUkF",
  "FbpESKLp0Sl5NmNO2vFm4aZz0Df3V3LR6pm4S5sb"
);
Parse.serverURL = "https://parseapi.back4app.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
