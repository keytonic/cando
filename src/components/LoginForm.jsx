import { useRef } from 'react'
import bcrypt from 'bcryptjs'
import {db} from "../firebase-config"
import { collection, addDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import { useHref } from "react-router"
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../api"
import { Link , useNavigate} from "react-router-dom";



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
    const passwordRef = useRef();

    function validateForm() 
    {
        let email = document.forms["form_register"]["email"];
        let password = document.forms["form_register"]["password"];

        if (email.value.length < 5) 
        {
          email.style.backgroundColor = "pink";
          email.style.color = "black";
          document.getElementById("alert_register").innerText = "Do it right!";
          return false;
        }
        if(password.value.length < 2)
        {
            password.style.backgroundColor = "pink";
            password.style.color = "black";
            document.getElementById("alert_register").innerText = "Do it right!";
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


        //console.log(hashedPassword);
        createUser(email,hashedPassword);
        //window.location.href = "/";
        navigate('/');

    }

  return (
    <div className='App'>
      <header className='App-header'>
        <form name="form_register" onSubmit={handleForm}>
        <input name="email"  ref={emailRef} type='email' placeholder='Email' required="true" /><br />
        <input name="password" ref={passwordRef} type='password' placeholder='Password' required="true"/><br />
        <span id="alert_register"></span>
          <button type='submit'> Register </button><br />
        </form>
      </header>
    </div>
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
            email.style.backgroundColor = "pink";
            email.style.color = "black";
            document.getElementById("alert_login").innerText = "Do it right!";
            return false;
        }
        if(password.value.length < 2)
        {
            password.style.backgroundColor = "pink";
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
        <div className='App'>
        <header className='App-header'>
         
        <form name="form_login" onSubmit={handleForm}>
            <input name="email"  ref={emailRef} type='email' placeholder='Email' required="true" /><br />
            <input name="password" ref={passwordRef} type='password' placeholder='Password' required="true"/><br />
            <span id="alert_login"></span>
            <button type="submit">Login </button>
        </form>
            <br /><br /><br /><br />
            <Link to="register">Register</Link>
         
        </header>
      </div>
    );
}
