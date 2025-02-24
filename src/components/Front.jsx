


import './Front.css'





export default function Front() 
{
/*
    useEffect(() => {
        //Runs only on the first render
      }, []);
*/


    let deferredPromp;
    window.addEventListener("beforeinstallprompt", function (event) 
    {
        event.preventDefault();

        const installButton = document.getElementById("installButton");
        installButton.style.display = "block";

        deferredPromp = event;

        installButton.addEventListener("click", function (event) 
        {
            deferredPromp.prompt();

            deferredPromp.userChoice.then((choiceResult) => 
            {
                if (choiceResult.outcome === 'accepted') 
                {
                    console.log("User accepted PWA install");
                }
                else 
                {
                    console.log("User declined PWA install");
                }

                deferredPromp = null;
                installButton.style.display = "none";
            });
        });
    });




    return (

        
            <div id="front-wrapper">
                <span>Splash page content comming soon!</span>
                <button id="installButton" type="button">Install</button>
            </div>
    
    );
}