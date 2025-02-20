import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";

import './Home.css'
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from "./Footer";


export default function Home() 
{
    const navigate = useNavigate();
    async function handleForm(event)
    {
        deleteCookie("email");
        navigate('/');
        location.reload();
    }

    return (
        <>
            <Navbar />
            <Body />
            <Footer />
        </>
    );
}