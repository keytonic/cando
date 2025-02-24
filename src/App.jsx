
import { useState, useEffect } from 'react'
import './App.css'
import LoginRegister from "./components/LoginRegister"

import Home from "./components/Home"
import { BrowserRouter, Routes, Route, Link, MemoryRouter } from "react-router-dom";


function App() {
    return (
        <>
            <MemoryRouter >
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="home" element={ <Home /> } />
                    <Route path="register" element={<LoginRegister action="register" />} />
                    <Route path="login" element={<LoginRegister action="login"/>} />
                    <Route path="*" element={ <Home /> } />
                </Routes>
            </MemoryRouter>
        </>
    )
}

export default App