import {db} from "../Firebase"
import { updateDoc, doc, deleteDoc } from "firebase/firestore";

import './TaskModal.css'

export default function TaskModal(props)
{

    //useEffect(() => { console.log("task modal render");});

    function modalClose()
    {
        //console.log("close");

        let modal = document.getElementById("task-modal-wrapper");

        modal.style.opacity = "0";
        modal.style.visibility = "hidden";

        document.getElementById("task-modal-id-hidden").value = "";

        document.getElementById("task-modal-title-text").value = "";
        document.getElementById("task-modal-title-hidden").value = "";

        document.getElementById("task-modal-list-text").value = "";
        document.getElementById("task-modal-list-hidden").value = "";
        document.getElementById("task-modal-list-text").innerHTML = "";

        document.getElementById("task-modal-details-text").value = "";
        document.getElementById("task-modal-details-hidden").value = "";





        
    }

    function modalSave()
    {
        if(document.getElementById("task-modal-open").value == "false") return;
        document.getElementById("task-modal-open").value = "false";

        //console.log("save");

        try
        {
            let taskId = document.getElementById("task-modal-id-hidden").value;

            let titleNew = document.getElementById("task-modal-title-text").value;
            //let titleOld = document.getElementById("task-modal-title-hidden").value;

            let listNew = document.getElementById("task-modal-list-text").value;
            //let listOld = document.getElementById("task-modal-list-hidden").value;

            let detailsNew = document.getElementById("task-modal-details-text").value;
            //let detailsOld = document.getElementById("task-modal-details-hidden").value;

            //alert(`taskId: ${taskId}\ntitleNew: ${titleNew} titleOld: ${titleOld}\nlistNew: ${listNew} listOld: ${listOld}\n detailsNew: ${detailsNew} detailsOld: ${detailsOld}`);

            const fetchData = async () => 
            {
                await updateDoc(doc(db, "tasks", taskId), 
                { 
                    text: titleNew,
                    list: listNew,
                    details: detailsNew

                }).then(() => 
                {
                    //fake enter key stroke on task input on main page to force a rerender so updates reflect
                    const inputElement = document.getElementById('add-text-input');
                    const enterKeyEvent = new KeyboardEvent('keydown', {key: 'Enter',code: 'Enter',which: 13,keyCode: 13,bubbles: true,cancelable: true});
                    inputElement.dispatchEvent(enterKeyEvent);

                    document.getElementById('re-render-button').click();
                    document.getElementById('lists-re-render-button').click();
                    modalClose();
                });
            };
            fetchData();
        } 
        catch (err) 
        {
            //console.log(err);
        } 
    }

    function modalDelete()
    {
        if(document.getElementById("task-modal-open").value == "false") return;
        document.getElementById("task-modal-open").value = "false";
        
        //console.log("delete");

        try
        {
            let taskId = document.getElementById("task-modal-id-hidden").value;

            const fetchData = async () => 
            {
                await deleteDoc(doc(db, "tasks", taskId)).then(() => 
                {
                    document.getElementById('re-render-button').click();
                    document.getElementById('lists-re-render-button').click();
                    modalClose();
                });
            };
            fetchData();
        } 
        catch (err) 
        {
            //console.log(err);
        } 
    }

    function handleClick(event)
    {
        if(event.target.id == "modal-close" || event.target.id == "modal-close-icon" || event.target.id == "modal-close-path")
        {
            modalClose();
        }
        else if(event.target.id == "modal-save-button")
        {
            modalSave()
        }
        else if(event.target.id == "modal-delete-button")
        {
            modalDelete()
        }
        else if(event.target.id == "task-modal-wrapper")
        {
            modalClose();
        }
        else
        {
            //alert(`who clicked me? class:${event.target.getAttribute("class")} id:${event.target.id}`);
        }
    }

    return (
    <>
        <div className="modal-wrapper" id="task-modal-wrapper" onClick={handleClick}>
                <div className="modal-window">
                    <div className="modal-header">
                        <div className="modal-nav"></div>
                        <div className="modal-title">Edit To-do</div>
                        <div className="modal-nav" id="modal-close" onClick={handleClick}>
                            <svg id="modal-close-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="modal-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="modal-body">

                        <div className="option-row task-row">
                            <span  id="task-modal-title" className="modal-title-cell">Title:</span>
                            <input id="task-modal-title-text" type="text" />
                            <input id="task-modal-title-hidden" type="hidden" value=""/>
                            
                        </div>
                        
                        <div className="option-row task-row">
                            <span  id="task-modal-list" className="modal-title-cell">List:</span>
                            <select id="task-modal-list-text" ></select>
                            <input id="task-modal-list-hidden" type="hidden" value=""/>
                        </div>

                        <div className="option-row task-row task-row-custom">
                            <span  id="task-modal-details" className="modal-title-cell">Details:</span>
                            <textarea id="task-modal-details-text" className="details-text-custom" rows="4" cols="50"></textarea>
                            <input id="task-modal-details-hidden" type="hidden" value=""/>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <input id="task-modal-id-hidden" type="hidden" value=""/>
                        <input id="task-modal-open" type="hidden" value="false"/>
                        <button type="button" id="modal-delete-button" onClick={handleClick}>Delete</button>
                        <button type="button" id="modal-save-button" onClick={handleClick}>Save</button>
                    </div>
                </div>
            </div>
    </>);
}