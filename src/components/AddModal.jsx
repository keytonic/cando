



import {getCookie} from "../Tools";
import {db} from "../Firebase"
import { updateDoc, doc ,getDoc} from "firebase/firestore";
import './AddModal.css'








export default function AddModal()
{

    //useEffect(() => { console.log("add modal render");});


    function modalClose()
    {
        //console.log("close " + Math.random());

        let modal = document.getElementById("add-modal-wrapper");

        modal.style.opacity = "0";
        modal.style.visibility = "hidden";

        document.getElementById("add-modal-text").value = "";
        document.getElementById("add-modal-text-hidden").value = "";
        document.getElementById("add-modal-id-hidden").value = "";
    }

    function modalSave()
    {
        if(document.getElementById("add-modal-open").value == "false") return;
        document.getElementById("add-modal-open").value = "false";



        const userid = getCookie("userid");
        const newList = document.getElementById("add-modal-text").value;

        let oldLists = [];
        let newLists = [];

        const fetchData = async () => 
        {
            try 
            {
                await getDoc(doc(db, 'users', userid)).then((snap) => 
                {
                    if (snap.exists()) 
                    {
                        oldLists = snap.data().lists;
                    }
                });

                //does a list with this name already exist?
                if(oldLists.includes(newList) == true)
                {
                    modalClose();
                    return;
                }

                //they might not have any lists yet
                if(oldLists == null)
                {
                    oldLists = [newList];
                }
                else
                {
                    oldLists.push(newList);
                }

                //console.log(oldLists);
                await updateDoc(doc(db, "users", userid), { lists: oldLists }).then(() => {

                    document.getElementById('lists-re-render-button').click();
                });

            } 
            catch (err) 
            {
                //console.log(err);
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
        else if(event.target.id == "add-modal-wrapper")
        {
            modalClose();
        }
    }



    return (
    <>
        <div className="modal-wrapper" id="add-modal-wrapper" onClick={handleClick}>
            <div className="modal-window">
                <div className="modal-header">
                    <div className="modal-nav"></div>
                    <div className="modal-title">Add List</div>
                    <div className="modal-nav" id="modal-close" onClick={handleClick}>
                        <svg id="modal-close-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                            <path id="modal-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                    </div>
                </div>
                <div className="modal-body" >
                    <div className="option-row">
                        <span  id="add-modal-title">Title:</span>
                        <input id="add-modal-text" className="modal-text"  type="text" />
                        <input id="add-modal-text-hidden" type="hidden" value=""/>
                        
                    </div>
                </div>
                <div className="add-modal-footer">
                    <input id="add-modal-id-hidden" type="hidden" value=""/>
                    <input id="add-modal-open" type="hidden" value="false"/>
                    <button type="button" id="modal-save-button" onClick={handleClick}>Save</button>
                </div>
            </div>
        </div>
    </>);
}