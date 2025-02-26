import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import LoginRegister from "../components/LoginRegister"
import {getCookie, deleteCookie, setCookie} from "../Tools"
import './Home.css'
import Navbar from "./Navbar";
import {Body} from "./Body";
import Footer from "./Footer";
import Front from "./Front";



export default function Home() 
{
    const [loggedIn, setLoggedIn] = useState(getCookie("email") != null);


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