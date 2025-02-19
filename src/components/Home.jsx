import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";

import './Home.css'


function deleteCookie(name) 
{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}



export default function Home() 
{
    const navigate = useNavigate();
    async function handleForm(event)
    {
        
        deleteCookie("email");
        //location.reload();
        navigate('/');
        location.reload();
    }

    useEffect(() => {
        document.getElementById("logo").classList.add("logo_move");
    }, []); 

    return (
        <>
            <span>Welcome home!</span><br /><br /><br /><br />
            <button type='submit' onClick={handleForm}> Log out </button>
        </>
    );
}