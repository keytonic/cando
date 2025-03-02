import { useState, useEffect } from "react";
import './ListMenu.css';
import {getCookie, setCookie, deleteCookie} from "../Tools";
import {db} from "../Firebase"
import { collection,  getDocs, query, where,   doc ,getDoc} from "firebase/firestore";

export default function ListMenu(props)
{
    //useEffect(() => {console.log("list menu render");});

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
        else if(event.target.id == "list-menu-add-cell" || event.target.id == "list-menu-add-icon" || event.target.id == "list-menu-add-path")
        {


            //closest searches up the DOM tree
            //querySelector searches down the DOM tree
            //const listItem = event.target.closest(".list-menu-item-card");
            //const listItemId = listItem.id;
            //const listText = listItem.querySelector("#list-name").innerText;

            let modal = document.getElementById("add-modal-wrapper");

            document.getElementById("add-modal-text").value = "";
            document.getElementById("add-modal-text-hidden").value = "";
            document.getElementById("add-modal-id-hidden").value = "";


            document.getElementById("add-modal-open").value = true;


            modal.style.opacity = "1";
            modal.style.visibility = "visible";


            document.getElementById("add-modal-text").focus();



            //console.log("opening modal");







            /*
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
                        //setRandom(Math.random());//force redraw of the list of lists
                        document.getElementById('lists-re-render-button').click();
                    });
                } 
                catch (err) 
                {
                    console.log(err);
                } 
            };
            fetchData();
            */





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
            //const inputElement = document.getElementById('add-text-input');
            //const enterKeyEvent = new KeyboardEvent('keydown', {key: 'Enter',code: 'Enter',which: 13,keyCode: 13,bubbles: true,cancelable: true});
            //inputElement.dispatchEvent(enterKeyEvent);

            // Select the button element
            document.getElementById('re-render-button').click();
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


            document.getElementById("list-modal-open").value = true;


            modal.style.opacity = "1";
            modal.style.visibility = "visible";

            //console.log("opening modal");
        }
        else
        {
            alert(`who clicked me? class:${event.target.getAttribute("class")} id:${event.target.id}`);
        }
    }

    function ListMenuList(props)
    {
        let blah = props.blah;
        const userid = getCookie("userid");

        const [data, setData] = useState();

        useEffect(() => {

            const fetchData = async () => {

                try {

                    const email = getCookie("email");

                    if(email == null) return;

                    let buf = [];
                    let lists = [];

                    await getDoc(doc(db, 'users', userid)).then((snap) => 
                    {
                        if (snap.exists()) 
                        {
                            lists = snap.data().lists;
                        }
                    });

                    if(lists == null) return;

                    // case sensitive sort
                    //lists.sort();

                    // not case sensitivesort
                    lists.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

                    for (let i = 0; i < lists.length; i++) 
                    {
                        const q2 = query(collection(db, "tasks"), where("userid", "==", userid), where("list", "==", lists[i]));
                        await getDocs(q2).then((snap) => 
                        {
                            buf.push(<ListMenuItem count={snap.size} title={lists[i]} id={i} key={i}/>);
                        });
                        //console.log(`List: ${lists[i]} Count: ${querySnapshot.size}`);
                        
                    }

                    setData(buf);
                } catch (err) {
                    //console.log(err);
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
                <div id="list-count">
                    {props.count}
                </div>
                <div id="edit-cell" onClick={handleClick} title="Edit">
                    <svg id="edit-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                        <path id="edit-path" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                    </svg>
                </div>
            </div>
        );
    }

    //const [random, setRandom] = useState("");//keep at this scope
    function ListMenu(props)
    {

        const [state, setState] = useState(0);

        const forceRerender = () => 
        {
            //console.log("refresh button pushed");
            setState(state + 1);
        };

        useEffect(() => 
        {
            //console.log("list menu render");
        });


        return (
            <>
            
            <button style={{display:"none"}} onClick={forceRerender} id="lists-re-render-button">Force Re-render</button>

            <div id="list-menu-list-wrapper">
                <ListMenuList blah={state} />
            </div>

            </>
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