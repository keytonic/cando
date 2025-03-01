import { useState, useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom";
import { collection, addDoc, getDocs, getDoc, query, where ,updateDoc,doc, orderBy, Timestamp,deleteDoc } from "firebase/firestore";
import {db} from "../Firebase"
import ListMenu from "../components/ListMenu"
import OptionsMenu from "../components/OptionsMenu"
import ListModal from "../components/ListModal"
import TaskModal from "../components/TaskModal"
import Front from "./Front";

import './Body.css'
import {getCookie, deleteCookie} from "../Tools"

export function Body() 
{
    const [taskData, setTaskData] = useState("");
    const isInitialRender = useRef(true);
    const navigate = useNavigate();

    let optionsOpen = false;

    useEffect(() => {
        //console.log("Body render");
    });


    useEffect(() => {
        
        window.onresize = function (event) 
        {
            adjustForScreenSize();
        }

        document.body.onclick = handleClick;
    }, []);

    useEffect(() => {
      
        //prevent running effect on first render i only want it to run when taskData is updated
        if (isInitialRender.current) 
        {
            isInitialRender.current = false; 
            return; 
        }
        const fetchData = async () => 
        {
            const userid = getCookie("userid");

            if(userid == null) return;

            let currentList = getCookie("list");

            if(currentList == null)
            { 
                currentList = "";

                //setCookie("list", currentList);

/*
                const userid = getCookie("userid");
                if(userid != null)
                {
                    await updateDoc(doc(db, "users", userid), { lists: ["Default list"] });
                }
*/
            }

            const currentDate = new Date();
            if(taskData != "" && taskData != 0)
            {
                await addDoc(collection(db, "tasks"), 
                { 
                    checked: "false", 
                    list: currentList, 
                    text: taskData, 
                    userid: userid,
                    created: currentDate 
                });
            }
        };
        fetchData();
        setTaskData("");
        
    }, [taskData]);  //Runs on the first render AND any time any dependency value changes

    function adjustForScreenSize() 
    {
        const navbarWrapper = document.getElementById('navbar-wrapper');

        if(navbarWrapper == null) return;

        const rec = navbarWrapper.getBoundingClientRect();
    
        if(rec == null) return;
    
        let listMenuWrapper = document.getElementById('list-menu-wrapper');

        if(listMenuWrapper == null) return;
    
        if(listMenuWrapper)
        {
            listMenuWrapper.style.transition = "unset";
            listMenuWrapper.style.left = rec.left + "px";
            listMenuWrapper.style.width = ((rec.width / 4) * 3) + "px";
        }
    
        let optionsMenuWrapper = document.getElementById('options-menu-wrapper');
    
        if(optionsMenuWrapper)
        {
            optionsMenuWrapper.style.transition = "unset";
            optionsMenuWrapper.style.right = rec.left + "px";
            optionsMenuWrapper.style.width = ((rec.width / 4) * 3) + "px";
        }
    
        if(optionsMenuWrapper && listMenuWrapper)
        {
            const element = document.getElementById('body-wrapper');
            const computedStyle = window.getComputedStyle(element);
            const height = computedStyle.getPropertyValue('height');
            
            listMenuWrapper.style.height = (parseInt(height.slice(0,-2)) + 50 + 15) + "px";
            optionsMenuWrapper.style.height = (parseInt(height.slice(0,-2)) + 50 + 15) + "px";
        }

        let elements = document.getElementsByClassName("list-menu-item-card");

        for (let i = 0; i < elements.length; i++) 
        {
            elements[i].style.minWidth = (((rec.width / 4) * 3) - 30) + "px";
        }

        elements = document.getElementsByClassName("options-menu-item-card");

        for (let i = 0; i < elements.length; i++) 
        {
            elements[i].style.minWidth = (((rec.width / 4) * 3) - 30) + "px";
        }
    }
    
    function ToDoCard(props)
    {
        const [taskUpdate, setTaskUpdate] = useState("");
    
        const isInitialRender2 = useRef(true);
    
        useEffect(() => {
 
            //prevent running effect on first render 
            //i only want it to run when taskUpdate is updated
            if (isInitialRender2.current) 
            {
                isInitialRender2.current = false; 
                return; 
            }
    
            const fetchData = async () => {
              
                if(taskUpdate != "")
                {
                    await updateDoc(doc(db, "tasks", taskUpdate.taskId), { checked: taskUpdate.checked }).then(() => {
                        
                        let newClass = taskUpdate.checked == "true" ? "checked" : "unchecked";
                        let disp = taskUpdate.checked == "true" ? "unset" : "none";
    
                        let svg = document.getElementById(taskUpdate.taskId).querySelector("svg");
    
                        svg.setAttribute("class",newClass);
                        svg.children[1].style.display = disp;
                    });
                }
            };
            fetchData();
            setTaskUpdate("");

        }, [taskUpdate]);  //Runs on the first render AND any time any dependency value changes
    
        function handleClick(event)
        {
            if( event.target.id == "check-cell" || event.target.id == "check-icon" || event.target.id == "path-check")
            {
                //querySelector searches down the DOM tree
                //closest searches up the DOM tree
                const taskId = event.target.closest(".list-item-card").id;
                let checked = document.getElementById(taskId).querySelector("svg").getAttribute("class") == "unchecked" ? "true" : "false";
    
                let showTrash = checked == "true" ? "inherit" : "none";
                document.getElementById(taskId).querySelector(".trash-cell").style.display = showTrash;
    
                setTaskUpdate({taskId: taskId, checked: checked });
                //alert(`taskId: ${taskId}, checked:${checked}`);
            }
            else if( event.target.id == "trash-cell" || event.target.id == "trash-icon" || event.target.id == "path-trash")
            {
                const taskId = event.target.closest(".list-item-card").id;
                const text = document.getElementById(taskId).querySelector(".task-text").innerText;
    
                let prompt = `Are you sure you want to delete: ${text} ?`;
    
                if (confirm(prompt) == true) 
                {
                    //do it
                    const fetchData = async () => {
                        await deleteDoc(doc(db, "tasks", taskId));
                    };
                    fetchData();
                    //forcing body to rerender by changing value of taskData to zero, 
                    //it wont do anything in the useEffect but it will trigger a rerender
                    setTaskData(0);
                } 
            }
            else if(event.target.id == "edit-cell" || event.target.id == "edit-icon" || event.target.id == "edit-path")
            {
                alert("edit");
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
                <svg id="check-icon" xmlns="http://www.w3.org/2000/svg" className={cls} width="28" height="28" fill="grey" viewBox="0 0 16 16">
                    <path id="path-check" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                    <path id="path-check" style={{display: disp}} d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                </svg>
            );
            
        }

        return (
            <div className="list-item-card" id={props.id}>
                <div className="check-cell" id="check-cell" onClick={handleClick}>
                    <StatusIcon checked={props.checked} /> 
                </div>
                <div className="text-cell">
                    <span className="task-text" id="task-text">{props.text}</span>
                </div>
                <div className="trash-cell" id="trash-cell" style={{display: props.checked == "true" ? "inherit" : "none"}} onClick={handleClick} title="Delete">
                    <svg id="trash-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                        <path id="path-trash" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path id="path-trash" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </div>
                <div className="edit-cell" id="edit-cell" onClick={handleClick} title="Edit">
                    <svg id="edit-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                        <path id="edit-path" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                    </svg>
                </div>
            </div>
        );
    }
    
    function ToDoListItems(props)
    {
        let blah = props.blah;

        //console.log(blah);

        const [data, setData] = useState();

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const userid = getCookie("userid");
                    let currentList = getCookie("list");
                    let showAll = getCookie("showAll") == null ? "false" : getCookie("showAll");

                    if(showAll == null) showAll = "true";

                    if(currentList == null) currentList = "";

                    if(userid == null) return;

                    const q2 = query(collection(db, "tasks"), where("userid", "==", userid), where("list", "==", currentList), orderBy("text"));
                    const querySnapshot = await getDocs(q2);

                    const list = [];

                    if(querySnapshot.empty === false)
                    {
                        querySnapshot.forEach((doc) => {

                            if(doc.data().checked == "false" || showAll == "true" )
                            {
                                list.push(<ToDoCard checked={doc.data().checked} text={doc.data().text} id={doc.id} key={doc.id}/>);
                            }
                        });
                    }

                    setData(list);
                } catch (err) {
                    console.log(err);
                } 
            };
            fetchData();
        }, [blah]);
        
        return (<>{data}</>);
    }

    //keep at this scope
    const [random, setRandom] = useState("");

    function ToDoList(props)
    {
        return(
            <>
                <div id="todo-list-wrapper">
                    <ToDoListItems blah={random}/>
                </div>
            </>
        );
    }

    function handleClick(event)
    {

        if(event.target.id == "add-icon" || event.target.id == "add-icon-cell" || event.target.id == "path-add")
        {
            let text = document.getElementById("add-text-input").value;

            if(text != "")
            {
                setTaskData(text);
                document.getElementById("add-text-input").value = "";
                document.getElementById("add-text-input").setAttribute("placeholder","Add a to-do...");
            }
        }
        else if(event.target.id == "add-text-input")
        {
            event.target.setAttribute("placeholder","");
        }
        else if(event.target.id == "nav-cell-lists" || event.target.id == "nav-icon-lists" || event.target.id == "nav-path-lists")
        {
            const navbarWrapper = document.getElementById('navbar-wrapper');

            if(navbarWrapper == null) return;
    
            const rec = navbarWrapper.getBoundingClientRect();
        
            if(rec == null) return;

            let listMenuWrapper = document.getElementById('list-menu-wrapper');

            if(listMenuWrapper == null) return;

            listMenuWrapper.style.transition = "width 0.5s ease-in-out, opacity 0.5s ease-in-out,visibility 0.5s ease-in-out";
            listMenuWrapper.style.left = rec.left + "px";
            listMenuWrapper.style.visibility = "inherit";
            listMenuWrapper.style.width = ((rec.width / 4) * 3) + "px";
            listMenuWrapper.style.opacity = ".95";

            const element = document.getElementById('body-wrapper');
            const computedStyle = window.getComputedStyle(element);
            const height = computedStyle.getPropertyValue('height');
            
            //make the list menu the same height as the main task list 
            //it will default to min-height: 600px; if too short
            listMenuWrapper.style.height = (parseInt(height.slice(0,-2)) + 50 + 15) + "px";

            //close the other menu

            let optionsMenuWrapper = document.getElementById('options-menu-wrapper');

            optionsMenuWrapper.style.transition = "width 0.5s ease-in-out, opacity 0.5s ease-in-out,visibility 0.5s ease-in-out";

            optionsOpen = false;

            optionsMenuWrapper.style.visibility = "hidden";
            optionsMenuWrapper.style.width = "0px";
            optionsMenuWrapper.style.opacity = "0";

            document.getElementById("body-wrapper").style.pointerEvents = "none";
            document.getElementById("body").style.position = "fixed";
            //document.getElementById("body").style.overflowY = "scroll";

            let elements = document.getElementsByClassName("list-menu-item-card");

            for (let i = 0; i < elements.length; i++) 
            {
                elements[i].style.minWidth = (((rec.width / 4) * 3) - 30) + "px";
            }


        }
        else if(event.target.id == "nav-cell-options" || event.target.id == "nav-icon-options" || event.target.id == "nav-path-options")
        {
            const navbarWrapper = document.getElementById('navbar-wrapper');

            if(navbarWrapper == null) return;
    
            const rec = navbarWrapper.getBoundingClientRect();
        
            if(rec == null) return;

            let optionsMenuWrapper = document.getElementById('options-menu-wrapper');

            if(optionsMenuWrapper == null ) return;

            optionsOpen = true;

            optionsMenuWrapper.style.transition = "width 0.5s ease-in-out, opacity 0.5s ease-in-out,visibility 0.5s ease-in-out";
            optionsMenuWrapper.style.right = rec.left + "px";
            optionsMenuWrapper.style.visibility = "inherit";
            optionsMenuWrapper.style.width = ((rec.width / 4) * 3) + "px";
            optionsMenuWrapper.style.opacity = ".95";

            const element = document.getElementById('body-wrapper');
            const computedStyle = window.getComputedStyle(element);
            const height = computedStyle.getPropertyValue('height');
            
            optionsMenuWrapper.style.height = (parseInt(height.slice(0,-2)) + 50 + 15) + "px";

            //close the other menu
            let listMenuWrapper = document.getElementById('list-menu-wrapper');

            listMenuWrapper.style.transition = "width 0.5s ease-in-out, opacity 0.5s ease-in-out,visibility 0.5s ease-in-out";

            listMenuWrapper.style.visibility = "hidden";
            listMenuWrapper.style.width = "0px";
            listMenuWrapper.style.opacity = "0";

            document.getElementById("body-wrapper").style.pointerEvents = "none";
            document.getElementById("body").style.position = "fixed";
            //document.getElementById("body").style.overflowY = "scroll";

            let elements = document.getElementsByClassName("options-menu-item-card");

            for (let i = 0; i < elements.length; i++) 
            {
                elements[i].style.minWidth = (((rec.width / 4) * 3) - 30) + "px";
            }

        }
        else if(event.target.id == "root" || event.target.id == "top-container" || event.target.id == "main-title-cell")
        {
            let optionsMenuWrapper = document.getElementById('options-menu-wrapper');
            let listMenuWrapper = document.getElementById('list-menu-wrapper');

            if(optionsMenuWrapper)
            {
                optionsMenuWrapper.style.transition = "width 1s ease-in-out, opacity 1s ease-in-out,visibility 1s ease-in-out";

                optionsMenuWrapper.style.visibility = "hidden";
                optionsMenuWrapper.style.width = "0px";
                optionsMenuWrapper.style.opacity = "0";

                document.getElementById("body-wrapper").style.pointerEvents = "auto";
                document.getElementById("body").style.position = "inherit";
            }
            
            if(listMenuWrapper)
            {
                listMenuWrapper.style.transition = "width 1s ease-in-out, opacity 1s ease-in-out,visibility 1s ease-in-out";

                listMenuWrapper.style.visibility = "hidden";
                listMenuWrapper.style.width = "0px";
                listMenuWrapper.style.opacity = "0";

                document.getElementById("body-wrapper").style.pointerEvents = "auto";
                document.getElementById("body").style.position = "inherit";
            }
        }
        else
        {
            //alert(`who clicked me? class:${event.target.getAttribute("class")} id:${event.target.id}`);
        }
        
    }

    function handleBlur(event)
    {
        if(event.target.id == "add-text-input")
        {
            if(event.target.value == "")
            {
                event.target.setAttribute("placeholder","Add a to-do...");
            }
        }
    }

    function handleKeyDown(event)
    {
        if (event.key === "Enter") 
        {
            let text = document.getElementById("add-text-input").value;

            if(text != "")
            {
                setTaskData(text);
                event.target.setAttribute("placeholder","Add a to-do...");
                document.getElementById("add-text-input").value = "";
            }
            else
            {
                //handling a simulated keystroke passing null to force rerender 
                //when new list selected to update the list name on main page
                //setTaskData(0);
                setRandom(Math.random());
                event.target.setAttribute("placeholder","Add a to-do...");
                document.getElementById("add-text-input").value = "";
            }
        }
    }

    if(getCookie("userid") == null)
    {
        return (<Front />);
    }
    
    return (
        <>
            <div id="top-container">
                <div className="navbar-wrapper" id="navbar-wrapper">
                    <div className="nav-cell" id="nav-cell-lists" title="Lists" onClick={handleClick}>
                        <svg className="nav-icon" id="nav-icon-lists" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                            <path id="nav-path-lists" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/>
                            <path id="nav-path-lists" d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/>
                            <path id="nav-path-lists" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/>
                        </svg>
                    </div>
                    <div className="nav-cell title-cell" id="main-title-cell"><span id="span-title-id">{getCookie("list") != null ? getCookie("list") : ""}</span></div>
                    <div className="nav-cell" id="nav-cell-options" title="Options" onClick={handleClick}>
                        <svg className="nav-icon" id="nav-icon-options" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white"  viewBox="0 0 16 16">
                            <path id="nav-path-options" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="body-wrapper" id="body-wrapper">

                <div id="add-todo-wrapper">
                    <div id="add-icon-cell" onClick={handleClick} title="Add to-do">
                        <svg id="add-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                            <path id="path-add" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                    </div>
                    <div id="add-text-cell">
                        <input id="add-text-input" type="text" onClick={handleClick} onBlur={handleBlur} onKeyDown={handleKeyDown} placeholder='Add a to-do...' />
                    </div>
                </div>


                <ToDoList />
            </div>
            <ListMenu />
            <OptionsMenu />
            <ListModal />
            <TaskModal />
        </>
    );
}