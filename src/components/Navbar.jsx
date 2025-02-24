//https://commons.wikimedia.org/wiki/File:Star%2BCheckmark_art.png


import { Link , useNavigate,useLocation} from "react-router-dom";
import { useRef,useState, useEffect } from 'react'
import './Navbar.css'
import CandoText from '../assets/candotext.png'
import StarCheck from '../assets/star-check.svg'


function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";

    console.log(`cookie set, name: ${name}, value: ${value}, days: ${days}`);
}

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

export default function Navbar() 
{

    const navigate = useNavigate();

    function closeAlert(event)
    {
        document.getElementById("login-bar-alert").style.display = "none";
        setCookie("accept-cookies", "true", 365);
    }
    useEffect(() => {

        if(getCookie("accept-cookies") == null)
        {
            document.getElementById("login-bar-alert").style.display = "flex";
        }

    }, []);

    function login_register(event)
    {
        if(event.target.id == "sign-in")
        {
            navigate("/login");
        }
        else if(event.target.id == "get-started")
        {
            navigate("/register");
        }
    }
    function Which_bar(props) 
    {
        const isLoggedIn = props.isLoggedIn;

        const location = useLocation();

        //alert(location.pathname);

        if(location.pathname.indexOf("/register") != -1 || location.pathname.indexOf("/login") != -1)
        {
            return (<></>);
        }

        if (isLoggedIn) 
        {
          return(
            <div className="navbar-wrapper">
                <div className="nav-cell" title="Lists">
                    <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/>
                        <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/>
                        <path d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/>
                    </svg>
                </div>
                <div className="nav-cell title-cell"><span id="span-title-id">Shopping</span></div>
                <div className="nav-cell" title="Options">
                    <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white"  viewBox="0 0 16 16">
                        <path d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                    </svg>
                </div>
            </div>
          );
        }
        else 
        {
            return (
                <>
                    <div className="login-bar-alert" id="login-bar-alert">
                        <div className="login-bar-alert-cell" id="alert-text">
                            <span>This site uses cookies for analytics, personalized content and ads. By continuing to browse this site, you agree to this use. <a href="#">Learn More.</a></span>
                        </div>
                        <div className="login-bar-alert-cell" id="close-alert" onClick={closeAlert} >
                            <svg id="close-alert-svg"  xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#747474" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </div>
                    </div>
                    <div className="login-bar">
                        <div id="login-bar-logo">
                            <Link to="/">
                                <img id="star-check" src={StarCheck} />
                                <img id="canndo-text" src={CandoText} />
                            </Link>


                        </div>
                        <div id="login-bar-buttons">
                            <button id="sign-in" onClick={login_register}>Login</button>
                            <button id="get-started" onClick={login_register}>Get Started</button>
                        </div>
                    </div>
                </>
            );
        }

    }

    return(
        <div id="top-container">
            <Which_bar isLoggedIn={getCookie("email") != null} />
        </div>
    );
}