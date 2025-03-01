
import {useNavigate} from "react-router-dom";
import './OptionsMenu.css'
import {getCookie, setCookie, deleteCookie} from "../Tools";
import { useState, useEffect } from 'react'

export default function OptionsMenu(props)
{
    const [options, setOptions] = useState({
        showAll: getCookie("showAll"),
    });

    useEffect(() => 
    {
        
        //console.log("options render");


    });


    useEffect(() => 
    {
        
        //console.log(options.showAll);


    },[options]);


    const navigate = useNavigate();

    function handleClick(event)
    {
        if(event.target.id == "options-menu-close-cell" || event.target.id == "options-icon-close" || event.target.id == "options-icon-path")
        {
            let optionsMenuWrapper = document.getElementById('options-menu-wrapper');

            optionsMenuWrapper.style.transition = "width 1s ease-in-out, opacity 1s ease-in-out,visibility 1s ease-in-out";

            optionsMenuWrapper.style.visibility = "hidden";
            optionsMenuWrapper.style.width = "0px";
            optionsMenuWrapper.style.opacity = "0";

            document.getElementById("body-wrapper").style.pointerEvents = "auto";
            document.getElementById("body").style.position = "inherit";
        }
        else if(event.target.id == "about-icon" || event.target.id == "about-cell" || event.target.id == "about-path")
        {
            alert("about");
        }
        else if(event.target.id == "select-icon" || event.target.id == "select-path" || event.target.id == "options-check")
        {
            if(options.showAll == null || options.showAll == "false")
            {
                setCookie("showAll","true");
            }
            else
            {
                setCookie("showAll","false");
            }

            //setOptions(getCookie("showAll"));

            setOptions({showAll: getCookie("showAll")});

            //fake enter key stroke on task input to force a 
            //rerender on main page so it re querys tasks for new current list
            const inputElement = document.getElementById('add-text-input');

            const enterKeyEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              which: 13,
              keyCode: 13,
              bubbles: true,
              cancelable: true
            });
            
            inputElement.dispatchEvent(enterKeyEvent);


        }
        else if(event.target.id == "logout-button")
        {
            deleteCookie("email");
            deleteCookie("userid");
            navigate('/',{ replace: true });
        }
        else
        {
            alert(`who clicked me? class:${event.target.getAttribute("class")} id:${event.target.id}`);
        }
    }

    function StatusIcon(props)
    {
        let disp = props.checked == "true" ? "unset" : "none";
        let cls = props.checked == "true" ? "checked" : "unchecked";

        return (
            <svg id="select-icon" xmlns="http://www.w3.org/2000/svg" className={cls} width="28" height="28" fill="grey" viewBox="0 0 16 16">
                <path id="select-path" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path id="select-path" style={{display: disp}} d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
            </svg>
        );
        
    }

    return (
        <div id="options-menu-wrapper">
            <div id="options-menu-nav-bar">
                <div className="about-cell list-menu-nav-cell" id="options-menu-about-cell" title="about" onClick={handleClick}>
                    <svg id="about-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path id="about-path" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"/>
                    </svg>
                </div>
                <div className="options-menu-nav-cell" id="options-menu-title-cell">
                    <span id="menu-title">Options</span>
                </div>
                <div className="options-menu-nav-cell" id="options-menu-close-cell" onClick={handleClick}>
                    <svg id="options-icon-close" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path id="options-icon-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
            </div>
            <div id="options-menu-list-wrapper">
                <div className="options-menu-item-card">
                    <div className="check-cell" id="options-check" onClick={handleClick}>
                        <StatusIcon checked={options.showAll} />
                    </div>

                    <div id="options-name">
                        Show completed to-dos
                    </div>

                </div>
            </div>
            <div id="options-menu-body-wrapper">
                <div id="logout-wrapper">
                    <button id="logout-button" type='button' onClick={handleClick}> Log out </button>
                </div>
            </div>
        </div>
    );
}