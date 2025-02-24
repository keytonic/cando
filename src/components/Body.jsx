import { useState, useEffect, useRef } from "react";
import { Link , useNavigate} from "react-router-dom";
import { collection, addDoc, getDocs, getDoc, query, where ,updateDoc,doc, orderBy } from "firebase/firestore";
import {db} from "../firebase-config"
import {getCookie, deleteCookie} from "../components/LoginRegister"
import './Body.css'

export function ToDoCard(props)
{
    const [taskUpdate, setTaskUpdate] = useState("");

    const isInitialRender = useRef(true);

    useEffect(() => {

        //prevent running effect on first render 
        //i only want it to run when taskUpdate is updated
        if (isInitialRender.current) 
        {
            isInitialRender.current = false; 
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
        if( event.target.id = "check-cell" || event.target.id == "check-icon" || event.target.id == "path")
        {
            //querySelector searches down the DOM tree
            //closest searches up the DOM tree
            const taskId = event.target.closest(".list-item-card").id;
            let checked = document.getElementById(taskId).querySelector("svg").getAttribute("class") == "unchecked" ? "true" : "false";
            setTaskUpdate({taskId: taskId, checked: checked });
            //alert(`taskId: ${taskId}, checked:${checked}`);
        }
        else
        {
            alert("who clicked me?:" + event.target.id);
        }
    }

    function StatusIcon(props)
    {
        let disp = props.checked == "true" ? "unset" : "none";
        let cls = props.checked == "true" ? "checked" : "unchecked";

        return (
            <svg id="check-icon" xmlns="http://www.w3.org/2000/svg" className={cls} width="24" height="24" fill="grey" viewBox="0 0 16 16">
                <path id="path" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path id="path" style={{display: disp}} d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
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
        </div>
    );
}


export function Body() 
{
    function ToDoList(props)
    {
        const [data, setData] = useState();
        
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const userid = getCookie("userid");
                    const q2 = query(collection(db, "tasks"), where("userid", "==", userid), orderBy("text"));
                    const querySnapshot = await getDocs(q2);
    
                    const list = [];
    
                    if(querySnapshot.empty === false)
                    {
                        querySnapshot.forEach((doc) => {
                            list.push(<ToDoCard checked={doc.data().checked} text={doc.data().text} id={doc.id} key={doc.id}/>);
                        });
                    }
    
                    setData(list);
                } catch (err) {
                   console.log(err);
                } 
            };
            fetchData();
        }, []);
        return (<>{data}</>);
    }
    





    const [taskData, setTaskData] = useState("");

    const isInitialRender = useRef(true);

    useEffect(() => {
        //prevent running effect on first render i only want it to run when taskData is updated
        if (isInitialRender.current) 
        {
            isInitialRender.current = false; 
            return; 
        }
        const fetchData = async () => {
            const userid = getCookie("userid");
            if(taskData != "")
            {
                const docRef = await addDoc(collection(db, "tasks"), { checked: "false", list: "Shopping", text: taskData, userid: userid });
            }
        };
        fetchData();
        setTaskData("");
        
    }, [taskData]);  //Runs on the first render AND any time any dependency value changes

    const navigate = useNavigate();
    async function handleForm(event)
    {
        //logout
        deleteCookie("email");
        deleteCookie("userid");

        navigate('/');
        //force re-render one logged out
        window.location.reload();

    }

    function handleClick(event)
    {
        if(event.target.id == "add-icon" || event.target.id == "add-icon-cell")
        {
            let text = document.getElementById("add-text-input").value;

            if(text != "")
            {
                setTaskData(text);
                event.target.setAttribute("placeholder","Add a to-do...");
                document.getElementById("add-text-input").value = "";
            }
        }
        else if(event.target.id == "add-text-input")
        {
            event.target.setAttribute("placeholder","");
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
        }
    }

    return (
        <>
            <div className="body-wrapper">
                <div id="add-todo-wrapper">
                    <div id="add-icon-cell" onClick={handleClick}>
                        <svg id="add-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>
                    </div>
                    <div id="add-text-cell">
                        <input id="add-text-input" type="text" onClick={handleClick} onBlur={handleBlur} onKeyDown={handleKeyDown} placeholder='Add a to-do...' />
                    </div>
                </div>

                <div id="todo-list-wrapper">
                    <ToDoList />
                </div>
                
                <br /><br /><br /><br />
                <button type='submit' onClick={handleForm}> Log out </button>
            </div>
        </>
    );
}