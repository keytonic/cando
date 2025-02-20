
import { useState, useEffect } from 'react'
import './App.css'
import LoginRegister from "./components/LoginRegister"

import Home from "./components/Home"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


function App() {
    return (
        <>
            <BrowserRouter basename="/cando">
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="home" element={ <Home /> } />
                    <Route path="register" element={<LoginRegister action="register" />} />
                    <Route path="login" element={<LoginRegister action="login"/>} />
                    <Route path="*" element={ <Home /> } />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App