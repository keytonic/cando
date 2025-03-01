import { useState, useEffect, useRef } from "react";
import './ListMenu.css';
import {getCookie, setCookie, deleteCookie} from "../Tools";
import {db} from "../Firebase"
import { collection, addDoc, getDocs, query, where, documentId, updateDoc, doc } from "firebase/firestore";


export default function ListMenu(props)
{
    useEffect(() => {
        //console.log("list menu render");
    });

    function handleClick(event)
    {
        if(event.target.id == "list-menu-close-cell" || event.target.id == "list-icon-close" || event.target.id == "list-icon-path")
        {
            let listMenuWrapper = document.getElementById('list-menu-wrapper');

            listMenuWrapper.style.transition = "width 1s ease-in-out, opacity 1s ease-in-out,visibility 1s ease-in-out";

            listMenuWrapper.style.visibility = "hidden";
            listMenuWrapper.style.width = "0px";
            listMenuWrapper.style.opacity = "0";

            document.getElementById("body-wrapper").style.pointerEvents = "auto";
            document.getElementById("body").style.position = "inherit";
        }
        else if(event.target.id == "list-delete" || event.target.id == "trash-icon" || event.target.id == "path-trash")
        {
            //get name of list the user is trying to delete
            //closest searches up the DOM tree
            //querySelector searches down the DOM tree
            const listItem = event.target.closest(".list-menu-item-card");
            const listText = listItem.querySelector("#list-name").innerText;

            //make sure thier sure
            if (confirm(`Delete list: ${listText}?`) != true) 
            {
                return;//or bail
            } 

            const fetchData = async () => 
            {
                try 
                {
                    const email = getCookie("email");

                    if(email == null) return;

                    const userid = getCookie("userid");
    
                    if(userid == null) return;

                    const q = query(collection(db, "users"), where("email", "==", email));
                    const querySnapshot = await getDocs(q);
                   
                    let oldLists = [];
        
                    if(querySnapshot.empty === false)
                    {
                        querySnapshot.forEach((doc) => {
                            oldLists = doc.data().lists;
                        });
                    }

                    let newLists = oldLists.filter(item => item !== listText);

                    if(getCookie("list") === listText)
                    {
                        deleteCookie("list");
                    }

                    await updateDoc(doc(db, "users", userid), { lists: newLists }).then(() => {
                        setRandom(Math.random());//force redraw of the list of lists
                    });
                } 
                catch (err) 
                {
                    console.log(err);
                } 
            };
            fetchData();
        }
        else if(event.target.id == "list-menu-add-cell" || event.target.id == "list-menu-add-icon" || event.target.id == "list-menu-add-path")
        {
            let newList = prompt("Enter new list name:");

            if (newList == null) return;

            const fetchData = async () => 
            {
                try 
                {

                    const email = getCookie("email");

                    if(email == null) return;

                    const userid = getCookie("userid");
    
                    if(userid == null) return;

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
                    if(oldLists != null && oldLists.includes(newList) == true)
                    {
                        return;
                    }
        


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
                        setRandom(Math.random());//force redraw of the list of lists
                    });
                } 
                catch (err) 
                {
                    console.log(err);
                } 
            };
            fetchData();
        }
        else if(event.target.id == "select-icon" || event.target.id == "select-path" || event.target.id == "list-select")
        {
            //closest searches up the DOM tree
            //querySelector searches down the DOM tree
            const listItem = event.target.closest(".list-menu-item-card");
            const listText = listItem.querySelector("#list-name").innerText;

            let currentList = getCookie("list");

            //loop through cards and uncheck them all
            let cards = document.getElementsByClassName("list-menu-item-card");
            for (let i = 0; i < cards.length; i++)
            {
                cards[i].querySelector("#select-icon").children[1].style.display = "none";
            }

            //if the current list is the same as the one they are clicking
            //then uncheck and delete cookie 
            if(currentList == listText)
            {
                deleteCookie("list");

                //update the new current list name on main page
                document.getElementById("span-title-id").innerText = "";
            }
            else
            {
                //alert(listText);
                setCookie("list", listText);

                //check the new current list
                listItem.querySelector("#select-icon").children[1].style.display = "unset";

                //update the new current list name on main page
                document.getElementById("span-title-id").innerText = listText;
            }

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
        else if(event.target.id == "list-rename" || event.target.id == "rename-icon" || event.target.id == "path-rename")
        {
            //get the new name for the list
            //closest searches up the DOM tree
            //querySelector searches down the DOM tree
            const listItem = event.target.closest(".list-menu-item-card");
            const listText = listItem.querySelector("#list-name").innerText;

            let newName = prompt("Rename list: ",listText);

            if(newName == null) return;

            if(newName === listText) return;

            const fetchData = async () => 
            {
                try 
                {
                    const email = getCookie("email");

                    if(email == null) return;

                    const userid = getCookie("userid");
    
                    if(userid == null) return;

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
                        return;
                    }

                    for (let i = 0; i < oldLists.length; i++) {
                        if (oldLists[i] === listText) {
                            oldLists[i] = newName; 
                        }
                      }
                    
                    //alert(oldLists);

                    await updateDoc(doc(db, "users", userid), { lists: oldLists }).then(() => {
                        setRandom(Math.random());//force redraw of the list of lists
                    });

                } 
                catch (err) 
                {
                    console.log(err);
                } 
            };
            fetchData();
        }
        else if(event.target.id == "edit-cell" || event.target.id == "edit-icon" || event.target.id == "edit-path")
        {
            //closest searches up the DOM tree
            //querySelector searches down the DOM tree
            const listItem = event.target.closest(".list-menu-item-card");
            const listItemId = listItem.id;
            const listText = listItem.querySelector("#list-name").innerText;

            let modal = document.getElementById("list-modal-wrapper");

            document.getElementById("list-modal-text").value = listText;
            document.getElementById("list-modal-text-hidden").value = listText;
            document.getElementById("list-modal-id-hidden").value = listItemId;




            modal.style.opacity = "1";
            modal.style.visibility = "visible";
        }
        else
        {
            alert(`who clicked me? class:${event.target.getAttribute("class")} id:${event.target.id}`);
        }
    }

    function ListMenuList(props)
    {
        let blah = props.blah;

        const [data, setData] = useState();

        useEffect(() => {

            const fetchData = async () => {

                try {

                    const email = getCookie("email");

                    if(email == null) return;

                    const q = query(collection(db, "users"), where("email", "==", email));
                    const querySnapshot = await getDocs(q);
                   
                    let buf = [];
                    let lists = [];

                    if(querySnapshot.empty === false)
                    {
                        querySnapshot.forEach((doc) => {
                            lists = doc.data().lists;
                        });
                    }

                    if(lists == null) return;

                    // case sensitive sort
                    //lists.sort();

                    // not case sensitivesort
                    lists.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

                    for (let i = 0; i < lists.length; i++) 
                    {
                        buf.push(<ListMenuItem title={lists[i]} id={i} key={i}/>);
                    }

                    setData(buf);
                } catch (err) {
                    console.log(err);
                } 
            };
            fetchData();
        }, [blah]);
        
        return (<>{data}</>);
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

    function ListMenuItem(props)
    {
        let currentList = getCookie("list");
        let checked = props.title == currentList ? "true" : "false";
        
        return (
            <div className="list-menu-item-card" id={String(Math.random()).slice(2)}>
                <div id="list-select" onClick={handleClick}>
                    <StatusIcon checked={checked} />
                </div>
                <div id="list-name">
                    {props.title}
                </div>
                <div id="list-rename" onClick={handleClick} title="Rename">
                    <svg id="rename-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                        <path id="path-rename" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </div>
                <div id="list-delete" onClick={handleClick} title="Delete">
                    <svg id="trash-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                        <path id="path-trash" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path id="path-trash" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </div>
                <div id="edit-cell" onClick={handleClick} title="Edit">
                    <svg id="edit-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                        <path id="edit-path" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                    </svg>
                </div>
            </div>
        );
    }

    const [random, setRandom] = useState("");//keep at this scope
    function ListMenu(props)
    {
        return (
            <div id="list-menu-list-wrapper">
                <ListMenuList blah={random} />
            </div>
        );
    }

    return (
        <div id="list-menu-wrapper">
            <div id="list-menu-nav-bar">
                <div className="list-menu-nav-cell" id="list-menu-close-cell" onClick={handleClick} title="Close list menu">
                    <svg id="list-icon-close" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path id="list-icon-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
                <div className="list-menu-nav-cell" id="list-menu-title-cell">
                    <span id="menu-title">Lists</span>
                </div>

                <div className="list-menu-nav-cell" id="list-menu-add-cell" onClick={handleClick} title="Create New List">
                    <svg id="list-menu-add-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path id="list-menu-add-path" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                    </svg>
                </div>
            </div>
            <ListMenu />
        </div>
    );
}