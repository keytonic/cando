import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import LoginRegister from "../components/LoginRegister"

import './Home.css'
import Navbar from "./Navbar";
import {Body} from "./Body";
import Footer from "./Footer";
import Front from "./Front";

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return null;
}

export function deleteCookie(name) 
{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default function Home() 
{
    const [loggedIn, setLoggedIn] = useState(getCookie("email") != null);
/*
    useEffect(() => {

        setLoggedIn(getCookie("email") != null);
        console.log(`Logged in: ${loggedIn}`);

    },[loggedIn]); */

    function Logout (props)
    {
        async function handleForm(event)
        {
            //logout
            deleteCookie("email");
            deleteCookie("userid");
            //navigate('/');
            //window.location.reload();
            setLoggedIn(getCookie("email") != null);
        }
        return (
            <div id="logout-wrapper">
                <button id="logout-button" type='submit' onClick={handleForm}> Log out </button>
            </div>
        );
    }
    
    function Which_page(props)
    {
        const isLoggedIn = props.isLoggedIn;
    
        if (isLoggedIn) 
        {
            return (<><Body /><Logout /></>);
        }
        else
        {
            return (<Front />);
        }
    }

    return (
        <>
            <Navbar />
            <Which_page isLoggedIn={loggedIn} />
            <Footer />
        </>
    );
}