import { useRef } from 'react'
import bcrypt from 'bcryptjs'
import {db} from "../Firebase"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Link , useNavigate} from "react-router-dom";
import './LoginRegister.css'
import StarCheck from '../assets/star-check.svg'
import CandoTextLarge from '../assets/candotext-large.png'
import {setCookie} from "../Tools"

function handleClick(event)
{
    let target = event.target;

    if(target.id.indexOf("form-") == -1) return;

    target.setAttribute("placeholder", "");
    
    document.getElementById(target.id + "-label").style.opacity = "1";
    document.getElementById(target.id + "-label").style.top = "2px";
    document.getElementById(target.id + "-label").style.left = "3px";
}

function handleBlur(event)
{
    let target = event.target;

    if(target.id.indexOf("form-") == -1) return;
 
    if(target.value.length <= 0)
    {
        target.setAttribute("placeholder",target.getAttribute("placeholder-slug"));
        document.getElementById(target.id + "-label").style.opacity = "0";
        document.getElementById(target.id + "-label").style.top = "40px";
        document.getElementById(target.id + "-label").style.left = "13px";
    }
}

export function Register() 
{
    const navigate = useNavigate();

    const salt = bcrypt.genSaltSync(10);
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    //useEffect(() => { console.log("register render");});

    function validateForm() 
    {
        let email = document.forms["form_register"]["email"];
        let password = document.forms["form_register"]["password"];
        let username = document.forms["form_register"]["username"];

        password.style.backgroundColor = "#beccd3";
        email.style.backgroundColor = "#beccd3";
        username.style.backgroundColor = "#beccd3";

        if (email.value.length < 5) 
        {
            email.style.backgroundColor = "#ef6461";
            email.style.color = "black";
            document.getElementById("alert_register").innerText = "Enter a valid email.";
            return false;
        }
        else if(password.value.length < 2)
        {
            password.style.backgroundColor = "#ef6461";
            password.style.color = "black";
            document.getElementById("alert_register").innerText = "Password too short.";
            return false;
        }
        else if(username.value.length < 2)
        {
            username.style.backgroundColor = "#ef6461";
            username.style.color = "black";
            document.getElementById("alert_register").innerText = "Username too short.";
            return false;
        }

        return true;
    }

    async function handleForm(e) 
    {
        e.preventDefault();

        if(validateForm() == false) return;

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const hashedPassword = bcrypt.hashSync(password, salt); 
        const username = usernameRef.current.value;

        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        let data = null;
        querySnapshot.forEach((doc) => {
            data = doc.data();
        });

        if(data != null)
        {
            document.getElementById("alert_register").innerText = "Email already registered.";
            //console.log("Email already registered.");
            return;
        }

        const docRef = await addDoc(collection(db, "users"), { username: username, email: email, password: hashedPassword, lists: [] });
        //console.log(`New user added email: ${email} username: ${username} id: ${docRef.id}`);
        navigate('/login');
    }

    return ( 
        <>
            <div id="login-register-top-bar">
                <div class="top-bar-cell-left">
                    <Link to="/"><img id="star-check" src={StarCheck} /></Link>
                </div>
                <div class="top-bar-cell-right">
                    <Link to="/login"><span>Login</span></Link>
                </div>
            </div>
            <div id="register-wrapper">
                <div id="register-wrapper-inside">
                    <Link to="/">
                        <div id="big-logo-with-text">
                            <img id="logo_big_front" src={StarCheck} alt="Logo" />
                            <img id="canndo-text-large" src={CandoTextLarge} />
                        </div>
                    </Link>
                    <div className='App'>
                        <header className='App-header'>
                            <form id="form_register" name="form_register" onSubmit={handleForm}>
                                <label htmlFor="form-username" className="opacity0" id="form-username-label">Username:</label>
                                <input id="form-username"  name="username"  ref={usernameRef} type='text' placeholder-slug="Username" placeholder='Username' required autoComplete={String(Math.random()).slice(2)} onClick={handleClick} onBlur={handleBlur} />  
                                <label htmlFor="form-email" className="opacity0" id="form-email-label">Email:</label>
                                <input id="form-email"  name="email"  ref={emailRef} type='email' placeholder-slug="Email" placeholder='Email' required autoComplete={String(Math.random()).slice(2)} onClick={handleClick} onBlur={handleBlur} />
                                <label htmlFor="form-password" className="opacity0" id="form-password-label">Password:</label>
                                <input id="form-password" name="password" ref={passwordRef} type='password' placeholder-slug="Password" placeholder='Password' required autoComplete={String(Math.random()).slice(2)}  onClick={handleClick} onBlur={handleBlur} />
                                <span id="alert_register"></span>
                                <button id="register_submit" type="submit">Register</button>
                            </form>
                        </header>
                    </div>
                </div>
            </div>
        </>
    );
}

export function Login() 
{
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();

    function validateForm() 
    {
        let email = document.forms["form_login"]["email"];
        let password = document.forms["form_login"]["password"];

        password.style.backgroundColor = "#beccd3";
        email.style.backgroundColor = "#beccd3";

        if (email.value.length < 5) 
        {
            email.style.backgroundColor = "#ef6461";
            email.style.color = "black";
            document.getElementById("alert_login").innerText = "Enter a valid email.";
            return false;
        }
        else if(password.value.length < 2)
        {
            password.style.backgroundColor = "#ef6461";
            password.style.color = "black";
            document.getElementById("alert_login").innerText = "Password too short.";
            return false;
        }
        return true;
    }

    async function handleForm(event)
    {
        event.preventDefault();

        if(validateForm() == false) return;

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        let id = "";

        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        let data = null;
        querySnapshot.forEach((doc) => {
            data = doc.data();
            id = doc.id;
        });

        if(data == null)
        {
            //console.log("Email account not found.");
            document.getElementById("alert_login").innerText = "Email account not found.";
            return;
        }

        let pass_good = bcrypt.compareSync(password, data.password);

        if(pass_good == true)
        {
            setCookie("email", email, 30);
            setCookie("userid", id, 30);
            navigate('/home');
        }
        else
        {
            //console.log("Password incorrect.");
            document.getElementById("alert_login").innerText = "Password incorrect.";
            return;
        }
    }

    return ( 

        <>
            <div id="login-register-top-bar">
                <div class="top-bar-cell-left">
                    <Link to="/"><img id="star-check" src={StarCheck} /></Link>
                </div>
                <div class="top-bar-cell-right">
                    <Link to="/register"><span>Create an account</span></Link>
                </div>
            </div>
            <div id="login-wrapper">
                <div id="login-wrapper-inside">
                    <Link to="/">
                        <div id="big-logo-with-text">
                            <img id="logo_big_front" src={StarCheck} alt="Logo" />
                            <img id="canndo-text-large" src={CandoTextLarge} />
                        </div>
                    </Link>
                    <div className='App'>
                        <header className='App-header'>
                            <form id="form_login" name="form_login" onSubmit={handleForm}>
                                <label htmlFor="form-email" className="opacity0" id="form-email-label">Email:</label>
                                <input id="form-email"  name="email"  ref={emailRef} type='email' placeholder-slug="Email" placeholder='Email' required autoComplete={String(Math.random()).slice(2)} onClick={handleClick} onBlur={handleBlur} />
                                <label htmlFor="form-password" className="opacity0" id="form-password-label">Password:</label>
                                <input id="form-password" name="password" ref={passwordRef} type='password' placeholder-slug="Password" placeholder='Password' required autoComplete={String(Math.random()).slice(2)}  onClick={handleClick} onBlur={handleBlur} />
                                <span id="alert_login"></span>
                                <button id="login_submit" type="submit">Login </button>
                            </form>
                        </header>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function LoginRegister(props)
{
    return (
        <>
            <div className="login-register-wrapper">
                {props.action == "login" ? <Login /> : <Register />}
            </div>
        </>
    );
}