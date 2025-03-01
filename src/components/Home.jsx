import {Body} from "./Body";
import Front from "./Front";
import {getCookie} from "../Tools"
import './Home.css'

export default function Home() 
{
    return (
        <>
            {getCookie("email") != null ? <Body /> : <Front />}
        </>
    );
}