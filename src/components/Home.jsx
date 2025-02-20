import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import LoginRegister, {getCookie} from "../components/LoginRegister"

import './Home.css'
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from "./Footer";


export default function Home() 
{
    return (
        <>
            {getCookie("email") == null ? <LoginRegister action="login"/> : <><Navbar /><Body /><Footer /></>}
        </>
    );
}