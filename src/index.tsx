import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig as secretConfig } from "./secrets";

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMEMT_ID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY ?? secretConfig.apiKey,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN ?? secretConfig.authDomain,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL ?? secretConfig.databaseURL,
  projectId: REACT_APP_FIREBASE_PROJECT_ID ?? secretConfig.projectId,
  storageBucket:
    REACT_APP_FIREBASE_STORAGE_BUCKET ?? secretConfig.storageBucket,
  messagingSenderId:
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID ?? secretConfig.messagingSenderId,
  appId: REACT_APP_FIREBASE_APP_ID ?? secretConfig.appId,
  measurementId:
    REACT_APP_FIREBASE_MEASUREMEMT_ID ?? secretConfig.measurementId,
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
