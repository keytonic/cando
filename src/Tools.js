



export function setCookie(name, value, days) 
{
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    console.log(`cookie set, name: ${name}, value: ${value}, days: ${days}`);
}

export function getCookie(name) 
{
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) 
    {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) 
        {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return null;
}

export function deleteCookie(name) 
{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}