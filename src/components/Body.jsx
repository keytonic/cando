

import { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";


import './Body.css'

function deleteCookie(name) 
{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}




export default function Body() 
{
    const navigate = useNavigate();
    async function handleForm(event)
    {
        deleteCookie("email");
        navigate('/');
        //location.reload();
        //location.reload();
        //window.location.href = "/";
    }

    return (
        <>
            <div className="body-wrapper">
                <span>Welcome home!</span><br /><br /><br /><br />
                <button type='submit' onClick={handleForm}> Log out </button>
            </div>
        </>
    );
}