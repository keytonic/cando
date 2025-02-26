import './ListMenu.css'





export default function ListMenu(props)
{
    function handleClick(event)
    {
        if(event.target.id == "list-menu-close-cell" || event.target.id == "list-icon-close" || event.target.id == "list-icon-path")
        {
            let listMenuWrapper = document.getElementById('list-menu-wrapper');

            listMenuWrapper.style.transition = "width 1s ease-in-out, opacity 1s ease-in-out,visibility 1s ease-in-out";

            listMenuWrapper.style.visibility = "hidden";
            listMenuWrapper.style.width = "0px";
            listMenuWrapper.style.opacity = "0";

            document.getElementById("body-wrapper").style.pointerEvents = "auto";
            document.getElementById("body").style.position = "inherit";
            //document.getElementById("body").style.overflowY = "auto";
        }
    }

    return (
        <div id="list-menu-wrapper">
            <div id="list-menu-nav-bar">
                <div className="list-menu-nav-cell" id="list-menu-close-cell" onClick={handleClick}>
                    <svg id="list-icon-close" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path id="list-icon-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </div>
                <div className="list-menu-nav-cell" id="list-menu-title-cell">
                    <span>List Menu</span>
                </div>
            </div>
        </div>
    );
}