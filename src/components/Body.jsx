

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
        window.location.reload();
        //location.reload();
        //location.reload();
        //window.location.href = "/";
    }

    return (
        <>
            <div className="body-wrapper">
                <div id="add-todo-wrapper">
                    <div id="add-icon-cell">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                    </div>
                    <div id="add-text-cell">
                        <input id="add-text-input" type="text" placeholder='Add a to-do...' />
                    </div>
                </div>
                
                <div id="todo-list-wrapper">
                    <div className="list-item-card">
                        <div className="check-cell">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="grey" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                            </svg>
                        </div>
                        <div className="text-cell"><span className="task-text">A long sentance to test out blah this shit ass fuck dick tits ass. A long sentance to test out blah this shit ass fuck dick tits ass. A long sentance to test out blah this shit ass fuck dick tits ass. A long sentance to test out blah this shit ass fuck dick tits ass. </span></div>
                    </div>

                    <div className="list-item-card">
                        <div className="check-cell">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="grey" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            </svg>
                        </div>
                        <div className="text-cell"><span className="task-text">A long sentance to test out blah this shit ass fuck dick tits ass. A long sentance to test out blah this shit ass fuck dick tits ass. A long sentance to test out blah this shit ass fuck dick tits ass. A long sentance to test out blah this shit ass fuck dick tits ass. </span></div>
                    </div>

                    <div className="list-item-card">
                        <div className="check-cell">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="grey" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            </svg>
                        </div>
                        <div className="text-cell"><span className="task-text">Milk </span></div>
                    </div>



                </div>
                
                
                
                
                
                
                <br /><br /><br /><br />
                <button type='submit' onClick={handleForm}> Log out </button>
            </div>
        </>
    );
}