
import { Link , useNavigate} from "react-router-dom";



function deleteCookie(name) 
{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}



export default function Home() 
{
    const navigate = useNavigate();
    async function handleForm(event)
    {
        
        deleteCookie("email");
        //location.reload();
        navigate('login');
    }


    return (
        <>
            <span>Welcome home!</span><br /><br /><br /><br />
            <button type='submit' style={{padding:0, borderRadius:0}} onClick={handleForm}> Log out </button>
        </>
    );
}