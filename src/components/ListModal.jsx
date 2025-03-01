import {db} from "../Firebase"
import { collection, addDoc, getDocs, query, where, documentId, updateDoc, doc } from "firebase/firestore";
import { useState } from "react";
import {getCookie, setCookie, deleteCookie} from "../Tools";
import './ListModal.css'


export default function ListModal(props)
{

    const [state, setState] = useState(previousState => {
        return { 
            ...previousState, 
            open: false 
        }
      });


    function modalClose()
    {
        let modal = document.getElementById("list-modal-wrapper");

        modal.style.opacity = "0";
        modal.style.visibility = "hidden";

        document.getElementById("list-modal-text").value = "";
        document.getElementById("list-modal-text-hidden").value = "";
        document.getElementById("list-modal-id-hidden").value = "";
    }

    function modalSave()
    {
        const oldName = document.getElementById("list-modal-text-hidden").value;
        const newName = document.getElementById("list-modal-text").value;
        const listId  = document.getElementById("list-modal-id-hidden").value;

        if(newName == null) 
        {
            modalClose();
            return;
        }
        if(newName === oldName) 
        {
            modalClose();
            return;
        }

        const fetchData = async () => 
        {
            try 
            {
                const email = getCookie("email");
                if(email == null) 
                {
                    modalClose();
                    return;
                }

                const userid = getCookie("userid");
                if(userid == null) 
                {
                    modalClose();
                    return;
                }

                const q = query(collection(db, "users"), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                
                let oldLists = [];
    
                if(querySnapshot.empty === false)
                {
                    querySnapshot.forEach((doc) => {
                        oldLists = doc.data().lists;
                    });
                }

                //does a list with this name already exist?
                if(oldLists.includes(newName) == true)
                {
                    modalClose();
                    return;
                }

                for (let i = 0; i < oldLists.length; i++) {
                    if (oldLists[i] === oldName) {
                        oldLists[i] = newName; 
                    }
                }
                await updateDoc(doc(db, "users", userid), { lists: oldLists }).then(() => {
                    document.getElementById(listId).querySelector("#list-name").innerText = newName;
                });

            } 
            catch (err) 
            {
                console.log(err);
            } 
        };
        fetchData();
        modalClose();
    }

    function modalDelete()
    {
        const listName = document.getElementById("list-modal-text-hidden").value;
        const listId  = document.getElementById("list-modal-id-hidden").value;

        const fetchData = async () => 
        {
            try 
            {
                const email = getCookie("email");

                if(email == null) 
                {
                    modalClose();
                    return;
                }

                const userid = getCookie("userid");

                if(userid == null) 
                {
                    modalClose();
                    return;
                }

                const q = query(collection(db, "users"), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                
                let oldLists = [];
    
                if(querySnapshot.empty === false)
                {
                    querySnapshot.forEach((doc) => {
                        oldLists = doc.data().lists;
                    });
                }

                //remove list from array
                let newLists = oldLists.filter(item => item !== listName);

                if(getCookie("list") === listName)
                {
                    deleteCookie("list");
                }

                await updateDoc(doc(db, "users", userid), { lists: newLists }).then(() => {
                    document.getElementById(listId).remove();
                });
            } 
            catch (err) 
            {
                console.log(err);
            } 
        };
        fetchData();
        modalClose();
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
    }



    return (<>
    
    
        <div className="modal-wrapper" id="list-modal-wrapper">
            <div className="modal-window">
                <div className="modal-header">
                    <div className="modal-nav"></div>
                    <div className="modal-title">Edit List</div>
                    <div className="modal-nav" id="modal-close" onClick={handleClick}>
                        <svg id="modal-close-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                            <path id="modal-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="option-row">
                        <span id="list-modal-title">Title:</span>
                        <input className="modal-text" id="list-modal-text" type="text" />
                        <input id="list-modal-text-hidden" type="hidden" value=""/>
                        <input id="list-modal-id-hidden" type="hidden" value=""/>
                    </div>
                    
                    
                </div>
                <div className="modal-footer">
                    <button type="button" id="modal-delete-button" onClick={handleClick}>Delete</button>
                    <button type="button" id="modal-save-button" onClick={handleClick}>Save</button>
                </div>
            </div>
        </div>
    
    
    
    
    
    
    </>);
}