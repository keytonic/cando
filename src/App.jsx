//cando
// 
import { useState, useEffect } from 'react'
import './App.css'
import { Login, Register } from "./components/LoginForm";
import { setCookie, getCookie } from "./components/LoginForm"
import Home from "./components/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {


  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={ getCookie("email") != null ? <Home /> : <Login /> } />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={ getCookie("email") != null ? <Home /> : <Login /> } />
        </Routes>
        </BrowserRouter>
    </>
  )
}

export default App