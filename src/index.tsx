import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD5eAhYwWvZWT2HedmRom-ZUFd_TVC-S_U",
  authDomain: "umactually-925d4.firebaseapp.com",
  databaseURL: "https://umactually-925d4-default-rtdb.firebaseio.com",
  projectId: "umactually-925d4",
  storageBucket: "umactually-925d4.firebasestorage.app",
  messagingSenderId: "44152076569",
  appId: "1:44152076569:web:d994024c8ca5ded76dad88",
  measurementId: "G-K77MMQHNJG",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
