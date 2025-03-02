import {Body} from "./Body";
import Front from "./Front";
import {getCookie} from "../Tools"
import './Home.css'

export default function Home() 
{
    //useEffect(() => { console.log("home render");});
    return (
        <>
            {getCookie("userid") != null ? <Body /> : <Front />}
        </>
    );
}