import { collection, addDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import {db} from "./firebase-config"


export async function getUsers()
{

}

export async function getUser(email)
{
    /*
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let ret = null;
    querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        ret = doc.data();
    });
    if(ret != null)
        return {email: ret.email, username: ret.username, password: ret.password};
    return null;*/
}

export async function createUser(email, password, username = "")
{
    const docRef = await addDoc(collection(db, "users"), { username: username, email: email, password: password });
    console.log(`New user added email: ${email} username: ${username} id: ${docRef.id}`);
    window.location.href = "/cando/login";
    return docRef;
}

export async function updateUser(email, password, username = "")
{

}

export async function deleteUser(email)
{

}