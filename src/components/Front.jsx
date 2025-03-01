
import './Front.css'
import {getCookie, setCookie} from "../Tools"
import { useEffect } from 'react'
import { Link , useNavigate } from "react-router-dom";

import CandoText from '../assets/candotext.png'
import StarCheck from '../assets/star-check.svg'

export default function Front() 
{
    const navigate = useNavigate();

    useEffect(() => {

        if(getCookie("accept-cookies") == null)
        {
            const alert_bar = document.getElementById("login-bar-alert");

            if(alert_bar != null)
            {
                document.getElementById("login-bar-alert").style.display = "flex";
            }
        }

        window.addEventListener("beforeinstallprompt", function (event) 
        {
            event.preventDefault();
    
            var deferredPromp = event;
    
            const installButton = document.getElementById("installButton");
            installButton.style.display = "block";
    
            installButton.addEventListener("click", function (event) 
            {
                deferredPromp.prompt();
    
                deferredPromp.userChoice.then((choiceResult) => 
                {
                    if (choiceResult.outcome === 'accepted') 
                    {
                        //console.log("User accepted PWA install");
                    }
                    else 
                    {
                        //console.log("User declined PWA install");
                    }
    
                    deferredPromp = null;
                    installButton.style.display = "none";
                });
            });
        });

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

    function closeAlert(event)
    {
        const alert_bar = document.getElementById("login-bar-alert");

        if(alert_bar != null)
        {
            document.getElementById("login-bar-alert").style.display = "none";
            setCookie("accept-cookies", "true", 365);
        }
    }

    return (
        <>
            <div id="top-container">
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
            </div>
            <div id="front-wrapper">
                <span>Splash page content comming soon!</span>
                <button id="installButton" type="button">Install</button>
            </div>
        </>
    );
}