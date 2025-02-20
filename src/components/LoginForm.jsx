import { useRef } from 'react'
import bcrypt from 'bcryptjs'
import {db} from "../firebase-config"
import { collection, addDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import { Link , useNavigate} from "react-router-dom";
import logo from '../assets/cando.png';
import './LoginForm.css'

export function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";

    console.log(`cookie set, name: ${name}, value: ${value}, days: ${days}`);
}

export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1, cookie.length);
      }
    }
    return null;
  }

export function Register() 
{
    const navigate = useNavigate();

    const salt = bcrypt.genSaltSync(10);
    const emailRef = useRef();
    const userRef = useRef();
    const passwordRef = useRef();

    function validateForm() 
    {
        let email = document.forms["form_register"]["email"];
        let password = document.forms["form_register"]["password"];
        let username = document.forms["form_register"]["username"];

        if (email.value.length < 5) 
        {
            email.style.backgroundColor = "#fec8fd";
            email.style.color = "black";
            document.getElementById("alert_register").innerText = "Enter a valid email.";
            return false;
        }
        else if(password.value.length < 2)
        {
            password.style.backgroundColor = "#fec8fd";
            password.style.color = "black";
            document.getElementById("alert_register").innerText = "Password must be atleast two characters long.";
            return false;
        }
        else if(username.value.length < 5)
        {
            username.style.backgroundColor = "#fec8fd";
            username.style.color = "black";
            document.getElementById("alert_register").innerText = "Username must be atleast five characters long.";
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
        const username = userRef.current.value;

        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        let data = null;
        querySnapshot.forEach((doc) => {
            data = doc.data();
        });

        if(data != null)
        {
            document.getElementById("alert_register").innerText = "User already exists.";
            console.log("User already exists.");
            return;
        }

        const docRef = await addDoc(collection(db, "users"), { username: username, email: email, password: hashedPassword });
        console.log(`New user added email: ${email} username: ${username} id: ${docRef.id}`);
        navigate('/');
    }

  return (
    <>
        <Link to="/">
            <img id="logo" src={logo} alt="Logo" />
        </Link>
        <div className='App'>
            <header className='App-header'>
                <form name="form_register" onSubmit={handleForm}>
                    <input name="email"  ref={emailRef} type='email' placeholder='Email' required  autoComplete="on" /><br />
                    <input name="username"  ref={userRef} type='text' placeholder='Username' required  autoComplete="on" /><br />
                    <input name="password" ref={passwordRef} type='password' placeholder='Password' required autoComplete="on" /><br />
                    <span id="alert_register"></span>
                    <button type='submit'> Register </button><br />
                </form>
                <br /><br /><br /><br />
                <Link to="/login">Login</Link>
            </header>
        </div>
    </>
  )
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

        if (email.value.length < 5) 
        {
            email.style.backgroundColor = "#fec8fd";
            email.style.color = "black";
            document.getElementById("alert_login").innerText = "Do it right!";
            return false;
        }
        if(password.value.length < 2)
        {
            password.style.backgroundColor = "#fec8fd";
            password.style.color = "black";
            document.getElementById("alert_login").innerText = "Do it right!";
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

    
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        let data = null;
        querySnapshot.forEach((doc) => {
            //console.log(doc.id, " => ", doc.data());
            data = doc.data();
        });

        if(data == null)
        {
            console.log("account with that email not found");
            document.getElementById("alert_login").innerText = "User not found.";
            return;
        }

        let pass_good = bcrypt.compareSync(password, data.password);
        console.log(data.password);
        console.log(pass_good);

        if(pass_good == true)
        {
            setCookie("email", email, 30);
            //window.location.href = "/";
            navigate('/');
            
            location.reload();

        }

    }


    return (
        <>
            <Link to="/">
                <img id="logo" src={logo} alt="Logo" />
            </Link>
            <div className='App'>
                <header className='App-header'>
                    <form name="form_login" onSubmit={handleForm}>
                        <input name="email"  ref={emailRef} type='email' placeholder='Email' required autoComplete="on" /><br />
                        <input name="password" ref={passwordRef} type='password' placeholder='Password' required autoComplete="on" /><br />
                        <span id="alert_login"></span>
                        <button type="submit">Login </button>
                    </form>
                    <br /><br /><br /><br />
                    <Link to="/register">Register</Link>
                </header>
            </div>
        </>
    );
}
