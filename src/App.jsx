import { Routes, Route, MemoryRouter } from "react-router-dom";
import LoginRegister from "./components/LoginRegister"
import Home from "./components/Home"
import './App.css'

function App() {
    return (
        <>
            <MemoryRouter >
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/home" element={ <Home /> } />
                    <Route path="/register" element={<LoginRegister action="register" />} />
                    <Route path="/login" element={<LoginRegister action="login"/>} />
                    <Route path="*" element={ <Home /> } />
                </Routes>
            </MemoryRouter>
        </>
    )
}

export default App