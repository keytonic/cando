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

    function handleLoginForm(e) 
    {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const hashedPassword = bcrypt.hashSync(password, salt); 

        //console.log(hashedPassword);
        createUser(email,hashedPassword);
        //window.location.href = "/";
        navigate('/');

    }

  return (
    <div className='App'>
      <header className='App-header'>
        <form>
          <input  ref={emailRef} type='email' placeholder='Email' /><br />
          <input  ref={passwordRef} type='password' placeholder='Password' /><br />
          <button type='submit' style={{padding:0, borderRadius:0}} onClick={handleLoginForm}> Register </button><br />
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

    async function handleForm(event)
    {
        event.preventDefault();


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
            return;
        }

        let pass_good = bcrypt.compareSync(password, data.password);
        console.log(data.password);
        console.log(pass_good);

        if(pass_good == true)
        {
            setCookie("email", email, 30);
            //window.location.href = "/";
            navigate('home');

        }

    }


    return (
        <div className='App'>
        <header className='App-header'>
         
    
            <input  ref={emailRef} type='email' placeholder='Email' /><br />
            <input  ref={passwordRef} type='password' placeholder='Password' /><br />
            <button  style={{padding:0, borderRadius:0}} onClick={handleForm}> Login </button><br /><br /><br /><br />

            <Link to="register">Register</Link>
         
        </header>
      </div>
    );
}
