import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import LoginRegister, {getCookie} from "../components/LoginRegister"

import './Home.css'
import Navbar from "./Navbar";
import {Body} from "./Body";
import Footer from "./Footer";
import Front from "./Front";

export default function Home() 
{
    return (
        <>
            <Navbar />
            {getCookie("email") == null ? <Front /> : <Body />}
            <Footer />
        </>
    );
}